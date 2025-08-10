(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[17957],{65531:function(e,r,t){"use strict";t.d(r,{Z:function(){return a}});var n=t(2265);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),l=(...e)=>e.filter((e,r,t)=>!!e&&t.indexOf(e)===r).join(" ");/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:s,className:o="",children:a,iconNode:c,...d},u)=>(0,n.createElement)("svg",{ref:u,...i,width:r,height:r,stroke:e,strokeWidth:s?24*Number(t)/Number(r):t,className:l("lucide",o),...d},[...c.map(([e,r])=>(0,n.createElement)(e,r)),...Array.isArray(a)?a:[a]])),a=(e,r)=>{let t=(0,n.forwardRef)(({className:t,...i},a)=>(0,n.createElement)(o,{ref:a,iconNode:r,className:l(`lucide-${s(e)}`,t),...i}));return t.displayName=`${e}`,t}},55340:function(e,r,t){"use strict";t.d(r,{Z:function(){return s}});var n=t(65531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},46346:function(e,r,t){Promise.resolve().then(t.bind(t,35849))},35849:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return a}});var n=t(57437),s=t(2265),l=t(61396),i=t.n(l),o=t(55340);function a(){let[e,r]=(0,s.useState)([]),[t,l]=(0,s.useState)(!0);return((0,s.useEffect)(()=>{fetch("/api/brands").then(e=>e.json()).then(e=>{let t=e.find(e=>"hisense"===e.name.toLowerCase());r(t?t.models.map(e=>({name:e})):[]),l(!1)}).catch(e=>{console.error("Modeller y\xfcklenirken hata oluştu:",e),l(!1)})},[]),t)?(0,n.jsx)("div",{className:"text-center py-20",children:"Modeller y\xfckleniyor..."}):(0,n.jsxs)("div",{className:"pt-16",children:[(0,n.jsx)("section",{className:"bg-gradient-to-br from-blue-50 to-white py-16",children:(0,n.jsxs)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center",children:[(0,n.jsx)("h1",{className:"text-4xl lg:text-5xl font-bold text-gray-900 mb-6",children:"Hisense TV Modelleri"}),(0,n.jsx)("p",{className:"text-xl text-gray-600 mb-8",children:"Pop\xfcler Hisense TV modelleri i\xe7in ekran değişimi ve tamir hizmetleri. Modelinizi se\xe7erek detaylı bilgi ve fiyat teklifi alabilirsiniz."})]})}),(0,n.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,n.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8",children:e.map(e=>(0,n.jsxs)(i(),{href:"/brands/hisense/".concat(e.name.toLowerCase()),className:"group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2",children:[(0,n.jsx)("div",{className:"mb-4",children:(0,n.jsx)(o.Z,{className:"w-8 h-8 text-yellow-500"})}),(0,n.jsx)("div",{className:"text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-2",children:e.name})]},e.name))})})]})}},30622:function(e,r,t){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n=t(2265),s=Symbol.for("react.element"),l=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(e,r,t){var n,l={},c=null,d=null;for(n in void 0!==t&&(c=""+t),void 0!==r.key&&(c=""+r.key),void 0!==r.ref&&(d=r.ref),r)i.call(r,n)&&!a.hasOwnProperty(n)&&(l[n]=r[n]);if(e&&e.defaultProps)for(n in r=e.defaultProps)void 0===l[n]&&(l[n]=r[n]);return{$$typeof:s,type:e,key:c,ref:d,props:l,_owner:o.current}}r.Fragment=l,r.jsx=c,r.jsxs=c},57437:function(e,r,t){"use strict";e.exports=t(30622)},61396:function(e,r,t){e.exports=t(34724)}},function(e){e.O(0,[34724,92971,67864,1744],function(){return e(e.s=46346)}),_N_E=e.O()}]);