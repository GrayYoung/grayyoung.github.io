/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global' ]);

	require([ 'jquery', 'bootstrap', 'app/model/translate' ], function($, bs, translate) {
		$(document).on('click', '#examination a', function(event) {
			var $this = $(this);
			var $item = $this.closest('li');

			if ($this.children('.fa-question-circle').length) {
				event.preventDefault();
				if ($item.length) {
					switch ($item.data('type')) {
						case 'radio':
							var $option = $item.find(':radio[value="true"]').closest('li');

							$option.toggleClass('text-success', !$option.hasClass('text-success'));
							break;
						case 'checkbox':
							var $option = $item.find(':checkbox[value="true"]').closest('li');

							$option.each(function() {
								var $checkbox = $(this);

								$checkbox.toggleClass('text-success', !$checkbox.hasClass('text-success'));
							});
							break;
						case 'yesOrNo':
							$item.find(':checkbox[value="true"]').prop('checked', true);
							$item.find(':checkbox[value="false"]').prop('checked', false);
							break;
						case 'text':
							$item.find('.embed-responsive > .collapse').collapse('toggle');
							break;
						case 'textarea':
							break;
					}
				} else {
					$item = $this.closest('section');
					if (!$item.length) {
						$item = $this.closest('article');
					}
					$item.find('h4 a').filter(function() {
						return $(this).children('.fa-question-circle').length;
					}).click();
				}
			}
		}).ready(function() {
			$('li[data-type="text"]').each(function() {
				$('.embed-responsive > .collapse', this).each(function(index) {
					var $control = $('div.form-control', this);
					var values = $control.text();

					if (values) {
						values = values.split('|');
						$control.html(values[index]);
					}
				});
			});
			$('[data-toggle="tooltip"]').tooltip({
				container: '#containerMain'
			});
			/* $('.custom-control-label, u').on('inserted.bs.tooltip', function(event) {
				var $this = $(this);

				if($this.attr('data-original-title') === '') {
					$this.attr('data-original-title', '<i class="fa fa-circle-notch fa-spin" aria-label="Loading"></i>...');
					translate({
						from: 'zh-CN',
						to: 'en',
						query: $.trim($this.text())
					}, function(enData) {
						translate({
							from: 'en',
							to: 'zh-CN',
							query: enData.translated
						}, function(zhData) {
							$this.attr('data-original-title', enData.translated + ' | ' + zhData.translated).tooltip('show');
						});
					});
				}
			}).tooltip({
				container: '#containerMain',
				placement : 'top',
				html : true,
				trigger: 'click focus',
				title : function() {
					return $(this).attr('data-original-title') || '<i class="fa fa-circle-notch fa-spin" aria-label="Loading"></i>...';
				}
			}); */
		});
	});
});