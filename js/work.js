/**
 * Media
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global' ]);
	require([ 'app/model/requests', 'app/model/util', 'app/model/excelRequest', 'jquery', 'bootstrap', 'xlsx' ], function(requests, util, excelRequest, $) {
		$(document).on('click', '#containerListing a.u-url', function(event) {
			var $this = $(this), $preview = $this.closest('.h-item'), $canvas;
			//var imdbID = /(?:\/)(tt\d+)$/g.exec($this.attr('href'))[1];
			var $modal = $('#modalPreview');
			var data = $preview.data('detail');
			var total = data.Thumbs.length, current = $preview.index();
			var leftLimited = current < 1, rightLimited = current > total - 2;
			var cvsContext, img = new Image();
	
			if($modal.size() === 0) {
				$modal = $(document.getElementById('tl-modalPreview').content).children().clone();
				$modal.on('hidden.bs.modal', function(event) {
					$(this).remove();
				}).insertAfter($this).modal('show');
			}
			$modal.find('.carousel-control').off('click').one('click', function(event) {
				var $arrow = $(this);
	
				$preview[(function(){
					if($arrow.hasClass('left')) {
						return 'prev';
					} else if($arrow.hasClass('right')) {
						return 'next';
					} else {
						return 'next';
					}
				})()]().find('a.u-url').click();
				event.preventDefault();
			}).filter('.left').toggleClass('disabled', leftLimited).children('.fa').toggleClass('fa-angle-left', !leftLimited).toggleClass('fa-minus', leftLimited)
				.end().end().filter('.right').toggleClass('disabled', rightLimited).children('.fa').toggleClass('fa-angle-right', !rightLimited).toggleClass('fa-minus', rightLimited);;
			$modal.find('.modal-title').text(data.Title).find('.modal-footer dd').text('');
			canvas = $modal.find('#posterCanvas').get(0);
			cvsContext = canvas.getContext('2d');
			cvsContext.clearRect(0, 0, canvas.width, canvas.height);
			img.onload = function() {
				canvas.width = this.width, canvas.height = this.height;
				cvsContext.drawImage(img, 0, 0);
			};
			img.src = data.Thumbs[0];
			event.preventDefault();
		}).ready(function(){
			var $container = $('#containerListing');
			var listItems = function(workbook) {
				var sheet = workbook.Sheets[workbook.SheetNames[0]];
				var $preview, $p = $('#fixedProgress'), $pLabel =  $('.progress-label', $p);

				for(var index = 2; ; index++) {
					var preview = {
						Title : sheet[ 'A' + index ] && sheet[ 'A' + index ].v,
					};

					if($.type(preview.Title) === 'undefined') {
						break;
					}
					preview.Thumbs = sheet[ 'C' + index ].v && sheet[ 'C' + index ].v.split(',')
					$preview = $(document.getElementById('tl-preview').content).children().clone().data('detail', preview);
					$preview.find('img').attr('src', preview.Thumbs[ 0 ]);
					$preview.find('.p-name').children().text(preview.Title);
					$container.append($preview);
					$pLabel.text(parseInt($pLabel.text(), 10) + 1);
				}
				$container.data('loading', false);
				$p.toggleClass('loading', false);
				$(window).unbind('scroll.ls.media');
			};
			
			$container.data({
				loading : false
			});
		
			$(window).bind('scroll.ls.media', function(event) {
				var $w = $(this), $p = $('#fixedProgress');
				var xhRequest;
		
				if(!$container.data('loading') && ($container.height() + $container.offset().top < $w.scrollTop() + $w.height())) {
					$container.data('loading', true);
					$p.toggleClass('loading', true);
					excelRequest('GET', requests.work, listItems);
				}
			}).triggerHandler('scroll.ls.media');
		});
	});
});