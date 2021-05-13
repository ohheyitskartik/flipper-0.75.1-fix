(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{142:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return d}));var n=r(0),o=r.n(n);function p(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){p(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},p=Object.keys(e);for(n=0;n<p.length;n++)r=p[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(n=0;n<p.length;n++)r=p[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=o.a.createContext({}),u=function(e){var t=o.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=u(e.components);return o.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},f=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,p=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),l=u(r),f=n,d=l["".concat(i,".").concat(f)]||l[f]||b[f]||p;return r?o.a.createElement(d,a(a({ref:t},s),{},{components:r})):o.a.createElement(d,a({ref:t},s))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var p=r.length,i=new Array(p);i[0]=f;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a.mdxType="string"==typeof e?e:n,i[1]=a;for(var s=2;s<p;s++)i[s]=r[s];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,r)}f.displayName="MDXCreateElement"},92:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return a})),r.d(t,"rightToc",(function(){return c})),r.d(t,"default",(function(){return u}));var n=r(3),o=r(7),p=(r(0),r(142)),i={id:"custom-ports",title:"Running Flipper with different ports",sidebar_label:"Using different ports"},a={unversionedId:"custom-ports",id:"custom-ports",isDocsHomePage:!1,title:"Running Flipper with different ports",description:"By default Flipper runs its servers on ports 8088 and 8089, and the mobile SDKs look for servers on those ports.",source:"@site/../docs/custom-ports.mdx",slug:"/custom-ports",permalink:"/docs/custom-ports",editUrl:"https://github.com/facebook/flipper/blob/master/website/../docs/custom-ports.mdx",version:"current",sidebar_label:"Using different ports",sidebar:"setup",previous:{title:"Crash Reporter Setup",permalink:"/docs/setup/crash-reporter-plugin"},next:{title:"Stetho Guidance",permalink:"/docs/stetho"}},c=[],s={rightToc:c};function u(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(p.b)("wrapper",Object(n.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(p.b)("p",null,"By default Flipper runs its servers on ports 8088 and 8089, and the mobile SDKs look for servers on those ports."),Object(p.b)("p",null,"Each of these can be overridden by setting an environment variable, with the format ",Object(p.b)("inlineCode",{parentName:"p"},"${INSECURE_PORT},${SECURE_PORT}"),"."),Object(p.b)("p",null,"To run the desktop app using custom ports:"),Object(p.b)("pre",null,Object(p.b)("code",Object(n.a)({parentName:"pre"},{}),"FLIPPER_PORTS=1111,2222 ./flipper\n")),Object(p.b)("p",null,"To configure the Android SDK for custom ports, set the ",Object(p.b)("inlineCode",{parentName:"p"},"flipper.ports")," prop to your chosen ports ",Object(p.b)("inlineCode",{parentName:"p"},"1111,2222")," like so, and then launch the Android app:"),Object(p.b)("pre",null,Object(p.b)("code",Object(n.a)({parentName:"pre"},{}),"adb shell su 0 setprop flipper.ports 1111,2222\n")),Object(p.b)("p",null,"To configure the iOS SDK for custom ports, set the FLIPPER_PORTS environment variable in your app launch script."))}u.isMDXComponent=!0}}]);