/**
 * Affix Navigation
 */

/*
 * The following comment tell gulp-jshint variable define is require in another file.
 */ 
/* global define */
define(['app/model/util', 'app/model/breakpoints', 'jquery', 'bootstrap'], function(util, bps, $) {
	if($(window).width() < bps.desktop.width) {
		return;
	}
	var $document = $(document);
	var outlineScanner = function($sections, deep) {
		var $list = $('<nav class="nav nav-pills flex-column level-' + (deep * 2) + ' "/>'), $item, $section;
		var id = '', heading = '';

		if(!$sections.length) {
			return null;
		}
		$sections.each(function() {
			$section = $(this);
			heading = $section.children('h1,h2,h3,h4,h5,h6').text();
			id = 'chapter-' + heading.replace(/\W/g, '');
			$section.attr('id', id);
			$item = $('<a class="nav-link" />').attr('href', '#' + id).text(heading);
			$list.append($item);
			$item.after(outlineScanner($section.children('section'), ++deep));
		});

		return $list;
	};

	$document.ready(function() {
		var $article = $document.find('main > article').addClass('row'), $outline = $('<div class="col-xl-2 col-lg-3 col-xs-12 order-12 hidden-lg-down"><div class="sticky-top" /></div>');

		$outline.children(':first').append(outlineScanner($article.children('section').addClass('col-xl-10 col-lg-9 col-xs-12 order-1'), 0));
		$article.children('section').first().before($outline);

		$('body').scrollspy({
			target: '.sticky-top .nav'
		});
	});
});