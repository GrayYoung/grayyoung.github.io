define({hasEvent:function(type,events){var tmp=/^([^.]*)(?:\.(.+)|)$/.exec(type)||[],typeT=origType=tmp[1];return events&&events[typeT]&&function(){var breakFct=!1,namespace=(tmp[2]||"").split(".").sort().join(".");$.each(events[typeT],function(i,e){if(e.namespace===namespace){breakFct=!0;return!1}});return breakFct}()?!0:!1},getUrlParam:function(name,ignoreCase){function getRegExp(name){var pattern=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");ignoreCase===!0&&(pattern=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i"));return window.location.search.substr(1).match(pattern)}var r="";r=getRegExp(name);return null!=r?unescape(r[2]):""},setCookie:function(cname,cvalue,exdays,domain){var tempCookieStr=cname+"="+cvalue+";";if(exdays&&""!=exdays){var d=new Date;d.setTime(d.getTime()+24*exdays*60*60*1e3);var expires="expires="+d.toGMTString();tempCookieStr+=expires+";"}tempCookieStr+="path=/;";domain&&""!=domain&&(tempCookieStr+=domain+";");document.cookie=tempCookieStr},getCookie:function(cname){for(var name=cname+"=",ca=document.cookie.split(";"),i=0;i<ca.length;i++){var c=$.trim(ca[i]);if(0==c.indexOf(name))return c.substring(name.length,c.length)}return""}});