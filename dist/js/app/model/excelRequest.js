define([],function(){function e(){return(e="undefined"!=typeof XMLHttpRequest?function(){return new XMLHttpRequest}:"undefined"!=typeof ActiveXObject?function(){if("string"!=typeof arguments.callee.activeXString)for(var e=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],t=0,n=e.length;n>t;t++)try{var r=new ActiveXObject(e[t]);return arguments.callee.activeXString=e[t],r}catch(i){console.log("Failed to create XMLHttpRequest: "+e[t])}return new ActiveXObject(arguments.callee.activeXString)}:function(){throw new Error("No XHR object availabel.")})()}return function(t,n,r){var i=e();if("undefined"!=typeof Uint8Array){try{i.responseType="arraybuffer"}catch(s){console.log(s)}i.onload=function(e){var t,n=i.response,s=new Array;try{t=new Uint8Array(n);for(var o=0;o!=t.length;++o)s[o]=String.fromCharCode(t[o])}catch(u){console.log(u),t=new Uint8Array(n.length);for(var o=0;o!=n.length;++o)t[o]=n[o],s[o]=String.fromCharCode(t[o])}r(XLSX.read(s.join(""),{type:"binary"}))}}else i.setRequestHeader("Accept-Charset","x-user-defined"),i.onreadystatechange=function(){4==i.readyState&&(i.status>=200&&i.status<=300||304==i.status?r(XLSX.read(i.responseBody,{type:"binary"})):console.log("Request was unsuccessful: "+i.status))};return i.open(t,n,!0),i.send(),i}});