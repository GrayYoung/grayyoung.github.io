/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require(['./config'], function(config) {
	require(['app/controller/global']);
	require(['slick'], function() {
		$(document).ready(function(e) {
			var $slider = $('#carousel-sliding').find('.carousel-inner');

			if($slider.children('.item').size() > 1) {
				$slider.slick({
					autoplay : true,
					autoplaySpeed : 5000,
					dots : false,
					dotsClass : 'carousel-indicators autogenerate',
					appendDots : '#banner-slides > div:last-child',
					customPaging : function(slider, i) {
						return '<a href="#slick-slide' + (function(index) {
							return index < 10 ? '0' + index : index;
						})(i) + '"><span class="sr-only">' + $('#banner-slides .item').eq(i).attr('title') + '</span></a>';
					},
					prevArrow : $slider.siblings('.carousel-control.left'),
					nextArrow : $slider.siblings('.carousel-control.right'),
					pauseOnFocus : true
				});
			} else {
				$slider.siblings('.carousel-control').remove();
			}
		});
	});
});