/**
 * Google Map for Store Locators
 */

/*
 * The following comment tell gulp-jshint variable define is require in another file.
 */ 
/* global define */
define(function() {
	window.storeMap = {
		map : null,
		infoWindow : null,
		markers : []
	};

	storeMap.createMarker = function(latlng, labelText, marker) {
		var gMarker, context, canvas = document.createElement('canvas');

		if($.type(labelText) === 'undefined') {
			labelText = '';
		}
		canvas.width = 34, canvas.height = 50;
		context = canvas.getContext('2d');
		context.arc(17, 17, 9, 0, 2 * Math.PI);
		context.fillStyle = 'white';
		context.fill();
		context.font = '57.5px FontAwesome';
		context.fillStyle = '#f15441';
		context.fillText('\uf041', 0, 46);
		context.font = '10px "Myriad Pro"';
		context.fillStyle = '#ce1126';
		context.fillText(labelText, 16 - labelText.length * 5 / 2, 20);

		gMarker = new google.maps.Marker({
			map : storeMap.map,
			position : latlng,
			/* label : {
				color : '#ce1126',
				fontFamily : 'Myriad Pro',
				fontSize : '10px',
				text : labelText || ' '
			}, */
			icon : {
				url : canvas.toDataURL('image/png'),
				size : new google.maps.Size(34, 50),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(17, 50),
				labelOrigin : new google.maps.Point(17, 17)
			},
			shape : {
				coords : [ 17, 0, 5, 5, 0, 16, 8, 37, 17, 50, 25, 37, 34, 16, 22, 5 ],
				type : 'poly'
			}
		});

		if(marker) {
			google.maps.event.addListener(gMarker, 'click', function() {
				var html = "<b>" + marker.name + "</b> <br/>" + marker.address1 + '<br/>' + marker.address2
					+ '<br/>' + marker.city + ', ' + marker.state + ' ' + marker.zipCode
					+ '<br/>' + marker.tel;
				storeMap.infoWindow.setContent(html);
				storeMap.infoWindow.open(storeMap.map, gMarker);
			});
		}
		storeMap.markers.push(gMarker);
	}

	storeMap.clearLocations = function() {
		for (var i = 0; i < storeMap.markers.length; i++) {
			storeMap.markers[i].setMap(null);
		}
		storeMap.markers.length = 0;
		if(storeMap.infoWindow) {
			storeMap.infoWindow.close();
		}
	}

	window.initMap = function() {
		var eLocatorMap = document.getElementById('locatorMap');
		var latlng = new google.maps.LatLng(30.543533, 104.043466);
		var locator = {
			name: 'Marching Printing',
			address1: 'Fuhua S Rd No.1606',
			address2: '',
			city: 'Chengdu',
			state: 'Sichuan',
			zipCode: '610000',
			tel: ''
		};
		var bounds = new google.maps.LatLngBounds();

		if(eLocatorMap === null) {
			return false;
		}
		storeMap.infoWindow = new google.maps.InfoWindow();
		storeMap.map = new google.maps.Map(eLocatorMap);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				storeMap.map.setOptions({
					center : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					zoom : 15,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});
				storeMap.createMarker(latlng, 'P', locator);
				//bounds.extend(latlng);
				//storeMap.map.fitBounds(bounds);
				storeMap.setCenter(latlng);
			}, function(positionError) {
				storeMap.map.setOptions({
					center : latlng,
					zoom : 15,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});
				console.log(positionError);
				storeMap.createMarker(latlng, 'P', locator);
				//bounds.extend(latlng);
				//storeMap.map.fitBounds(bounds);
			});
		}
	};

	require({
		urlArgs : ''
	}, [ 'googleMap' ], function(){
	}, function(error) {
		if ((error.requireModules && error.requireModules[0]) === 'googleMap') {
			$('#locatorMap').next().removeClass('hidden').end().remove();
		}
	});

	return storeMap;
});