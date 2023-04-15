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
		context.arc(17, 17, 15, 0, 2 * Math.PI);
		context.fillStyle = 'white';
		context.fill();
		context.font = 'normal 900 45px/1 "Font Awesome 5 Free"';
		context.fillStyle = '#f15441';
		context.fillText('\uf3c5', 0, 40);
		context.font = '10px "Myriad Pro"';
		context.fillStyle = '#ce1126';
		context.fillText(labelText, 17 - labelText.length * 5 / 2, 21);

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
				size : new google.maps.Size(34, 45),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(17, 45),
				labelOrigin : new google.maps.Point(17, 17)
			},
			shape : {
				coords : [17, 0, 8, 8, 0, 17, 17, 45, 25, 37, 34, 17, 25, 8],
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
		var latlng = new google.maps.LatLng(30.465404, 104.089004);
		var locator = {
			name: 'Marching Printing',
			address1: 'Tianjin Ed East Section No.1234',
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
		storeMap.map = new google.maps.Map(eLocatorMap, {
			zoom: 10,
			center: latlng
		});
		storeMap.createMarker(latlng, 'P', locator);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				storeMap.map.setOptions({
					center : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					zoom : 15,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});
				//bounds.extend(latlng);
				//storeMap.map.fitBounds(bounds);
				storeMap.map.setCenter(latlng);
			}, function(positionError) {
				storeMap.map.setOptions({
					center : latlng,
					zoom : 15,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});
				console.log(positionError);
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
			$('#locatorMap').html('Google Map Temporarily Unavailable.');
		}
	});

	return storeMap;
});