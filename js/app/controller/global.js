/**
 * Global Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests', 'app/model/util', 'jquery', 'bootstrap', 'slick', 'browser' ], function(requests, util, $) {
	$(document).on('submit', '#form-cse-search', function(event) {
		var $this = $(this), searchPath = $this.attr('action');
		var pattern = new RegExp('^' + searchPath, 'i');

		if(pattern.test(location.pathname)) {
			$(document).off('submit', '#form-cse-search').on('submit', '#form-cse-search', function(event) {
				var $search = $('#input-cse-search');
				var searchEntry = $.trim($search.val());
				var element = google.search.cse.element.getElement('searchresults-only0');
		
				if (searchEntry == '') {
					element.clearAllResults();
				} else {
					element.execute(searchEntry);
				}
				history.pushState(null, null, '?' + $search.attr('name') + '=' + encodeURIComponent(searchEntry));

				event.preventDefault();
			});
			$this.submit();
		} else {
			$.ajax({
				url: searchPath,
				dataType: 'html',
				success: function(data) {
					var $documentB = $(data);

					document.title = $documentB.filter('title').text();
					$('main').replaceWith($documentB.find('main'));
					google.search.cse.element.go('searchResults');
					history.pushState(null, null, searchPath);
					$this.submit();
				}
			});
		}
		event.preventDefault();
	}).ready(function() {
		/**
		 * Global Status
		 */
		$('#progressBar').toggleClass('active', false);
		if($.browser.msie) {
			$('#tip-browser').removeClass('hidden');
		} else {
			$('#tip-browser').remove();
		}

		/**
		 * Slides
		 */
		$('.carousel.slide').each(function() {
			var $slider = $(this).find('.carousel-inner');

			if($slider.children('.item').size() > 1) {
				$slider.slick({
					autoplay : true,
					autoplaySpeed : 5000,
					dots : true,
					dotsClass : 'carousel-indicators',
					appendDots : $slider.parent(),
					customPaging : function(slider, i) {
						return '<a href="#slick-slide' + (function(index) {
							return index < 10 ? '0' + index : index;
						})(i) + '"><span class="sr-only">' + $('.item', $slider).eq(i).attr('title') + '</span></a>';
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
	$(window).on('popstate', function(event) {
		var $form = $('#form-cse-search'), $input = $('#input-cse-search');
		var pattern = new RegExp('^' + $form.attr('action'), 'i');
		var query = util.getUrlParam('query');

		if(pattern.test(location.pathname)) {
			$input.val(query);
			$form.submit();
		}
	});

	/**
	 * Google Analytics
	 */
	(function(i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1 * new Date();
		a = s.createElement(o), m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

	ga('create', 'UA-51330074-5', 'auto');
	ga('require', 'linkid');
	ga('send', 'pageview');

	/**
	 * Google Custom Search Engine
	 */
	window.__gcse = {
		parsetags: 'explicit',
		callback: function() {
			var searchR = function() {
				var $form = $('#form-cse-search'), $input = $('#input-cse-search');
				var pattern = new RegExp('^' + $form.attr('action'), 'i');
				var query = util.getUrlParam('query');

				google.search.cse.element.go('searchResults');
				if(pattern.test(location.pathname)) {
					$input.focus().val(query);
					$form.submit();
				}
			};

			if (document.readyState == 'complete') {
				searchR();
			} else {
				google.setOnLoadCallback(searchR, true);
			}
		}
	};
	/* require(['googleAPI'], function() {
		google.load('search', '1', {
			nocss: true,
			callback: function() {
				var searchControl = new google.search.CustomSearchControl('001907108702964322728:jc6j-dfwhfq');
				searchControl.draw('searchResults');
				//window.__gcse.callback();
			}
		});
	}); */
	// Attach the Google branding watermark
	require(['googleCSE', 'googleWatermark']);
});
