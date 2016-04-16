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
			var imdbData = $preview.data('imdbData');
			var total = parseInt($('#fixedProgress .progress-label').text(), 10), current = $preview.index();
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
			$modal.find('.modal-title').text(imdbData.Title).find('.modal-footer dd').text('');
			$.each(imdbData, function(key, value) {
				$modal.find('.modal-footer .p-' + key.toLowerCase()).text(value);
			});
			canvas = $modal.find('#posterCanvas').get(0);
			cvsContext = canvas.getContext('2d');
			cvsContext.clearRect(0, 0, canvas.width, canvas.height);
			img.onload = function() {
				canvas.width = this.width, canvas.height = this.height;
				cvsContext.drawImage(img, 0, 0);
			};
			img.src = (imdbData.Posters && imdbData.Posters[0]) || ('http://grayyoung.github.io/Flickr/poster/' + imdbData.Title + '.jpg');
			event.preventDefault();
		}).ready(function(){
			var $container = $('#containerListing');
			var listItems = function(workbook) {
				var sheet = (workbook && workbook.Sheets[workbook.SheetNames[0]]) || $container.data('sheet');
				var offset = $container.data('offset') || 2, count = 1;
				var type = util.getUrlParam('t', true);
				var tPattern = new RegExp('\^\\s*' + type + '\\s*\$', 'i');
				var $p = $('#fixedProgress'), $pLabel =  $('.progress-label', $p);
				var callData = function(data) {
					var $p = $('#fixedProgress'), $pLabel =  $('.progress-label', $p);
					var $preview = $(document.getElementById('tl-preview').content).children().clone().data('imdbData', data);

					$preview.find('.p-category').children().first().text(data.Type).end().last().text(data.Genre);
					$preview.find('img').attr('src', data.Poster).get(0).onerror = function() {
						this.src = (data.Posters && data.Posters[0]) || ('http://grayyoung.github.io/Flickr/poster/' + data.Title + '.jpg');
						this.onerror = null;
					};
					$preview.find('.p-name').children().text(data.Title);
					//$preview.find('.p-summary').append(data.Plot);
					$preview.find('.p-rating').children().first().css('width', data.imdbRating + 'em').next().children().first().text(data.imdbRating).next().text(data.imdbVotes);
					$preview.find('.u-url').attr('href', 'http://www.imdb.com/title/' + data.imdbID);
					$container.append($preview);
					$pLabel.text(parseInt($pLabel.text(), 10) + 1);
					count++;
				};

				$container.data('sheet', sheet);
				(function(index) {
					var oneAfterOne = arguments.callee;
					var preview;

					$container.data('offset', index);
					preview = {
						Title : sheet[ 'A' + index ] && sheet[ 'A' + index ].v,
						imdbID : sheet[ 'B' + index ] && sheet[ 'B' + index ].v,
						Type : sheet[ 'C' + index ] && sheet[ 'C' + index ].v,
						PosterList : sheet[ 'D' + index ] && sheet[ 'D' + index ].v
					};
					console.log(index);
					if($.type(preview.Title) === 'undefined' && $.type(preview.imdbID) === 'undefined') {
						$container.data('loading', false);
						$p.toggleClass('loading', false);
						$(window).unbind('scroll.ls.media');

						return false;
					}
					if(count > 20) {
						$container.data('loading', false);
						$p.toggleClass('loading', false);

						return true;
					}
					delete sheet[ 'A' + index ];
					delete sheet[ 'B' + index ];
					delete sheet[ 'C' + index ];
					delete sheet[ 'D' + index ];
					if(type === '' || tPattern.test(preview.Type)) {
						if(preview.imdbID) {
							$.ajax({
								url : 'http://www.omdbapi.com/',
								type : 'get',
								data : {
									i : preview.imdbID,
									plot : 'full',
									r : 'json'
								},
								success : function(imdbData) {
									if(preview.PosterList) {
										imdbData.Posters = preview.PosterList.split(',');
									}
									callData(imdbData);
								},
								error : function() {
									callData(preview);
								},
								complete : function() {
									oneAfterOne(index + 1);
								}
							});
						} else {
							callData(preview);
							oneAfterOne(index + 1);
						}
					} else {
						oneAfterOne(index + 1);
					}
				})(offset);
			};

			$container.data({
				loading : false
			});

			$(window).bind('scroll.ls.media', function(event) {
				var $w = $(this), $p = $('#fixedProgress');
		
				if(!$container.data('loading') && ($container.height() + $container.offset().top < $w.scrollTop() + $w.height())) {
					$container.data('loading', true);
					$p.toggleClass('loading', true);
					if($container.data('sheet')) {
						listItems();
					} else {
						excelRequest('GET', requests.media, listItems);
					}
				}
			}).triggerHandler('scroll.ls.media');
		});
	});
});