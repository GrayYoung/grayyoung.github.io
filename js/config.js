/**
 * Common requirejs config for all page modules.
 */

/*
 * The following comment tell gulp-jshint variable define is requirejs in
 * another file.
 */
/* global requirejs */
requirejs.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app',
		jquery: 'jquery',
		bootstrap: 'bootstrap',
		browser: 'jquery.browser',
		slick: 'slick',
		zip: 'jszip',
		xlsx: 'xlsx',
		ajax: 'ajax.min',
		googleAPI: 'https://www.google.com/jsapi',
		googleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBECsgJK9qsTirYdxvaPWfOywXxiwdYe5k&callback=initMap&language=en',
		googleCSE: 'https://cse.google.com/cse.js?cx=001907108702964322728:jc6j-dfwhfq',
		googleWatermark: '//www.google.com/cse/brand?form=form-cse-search&inputbox=input-cse-search'
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
            'app/model/util',
            'app/model/responsiveness',
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