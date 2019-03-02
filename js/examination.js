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
			$('[data-toggle="tooltip"]').tooltip();
		});
	});
});