/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global', 'app/controller/affixNavigation' ]);

	require([ 'jquery', 'bootstrap' ], function($) {
		$(document).ready(function() {
			var $pagination = $('#pagination');

			if($pagination.size() === 0) {
				var patternNO = /(?:\/dummy_split_)(\d{3})(?:\.html$)/g;
				var creatItem = function(number, arrow) {
					var patternN = new RegExp('\\d\{' + number.toString().length + '\}\$');

					return '<li><a href="dummy_split_' + '000'.replace(patternN, number) + '.html" aria-label="Next"><i class="fa ' + arrow + '" aria-hidden="true"></i></a></li>';
				};
				$pagination = $('<div id="pagination" class="container hidden-print"><hr><nav><ul class="pagination"></ul></nav></div>');
				var pageNO = parseInt(patternNO.exec(location.pathname)[1], 10);

				$pagination.find('.pagination').append(creatItem(pageNO + 1, 'fa-angle-double-right'));
				if(pageNO > 1) {
					$pagination.find('.pagination').prepend(creatItem(pageNO - 1, 'fa-angle-double-left'));
				}
				$('main').append($pagination);
			}

			$('a[href]').filter(function() {
				return $(this).children('sup').size() > 0;
			}).on('inserted.bs.tooltip', function(event) {
				var $this = $(this);

				if($this.attr('data-original-title') === '') {
					$.get($this.attr('href'), function(data) {
						var supStr = $(data).find($this.attr('href').match(/(\#[\w, \d]+)/g)[0]).html();

						$this.attr('data-original-title', supStr).tooltip('show');
					});
				}
			}).tooltip({
				placement : 'top',
				html : true,
				title : function() {
					return $(this).attr('data-original-title') || '<i class="fa fa-circle-o-notch fa-spin" aria-label="Loading" />...';
				}
			});
		});
	});
});