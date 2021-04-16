(this["webpackJsonpgun-ui"]=this["webpackJsonpgun-ui"]||[]).push([[0],{254:function(e,n,t){e.exports=t(390)},259:function(e,n,t){},261:function(e,n,t){},264:function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id=264},274:function(e,n,t){},390:function(e,n,t){"use strict";t.r(n);var o=t(0),r=t.n(o),a=t(110),c=t.n(a),l=(t(259),t(32)),i=t(240),u=t(11),s=t.n(u),d=t(15),f=(t(261),t(152)),p=t.n(f);t(265),t(274);var g=t(234),h=function(e){var n=e.root;return r.a.createElement(g.a,{root:n,margin:{top:20,right:20,bottom:20,left:20},identity:"name",colorBy:"depth",label:function(e){return e.data.label},value:"loc",colors:{scheme:"spectral"},padding:0,labelSkipRadius:0,labelTextColor:"black",borderWidth:2,borderColor:{from:"color"},defs:[{id:"lines",type:"patternLines",background:"none",color:"inherit",rotation:-75,lineWidth:5,spacing:8}],fill:[{match:{depth:1},id:"lines"}],animate:!0,motionStiffness:90,motionDamping:12})};t(388);var v=new Set,b=[{id:"gun",props:{root:""}}],m=[];var w=function(e,n){var t={name:"root",label:"root",color:"hsl(0, 70%, 50%)",loc:1},o=!0,r=!1,a=void 0;try{for(var c,i=e.nodes[Symbol.iterator]();!(o=(c=i.next()).done);o=!0)for(var u=c.value,s=u.id.split("/"),d=t,f=function(e){var t=s[e],o=(d.children||[]).find((function(e){return e.label2===t}));if(s.length,o)d=o;else{var r={fullPath:u.id,name:t,label:t,label2:t,loc:15};d.children=[].concat(Object(l.a)(d.children||[]),[r]),d=r}if(e===s.length-1){var a=JSON.stringify(u.props,null,4).replace(/\\/g,"");d.fullPath=u.id,d.label2=t,d.name="".concat(u.id,"\r\n\r\n | ").concat(a),d.label=n?d.name:"".concat(s[e-1],"/").concat(t),d.loc=Object.keys(u.props).length>0?3:.3}else d.children||(d.children=[{fullPath:u.id,name:t,label:t,loc:.3}]);(d.children||[]).length>1&&d.children.find((function(e){return 3===e.loc}))&&!d.children.find((function(e){return.3===e.loc&&(e.children||[]).length>0}))&&(d.children=d.children.filter((function(e){return.3!==e.loc})))},p=0;p<s.length;p++)f(p)}catch(g){r=!0,a=g}finally{try{o||null==i.return||i.return()}finally{if(r)throw a}}return t},k=function(){var e=Object(o.useState)({nodes:b,links:m}),n=Object(d.a)(e,2),t=n[0],a=n[1],c=Object(o.useState)("http://localhost:8765/gun"),u=Object(d.a)(c,2),f=u[0],g=u[1],k=Object(o.useState)("Fluke"),x=Object(d.a)(k,2),O=x[0],y=x[1],E=Object(o.useState)(new p.a),j=Object(d.a)(E,2),S=j[0],N=j[1];Object(o.useEffect)((function(){v.forEach((function(e){S.get(e).off(),v.delete(e)}))}),[S]);var C=Object(o.useState)(!0),_=Object(d.a)(C,2),D=_[0],I=_[1];Object(o.useEffect)((function(){console.log("Peers set to: ".concat(Object.keys(S._.opt.peers).length>0?Object.keys(S._.opt.peers).reduce((function(e,n){return e+", "+n})):"No peers connected"))}),[S]);var P=function(e){for(var n=S,t=0;t<e.length;t++)n=n.get(e[t]);return n},B=function(e){v.has(e)||(console.log("Added listener to node: "+e),S.get(e).on(R,{change:!0}),v.add(e))},G=function(e){console.log("Removing unreferenced Nodes");var n=t.links.findIndex((function(n){return n.target===e}));console.log("Node still referenced?: ".concat(-1===n?"No":"Yes")),-1===n&&L(e)},L=function(e){S.get(e).off(),a((function(n){var t=n.nodes;if(t.length<=1)return console.warn("Didn't delete node \"".concat(e,'", it is the last node')),n;console.log("Searching node with soul: ".concat(e));var o=t.findIndex((function(n){return n.id===e}));return-1===o?(console.error("No node found!"),n):(console.log("Removing node at index: ".concat(o)),t.splice(o,1),Object(i.a)({},n,{nodes:t}))}))},R=function(e){a((function(n){var t=e._["#"];if(console.log('Setting data of node: "'.concat(t,'"')),!n)return n;var o=n.nodes,r=n.links,a=o.findIndex((function(e){return e.id===t}));if(-1===a)return console.error("id not found"),n;console.log('Found node with index: "'.concat(a,'"'));var c={},l=[],i=[],u=[],s=function(n){if("_"===n)return"continue";var s=r.findIndex((function(e){return e.label===n&&e.source===t}));-1!==s&&(G(r[s].target),r.splice(s,1));var d=e[n];if(d&&void 0!==d["#"]){var f=d["#"];return l.push({id:f,props:{}}),i.push({source:t,target:f,label:n}),B(f),void 0!==o[a].props[n]&&u.push(n),"continue"}c[n]=e[n]};for(var d in e)s(d);for(var f in console.log("Adding props"),console.log(c),o[a].props)u.includes(f)||void 0!==c[f]||(c[f]=o[a].props[f]);return o[a].props=c,o.push.apply(o,l),r.push.apply(r,i),console.log("New nodes"),console.log(o),{nodes:o,links:r}}))},W=function e(n,t){return s.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",new Promise((function(o,r){var a;return s.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:a={vertices:[],edges:[]},P(n).once((function(r){var c,i,u;return s.a.async((function(d){for(;;)switch(d.prev=d.next){case 0:c=r._["#"],B(c),i={},d.t0=s.a.keys(r);case 4:if((d.t1=d.t0()).done){d.next=17;break}if("_"!==(u=d.t1.value)){d.next=8;break}return d.abrupt("continue",4);case 8:if(!r[u]||void 0===r[u]["#"]){d.next=14;break}return d.next=11,s.a.awrap(function(){var t,o;return s.a.async((function(i){for(;;)switch(i.prev=i.next){case 0:if(t=r[u]["#"],-1===a.vertices.findIndex((function(e){return e.id===t}))){i.next=4;break}return a.edges.push({source:c,target:t,label:u}),i.abrupt("return","continue");case 4:return i.next=6,s.a.awrap(e([].concat(Object(l.a)(n),[u]),c));case 6:return o=i.sent,a.vertices=[].concat(Object(l.a)(a.vertices),Object(l.a)(o.vertices)),a.edges=[].concat(Object(l.a)(a.edges),Object(l.a)(o.edges)),i.abrupt("return","continue");case 10:case"end":return i.stop()}}))}());case 11:if("continue"!==d.sent){d.next=14;break}return d.abrupt("continue",4);case 14:i[u]=r[u],d.next=4;break;case 17:a.vertices.push({id:c,props:i}),null!==t&&a.edges.push({source:t,target:c,label:n[n.length-1]}),console.log("Got Data from Graph:"),console.log(a),o(a);case 22:case"end":return d.stop()}}))}));case 2:case"end":return r.stop()}}))})));case 1:case"end":return o.stop()}}))};return console.log("graph:",t),window.graph=t,r.a.createElement("div",{className:"App"},r.a.createElement("h1",null,"GunDB Overview"),r.a.createElement("label",null,"Endpoint"),r.a.createElement("br",null),r.a.createElement("input",{value:f,onChange:function(e){g(e.target.value)},type:"text"}),r.a.createElement("br",null),r.a.createElement("label",null,"Root"),r.a.createElement("br",null),r.a.createElement("input",{value:O,onChange:function(e){y(e.target.value)},type:"text"}),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return function(e,n){var t;return s.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return a((function(){return{nodes:b,links:m}})),o.next=3,s.a.awrap(W(e,n));case 3:t=o.sent,console.log(t.vertices),console.log(t.edges),a((function(){return{nodes:t.vertices||b,links:t.edges||m}})),G("gun");case 8:case"end":return o.stop()}}))}([O],null)}},"Load Data from Gun"),r.a.createElement("button",{onClick:function(){return N(new p.a(f)),a((function(e){return{nodes:b,links:m}})),void(window.gun=S)}},"Load Endpoint"),r.a.createElement("button",{onClick:function(){I(!D)}},"Toggle Values"),r.a.createElement("div",{style:{height:"1100px"}},r.a.createElement(h,{root:w(t,D)})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[254,1,2]]]);
//# sourceMappingURL=main.2e4fee7c.chunk.js.map