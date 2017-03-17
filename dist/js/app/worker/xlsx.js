importScripts('../../lib/jszip.js');
importScripts('../../lib/require.js');

require([ '../../config' ], function(config) {
	require(['app/model/requests', 'app/model/excelRequest', 'xlsx' ], function(requests, excelRequest) {
		excelRequest('GET', requests.media, postMessage);
	});
});