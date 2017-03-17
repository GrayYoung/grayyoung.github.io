define("app/model/requests",{imdb:"http://www.omdbapi.com/",media:"/data/media.xlsx",work:"/data/work.xlsx"}),!function(e,t){"use strict";"function"==typeof define&&define.amd?define("ajax",t):"object"==typeof exports?exports=module.exports=t():(e.Ajax=t(),e.ajax=t())}(this,function(){"use strict";function e(t){void 0!==this&&console.warn(["Instance with `new` is deprecated. ","This will be removed in `v2.0.0` version."].join("")),this instanceof e&&console.warn(["Ajax constructor is deprecated. This will be removed in ","`v2.0.0`. Use ajax (lowercase version) without `new` ","keyword instead"].join("")),t=t||{};var n={},o={};return o.methods={then:function(){},"catch":function(){},always:function(){},done:function(){},error:function(){}},o.maybeData=function(e){return e||null},o.httpMethods=["get","post","put","delete"],o.httpMethods.forEach(function(e){n[e]=function(n,s){return o.xhrConnection(e,n,o.maybeData(s),t)}}),o.xhrConnection=function(e,t,n,s){var r=new XMLHttpRequest;return r.open(e,t||"",!0),o.setHeaders(r,s.headers),r.addEventListener("readystatechange",o.ready,!1),r.send(o.objectToQueryString(n)),o.promises()},o.setHeaders=function(e,t){t=t||{},o.hasContentType(t)||(t["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(t).forEach(function(n){t[n]&&e.setRequestHeader(n,t[n])})},o.hasContentType=function(e){return Object.keys(e).some(function(e){return"content-type"===e.toLowerCase()})},o.ready=function(){var e=this;e.readyState===e.DONE&&(e.removeEventListener("readystatechange",o.ready,!1),o.methods.always.apply(o.methods,o.parseResponse(e)),e.status>=200&&e.status<300?(o.methods.then.apply(o.methods,o.parseResponse(e)),o.methods.done.apply(o.methods,o.parseResponse(e))):(o.methods["catch"].apply(o.methods,o.parseResponse(e)),o.methods.error.apply(o.methods,o.parseResponse(e))))},o.parseResponse=function(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]},o.promises=function(){var e={};return Object.keys(o.methods).forEach(function(t){e[t]=o.generatePromise.call(this,t)},this),e},o.generatePromise=function(e){return function(t){return o.generateDeprecatedMessage(e),o.methods[e]=t,this}},o.generateDeprecatedMessage=function(e){var t="@fdaciuk/ajax: `%s` is deprecated and will be removed in v2.0.0. Use `%s` instead.";switch(e){case"done":console.warn(t,"done","then");break;case"error":console.warn(t,"error","catch")}},o.objectToQueryString=function(e){return o.isObject(e)?o.getQueryString(e):e},o.getQueryString=function(e){return Object.keys(e).map(function(t){return[encodeURIComponent(t),"=",encodeURIComponent(e[t])].join("")}).join("&")},o.isObject=function(e){return"[object Object]"===Object.prototype.toString.call(e)},t.method&&t.url?o.xhrConnection(t.method,t.url,o.maybeData(t.data),t):n}return e}),define("app/model/iterateMedia",["app/model/requests","ajax"],function(e,t){var n,o,s,r,i=1;return function(){if(s=arguments[0],r=arguments.callee,"undefined"==typeof s)throw new Error("no parameter be defiended.");return"undefined"==typeof n&&(n=new RegExp("^\\s*"+s.type+"\\s*$","i")),"function"==typeof s.init&&s.init(),o={Title:s.sheet["A"+s.offset]&&s.sheet["A"+s.offset].v,imdbID:s.sheet["B"+s.offset]&&s.sheet["B"+s.offset].v,Type:s.sheet["C"+s.offset]&&s.sheet["C"+s.offset].v,PosterList:s.sheet["D"+s.offset]&&s.sheet["D"+s.offset].v},"undefined"==typeof o.Title&&"undefined"==typeof o.imdbID?("function"==typeof s.end&&s.end(),i=null,o=null,n=null,!1):i>s.setting.pageSize?("function"==typeof s.pause&&s.pause(),i=1,!0):(delete s.sheet["A"+s.offset],delete s.sheet["B"+s.offset],delete s.sheet["C"+s.offset],delete s.sheet["D"+s.offset],s.offset++,void(""===s.type||n.test(o.Type)?(o.imdbID?t().get(e.imdb+"?i="+o.imdbID+"&plot=full&r=json").then(function(e,t){o&&o.PosterList&&(e.Posters=o.PosterList.split(",")),"function"==typeof s.success&&s.success({media:e,offset:s.offset})})["catch"](function(e,t){"function"==typeof s.error&&s.error({media:o,offset:s.offset})}).always(function(e,t){"function"==typeof s.complete&&s.complete({media:o,offset:s.offset}),r(s)}):("function"==typeof s.error&&s.error({media:o,offset:s.offset}),r(s)),i++):r(s)))}});