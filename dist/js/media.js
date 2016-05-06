require(["./config"],function(config){require(["app/controller/global"]);require(["app/model/util","app/model/requests","app/model/excelRequest","app/model/iterateMedia","jquery","bootstrap","xlsx"],function(util,requests,excelRequest,iterateMedia,$){$(document).on("mousewheel.ls.media",function(event){event.deltaY>0&&$(document).scrollTop()<=0?$("#containerListing").trigger("update","top"):event.deltaY<0&&$(document).scrollTop()>=$(document).height()-$(window).height()&&$("#containerListing").trigger("update","bottom")}).on("touchstart.ls.media",function(event){var $document=$(this);$document.data("touch",{pageX:event.originalEvent.changedTouches[0].pageX,pageY:event.originalEvent.changedTouches[0].pageY,startTime:(new Date).getTime()})}).on("touchend.ls.media",function(event){var $document=$(this),touchData=$document.data("touch"),distance=event.originalEvent.changedTouches[0].pageY-touchData.pageY;(new Date).getTime()-touchData.startTime<=300&&(distance>=60&&$(document).scrollTop()<=0?$("#containerListing").trigger("update","top"):60>=distance&&$(document).scrollTop()>=$(document).height()-$(window).height()&&$("#containerListing").trigger("update","bottom"))}).on("click","#containerListing a.u-url",function(event){var cvsContext,$this=$(this),$preview=$this.closest(".h-item"),$modal=$("#modalPreview"),imdbData=$preview.data("imdbData"),total=parseInt($("#fixedProgress .progress-label").text(),10),current=$preview.index(),leftLimited=1>current,rightLimited=current>total-2,img=new Image;if(0===$modal.size()){$modal=$(document.getElementById("tl-modalPreview").content).children().clone();$modal.on("hidden.bs.modal",function(event){$(this).remove()}).insertAfter($this).modal("show")}$modal.find(".loading").toggleClass("active",!0);$modal.find(".carousel-control").off("click").one("click",function(event){var $arrow=$(this);$preview[function(){return $arrow.hasClass("left")?"prev":($arrow.hasClass("right"),"next")}()]().find("a.u-url").click();event.preventDefault()}).filter(".left").toggleClass("disabled",leftLimited).children(".fa").toggleClass("fa-angle-left",!leftLimited).toggleClass("fa-minus",leftLimited).end().end().filter(".right").toggleClass("disabled",rightLimited).children(".fa").toggleClass("fa-angle-right",!rightLimited).toggleClass("fa-minus",rightLimited);$modal.find(".modal-title").text(imdbData.Title).find(".modal-footer dd").text("");$.each(imdbData,function(key,value){$modal.find(".modal-footer .p-"+key.toLowerCase()).text(value)});canvas=$modal.find("#posterCanvas").get(0);cvsContext=canvas.getContext("2d");cvsContext.clearRect(0,0,canvas.width,canvas.height);img.onerror=function(){var gradient=cvsContext.createLinearGradient(0,0,canvas.width,0);gradient.addColorStop(.125,"#f15441");gradient.addColorStop(.375,"#fec536");gradient.addColorStop(.625,"#69c4bd");gradient.addColorStop(.875,"#2b669f");cvsContext.fillRect(0,0,canvas.width,canvas.height);cvsContext.fillStyle=gradient;cvsContext.fill();$modal.find(".loading").toggleClass("active",!1)};img.onload=function(){canvas.width=this.width,canvas.height=this.height;cvsContext.drawImage(img,0,0);$modal.find(".loading").addClass("active");$modal.find(".loading").toggleClass("active",!1)};img.src=imdbData.Posters&&imdbData.Posters[0]||"http://grayyoung.github.io/Flickr/poster/"+imdbData.Title+".jpg";event.preventDefault()}).ready(function(){var $container=$("#containerListing"),setting={pageSize:20},type=util.getUrlParam("t",!0),listItems=function(workbook){var sheet=workbook&&workbook.Sheets[workbook.SheetNames[0]]||$container.data("sheet"),offset=$container.data("offset")||2,$p=$("#fixedProgress"),callData=($(".progress-label",$p),function(data){var $p=$("#fixedProgress"),$pLabel=$(".progress-label",$p),$preview=$(document.getElementById("tl-preview").content).children().clone().data({imdbData:data,page:parseInt(offset/setting.pageSize,10)+1});$preview.find(".p-category").children().first().text(data.Type).end().last().text(data.Genre);$preview.find("img").attr("src",data.Poster).get(0).onerror=function(){this.src=data.Posters&&data.Posters[0]||"http://grayyoung.github.io/Flickr/poster/"+data.Title+".jpg";this.onerror=null};$preview.find(".p-name").children().text(data.Title);$preview.find(".p-rating").children().first().css("width",data.imdbRating+"em").next().children().first().text(data.imdbRating).next().text(data.imdbVotes);$preview.find(".u-url").attr("href","http://www.imdb.com/title/"+data.imdbID);$container.append($preview);$pLabel.text(parseInt($pLabel.text(),10)+1)});if(window.Worker){var ajaxWorker=new Worker("/js/app/worker/ajaxToIMDB.js");ajaxWorker.onmessage=function(event){if(1===event.data.status)ajaxWorker.postMessage({sheet:sheet,offset:offset,setting:setting,type:type});else if(event.data.offset){callData(event.data.media);$container.data("offset",event.data.offset)}else if(event.data.pause===!0){$container.data("loading",!1);$p.toggleClass("loading",!1)}else if(event.data.stopProgress===!0){$container.data("loading",!1);$p.toggleClass("loading",!1);$(document).off("scroll.ls.media mousewheel.ls.media touchstart.ls.media touchend.ls.media");$container.unbind("update")}}}else iterateMedia({sheet:sheet,offset:offset,setting:setting,type:type,pause:function(){$container.data("loading",!1);$p.toggleClass("loading",!1)},end:function(){$container.data("loading",!1);$p.toggleClass("loading",!1);$(document).off("scroll.ls.media mousewheel.ls.media touchstart.ls.media touchend.ls.media");$container.unbind("update")},success:function(data){callData(data.media);$container.data("offset",data.offset)},error:function(data){callData(data.media);$container.data("offset",data.offset)}})};$container.data({loading:!1});$("#containerListing").bind("update",function(event,direction){var $container=$(this),$p=$("#fixedProgress");if($container.data("loading")===!0||"top"===direction)return!1;$container.data("loading",!0);$p.toggleClass("loading",!0);if($container.data("sheet"))listItems();else if(window.Worker){var xlsxWorker=new Worker("/js/app/worker/xlsx.js");xlsxWorker.onmessage=function(event){listItems(event.data);xlsxWorker.terminate()};xlsxWorker.onerror=function(error){excelRequest("GET",requests.media,listItems);xlsxWorker.terminate()}}else excelRequest("GET",requests.media,listItems)});$(document).data("oddScrollTop",$(document).scrollTop()).on("scroll.ls.media",function(event){var $item,el_top,el_height,updatedURL=location.search.substr(1),page=1,pattern=/(^|\&)(page=[^\&]*)(\&|$)/gi,$document=$(this),$container=$("#containerListing"),newScrollTop=$document.scrollTop(),oddScrollTop=$document.data("oddScrollTop"),wHeight=$(window).height(),containerTop=$container.offset().top,containerHeight=$container.height();oddScrollTop>newScrollTop&&newScrollTop<=containerTop-Math.min(wHeight,containerTop)/2?$container.trigger("update","top"):newScrollTop>=oddScrollTop&&newScrollTop>=containerTop+containerHeight-wHeight+Math.min(wHeight,$document.height()-containerTop-containerHeight)/2&&$container.trigger("update","bottom");$document.data("oddScrollTop",newScrollTop).find(".h-item").each(function(){$item=$(this);el_top=$item.offset().top,el_height=$item.height();if(el_top+.75*el_height>newScrollTop&&newScrollTop+el_height>el_top){page=$item.data("page")||$container.data("originalpage");""!==updatedURL?pattern.test(updatedURL)?updatedURL=updatedURL.replace(pattern,"$1page="+page+"$3"):updatedURL+="&page="+page:updatedURL="page="+page;history.replaceState(null,null,location.pathname+"?"+updatedURL.replace(/(^|\&)(page=1)(\&|$)/gi,"$3").replace(/^\&+/g,""));return!1}})}).trigger("scroll.ls.media")})})});define("../media",function(){});define("app/model/util",{getUrlParam:function(name,ignoreCase){var r="";r=function(name){var pattern=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");ignoreCase===!0&&(pattern=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i"));return location.search.substr(1).match(pattern)}(name);return null!=r?unescape(r[2]):""}});define("app/model/excelRequest",[],function(){function createXHR(){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"==typeof ActiveXObject)throw new Error("No XHR object availabel.");for(var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i=0,len=versions.length;len>i;i++)try{var xhr=new ActiveXObject(versions[i]);arguments.callee.activeXString=versions[i];return xhr}catch(error){console.log("Failed to create XMLHttpRequest: "+versions[i])}}return function(method,url,callback){var xhRequest=createXHR();if("undefined"!=typeof Uint8Array){xhRequest.responseType="arraybuffer";xhRequest.onload=function(e){for(var arraybuffer=xhRequest.response,data=new Uint8Array(arraybuffer),arr=new Array,i=0;i!=data.length;++i)arr[i]=String.fromCharCode(data[i]);callback(XLSX.read(arr.join(""),{type:"binary"}))}}else{xhRequest.setRequestHeader("Accept-Charset","x-user-defined");xhRequest.onreadystatechange=function(){4==xhRequest.readyState&&(xhRequest.status>=200&&xhRequest.status<=300||304==xhRequest.status?callback(XLSX.read(xhRequest.responseBody,{type:"binary"})):console.log("Request was unsuccessful: "+xhRequest.status))}}xhRequest.open(method,url,!0);xhRequest.send();return xhRequest}});define("app/model/requests",{imdb:"http://www.omdbapi.com/",media:"/data/media.xlsx",work:"/data/work.xlsx"});!function(e,t){"use strict";"function"==typeof define&&define.amd?define("ajax",t):"object"==typeof exports?exports=module.exports=t():(e.Ajax=t(),e.ajax=t())}(this,function(){"use strict";function e(t){void 0!==this&&console.warn(["Instance with `new` is deprecated. ","This will be removed in `v2.0.0` version."].join("")),this instanceof e&&console.warn(["Ajax constructor is deprecated. This will be removed in ","`v2.0.0`. Use ajax (lowercase version) without `new` ","keyword instead"].join("")),t=t||{};var n={},o={};return o.methods={then:function(){},"catch":function(){},always:function(){},done:function(){},error:function(){}},o.maybeData=function(e){return e||null},o.httpMethods=["get","post","put","delete"],o.httpMethods.forEach(function(e){n[e]=function(n,r){return o.xhrConnection(e,n,o.maybeData(r),t)}}),o.xhrConnection=function(e,t,n,r){var s=new XMLHttpRequest;return s.open(e,t||"",!0),o.setHeaders(s,r.headers),s.addEventListener("readystatechange",o.ready,!1),s.send(o.objectToQueryString(n)),o.promises()},o.setHeaders=function(e,t){t=t||{},o.hasContentType(t)||(t["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(t).forEach(function(n){t[n]&&e.setRequestHeader(n,t[n])})},o.hasContentType=function(e){return Object.keys(e).some(function(e){return"content-type"===e.toLowerCase()})},o.ready=function(){var e=this;e.readyState===e.DONE&&(e.removeEventListener("readystatechange",o.ready,!1),o.methods.always.apply(o.methods,o.parseResponse(e)),e.status>=200&&e.status<300?(o.methods.then.apply(o.methods,o.parseResponse(e)),o.methods.done.apply(o.methods,o.parseResponse(e))):(o.methods["catch"].apply(o.methods,o.parseResponse(e)),o.methods.error.apply(o.methods,o.parseResponse(e))))},o.parseResponse=function(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]},o.promises=function(){var e={};return Object.keys(o.methods).forEach(function(t){e[t]=o.generatePromise.call(this,t)},this),e},o.generatePromise=function(e){return function(t){return o.generateDeprecatedMessage(e),o.methods[e]=t,this}},o.generateDeprecatedMessage=function(e){var t="@fdaciuk/ajax: `%s` is deprecated and will be removed in v2.0.0. Use `%s` instead.";switch(e){case"done":console.warn(t,"done","then");break;case"error":console.warn(t,"error","catch")}},o.objectToQueryString=function(e){return o.isObject(e)?o.getQueryString(e):e},o.getQueryString=function(e){return Object.keys(e).map(function(t){return[encodeURIComponent(t),"=",encodeURIComponent(e[t])].join("")}).join("&")},o.isObject=function(e){return"[object Object]"===Object.prototype.toString.call(e)},t.method&&t.url?o.xhrConnection(t.method,t.url,o.maybeData(t.data),t):n}return e});define("app/model/iterateMedia",["app/model/requests","ajax"],function(requests,ajax){var tPattern,preview,_thisParam,_thisF,count=1;return function(){_thisParam=arguments[0],_thisF=arguments.callee;if("undefined"==typeof _thisParam)throw new Error("no parameter be defiended.");"undefined"==typeof tPattern&&(tPattern=new RegExp("^\\s*"+_thisParam.type+"\\s*$","i"));_thisParam.offset++;"function"==typeof _thisParam.init&&_thisParam.init();preview={Title:_thisParam.sheet["A"+_thisParam.offset]&&_thisParam.sheet["A"+_thisParam.offset].v,imdbID:_thisParam.sheet["B"+_thisParam.offset]&&_thisParam.sheet["B"+_thisParam.offset].v,Type:_thisParam.sheet["C"+_thisParam.offset]&&_thisParam.sheet["C"+_thisParam.offset].v,PosterList:_thisParam.sheet["D"+_thisParam.offset]&&_thisParam.sheet["D"+_thisParam.offset].v};if("undefined"==typeof preview.Title&&"undefined"==typeof preview.imdbID){"function"==typeof _thisParam.end&&_thisParam.end();_thisParam=null,_thisF=null;count=null,preview=null,tPattern=null;return!1}if(count>_thisParam.setting.pageSize){"function"==typeof _thisParam.pause&&_thisParam.pause();count=1;return!0}delete _thisParam.sheet["A"+_thisParam.offset];delete _thisParam.sheet["B"+_thisParam.offset];delete _thisParam.sheet["C"+_thisParam.offset];delete _thisParam.sheet["D"+_thisParam.offset];if(""===_thisParam.type||tPattern.test(preview.Type)){if(preview.imdbID)ajax().get(requests.imdb+"?i="+preview.imdbID+"&plot=full&r=json").then(function(response,xhrObject){preview&&preview.PosterList&&(response.Posters=preview.PosterList.split(","));"function"==typeof _thisParam.success&&_thisParam.success({media:response,offset:_thisParam.offset})})["catch"](function(responseError,xhrObject){"function"==typeof _thisParam.error&&_thisParam.error({media:preview,offset:_thisParam.offset})}).always(function(response,xhrObject){"function"==typeof _thisParam.complete&&_thisParam.complete({media:preview,offset:_thisParam.offset});_thisF(_thisParam)});else{"function"==typeof _thisParam.error&&_thisParam.error({media:preview,offset:_thisParam.offset});_thisF(_thisParam)}count++}else _thisF(_thisParam)}});define("app/controller/global",["app/model/requests","jquery","bootstrap","browser"],function(requests,$){$(document).ready(function(){$("#progressBar").toggleClass("active",!1);$.browser.msie?$("#tip-browser").removeClass("hidden"):$("#tip-browser").remove()});!function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)}(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create","UA-51330074-5","auto");ga("require","linkid");ga("send","pageview")});