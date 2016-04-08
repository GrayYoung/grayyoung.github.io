/**
 * Media Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests', 'app/model/util', 'jquery', 'bootstrap', 'xlsx' ], function(requests, util, $) {
	$(document).on('click', '#containerListing a.u-url', function(event) {
		var $this = $(this);
		var imdbID = /(?:\/)(tt\d+)$/g.exec($this.attr('href'))[1];
		var $modal = $('#modalPreview');

console.log(this);
console.log(event);
		if($modal.size() === 0) {
			$modal = $(document.getElementById('tl-modalPreview').content).children().clone();
			$modal.on('hidden.bs.modal', function(event) {
				$(this).remove();
			}).insertAfter($this).modal('show');
		}
		$modal.find('.carousel-control').off('click').one('click', function(event) {
			var $arrow = $(this);

			$this.closest('.h-item')[(function(){
				if($arrow.hasClass('left')) {
					return 'prev';
				} else if($arrow.hasClass('right')) {
					return 'next';
				} else {
					return 'next';
				}
			})()]().find('a.u-url').click();
			event.preventDefault();
		});
		$.ajax({
			url : 'http://www.omdbapi.com/',
			type : 'get',
			data : {
				i : imdbID,
				plot : 'full',
				r : 'json'
			},
			success : function(imdbData) {
				console.log(imdbData);
				$modal.find('.modal-title').text(imdbData.Title);
				$modal.find('.modal-footer').empty().append(imdbData.Plot).append(imdbData.Actors);
				$modal.find('.carousel-inner .item.active img').attr('src', imdbData.Poster);
			},
			error : function() {
			},
			complete : function() {
			}
		});
		event.preventDefault();
	}).ready(function(){
		var $container = $('#containerListing');
		var listItems = function(workbook) {
			var sheet = workbook.Sheets[workbook.SheetNames[0]];
			var type = util.getUrlParam('t', true);
			var tPattern = new RegExp('\^\\s*' + type + '\\s*\$', 'i');
			var createPreview = function(preview) {
				return '<li class="col-xs-12 col-sm-6 col-md-4 col-lg-3 h-item h-review-aggregate">'
				+ '<figure class="thumbnail"><p class="p-category"><span class="text-capitalize">' + preview.Type + '</span>'
				+ (preview.Genre ? '<span>: </span>' : '') + '<span class="text-capitalize">' + (preview.Genre || '') + '</span></p>'
				+ '<hr />' + '<img onerror="this.src=\'' + preview.exPoster + '\'; this.onerror = null;" class="center-block" src="' + preview.Poster + '" alt="" aria-hidden="true">'
				+ '<figcaption><div class="caption"><h3 class="p-name"><strong>' + preview.Title + '</strong></h3>'
				+ '<p><span class="text-muted">Director: </span><strong>' + (preview.Director || 'N/A') + '</strong></p>'
				+ '<p><span class="text-muted">Actors: </span><strong>' + (preview.Actors || 'N/A') + '</strong></p>'
				+ '<p class="p-summary"><span class="text-muted">Plot: </span>' +( preview.Plot || 'N/A') + '</p>'
				+ '<p class="p-rating">' + (preview.imdbRating ? '<span style="width: ' + preview.imdbRating + 'em"><span class="p-count text-warning"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span></span>' : '')
				+ '<span class="p-votes">' + (preview.imdbRating ? '<span class="text-success fa-lg">' + preview.imdbRating + '</span>' : '')
				+ (preview.imdbVotes ? '<small class="text-muted">(' + preview.imdbVotes + ')</small>' : '') + '</span></p></div></figcaption>'
				+ (preview.imdbID ? '<a class="u-url" target="_blank" href="http://www.imdb.com/title/' + preview.imdbID + '">Read more...</a>' : '') + '</figure></li>';
			};
			var callData = function(data) {
				var $p = $('#fixedProgress'), $pLabel =  $('.progress-label', $p);
	
				if($.type(data.Title) === 'undefined' && $.type(data.imdbID) === 'undefined' && $.type(data.Type) === 'undefined') {
					$container.data('loading', false);
					$p.toggleClass('loading', false);
					$(window).unbind('scroll.ls.media');
				} else {
					$container.append(createPreview(data));
					$pLabel.text(parseInt($pLabel.text(), 10) + 1);
				}
			};
	
			(function(index) {
				var oneAfterOne = arguments.callee;
				var preview = {
					Title : sheet[ 'A' + index ] ? sheet[ 'A' + index ].v : 'N/A',
					imdbID : sheet[ 'B' + index ] ? sheet[ 'B' + index ].v : 'N/A',
					Type : sheet[ 'C' + index ] ? sheet[ 'C' + index ].v : 'N/A',
					Poster : sheet[ 'D' + index ] ? sheet[ 'D' + index ].v : ''
				};
	
				if(type === '' || tPattern.test(preview.Type)) {
					if(preview.imdbID) {
						$.ajax({
							url : 'http://www.omdbapi.com/',
							type : 'get',
							data : {
								i : preview.imdbID,
								plot : 'short',
								r : 'json'
							},
							success : function(imdbData) {
								imdbData.exPoster = preview.Poster;
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
						callData(preview, index, oneAfterOne);
						oneAfterOne(index + 1);
					}
				} else {
					oneAfterOne(index + 1);
				}
			})(2);
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
	
				if(window.XMLHttpRequest) {
					xhRequest = new XMLHttpRequest();
				} else if(window.ActiveXObject) {
					xhRequest = new ActiveXObject('MSXML2.XMLHTTP.3.0');
				} else {
					throw 'XHR unavailable for your browser';
				}
				xhRequest.open('GET', requests.media, true);
				if(typeof Uint8Array !== 'undefined') {
					xhRequest.responseType = "arraybuffer";
					xhRequest.onload = function(e) {
						var arraybuffer = xhRequest.response;
						var data = new Uint8Array(arraybuffer);
						var arr = new Array();
	
						for(var i = 0; i != data.length; ++i) {
							arr[i] = String.fromCharCode(data[i]);
						}
						listItems(XLSX.read(arr.join(''), {
							type : 'binary'
						}));
					};
				} else {
					xhRequest.setRequestHeader('Accept-Charset', 'x-user-defined');	
					xhRequest.onreadystatechange = function() {
						if(xhRequest.readyState == 4 && xhRequest.status == 200) {
							listItems(XLSX.read(xhRequest.responseBody, {
								type : 'binary'
							}));
						} 
					};
				}
				xhRequest.send();
			}
		}).triggerHandler('scroll.ls.media');
	});
});