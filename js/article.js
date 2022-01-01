/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global', 'app/controller/affixNavigation' ]);

	require([ 'jquery', 'bootstrap' ], function($, bootstrap) {
		$(document).ready(function() {
			$('a[href]').filter(function() {
				return $(this).children('sup').length > 0;
			}).on('inserted.bs.tooltip', function(event) {
				var $this = $(this);

				if($this.attr('data-original-title') === '') {
					$this.attr('data-original-title', '<i class="fa fa-circle-notch fa-spin" aria-label="Loading"></i>...');
					$.get($this.attr('href'), function(data) {
						var supStr = $(data).find($this.attr('href').match(/(\#[\w, \d]+)/g)[0]).html();
            var bsTooltip = new bootstrap.Tooltip(this);

						$this.attr('data-original-title', supStr);
            bsTooltip.show();
					});
				}
			}).each(function () {
        var bsTooltip = new bootstrap.Tooltip(this, {
          container: '#containerMain',
          placement : 'top',
          html : true,
          title : function() {
            return $(this).attr('data-original-title') || '<i class="fa fa-circle-notch fa-spin" aria-label="Loading"></i>...';
          }
        });
      });
		});
	});
});