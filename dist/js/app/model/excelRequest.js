define([],function(){function createXHR(){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"==typeof ActiveXObject)throw new Error("No XHR object availabel.");for(var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i=0,len=versions.length;len>i;i++)try{var xhr=new ActiveXObject(versions[i]);arguments.callee.activeXString=versions[i];return xhr}catch(error){console.log("Failed to create XMLHttpRequest: "+versions[i])}}return function(method,url,callback){var xhRequest=createXHR();if("undefined"!=typeof Uint8Array){xhRequest.responseType="arraybuffer";xhRequest.onload=function(e){for(var arraybuffer=xhRequest.response,data=new Uint8Array(arraybuffer),arr=new Array,i=0;i!=data.length;++i)arr[i]=String.fromCharCode(data[i]);callback(XLSX.read(arr.join(""),{type:"binary"}))}}else{xhRequest.setRequestHeader("Accept-Charset","x-user-defined");xhRequest.onreadystatechange=function(){4==xhRequest.readyState&&(xhRequest.status>=200&&xhRequest.status<=300||304==xhRequest.status?callback(XLSX.read(xhRequest.responseBody,{type:"binary"})):console.log("Request was unsuccessful: "+xhRequest.status))}}xhRequest.open(method,url,!0);xhRequest.send();return xhRequest}});