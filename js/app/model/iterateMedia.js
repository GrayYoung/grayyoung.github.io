/**
 * Iterate Media Item
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define(['app/model/requests', 'ajax'], function(requests, ajax) {
	var tPattern, preview, count = 1, _thisParam, _thisF;
	/**
	 * sheet index
	 */
	return function() {
		_thisParam = arguments[0], _thisF = arguments.callee;

		if(typeof _thisParam === 'undefined') {
			throw new Error('no parameter be defiended.');
		}
		if(typeof tPattern === 'undefined') {
			tPattern = new RegExp('\^\\s*' + _thisParam.type + '\\s*\$', 'i');
		}
		_thisParam.offset++;
		if(typeof _thisParam.init === 'function') {
			_thisParam.init();
		}
		preview = {
			Title : _thisParam.sheet[ 'A' + _thisParam.offset ] && _thisParam.sheet[ 'A' + _thisParam.offset ].v,
			imdbID : _thisParam.sheet[ 'B' + _thisParam.offset ] && _thisParam.sheet[ 'B' + _thisParam.offset ].v,
			Type :_thisParam.sheet[ 'C' + _thisParam.offset ] && _thisParam.sheet[ 'C' + _thisParam.offset ].v,
			PosterList : _thisParam.sheet[ 'D' + _thisParam.offset ] && _thisParam.sheet[ 'D' + _thisParam.offset ].v
		};
		if(typeof preview.Title === 'undefined' && typeof preview.imdbID === 'undefined') {
			if(typeof _thisParam.end === 'function') {
				_thisParam.end();
			}
			_thisParam = null, _thisF = null;
			count = null, preview = null, tPattern = null;

			return false;
		}
		if(count > _thisParam.setting.pageSize) {
			if(typeof _thisParam.pause === 'function') {
				_thisParam.pause();
			}
			count = 1;

			return true;
		}
		delete _thisParam.sheet[ 'A' + _thisParam.offset ];
		delete _thisParam.sheet[ 'B' + _thisParam.offset ];
		delete _thisParam.sheet[ 'C' + _thisParam.offset ];
		delete _thisParam.sheet[ 'D' + _thisParam.offset ];
		if(_thisParam.type === '' || tPattern.test(preview.Type)) {
			if(preview.imdbID) {
				ajax().get(requests.imdb + '?i=' + preview.imdbID + '&plot=full&r=json').then(function(response, xhrObject) {
					if(preview && preview.PosterList) {
						response.Posters = preview.PosterList.split(',');
					}
					if(typeof _thisParam.success === 'function') {
						_thisParam.success({
							media: response,
							offset: _thisParam.offset
						});
					}
				}).catch(function(responseError, xhrObject) {
					if(typeof _thisParam.error === 'function') {
						_thisParam.error({
							media: preview,
							offset: _thisParam.offset
						});
					}
				}).always(function(response, xhrObject) {
					if(typeof _thisParam.complete === 'function') {
						_thisParam.complete({
							media: preview,
							offset: _thisParam.offset
						});
					}
					_thisF(_thisParam);
				});
			} else {
				if(typeof _thisParam.error === 'function') {
					_thisParam.error({
						media: preview,
						offset: _thisParam.offset
					});
				}
				_thisF(_thisParam);
			}
			count++
		} else {
			_thisF(_thisParam);
		}
	};
});