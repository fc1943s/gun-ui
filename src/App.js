import './App.css';

import Gun from 'gun';
import 'gun/sea';
import React, { useEffect, useState } from 'react';

// import { ResponsiveCirclePacking } from '@nivo/circle-packing'
import { ResponsiveBubble } from '@nivo/circle-packing'


function log (...p) {
  if(window.log) {
    console.log(...p);
  }
}
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBubble = ({ root /* see root tab */ }) => {
  const [zoomedId, setZoomedId] = useState(null);
  return (
  // <ResponsiveCirclePacking
  <ResponsiveBubble
    // data={root}
    root={root}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    // id="fullPath"
    identity="name"
    colorBy="depth"
    label={x => x.data.label}
    enableLabels={true}
    value="loc"
    // zoomedId={zoomedId}
    // onClick={node => {
    //   setZoomedId(zoomedId === node.id ? null : node.id)
    // }}
    colors={{ scheme: 'spectral' }}
    padding={0}
    labelSkipRadius={0}
    labelTextColor="black"
    borderWidth={2}
    borderColor={{ from: 'color' }}
    defs={[
      {
        id: 'lines',
        type: 'patternLines',
        background: 'none',
        color: 'inherit',
        rotation: -75,
        lineWidth: 5,
        spacing: 8
      }
    ]}
    fill={[{ match: { depth: 1 }, id: 'lines' }]}
    animate={true}
    motionStiffness={90}
    motionDamping={12}
  />
)}


// const gun = new Gun('http://192.168.178.64:8765/gun');
require('gun/lib/open.js');

let gunListeners = new Set();

const vertices = [{ id: 'gun', props: { root: '' } }];
const edges = [];

// const sleep = async (ms) => {
//   return new Promise((resolve, _reject) => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });
// };

const authUser = (user, username, password) => {
  return new Promise((resolve, reject) => {
    try {
      user.auth(username, password, resolve)
    } catch (e) {
      reject(e)
    }
  });
};

function App() {
  const [graph, setGraph] = useState({
    nodes: vertices,
    links: edges,
  });

  const [endpoint, setEndpoint] = useState('http://localhost:8765/gun');

  const [root, setRoot] = useState('GunRecoil');
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [gun, setGun] = useState(new Gun());

  useEffect(() => {
    (async () => {
      if (username.length > 0 && password.length > 0) {
        const ack = await authUser(gun.user(), username, password);
        log('ack', ack);
      }
    })()
  }, [gun, username, password]);

  const getGunRoot = React.useCallback(() => {
    let currentReference = gun;
    if (username.length > 0 && password.length > 0) {
      currentReference = gun.user();
    }
    return currentReference;
  }, [gun, username, password]);


  useEffect(() => {
    gunListeners.forEach((soul) => {
      const gunRoot = getGunRoot();
      gunRoot.get(soul).off();
      gunListeners.delete(soul);
    });
  }, [gun, getGunRoot]);

  const [valuesEnabled, setValuesEnabled] = useState(true);

  const toggleValues = React.useCallback(() => {
    setValuesEnabled(!valuesEnabled);
  }, [setValuesEnabled, valuesEnabled]);

  const loadEndpoint = React.useCallback(() => {
    const newGun = new Gun(endpoint);
    setGun(newGun);
    setGraph((_graph) => {
      return {
        nodes: vertices,
        links: edges,
      };
    });
    window.gun = newGun;
  }, [setGun, setGraph, endpoint]);

  useEffect(() => {
    log(
      `Peers set to: ${
        Object.keys(gun._.opt.peers).length > 0
          ? Object.keys(gun._.opt.peers).reduce(
          (a, b) => a + ', ' + b
          )
          : 'No peers connected'
      }`
    );
  }, [gun]);

  const getPath = React.useCallback((path) => {
    let currentReference = getGunRoot();

    for (let i = 0; i < path.length; i++) {
      log('currentReference', path, currentReference, 'next:', path[i]);
      currentReference = currentReference.get(path[i]);
    }
    return currentReference;
  }, [getGunRoot]);

  const resetGraph = React.useCallback(() => {
    setGraph(() => {
      return {
        nodes: vertices,
        links: edges,
      };
    });
  }, [setGraph]);

  const removeNode = React.useCallback((soul) => {
    let gun = getGunRoot();
    gun.get(soul).off();
    setGraph((data) => {
      let nodes = data.nodes;
      if (nodes.length <= 1) {
        console.warn(
          `Didn't delete node "${soul}", it is the last node`
        );
        return data;
      }
      log(`Searching node with soul: ${soul}`);
      const nodeId = nodes.findIndex((node) => node.id === soul);
      if (nodeId === -1) {
        console.error(`No node found!`);
        return data;
      }
      log(`Removing node at index: ${nodeId}`);
      nodes.splice(nodeId, 1);
      return { ...data, nodes: nodes };
    });
  }, [getGunRoot]);

  const removeUnreferencedNode = React.useCallback((soul) => {
    log(`Removing unreferenced Nodes`);
    const index = graph.links.findIndex((edge) => edge.target === soul);
    log(`Node still referenced?: ${index === -1 ? 'No' : 'Yes'}`);
    if (index === -1) {
      removeNode(soul);
    }
  }, [graph, removeNode]);

  const addGunListenerRef = React.useRef(null);

  const handleNodeChange = React.useCallback((change) => {
    setGraph((data) => {
      const id = change['_']['#'];

      log(`Setting data of node: "${id}"`);

      if (!data) return data;

      let oldNodes = data.nodes;
      let oldLinks = data.links;

      const idx = oldNodes.findIndex((node) => node.id === id);

      if (idx === -1) {
        console.error('id not found');
        return data;
      }
      log(`Found node with index: "${idx}"`);

      let newProps = {};
      let newVertices = [];
      let newEdges = [];
      let propsToRemove = [];

      for (const prop in change) {
        // Ignore the soul
        if (prop === '_') continue;
        // Is this property currently given to a child node?
        const childEdgeIndex = oldLinks.findIndex((edge) => {
          return edge.label === prop && edge.source === id;
        });
        // If so, remove the edge
        if (childEdgeIndex !== -1) {
          removeUnreferencedNode(oldLinks[childEdgeIndex].target);
          oldLinks.splice(childEdgeIndex, 1);
        }
        // Property is new child Node
        const propVal = change[prop];
        if (propVal && propVal['#'] !== undefined) {
          // Add new node
          const newNodeSoul = propVal['#'];
          newVertices.push({
            id: newNodeSoul,
            props: {},
          });
          newEdges.push({
            source: id,
            target: newNodeSoul,
            label: prop,
          });
          addGunListenerRef.current(newNodeSoul);
          // Remove old property from parent if it exists
          if (oldNodes[idx].props[prop] !== undefined) {
            propsToRemove.push(prop);
          }
          continue;
        }
        // Add property to node props
        newProps[prop] = change[prop];
      }

      log('Adding props');
      log(newProps);

      for (const p in oldNodes[idx]['props']) {
        if (!propsToRemove.includes(p) && newProps[p] === undefined) {
          newProps[p] = oldNodes[idx]['props'][p];
        }
      }

      oldNodes[idx]['props'] = newProps;

      oldNodes.push(...newVertices);
      oldLinks.push(...newEdges);

      log('New nodes');
      log(oldNodes);

      return {
        nodes: oldNodes,
        links: oldLinks,
      };
    });
  }, [addGunListenerRef, removeUnreferencedNode]);

  const addGunListener = React.useCallback((soul) => {
    if (!gunListeners.has(soul)) {
      console.log('Added listener to node: ' + soul);

      let gun = getGunRoot();
      gun.get(soul).on(handleNodeChange, { change: true });
      gunListeners.add(soul);
    }
  }, [getGunRoot, handleNodeChange]);

  React.useEffect(() => {
    addGunListenerRef.current = addGunListener;
  }, [addGunListener]);


  const getDataFromGun = React.useCallback((path, parentId) => {
    return new Promise(async (resolve, _reject) => {
      let graph = { vertices: [], edges: [] };
      const gun = getGunRoot();
      const node = await getPath(path);
      log("node", node);

      const process = async (nodeProperties) => {
        const soul = nodeProperties['_']['#'];

        addGunListener(soul);

        let props = {};
        for (let prop in nodeProperties) {
          if (prop === '_') continue;
          if (
            nodeProperties[prop] &&
            nodeProperties[prop]['#'] !== undefined
          ) {
            const childSoul = nodeProperties[prop]['#'];
            // If the vertex is already listed (referenceed multiple times)
            if (
              graph.vertices.findIndex(
                (vertex) => vertex.id === childSoul
              ) !== -1
            ) {
              graph.edges.push({
                source: soul,
                target: childSoul,
                label: prop,
              });
              continue;
            }
            let childGraph = await getDataFromGun(
              [...path, prop],
              soul
            );
            graph.vertices = [
              ...graph.vertices,
              ...childGraph.vertices,
            ];
            graph.edges = [...graph.edges, ...childGraph.edges];
            continue;
          }
          props[prop] = nodeProperties[prop];
        }
        graph.vertices.push({
          id: soul,
          props,
        });
        if (parentId !== null) {
          graph.edges.push({
            source: parentId,
            target: soul,
            label: path[path.length - 1],
          });
        }
        log('Got Data from Graph:');
        log(graph);

        resolve(graph);
      }
      if (node['_']['#']) {
        await process(node);
      } else {
        node.once(process);
      }
    });
  }, [getPath, addGunListener, getGunRoot]);

  const insertDataFromGun = React.useCallback(async (path, parentId) => {
    resetGraph();
    const graph = await getDataFromGun(path, parentId);

    log(graph.vertices);
    log(graph.edges);

    setGraph(() => {
      return {
        nodes: graph.vertices || vertices,
        links: graph.edges || edges,
      };
    });
    removeUnreferencedNode('gun');
  }, [setGraph, resetGraph, getDataFromGun, removeUnreferencedNode]);


  // const _graphConfig = {
  //   width: 800,
  //   height: 800,
  //   directed: true,
  //   nodeHighlightBehavior: true,
  //   staticGraphWithDragAndDrop: false, // If false, can be removed
  //   automaticRearrangeAfterDropNode: false, // If false, can be removed
  //   node: {
  //     renderLabel: false,
  //     size: 1000,
  //     viewGenerator: (node) => <Vertex node={node} />,
  //   },
  //   link: {
  //     highlightColor: 'blue',
  //     renderLabel: true,
  //     highlightFontWeight: 'bold',
  //     semanticStrokeWidth: true,
  //     fontSize: 12,
  //   },
  //   d3: {
  //     gravity: -1000,
  //     linkLength: 50,
  //   },
  // };

  // const _windowStyle = {
  //   backgroundColor: '#282828',
  //   padding: '2px',
  // };
  //
  // const _graphStyle = {
  //   backgroundColor: '#FFF',
  // };

  log('graph:', graph);
  window.graph = graph;

  return (
    <div className="App" style={{ 'padding-top': '600px' }}>
      <label>Endpoint </label>
      <input
        value={endpoint}
        onChange={(ev) => {
          setEndpoint(ev.target.value);
        }}
        type="text"
      />
      <label>Root </label>
      <input
        value={root}
        onChange={(ev) => {
          setRoot(ev.target.value);
        }}
        type="text"
      />
      <label>Search </label>
      <input
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
        }}
        type="text"
      />
      <label>Username </label>
      <input
        value={username}
        onChange={(ev) => {
          setUsername(ev.target.value);
        }}
        type="text"
      />
      <label>Password </label>
      <input
        value={password}
        onChange={(ev) => {
          setPassword(ev.target.value);
        }}
        type="password"
      />
      <br />
      <button onClick={() => insertDataFromGun([root], null)}>
        Load Data from Gun
      </button>
      <button onClick={() => loadEndpoint()}>Load Endpoint</button>

      <button onClick={() => toggleValues()}>Toggle Values</button>

      <div style={{ height: "1100px", color: "black" }}>
        <MyResponsiveBubble root={getRootData(graph, valuesEnabled, search)} />
      </div>

      {/*<div style={windowStyle}>*/}
      {/*  <div style={graphStyle}>*/}
      {/*    <Graph id="graph-id" data={graph} config={graphConfig} />*/}
      {/*  </div>*/}
      {/*</div>*/}

    </div>
  );
}

const getRootData = (graph, valuesEnabled, search) => {
  const newGraph = {
    "name": "root",
    label: 'root',
    color: `hsl(0, 70%, 50%)`,
    loc: 1
  };

  const user = window.gun ? window.gun.user().is : null;
  let pub = user ? user.pub : '';

  const nodes = graph.nodes.map((node) => {
      return Object.keys(node.props).map((prop) => ({
        id: `${node.id.replace(pub, '')}/${prop}`,
        props: node.props[prop]
      }))
    }).reduce((a, b) => [...a, ...b])
  ;
  // log('nodes', nodes);

  nodes.sort((a, b) => a.id.localeCompare(b.id));

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const innerNodes = node.id.split("/");

    let currObj = newGraph;
    for (let j = 0; j < innerNodes.length; j++) {
      const innerNode = innerNodes[j];

      let currCurrObj = (currObj.children || []).find((x) => x.label2 === innerNode)

      if (j === innerNodes.length - 1) {
      }

      if (!currCurrObj) {
        let x = {
          fullPath: node.id,
          name: innerNode,
          label: innerNode,
          label2: innerNode,
          loc: 15
        }
        currObj.children = [...currObj.children || [], x];
        currObj = x;
      } else {
        currObj = currCurrObj;
      }

      const valueOn = 3;
      const valueOff = 0.3;

      if (j === innerNodes.length - 1) {
        const propsText = JSON.stringify(node.props, null, 4).replace(/\\/g, "");

        currObj.fullPath = node.id;
        currObj.label2 = innerNode;
        currObj.name = `${node.id}\r\n\r\n${propsText}`;
        // currObj.name = {a:1,b:2};
        currObj.label = !valuesEnabled ? `${innerNode}${("/" + innerNodes[j - 1])}` : currObj.name;
        currObj.label = search === '' ? currObj.label : (currObj.name.indexOf(search) >= 0 ? currObj.label : '');
        // currObj.color = `hsl(${Math.round(255 * Math.random())}, 70%, 50%)`;
        currObj.loc = Object.keys(node.props || {}).length > 0 ? valueOn : valueOff;
        // currObj.children = currObj.loc === valueOff ? [] : Object.keys(node.props).map((key) => ({
        //     fullPath: node.id + "key",
        //     name: key,
        //     label: node.props[key],
        //     loc: valueOn
        //   }))
      } else {
        if (!currObj.children) {
          currObj.children = [
            {
              fullPath: node.id,
              name: innerNode,
              label: innerNode,
              loc: valueOff
            }
          ]
        }
      }

      if ((currObj.children || []).length > 1
        && currObj.children.find((x) => x.loc === valueOn)
        && !currObj.children.find((x) => x.loc === valueOff && (x.children || []).length > 0)) {
        currObj.children = currObj.children.filter((x) => x.loc !== valueOff)
      }
    }
  }

  return newGraph;
}

export default App;
