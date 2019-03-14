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
            $('#examination.invisible').removeClass('invisible');
		});
	});
});