/**
 * Common requirejs config for all page modules.
 */

/*
 * The following comment tell gulp-jshint variable define is requirejs in
 * another file.
 */
/* global requirejs */
requirejs.config({
	baseUrl: '/dist/js/lib',
	paths: {
		app: '../app',
		jquery: 'jquery.min',
		bootstrap: 'bootstrap.min',
		browser: 'jquery.browser.min',
		slick: 'slick.min',
		zip: 'jszip',
		xlsx: 'xlsx.min',
		ajax: 'ajax.min',
		googleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBECsgJK9qsTirYdxvaPWfOywXxiwdYe5k&callback=initMap&language=en'
	},
	shim: {
		bootstrap: ['jquery']
	},
	map: {
	},
	waitSeconds: 0,
	modules: [ {
		name: '../config',
		include: [ 
            'jquery',
            'bootstrap',
			'browser'
        ]
	}, {
		name: '../marching',
		exclude: [ 
            '../config'
        ],
		include: [ 
            'slick',
            'app/controller/global'
        ]
	}, {
		name: '../article',
		exclude: [ 
            '../config'
        ],
		include: [ 
            'app/controller/global'
        ]
	}, {
		name: '../media',
		include: [ 
            'app/model/util',
            'app/model/excelRequest',
            'app/model/requests',
            'app/model/iterateMedia',
            'app/controller/global'
        ],
		exclude: [ 
            '../config'
        ]
	}, {
		name: '../work',
		include: [ 
            'app/model/excelRequest',
            'app/model/requests',
            'app/controller/global',
            'xlsx'
        ],
		exclude: [ 
            '../config'
        ]
	}, {
		name: '../printing',
		include: [ 
            'app/model/util',
            'app/controller/global',
            'app/controller/locatorMap',
        ],
		exclude: [ 
            '../config'
        ]
	}, {
		name: 'app/model/iterateMedia',
		include: [ 
            'ajax'
        ]
	} ]
});