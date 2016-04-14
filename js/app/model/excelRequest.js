/**
 * Request Excel File
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define(function() {
	return function(method, url, callback) {
		var xhRequest;
	
		if(window.XMLHttpRequest) {
			xhRequest = new XMLHttpRequest();
		} else if(window.ActiveXObject) {
			xhRequest = new ActiveXObject('MSXML2.XMLHTTP.3.0');
		} else {
			throw 'XHR unavailable for your browser';
		}
		xhRequest.open(method, url, true);
		if(typeof Uint8Array !== 'undefined') {
			xhRequest.responseType = "arraybuffer";
			xhRequest.onload = function(e) {
				var arraybuffer = xhRequest.response;
				var data = new Uint8Array(arraybuffer);
				var arr = new Array();
	
				for(var i = 0; i != data.length; ++i) {
					arr[i] = String.fromCharCode(data[i]);
				}
				callback(XLSX.read(arr.join(''), {
					type : 'binary'
				}));
			};
		} else {
			xhRequest.setRequestHeader('Accept-Charset', 'x-user-defined');	
			xhRequest.onreadystatechange = function() {
				if(xhRequest.readyState == 4 && xhRequest.status == 200) {
					callback(XLSX.read(xhRequest.responseBody, {
						type : 'binary'
					}));
				} 
			};
		}
		xhRequest.send();
	
		return xhRequest;
	};
});