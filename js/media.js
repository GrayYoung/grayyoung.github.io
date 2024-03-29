/**
 * Media 
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global' ]);
	require([ 'app/model/util', 'app/model/requests', 'app/model/excelRequest', 'app/model/iterateMedia', 'jquery', 'bootstrap', 'xlsx' ], function(util, requests, excelRequest, iterateMedia, $, bootstrap) {
		$(document).on('mousewheel.ls.media', function(event) {
			this.event = event;
			util.throttle(scrollEventHandler, this);
		}).on('touchstart.ls.media', function(event) {
			this.event = event;
			util.throttle(scrollEventHandler, this);
		}).on('touchend.ls.media', function(event) {
			this.event = event;
			util.throttle(scrollEventHandler, this);
		}).on('click', '#containerListing a.u-url', function(event) {
			var $this = $(this), $preview = $this.closest('.h-item');
			//var imdbID = /(?:\/)(tt\d+)$/g.exec($this.attr('href'))[1];
			var $modal = $('#modalPreview');
			var imdbData = $preview.data('imdbData');
			var total = parseInt($('#fixedProgress .progress-label').text(), 10), current = $preview.index();
			var leftLimited = current < 1, rightLimited = current > total - 2;
			var img = new Image();
	
			if($modal.length === 0) {
				$modal = $(document.getElementById('tl-modalPreview').content).children().clone();
				$modal.on('hidden.bs.modal', function(event) {
					$(this).remove();
				});
				$this.parent().after($modal);
				var previewModal = new bootstrap.Modal($modal);
				previewModal.show();
			}
			$modal.find('.carousel-control-prev, .carousel-control-next').off('click').one('click', function(event) {
				var $arrow = $(this);
	
				$preview[(function(){
					if($arrow.hasClass('carousel-control-prev')) {
						return 'prev';
					} else if($arrow.hasClass('right')) {
						return 'next';
					} else {
						return 'next';
					}
				})()]().find('a.u-url').click();
				event.preventDefault();
			}).filter('.carousel-control-prev').toggleClass('disabled', leftLimited).children('.fa').toggleClass('fa-angle-left', !leftLimited).toggleClass('fa-minus', leftLimited)
				.end().end().filter('.carousel-control-next').toggleClass('disabled', rightLimited).children('.fa').toggleClass('fa-angle-right', !rightLimited).toggleClass('fa-minus', rightLimited);;
			$modal.find('.modal-title').text(imdbData.Title).find('dd').text('N/A');
			$.each(imdbData, function(key, value) {
				$modal.find('.p-' + key.toLowerCase()).text(value);
			});
			if(imdbData.Poster) {
				img.onerror = function() {
					$modal.find('.loading').remove();
				};
				img.onload = function() {
					$modal.find('.loading').remove();
					$modal.find('#posterCanvas').attr('src', this.src);
				};
				img.src = imdbData.Poster.replace(/(SX)(\d+)(\.\w+$)/, '$13000$3');
			} else {
				$modal.find('#posterCanvas').remove();
			}
			event.preventDefault();
		}).on('scroll.ls.media', function(event) {
			util.throttle(listing);
		}).ready(function(){
			var $container = $('#containerListing');
			var setting = {
				pageSize : 40
			};
			var type = util.getUrlParam('type', true), genre = util.getUrlParam('genre', true);
			var listItems = function(workbook) {
				if(genre && workbook && workbook.SheetNames.indexOf(genre) === -1) {
					return;
				}
				const sheet = (workbook && workbook.Sheets[genre || workbook.SheetNames[0]]);
				const listData = sheet ? XLSX.utils.sheet_to_json(sheet).reverse() : ($container.data('listData') || []);

				var offset = $container.data('offset') || 0;
				const $p = $('#fixedProgress'), $pLabel = $('.progress-label', $p);
				const callData = function(data) {
					var $p = $('#fixedProgress'), $pLabel = $('.progress-label', $p);
					var $preview = $(document.getElementById('tl-preview').content).children().clone().data({
						imdbData: data,
						page: parseInt(offset / setting.pageSize, 10) + 1
					});

					$container.append($preview);
					$preview.find('.p-category').children().first().text(data.Type).end().last().text(data.Genre);
					$preview.find('img').attr('src', data.Poster)/* .get(0).onerror = function() {
						this.src = (data.Posters && data.Posters[0]) || ('http://grayyoung.github.io/Flickr/poster/' + data.Title + '.jpg');
						this.onerror = null;
					} */;
					$preview.find('.p-name').text(data.Title);
					//$preview.find('.p-summary').append(data.Plot);
					$preview.find('.p-rating').children().first().css('width', data.imdbRating + 'em').next().children().first().text(data.imdbRating).next().text(data.imdbVotes);
					$preview.find('.u-url').attr('href', 'http://www.imdb.com/title/' + data.imdbID);
					$pLabel.text(parseInt($pLabel.text(), 10) + 1);

					window.parent.postMessage({
						docHeight: $(document).height()
					}, '*');
				};
				$container.data('listData', listData);
				if(window.Worker) {
					var ajaxWorker = new Worker('/js/app/worker/ajaxToIMDB.js');

					ajaxWorker.onmessage = function(event) {
						if(event.data.status === 1) {
							ajaxWorker.postMessage({
								listData: listData,
								offset: offset,
								setting: setting,
								type: type
							});
						} else if(event.data.offset) {
							callData(event.data.media);
							$container.data('offset', event.data.offset);
						} else if(event.data.pause === true) {
							$container.data('loading', false);
							$p.toggleClass('loading', false);
						} else if(event.data.stopProgress === true) {
							$container.data('loading', false);
							$p.toggleClass('loading', false);
							$(document).off('scroll.ls.media mousewheel.ls.media touchstart.ls.media touchend.ls.media');
							$container.unbind('update');
						}
					};
				} else {
					iterateMedia({
						listData: listData,
						offset: offset,
						setting: setting,
						type: type,
						pause: function() {
							$container.data('loading', false);
							$p.toggleClass('loading', false);
						},
						end: function() {
							$container.data('loading', false);
							$p.toggleClass('loading', false);
							$(document).off('scroll.ls.media mousewheel.ls.media touchstart.ls.media touchend.ls.media');
							$container.unbind('update');
						},
						success: function(data) {
							callData(data.media);
							$container.data('offset', data.offset);
						},
						error: function(data) {
							callData(data.media);
							$container.data('offset', data.offset);
						}
					});
				}
			};

			$container.data({
				loading : false
			});

			$('#containerListing').bind('update', function(event, direction) {
				var $container = $(this), $p = $('#fixedProgress');

				if($container.data('loading') === true || direction === 'top') {
					return false;
				}
				$container.data('loading', true);
				$p.toggleClass('loading', true);
				if($container.data('listData')) {
					listItems();
				} else {
					if(window.Worker) {
						var xlsxWorker = new Worker('/js/app/worker/xlsx.js');
						
						xlsxWorker.onmessage = function(event) {
							listItems(event.data);
							xlsxWorker.terminate();
						};
						xlsxWorker.onerror = function(error) {
							excelRequest('GET', requests.media, listItems);
							xlsxWorker.terminate();
						};
					} else {
						excelRequest('GET', requests.media, listItems);
					}
				}
			});
			$(document).data('oddScrollTop', $(document).scrollTop()).trigger('scroll.ls.media');
		});

		function scrollEventHandler() {
			var $document = $(this);
			var event = this.event.originalEvent;

			switch(event.type) {
				case 'mousewheel': 
					var deltaY = event.wheelDeltaY || event.deltaY;

					if(deltaY > 0 && $document.scrollTop() <= 0) {
						$('#containerListing').trigger('update', 'top');
					} else if(deltaY < 0 && $document.scrollTop() >= $document.height() - $(window).height()) {
						$('#containerListing').trigger('update', 'bottom');
					}
					break;
				case 'touchstart':

					$document.data('touch', {
						pageX : event.changedTouches[0].pageX,
						pageY : event.changedTouches[0].pageY,
						startTime : new Date().getTime()
					});
					break;
				case 'touchend':
					var touchData = $document.data('touch');
					var distance = event.changedTouches[0].pageY - touchData.pageY;

					if(new Date().getTime() - touchData.startTime <= 300) {
						if(distance >= 60 && $document.scrollTop() <= 0) {
							$('#containerListing').trigger('update', 'top');
						} else if(distance <= 60 && $document.scrollTop() >= $document.height() - $(window).height()) {
							$('#containerListing').trigger('update', 'bottom');
						}
						//event.preventDefault();
					}
					break;
			};
		}

		function listing() {
			var updatedURL = location.search.substr(1), page = 1;
			var pattern = /(^|\&)(page=[^\&]*)(\&|$)/gi;
			var $document = $(document), $container = $('#containerListing'), $item;
			var newScrollTop = $document.scrollTop(), oddScrollTop = $document.data('oddScrollTop');
			var wHeight = $(window).height(), containerTop = $container.offset().top, containerHeight = $container.height(), el_top, el_height;

			if(newScrollTop < oddScrollTop && newScrollTop <= containerTop - Math.min(wHeight, containerTop) / 2) {
				$container.trigger('update', 'top');
			} else if(newScrollTop >= oddScrollTop && newScrollTop >= containerTop + containerHeight - wHeight + Math.min(wHeight, $document.height() - containerTop - containerHeight) / 2) {
				$container.trigger('update', 'bottom');
			}
			$document.data('oddScrollTop', newScrollTop).find('.h-item').each(function() {
				$item = $(this);
				el_top = $item.offset().top, el_height = $item.height();

				if((el_top + el_height * 0.75 > newScrollTop) && (el_top < (newScrollTop + el_height))) {
					page = $item.data('page') || $container.data('originalpage');
					if(updatedURL !== '') {
						if(pattern.test(updatedURL)){
							updatedURL = updatedURL.replace(pattern, '$1page=' + page + '$3');
						} else {
							updatedURL += '&page=' + page;
						}
					} else {
						updatedURL = 'page=' + page;
					}
					history.replaceState(null, null, location.pathname + '?' + updatedURL.replace(/(^|\&)(page=1)(\&|$)/gi, '$3').replace(/^\&+/g, ''));

					return false;
				}
			});
		}
	});
});