/**
 * Media 
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	require([ 'app/controller/global' ]);
	require([ 'app/model/util', 'app/model/requests', 'app/model/excelRequest', 'app/model/iterateMedia', 'jquery', 'bootstrap', 'xlsx' ], function(util, requests, excelRequest, iterateMedia, $) {
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
			$modal.find('.loading').toggleClass('active', true);
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
			img.onerror = function() {
				var gradient = cvsContext.createLinearGradient(0, 0, canvas.width, 0);

				gradient.addColorStop(0.125, '#f15441');
				gradient.addColorStop(0.375, '#fec536');
				gradient.addColorStop(0.625, '#69c4bd');
				gradient.addColorStop(0.875, '#2b669f');
				cvsContext.fillRect(0, 0, canvas.width, canvas.height);
				cvsContext.fillStyle = gradient;
				cvsContext.fill();
				$modal.find('.loading').toggleClass('active', false);
			};
			img.onload = function() {
				canvas.width = this.width, canvas.height = this.height;
				cvsContext.drawImage(img, 0, 0);
				$modal.find('.loading').addClass('active');
				$modal.find('.loading').toggleClass('active', false);
			};
			img.src = (imdbData.Posters && imdbData.Posters[0]) || ('https://grayyoung.github.io/Flickr/poster/' + imdbData.Title + '.jpg');
			event.preventDefault();
		}).on('scroll.ls.media', function(event) {
			util.throttle(listing);
		}).ready(function(){
			var $container = $('#containerListing');
			var setting = {
				pageSize : 20
			};
			var type = util.getUrlParam('t', true);
			var listItems = function(workbook) {
				var sheet = (workbook && workbook.Sheets[workbook.SheetNames[0]]) || $container.data('sheet');
				var offset = $container.data('offset') || 2;
				var $p = $('#fixedProgress'), $pLabel =  $('.progress-label', $p);
				var callData = function(data) {
					var $p = $('#fixedProgress'), $pLabel =  $('.progress-label', $p);
					var $preview = $(document.getElementById('tl-preview').content).children().clone().data({
						imdbData: data,
						page: parseInt(offset / setting.pageSize, 10) + 1
					});

					$preview.find('.p-category').children().first().text(data.Type).end().last().text(data.Genre);
					$preview.find('img').attr('src', data.Poster)/* .get(0).onerror = function() {
						this.src = (data.Posters && data.Posters[0]) || ('http://grayyoung.github.io/Flickr/poster/' + data.Title + '.jpg');
						this.onerror = null;
					} */;
					$preview.find('.p-name').children().text(data.Title);
					//$preview.find('.p-summary').append(data.Plot);
					$preview.find('.p-rating').children().first().css('width', data.imdbRating + 'em').next().children().first().text(data.imdbRating).next().text(data.imdbVotes);
					$preview.find('.u-url').attr('href', 'http://www.imdb.com/title/' + data.imdbID);
					$container.append($preview);
					$pLabel.text(parseInt($pLabel.text(), 10) + 1);

					window.parent.postMessage({
						docHeight: $(document).height()
					}, '*');
				};
				$container.data('sheet', sheet);
				if(window.Worker) {
					var ajaxWorker = new Worker('/js/app/worker/ajaxToIMDB.js');

					ajaxWorker.onmessage = function(event) {
						if(event.data.status === 1) {
							ajaxWorker.postMessage({
								sheet: sheet,
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
						sheet: sheet,
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
				if($container.data('sheet')) {
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