(this["webpackJsonpgun-ui"]=this["webpackJsonpgun-ui"]||[]).push([[0],{254:function(e,n,t){e.exports=t(390)},259:function(e,n,t){},261:function(e,n,t){},264:function(e,n){function t(e){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}t.keys=function(){return[]},t.resolve=t,e.exports=t,t.id=264},274:function(e,n,t){},390:function(e,n,t){"use strict";t.r(n);var o=t(0),r=t.n(o),c=t(110),a=t.n(c),i=(t(259),t(25)),l=t(240),u=t(11),s=t.n(u),d=t(15),f=(t(261),t(152)),p=t.n(f);t(265),t(274);var g=t(234),h=function(e){var n=e.root;return r.a.createElement(g.a,{root:n,margin:{top:20,right:20,bottom:20,left:20},identity:"name",colorBy:"depth",label:function(e){return e.data.label},value:"loc",colors:{scheme:"spectral"},padding:0,labelSkipRadius:0,labelTextColor:"black",borderWidth:2,borderColor:{from:"color"},defs:[{id:"lines",type:"patternLines",background:"none",color:"inherit",rotation:-75,lineWidth:5,spacing:8}],fill:[{match:{depth:1},id:"lines"}],animate:!0,motionStiffness:90,motionDamping:12})};t(388);var b=new Set,v=[{id:"gun",props:{root:""}}],m=[];var w=function(e,n){var t={name:"root",label:"root",color:"hsl(0, 70%, 50%)",loc:1},o=e.nodes.map((function(e){return Object.keys(e.props).map((function(n){return{id:"".concat(e.id,"/").concat(n),props:e.props[n]}}))})).reduce((function(e,n){return[].concat(Object(i.a)(e),Object(i.a)(n))})),r=!0,c=!1,a=void 0;try{for(var l,u=o[Symbol.iterator]();!(r=(l=u.next()).done);r=!0)for(var s=l.value,d=s.id.split("/"),f=t,p=function(e){var t=d[e],o=(f.children||[]).find((function(e){return e.label2===t}));if(d.length,o)f=o;else{var r={fullPath:s.id,name:t,label:t,label2:t,loc:15};f.children=[].concat(Object(i.a)(f.children||[]),[r]),f=r}if(e===d.length-1){var c=JSON.stringify(s.props,null,4).replace(/\\/g,"");f.fullPath=s.id,f.label2=t,f.name="".concat(s.id,"\r\n\r\n").concat(c),f.label=n?f.name:"".concat(d[e-1],"/").concat(t),f.loc=Object.keys(s.props).length>0?3:.3}else f.children||(f.children=[{fullPath:s.id,name:t,label:t,loc:.3}]);(f.children||[]).length>1&&f.children.find((function(e){return 3===e.loc}))&&!f.children.find((function(e){return.3===e.loc&&(e.children||[]).length>0}))&&(f.children=f.children.filter((function(e){return.3!==e.loc})))},g=0;g<d.length;g++)p(g)}catch(h){c=!0,a=h}finally{try{r||null==u.return||u.return()}finally{if(c)throw a}}return t},k=function(){var e=Object(o.useState)({nodes:v,links:m}),n=Object(d.a)(e,2),t=n[0],c=n[1],a=Object(o.useState)("http://localhost:8765/gun"),u=Object(d.a)(a,2),f=u[0],g=u[1],k=Object(o.useState)("Fluke"),O=Object(d.a)(k,2),x=O[0],y=O[1],j=Object(o.useState)(new p.a),E=Object(d.a)(j,2),S=E[0],N=E[1];Object(o.useEffect)((function(){b.forEach((function(e){S.get(e).off(),b.delete(e)}))}),[S]);var C=Object(o.useState)(!0),_=Object(d.a)(C,2),D=_[0],I=_[1];Object(o.useEffect)((function(){console.log("Peers set to: ".concat(Object.keys(S._.opt.peers).length>0?Object.keys(S._.opt.peers).reduce((function(e,n){return e+", "+n})):"No peers connected"))}),[S]);var P=function(e){for(var n=S,t=0;t<e.length;t++)n=n.get(e[t]);return n},B=function(e){b.has(e)||(console.log("Added listener to node: "+e),S.get(e).on(R,{change:!0}),b.add(e))},G=function(e){console.log("Removing unreferenced Nodes");var n=t.links.findIndex((function(n){return n.target===e}));console.log("Node still referenced?: ".concat(-1===n?"No":"Yes")),-1===n&&L(e)},L=function(e){S.get(e).off(),c((function(n){var t=n.nodes;if(t.length<=1)return console.warn("Didn't delete node \"".concat(e,'", it is the last node')),n;console.log("Searching node with soul: ".concat(e));var o=t.findIndex((function(n){return n.id===e}));return-1===o?(console.error("No node found!"),n):(console.log("Removing node at index: ".concat(o)),t.splice(o,1),Object(l.a)({},n,{nodes:t}))}))},R=function(e){c((function(n){var t=e._["#"];if(console.log('Setting data of node: "'.concat(t,'"')),!n)return n;var o=n.nodes,r=n.links,c=o.findIndex((function(e){return e.id===t}));if(-1===c)return console.error("id not found"),n;console.log('Found node with index: "'.concat(c,'"'));var a={},i=[],l=[],u=[],s=function(n){if("_"===n)return"continue";var s=r.findIndex((function(e){return e.label===n&&e.source===t}));-1!==s&&(G(r[s].target),r.splice(s,1));var d=e[n];if(d&&void 0!==d["#"]){var f=d["#"];return i.push({id:f,props:{}}),l.push({source:t,target:f,label:n}),B(f),void 0!==o[c].props[n]&&u.push(n),"continue"}a[n]=e[n]};for(var d in e)s(d);for(var f in console.log("Adding props"),console.log(a),o[c].props)u.includes(f)||void 0!==a[f]||(a[f]=o[c].props[f]);return o[c].props=a,o.push.apply(o,i),r.push.apply(r,l),console.log("New nodes"),console.log(o),{nodes:o,links:r}}))},W=function e(n,t){return s.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",new Promise((function(o,r){var c;return s.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:c={vertices:[],edges:[]},P(n).once((function(r){var a,l,u;return s.a.async((function(d){for(;;)switch(d.prev=d.next){case 0:a=r._["#"],B(a),l={},d.t0=s.a.keys(r);case 4:if((d.t1=d.t0()).done){d.next=17;break}if("_"!==(u=d.t1.value)){d.next=8;break}return d.abrupt("continue",4);case 8:if(!r[u]||void 0===r[u]["#"]){d.next=14;break}return d.next=11,s.a.awrap(function(){var t,o;return s.a.async((function(l){for(;;)switch(l.prev=l.next){case 0:if(t=r[u]["#"],-1===c.vertices.findIndex((function(e){return e.id===t}))){l.next=4;break}return c.edges.push({source:a,target:t,label:u}),l.abrupt("return","continue");case 4:return l.next=6,s.a.awrap(e([].concat(Object(i.a)(n),[u]),a));case 6:return o=l.sent,c.vertices=[].concat(Object(i.a)(c.vertices),Object(i.a)(o.vertices)),c.edges=[].concat(Object(i.a)(c.edges),Object(i.a)(o.edges)),l.abrupt("return","continue");case 10:case"end":return l.stop()}}))}());case 11:if("continue"!==d.sent){d.next=14;break}return d.abrupt("continue",4);case 14:l[u]=r[u],d.next=4;break;case 17:c.vertices.push({id:a,props:l}),null!==t&&c.edges.push({source:t,target:a,label:n[n.length-1]}),console.log("Got Data from Graph:"),console.log(c),o(c);case 22:case"end":return d.stop()}}))}));case 2:case"end":return r.stop()}}))})));case 1:case"end":return o.stop()}}))};return console.log("graph:",t),window.graph=t,r.a.createElement("div",{className:"App",style:{"padding-top":"2000px"}},r.a.createElement("h1",null,"GunDB Overview"),r.a.createElement("label",null,"Endpoint"),r.a.createElement("br",null),r.a.createElement("input",{value:f,onChange:function(e){g(e.target.value)},type:"text"}),r.a.createElement("br",null),r.a.createElement("label",null,"Root"),r.a.createElement("br",null),r.a.createElement("input",{value:x,onChange:function(e){y(e.target.value)},type:"text"}),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return function(e,n){var t;return s.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return c((function(){return{nodes:v,links:m}})),o.next=3,s.a.awrap(W(e,n));case 3:t=o.sent,console.log(t.vertices),console.log(t.edges),c((function(){return{nodes:t.vertices||v,links:t.edges||m}})),G("gun");case 8:case"end":return o.stop()}}))}([x],null)}},"Load Data from Gun"),r.a.createElement("button",{onClick:function(){return N(new p.a(f)),c((function(e){return{nodes:v,links:m}})),void(window.gun=S)}},"Load Endpoint"),r.a.createElement("button",{onClick:function(){I(!D)}},"Toggle Values"),r.a.createElement("div",{style:{height:"1100px"}},r.a.createElement(h,{root:w(t,D)})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(r.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[254,1,2]]]);
//# sourceMappingURL=main.4081ef05.chunk.js.map