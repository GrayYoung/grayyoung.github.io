/**
 * Request Excel File
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define(function() {
	function createXHR() {
		if(typeof XMLHttpRequest != 'undefined') {
			createXHR = function() {
				return new XMLHttpRequest();
			}
		} else if(typeof ActiveXObject != 'undefined') {
			createXHR = function() {
				if(typeof arguments.callee.activeXString != 'string') {
					var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];

					for(var i = 0, len = versions.length; i < len; i++) {
						try {
							var xhr = new ActiveXObject(versions[i]);
		
							arguments.callee.activeXString = versions[i];

							return xhr;
						} catch(error) {
							console.log('Failed to create XMLHttpRequest: ' + versions[i]);
						}
					}
				}

				return new ActiveXObject(arguments.callee.activeXString);
			}
		} else {
			createXHR = function() {
				throw new Error('No XHR object availabel.');
			}
		}

		return createXHR();
	}

	return function(method, url, callback) {
		var xhRequest = createXHR();

		if(typeof Uint8Array !== 'undefined') {
			try {
				xhRequest.responseType = 'arraybuffer';
			} catch(error) {
				console.log(error);
			}
			xhRequest.onload = function(e) {
				var arraybuffer = xhRequest.response;
				var data, arr = new Array();
				var unitLimited = false;

				try {
					data = new Uint8Array(arraybuffer)
					for(var i = 0; i != data.length; ++i) {
						arr[i] = String.fromCharCode(data[i]);
					}
				} catch(error) {
					console.log(error);
					data = new Uint8Array(arraybuffer.length)
					for(var i = 0; i != arraybuffer.length; ++i) {
						data[i] = arraybuffer[i];
						arr[i] = String.fromCharCode(data[i]);
					}
				}
				callback(XLSX.read(arr.join(''), {
					type : 'binary'
				}));
			};
		} else {
			xhRequest.setRequestHeader('Accept-Charset', 'x-user-defined');	
			xhRequest.onreadystatechange = function() {
				if(xhRequest.readyState == 4) {
					if((xhRequest.status >= 200 && xhRequest.status <= 300) || xhRequest.status == 304) {
						callback(XLSX.read(xhRequest.responseBody, {
							type : 'binary'
						}));
					} else {
						console.log('Request was unsuccessful: ' + xhRequest.status);
					}
				} 
			};
		}
		xhRequest.open(method, url, true);
		xhRequest.send();
	
		return xhRequest;
	};
});