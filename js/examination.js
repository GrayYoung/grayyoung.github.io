/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global' ]);

	require([ 'jquery', 'bootstrap' ], function($) {
		$(document).on('click', '#examination a', function(event) {
			var $this = $(this);
			var $item = $this.closest('li');

			if ($this.children('.fa-question-circle').length) {
				event.preventDefault();
				if ($item.length) {
					switch ($item.data('type')) {
						case 'radio':
							$item.find(':radio[value="true"]').click();
							break;
						case 'yesOrNo':
							var value = $($this.attr('href') + 'Answer').find('.form-control').text();
							var $input = $item.find('input.form-control');

							$item.find(':checkbox[value="true"]').prop('checked', true);
							$item.find(':checkbox[value="false"]').prop('checked', false);
							if ($input.hasClass('text-info')) {
								$input.val('').removeClass('text-info');
							} else {
								$input.val(value).addClass('text-info');
							}
							break;
						case 'text':
							var values = $($this.attr('href') + 'Answer').find('.form-control').text();

							if (values) {
								values = values.split('|');
								$item.find('input.form-control').each(function(index) {
									var $input = $(this);

									if ($input.hasClass('text-info')) {
										$input.val('').removeClass('text-info');
									} else {
										$input.val(values[index]).addClass('text-info');
									}
								});
							}
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
						return $(this).children('.fa-question-circle').length
					}).click();
				}
			}
		}).ready(function() {
			$('[data-toggle="tooltip"]').tooltip({
				container: '#containerMain'
			});
		});
	});
});