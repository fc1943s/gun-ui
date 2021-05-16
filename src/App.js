import './App.css';

import Gun from 'gun';
import React, { useEffect, useState } from 'react';
import { Graph } from 'react-d3-graph';

import Vertex from './Vertex';

import { ResponsiveBubble } from '@nivo/circle-packing'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBubble = ({ root /* see root tab */ }) => (
  <ResponsiveBubble
    root={root}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    identity="name"
    colorBy="depth"
    label={(d) => d.data.label}
    value="loc"
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
)


// const gun = new Gun('http://192.168.178.64:8765/gun');
require('gun/lib/open.js');

let gunListeners = new Set();

const vertices = [{ id: 'gun', props: { root: '' } }];
const edges = [];

function App() {
  const [graph, setGraph] = useState({
    nodes: vertices,
    links: edges,
  });

  const [endpoint, setEndpoint] = useState('http://localhost:8765/gun');

  const [root, setRoot] = useState('GunRecoil');

  const [gun, setGun] = useState(new Gun());

  useEffect(() => {
    gunListeners.forEach((soul) => {
      gun.get(soul).off();
      gunListeners.delete(soul);
    });
  }, [gun]);

  const [valuesEnabled, setValuesEnabled] = useState(true);

  const toggleValues = () => {
    setValuesEnabled(!valuesEnabled);
  }

  const loadEndpoint = () => {
    setGun(new Gun(endpoint));
    setGraph((graph) => {
      return {
        nodes: vertices,
        links: edges,
      };
    });
    window.gun = gun;
  };

  useEffect(() => {
    console.log(
      `Peers set to: ${
        Object.keys(gun._.opt.peers).length > 0
          ? Object.keys(gun._.opt.peers).reduce(
          (a, b) => a + ', ' + b
          )
          : 'No peers connected'
      }`
    );
  }, [gun]);

  const getPath = (path) => {
    let currentReference = gun;
    for (let i = 0; i < path.length; i++) {
      currentReference = currentReference.get(path[i]);
    }
    return currentReference;
  };

  const resetGraph = () => {
    setGraph(() => {
      return {
        nodes: vertices,
        links: edges,
      };
    });
  };

  const insertDataFromGun = async (path, parentId) => {
    resetGraph();
    const graph = await getDataFromGun(path, parentId);

    console.log(graph.vertices);
    console.log(graph.edges);

    setGraph(() => {
      return {
        nodes: graph.vertices || vertices,
        links: graph.edges || edges,
      };
    });
    removeUnreferencedNode('gun');
  };

  const addGunListener = (soul) => {
    if (!gunListeners.has(soul)) {
      console.log('Added listener to node: ' + soul);
      gun.get(soul).on(handleNodeChange, { change: true });
      gunListeners.add(soul);
    }
  };

  const removeUnreferencedNode = (soul) => {
    console.log(`Removing unreferenced Nodes`);
    const index = graph.links.findIndex((edge) => edge.target === soul);
    console.log(`Node still referenced?: ${index === -1 ? 'No' : 'Yes'}`);
    if (index === -1) {
      removeNode(soul);
    }
  };

  const removeNode = (soul) => {
    gun.get(soul).off();
    setGraph((data) => {
      let nodes = data.nodes;
      if (nodes.length <= 1) {
        console.warn(
          `Didn't delete node "${soul}", it is the last node`
        );
        return data;
      }
      console.log(`Searching node with soul: ${soul}`);
      const nodeId = nodes.findIndex((node) => node.id === soul);
      if (nodeId === -1) {
        console.error(`No node found!`);
        return data;
      }
      console.log(`Removing node at index: ${nodeId}`);
      nodes.splice(nodeId, 1);
      return { ...data, nodes: nodes };
    });
  };

  const handleNodeChange = (change) => {
    setGraph((data) => {
      const id = change['_']['#'];

      console.log(`Setting data of node: "${id}"`);

      if (!data) return data;

      let oldNodes = data.nodes;
      let oldLinks = data.links;

      const idx = oldNodes.findIndex((node) => node.id === id);

      if (idx === -1) {
        console.error('id not found');
        return data;
      }
      console.log(`Found node with index: "${idx}"`);

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
          addGunListener(newNodeSoul);
          // Remove old property from parent if it exists
          if (oldNodes[idx].props[prop] !== undefined) {
            propsToRemove.push(prop);
          }
          continue;
        }
        // Add property to node props
        newProps[prop] = change[prop];
      }

      console.log('Adding props');
      console.log(newProps);

      for (const p in oldNodes[idx]['props']) {
        if (!propsToRemove.includes(p) && newProps[p] === undefined) {
          newProps[p] = oldNodes[idx]['props'][p];
        }
      }

      oldNodes[idx]['props'] = newProps;

      oldNodes.push(...newVertices);
      oldLinks.push(...newEdges);

      console.log('New nodes');
      console.log(oldNodes);

      return {
        nodes: oldNodes,
        links: oldLinks,
      };
    });
  };

  const getDataFromGun = async (path, parentId) => {
    return new Promise(async (resolve, reject) => {
      let graph = { vertices: [], edges: [] };
      getPath(path).once(async (nodeProperties) => {
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
        console.log('Got Data from Graph:');
        console.log(graph);

        resolve(graph);
      });
    });
  };

  const graphConfig = {
    width: 800,
    height: 800,
    directed: true,
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop: false, // If false, can be removed
    automaticRearrangeAfterDropNode: false, // If false, can be removed
    node: {
      renderLabel: false,
      size: 1000,
      viewGenerator: (node) => <Vertex node={node} />,
    },
    link: {
      highlightColor: 'blue',
      renderLabel: true,
      highlightFontWeight: 'bold',
      semanticStrokeWidth: true,
      fontSize: 12,
    },
    d3: {
      gravity: -1000,
      linkLength: 50,
    },
  };

  const windowStyle = {
    backgroundColor: '#282828',
    padding: '2px',
  };

  const graphStyle = {
    backgroundColor: '#FFF',
  };

  console.log('graph:', graph);
  window.graph = graph;

  return (
    <div className="App" style={{ 'padding-top': '600px' }}>
      <h1>GunDB Overview</h1>
      <label>Endpoint</label>
      <br />
      <input
        value={endpoint}
        onChange={(ev) => {
          setEndpoint(ev.target.value);
        }}
        type="text"
      />
      <br />
      <label>Root</label>
      <br />
      <input
        value={root}
        onChange={(ev) => {
          setRoot(ev.target.value);
        }}
        type="text"
      />
      <br />
      <button onClick={() => insertDataFromGun([root], null)}>
        Load Data from Gun
      </button>
      <button onClick={() => loadEndpoint()}>Load Endpoint</button>

      <button onClick={() => toggleValues()}>Toggle Values</button>

      <div style={{ height: "1100px", color: "black" }}>
        <MyResponsiveBubble root={getRootData(graph, valuesEnabled)} />
      </div>

      {/*<div style={windowStyle}>*/}
      {/*  <div style={graphStyle}>*/}
      {/*    <Graph id="graph-id" data={graph} config={graphConfig} />*/}
      {/*  </div>*/}
      {/*</div>*/}

    </div>
  );
}

const getRootData = (graph, valuesEnabled) => {
  const newGraph = {
    "name": "root",
    label: 'root',
    color: `hsl(0, 70%, 50%)`,
    loc: 1
  };

  const nodes = graph.nodes.map((node) => {
    return Object.keys(node.props).map((prop) => ({
      id: `${node.id}/${prop}`,
      props: node.props[prop]
    }))
  }).reduce((a, b) => [...a, ...b]);
  // console.log('nodes', nodes);

  for (const node of nodes) {
    const innerNodes = node.id.split("/");

    let currObj = newGraph;
    for (let i = 0; i < innerNodes.length; i++) {
      const innerNode = innerNodes[i];

      let currCurrObj = (currObj.children || []).find((x) => x.label2 === innerNode)

      if (i === innerNodes.length - 1) {
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

      if (i === innerNodes.length - 1) {
        const propsText = JSON.stringify(node.props, null, 4).replace(/\\/g, "");

        currObj.fullPath = node.id;
        currObj.label2 = innerNode;
        currObj.name = `${node.id}\r\n\r\n${propsText}`;
        // currObj.name = {a:1,b:2};
        currObj.label = !valuesEnabled ? `${innerNodes[i - 1]}/${innerNode}` : currObj.name;
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
