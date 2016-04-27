define("app/model/requests",{imdb:"http://www.omdbapi.com/",media:"/data/media.xlsx",work:"/data/work.xlsx"});!function(e,t){"use strict";"function"==typeof define&&define.amd?define("ajax",t):"object"==typeof exports?exports=module.exports=t():(e.Ajax=t(),e.ajax=t())}(this,function(){"use strict";function e(t){void 0!==this&&console.warn(["Instance with `new` is deprecated. ","This will be removed in `v2.0.0` version."].join("")),this instanceof e&&console.warn(["Ajax constructor is deprecated. This will be removed in ","`v2.0.0`. Use ajax (lowercase version) without `new` ","keyword instead"].join("")),t=t||{};var n={},o={};return o.methods={then:function(){},"catch":function(){},always:function(){},done:function(){},error:function(){}},o.maybeData=function(e){return e||null},o.httpMethods=["get","post","put","delete"],o.httpMethods.forEach(function(e){n[e]=function(n,r){return o.xhrConnection(e,n,o.maybeData(r),t)}}),o.xhrConnection=function(e,t,n,r){var s=new XMLHttpRequest;return s.open(e,t||"",!0),o.setHeaders(s,r.headers),s.addEventListener("readystatechange",o.ready,!1),s.send(o.objectToQueryString(n)),o.promises()},o.setHeaders=function(e,t){t=t||{},o.hasContentType(t)||(t["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(t).forEach(function(n){t[n]&&e.setRequestHeader(n,t[n])})},o.hasContentType=function(e){return Object.keys(e).some(function(e){return"content-type"===e.toLowerCase()})},o.ready=function(){var e=this;e.readyState===e.DONE&&(e.removeEventListener("readystatechange",o.ready,!1),o.methods.always.apply(o.methods,o.parseResponse(e)),e.status>=200&&e.status<300?(o.methods.then.apply(o.methods,o.parseResponse(e)),o.methods.done.apply(o.methods,o.parseResponse(e))):(o.methods["catch"].apply(o.methods,o.parseResponse(e)),o.methods.error.apply(o.methods,o.parseResponse(e))))},o.parseResponse=function(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]},o.promises=function(){var e={};return Object.keys(o.methods).forEach(function(t){e[t]=o.generatePromise.call(this,t)},this),e},o.generatePromise=function(e){return function(t){return o.generateDeprecatedMessage(e),o.methods[e]=t,this}},o.generateDeprecatedMessage=function(e){var t="@fdaciuk/ajax: `%s` is deprecated and will be removed in v2.0.0. Use `%s` instead.";switch(e){case"done":console.warn(t,"done","then");break;case"error":console.warn(t,"error","catch")}},o.objectToQueryString=function(e){return o.isObject(e)?o.getQueryString(e):e},o.getQueryString=function(e){return Object.keys(e).map(function(t){return[encodeURIComponent(t),"=",encodeURIComponent(e[t])].join("")}).join("&")},o.isObject=function(e){return"[object Object]"===Object.prototype.toString.call(e)},t.method&&t.url?o.xhrConnection(t.method,t.url,o.maybeData(t.data),t):n}return e});define("app/model/iterateMedia",["app/model/requests","ajax"],function(requests,ajax){var tPattern,preview,_thisParam,_thisF,count=1;return function(){_thisParam=arguments[0],_thisF=arguments.callee;if("undefined"==typeof _thisParam)throw new Error("no parameter be defiended.");"undefined"==typeof tPattern&&(tPattern=new RegExp("^\\s*"+_thisParam.type+"\\s*$","i"));_thisParam.offset++;"function"==typeof _thisParam.init&&_thisParam.init();preview={Title:_thisParam.sheet["A"+_thisParam.offset]&&_thisParam.sheet["A"+_thisParam.offset].v,imdbID:_thisParam.sheet["B"+_thisParam.offset]&&_thisParam.sheet["B"+_thisParam.offset].v,Type:_thisParam.sheet["C"+_thisParam.offset]&&_thisParam.sheet["C"+_thisParam.offset].v,PosterList:_thisParam.sheet["D"+_thisParam.offset]&&_thisParam.sheet["D"+_thisParam.offset].v};if("undefined"==typeof preview.Title&&"undefined"==typeof preview.imdbID){"function"==typeof _thisParam.end&&_thisParam.end();_thisParam=null,_thisF=null;count=null,preview=null,tPattern=null;return!1}if(count>_thisParam.setting.pageSize){"function"==typeof _thisParam.pause&&_thisParam.pause();count=1;return!0}delete _thisParam.sheet["A"+_thisParam.offset];delete _thisParam.sheet["B"+_thisParam.offset];delete _thisParam.sheet["C"+_thisParam.offset];delete _thisParam.sheet["D"+_thisParam.offset];if(""===_thisParam.type||tPattern.test(preview.Type)){if(preview.imdbID)ajax().get(requests.imdb+"?i="+preview.imdbID+"&plot=full&r=json").then(function(response,xhrObject){preview&&preview.PosterList&&(response.Posters=preview.PosterList.split(","));"function"==typeof _thisParam.success&&_thisParam.success({media:response,offset:_thisParam.offset})})["catch"](function(responseError,xhrObject){"function"==typeof _thisParam.error&&_thisParam.error({media:preview,offset:_thisParam.offset})}).always(function(response,xhrObject){"function"==typeof _thisParam.complete&&_thisParam.complete({media:preview,offset:_thisParam.offset});_thisF(_thisParam)});else{"function"==typeof _thisParam.error&&_thisParam.error({media:preview,offset:_thisParam.offset});_thisF(_thisParam)}count++}else _thisF(_thisParam)}});