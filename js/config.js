/**
 * Common requirejs config for all page modules.
 */

/*
 * The following comment tell gulp-jshint variable define is requirejs in
 * another file.
 */
/* global requirejs */
requirejs.config({
	baseUrl : '/js/lib',
	paths : {
		app : '../app',
		jquery : 'jquery.min',
		bootstrap : 'bootstrap.min',
		zip : 'jszip',
		xlsx : 'xlsx.min',
		googleMap : 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBECsgJK9qsTirYdxvaPWfOywXxiwdYe5k&callback=initMap&language=en'
	},
	shim : {
		bootstrap : [ 'jquery' ]
	},
	map : {
	},
	waitSeconds : 0,
	modules : [ {
		name : '../config',
		include : [ 
            'jquery',
            'bootstrap'
        ]
	}, {
		name : '../marching',
		exclude : [ 
            '../config'
        ],
		include : [ 
            'app/model/requests',
            'app/controller/global',
            'app/controller/locatorMap',
            'app/controller/media'
        ]
	}, {
		name : '../article',
		exclude : [ 
            '../config'
        ],
		include : [ 
            'app/controller/global'
        ]
	}, {
		name : 'app/controller/media',
		include : [ 
           'app/model/util',
            'app/model/requests',
            'xlsx'
        ],
		exclude : [ 
            'app/model/requests'
        ]
	} ]
});