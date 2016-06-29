/**
 * Affix Navigation
 */

/*
 * The following comment tell gulp-jshint variable define is require in another file.
 */ 
/* global define */
define(['app/model/util', 'jquery', 'bootstrap'], function(util, $) {
	var $document = $(document), $outline = $('<nav class="col-lg-2 col-md-3 hidden-xs hidden-sm"/>');

	function matchDestination() {
		var $this, $current, $parent, $w = $(window);
		var st = $document.scrollTop(), gap = 0, top = 0;

		$document.find('main > article').find('section').each(function() {
			$this = $(this);
			if($this.offset().top > st) {
				$current = $outline.find('a[href="#' + $this.attr('id') + '"]');
				$parent = $current.parent('li');
				if($outline.data('oldActiveItems')) {
					$outline.data('oldActiveItems').removeClass('active');
				}
				$outline.data('oldActiveItems', $current.parents('li').addClass('active'));
				top = $current.offset().top;
				gap = st + $w.height() - top - $current.height() - 15;
				if(gap < 0) {
					$outline.children('ul').css('top', gap);
				} else if(top < st) {
					$outline.children('ul').css('top', st - top);
				}

				return false;
			}
		});
	}

	$document.on('scroll.ui.an', function() {
		util.throttle(matchDestination);
	}).ready(function() {
		var $article = $document.find('main > article');
		var outlineScanner = function($section) {
			var $list = $('<ul class="list-unstyled"/>'), $item = $('<li/>');
			var heading = $section.children('h1,h2,h3,h4,h5,h6').text(), id = 'chapter-' + heading.replace(/\W/g, '');
	
			$list.append($item);
			$item.append($('<a/>').attr('href', '#' + id).text(heading));
			$section.attr('id', id);
			$section.children('section').each(function() {
				$item.append(outlineScanner($(this)));
			});
	
			return $list;
		};

		$article.children('section').each(function() {
			$outline.append(outlineScanner($(this).addClass('col-lg-10 col-md-9')));
		}).end().append($outline);
		console.log($document.height() - $article.offset().top - $article.height());
		$outline.children('ul').affix({
			offset: {
				top: $outline.offset().top,
				bottom: $document.height() - $article.offset().top - $article.height()
			}
		}).on('affixed-top.bs.affix', function() {
			$(this).css('top', '');
		});
		matchDestination();
	});
});