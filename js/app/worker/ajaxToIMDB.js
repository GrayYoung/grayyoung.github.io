importScripts('../../lib/require.js');

require([ '../../config' ], function(config) {
	require(['app/model/iterateMedia'], function(iterateMedia) {
		onmessage = function(event) {
			if(event.data.listData) {
				iterateMedia({
					listData: event.data.listData,
					offset: event.data.offset,
					setting: event.data.setting,
					type: event.data.type,
					pause: function() {
						postMessage({
							pause: true
						});
					},
					end: function() {
						postMessage({
							stopProgress: true
						});
					},
					success: function(data) {
						postMessage(data);
					},
					error: function(data) {
						postMessage(data);
					}
				});
			}
		};

		postMessage({
			status: 1
		});
	});
});