(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EasyMediasoup = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APP_NAME = 'mediasoup';

var Logger = function () {
	function Logger(prefix) {
		(0, _classCallCheck3.default)(this, Logger);

		if (prefix) {
			this._debug = (0, _debug2.default)(APP_NAME + ':' + prefix);
			this._warn = (0, _debug2.default)(APP_NAME + ':WARN:' + prefix);
			this._error = (0, _debug2.default)(APP_NAME + ':ERROR:' + prefix);
		} else {
			this._debug = (0, _debug2.default)(APP_NAME);
			this._warn = (0, _debug2.default)(APP_NAME + ':WARN');
			this._error = (0, _debug2.default)(APP_NAME + ':ERROR');
		}
		this._debug.enabled = false;
		if (global.debug_mode) {
			this._debug.enabled = true;
		} else {
			/* eslint-disable no-console */
			this._debug.log = console.info.bind(console);
			this._warn.log = console.warn.bind(console);
			this._error.log = console.error.bind(console);
			/* eslint-enable no-console */
		}
	}

	(0, _createClass3.default)(Logger, [{
		key: 'debug',
		get: function get() {
			return this._debug;
		}
	}, {
		key: 'warn',
		get: function get() {
			return this._warn;
		}
	}, {
		key: 'error',
		get: function get() {
			return this._error;
		}
	}]);
	return Logger;
}();

exports.default = Logger;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/helpers/classCallCheck":47,"babel-runtime/helpers/createClass":48,"debug":151}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _protooClient = require('protoo-client');

var _protooClient2 = _interopRequireDefault(_protooClient);

var _mediasoupClient = require('mediasoup-client');

var mediasoupClient = _interopRequireWildcard(_mediasoupClient);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _urlFactory = require('./urlFactory');

var _requestActions = require('./redux/requestActions');

var requestActions = _interopRequireWildcard(_requestActions);

var _stateActions = require('./redux/stateActions');

var stateActions = _interopRequireWildcard(_stateActions);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _msr = require('msr');

var _msr2 = _interopRequireDefault(_msr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as cookiesManager from './cookiesManager';
var logger = new _Logger2.default('RoomClient');

var ROOM_OPTIONS = {
	requestTimeout: 10000,
	transportOptions: {
		tcp: false
	}
};

var DEFAULT_VIDEO_CONSTRAINS = {
	qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
	vga: { width: { ideal: 640 }, height: { ideal: 480 } },
	hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

var DEFAULT_SIMULCAST_OPTIONS = {
	low: 100000,
	medium: 300000,
	high: 1500000
};

var VIDEO_CONSTRAINS = [];
var SIMULCAST_OPTIONS = [];

var RoomClient = function () {
	function RoomClient(_ref) {
		var media_server_wss = _ref.media_server_wss,
		    roomId = _ref.roomId,
		    peerName = _ref.peerName,
		    displayName = _ref.displayName,
		    device = _ref.device,
		    useSimulcast = _ref.useSimulcast,
		    produce = _ref.produce,
		    dispatch = _ref.dispatch,
		    getState = _ref.getState,
		    turnservers = _ref.turnservers,
		    args = _ref.args;
		(0, _classCallCheck3.default)(this, RoomClient);

		logger.debug('constructor() [roomId:"%s", peerName:"%s", displayName:"%s", device:%s]', roomId, peerName, displayName, device.flag);
		var protooUrl = (0, _urlFactory.getProtooUrl)(media_server_wss, peerName, roomId);
		var protooTransport = new _protooClient2.default.WebSocketTransport(protooUrl);

		VIDEO_CONSTRAINS = args.video_constrains.length != 0 ? args.video_constrains : DEFAULT_VIDEO_CONSTRAINS;
		SIMULCAST_OPTIONS = args.simulcast_options.length != 0 ? args.simulcast_options : DEFAULT_SIMULCAST_OPTIONS;

		this.initially_muted = args.initially_muted;
		this.is_audio_initialized = false;

		this._is_webcam_enabled = true;
		this._is_audio_enabled = !this.initially_muted;
		this._is_screenshare_enabled = true;
		this._screenStreamId = null;

		// Closed flag.
		this._closed = false;

		// Whether we should produce.
		this._produce = produce;

		// Whether simulcast should be used.
		this._useSimulcast = useSimulcast;

		// Redux store dispatch function.
		this._dispatch = dispatch;

		// Redux store getState function.
		this._getState = getState;

		// My peer name.
		this._peerName = peerName;

		// protoo-client Peer instance.
		this._protoo = new _protooClient2.default.Peer(protooTransport);
		// set turn servers
		ROOM_OPTIONS.turnServers = turnservers;
		// mediasoup-client Room instance.
		this._room = new mediasoupClient.Room(ROOM_OPTIONS);

		//Инициализируем хранилище данных браузера пользователя
		this._storage = window.localStorage;

		// Transport for sending.
		this._sendTransport = null;

		// Transport for receiving.
		this._recvTransport = null;

		// Local mic mediasoup Producer.
		this._micProducer = null;

		// Local webcam mediasoup Producer.
		this._webcamProducer = null;

		this._videoRecorder = null;
		this._audioRecorder = null;
		this._recordState = 'inactive';
		this._recordIntervalFunc = null;

		// User screen capture mediasoup Producer.
		this._screenShareProducer = null;

		// Map of webcam MediaDeviceInfos indexed by deviceId.
		// @type {Map<String, MediaDeviceInfos>}
		this._webcams = new _map2.default();

		//Список всех аудио-устройств ввода пользователя
		this._mics = new _map2.default();
		// Local Webcam. Object with:
		// - {MediaDeviceInfo} [device]
		// - {String} [resolution] - 'qvga' / 'vga' / 'hd'.
		this._webcam = {
			device: null,
			resolution: 'hd'
		};
		//Текущий микрофон пользователя
		this._mic = null;

		//_mediaRecorder = null;

		this._recordWorker;

		this._join({ displayName: displayName, device: device });
	}

	(0, _createClass3.default)(RoomClient, [{
		key: 'close',
		value: function close() {
			var _this = this;

			if (this._closed) return;

			this._closed = true;

			logger.debug('close()');
			this._room.producers.forEach(function (producer) {
				producer.track.stop();
			});
			// this.room._micProducer.track.stop()
			// this.room._webcamProducer.track.stop()
			// Leave the mediasoup Room.
			this._room.leave();

			// Close protoo Peer (wait a bit so mediasoup-client can send
			// the 'leaveRoom' notification).
			setTimeout(function () {
				return _this._protoo.close();
			}, 250);

			this._dispatch(stateActions.setRoomState('closed'));
		}
	}, {
		key: 'changeDisplayName',
		value: function changeDisplayName(displayName) {
			var _this2 = this;

			logger.debug('changeDisplayName() [displayName:"%s"]', displayName);

			// Store in cookie.
			// cookiesManager.setUser({ displayName });

			return this._protoo.send('change-display-name', { displayName: displayName }).then(function () {
				_this2._dispatch(stateActions.setDisplayName(displayName));

				_this2._dispatch(requestActions.notify({
					text: 'Display name changed'
				}));
			}).catch(function (error) {
				logger.error('changeDisplayName() | failed: %o', error);

				_this2._dispatch(requestActions.notify({
					type: 'error',
					text: 'Could not change display name: ' + error
				}));

				// We need to refresh the component for it to render the previous
				// displayName again.
				_this2._dispatch(stateActions.setDisplayName());
			});
		}
	}, {
		key: 'muteMic',
		value: function muteMic() {
			logger.debug('muteMic()');
			this._is_audio_enabled = false;
			this._micProducer.pause();
		}
	}, {
		key: 'unmuteMic',
		value: function unmuteMic() {
			logger.debug('unmuteMic()');
			this._is_audio_enabled = true;
			if (this._micProducer) {
				this._micProducer.resume();
			} else {
				this._setMicProducer();
			}
		}
	}, {
		key: 'enableWebcam',
		value: function enableWebcam() {
			logger.debug('enableWebcam()');
			this._is_webcam_enabled = true;
			this._activateWebcam();
		}
	}, {
		key: 'setScreenShare',
		value: function setScreenShare(streamId) {
			console.log("setScreenShare()");
			this._screenStreamId = streamId;
			if (!this._screenShareProducer) this._activateScreenShare();else this._changeScreenForShare();
		}
	}, {
		key: 'deactivateScreenShare',
		value: function deactivateScreenShare() {
			console.log('deactivateScreenShare()');
			if (!this._screenShareProducer) {
				console.log("Error! Screen share producer doesn't exist");
				return false;
			}
			this._screenShareProducer = null;
			return true;
		}

		//Запускаем продюсер захвата экрана

	}, {
		key: '_activateScreenShare',
		value: function _activateScreenShare() {
			var _this3 = this;

			logger.debug('activateScreenShare()');

			this._dispatch(stateActions.setScreenShareInProgress(true));

			return _promise2.default.resolve().then(function () {
				return _this3._setScreenShareProducer();
			}).then(function () {
				_this3._dispatch(stateActions.setScreenShareInProgress(false));
			}).catch(function (error) {
				logger.error('activateWebcam() | failed: %o', error);

				_this3._dispatch(stateActions.setScreenShareInProgress(false));
			});
		}

		//Запускаем микрофон

	}, {
		key: '_activateMic',
		value: function _activateMic() {
			var _this4 = this;

			logger.debug('activateMic()');
			//console.log('inside activate mic')

			this._dispatch(stateActions.setMicInProgress(true));

			return _promise2.default.resolve().then(function () {
				return _this4._updateMics();
			}).then(function () {
				return _this4._setMicProducer();
			}).then(function () {
				_this4._dispatch(stateActions.setMicInProgress(false));
			}).catch(function (error) {
				logger.error('activateWebcam() | failed: %o', error);

				_this4._dispatch(stateActions.setMicInProgress(false));
			});
		}

		//Запускаем вебкамеру

	}, {
		key: '_activateWebcam',
		value: function _activateWebcam() {
			var _this5 = this;

			logger.debug('activateWebcam()');

			// Store in cookie.
			// cookiesManager.setDevices({ webcamEnabled: true });
			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				return _this5._updateWebcams();
			}).then(function () {
				return _this5._setWebcamProducer();
			}).then(function () {
				_this5._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('activateWebcam() | failed: %o', error);

				_this5._dispatch(stateActions.setWebcamInProgress(false));
			});
		}
	}, {
		key: 'disableWebcam',
		value: function disableWebcam() {
			logger.debug('disableWebcam()');
			this._is_webcam_enabled = false;
			this._deactivateWebcam();
		}
	}, {
		key: '_deactivateWebcam',
		value: function _deactivateWebcam() {
			var _this6 = this;

			logger.debug('deactivateWebcam()');

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				_this6._webcamProducer.close();

				_this6._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('deactivateWebcam() | failed: %o', error);

				_this6._dispatch(stateActions.setWebcamInProgress(false));
			});
		}
	}, {
		key: 'changeWebcam',
		value: function changeWebcam() {
			var _this7 = this;

			logger.debug('changeWebcam()');
			this._is_webcam_enabled = true;
			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				return _this7._updateWebcams();
			}).then(function () {
				var array = (0, _from2.default)(_this7._webcams.keys());
				var len = array.length;
				var deviceId = _this7._webcam.device ? _this7._webcam.device.deviceId : undefined;
				var idx = array.indexOf(deviceId);

				if (idx < len - 1) idx++;else idx = 0;

				_this7._webcam.device = _this7._webcams.get(array[idx]);

				logger.debug('changeWebcam() | new selected webcam [device:%o]', _this7._webcam.device);

				// Reset video resolution to HD.
				_this7._webcam.resolution = 'hd';
			}).then(function () {
				var _webcam = _this7._webcam,
				    device = _webcam.device,
				    resolution = _webcam.resolution;


				if (!device) throw new Error('no webcam devices');

				logger.debug('changeWebcam() | calling getUserMedia()');

				// return navigator.mediaDevices.getUserMedia(
				// 	{
				// 		video :
				// 		{
				// 			deviceId : { exact: device.deviceId },
				// 			...VIDEO_CONSTRAINS[resolution]
				// 		}
				// 	});

				//return getScreenShare();
				return navigator.mediaDevices.getUserMedia((0, _extends3.default)({
					deviceId: { exact: device.deviceId },
					audio: false
				}, VIDEO_CONSTRAINS[resolution], {
					video: true
				}));
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				return _this7._webcamProducer.replaceTrack(track).then(function (newTrack) {
					track.stop();

					return newTrack;
				});
			}).then(function (newTrack) {
				_this7._dispatch(stateActions.setProducerTrack(_this7._webcamProducer.id, newTrack));

				_this7._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('changeWebcam() failed: %o', error);

				_this7._dispatch(stateActions.setWebcamInProgress(false));
			});
		}
	}, {
		key: 'setWebcamResulution',
		value: function setWebcamResulution(resolution) {
			var _this8 = this;

			// if (!this._is_webcam_enabled) return 0
			logger.debug('setWebcamResulution()');

			var oldResolution = void 0;
			var newResolution = void 0;

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				oldResolution = _this8._webcam.resolution;
				newResolution = resolution;

				_this8._webcam.resolution = newResolution;
			}).then(function () {
				var _webcam2 = _this8._webcam,
				    device = _webcam2.device,
				    resolution = _webcam2.resolution;


				logger.debug('setWebcamResulution() | calling getUserMedia()');

				// return navigator.mediaDevices.getUserMedia(
				// 	{
				// 		video :
				// 		{
				// 			deviceId : { exact: device.deviceId },
				// 			...VIDEO_CONSTRAINS[resolution]
				// 		}
				// 	});

				// return navigator.mediaDevices.getUserMedia(
				// 	{
				// 		audio:false,
				// 		video : true
				// 	});

				//return getScreenShare();

				return navigator.mediaDevices.getUserMedia((0, _extends3.default)({
					deviceId: { exact: device.deviceId },
					audio: false
				}, VIDEO_CONSTRAINS[resolution], {
					video: true
				}));
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				return _this8._webcamProducer.replaceTrack(track).then(function (newTrack) {
					track.stop();

					return newTrack;
				});
			}).then(function (newTrack) {
				_this8._dispatch(stateActions.setProducerTrack(_this8._webcamProducer.id, newTrack));

				_this8._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('changeWebcamResolution() failed: %o', error);

				_this8._dispatch(stateActions.setWebcamInProgress(false));

				_this8._webcam.resolution = oldResolution;
			});
		}
	}, {
		key: 'changeWebcamResolution',
		value: function changeWebcamResolution() {
			var _this9 = this;

			// if (!this._is_webcam_enabled) return 0
			logger.debug('changeWebcamResolution()');

			var oldResolution = void 0;
			var newResolution = void 0;

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				oldResolution = _this9._webcam.resolution;

				switch (oldResolution) {
					case 'qvga':
						newResolution = 'vga';
						break;
					case 'vga':
						newResolution = 'hd';
						break;
					case 'hd':
						newResolution = 'qvga';
						break;
				}

				_this9._webcam.resolution = newResolution;
			}).then(function () {
				var _webcam3 = _this9._webcam,
				    device = _webcam3.device,
				    resolution = _webcam3.resolution;


				logger.debug('changeWebcamResolution() | calling getUserMedia()');

				// return navigator.mediaDevices.getUserMedia(
				// 	{
				// 		video :
				// 		{
				// 			deviceId : { exact: device.deviceId },
				// 			...VIDEO_CONSTRAINS[resolution]
				// 		}
				// 	});

				// return navigator.mediaDevices.getUserMedia(
				// 	{
				// 		audio:false,
				// 		video : true
				// 	});

				//return getScreenShare();

				return navigator.mediaDevices.getUserMedia((0, _extends3.default)({
					deviceId: { exact: device.deviceId },
					audio: false
				}, VIDEO_CONSTRAINS[resolution], {
					video: true
				}));
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				return _this9._webcamProducer.replaceTrack(track).then(function (newTrack) {
					track.stop();

					return newTrack;
				});
			}).then(function (newTrack) {
				_this9._dispatch(stateActions.setProducerTrack(_this9._webcamProducer.id, newTrack));

				_this9._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('changeWebcamResolution() failed: %o', error);

				_this9._dispatch(stateActions.setWebcamInProgress(false));

				_this9._webcam.resolution = oldResolution;
			});
		}
	}, {
		key: 'enableAudioOnly',
		value: function enableAudioOnly() {
			var _this10 = this;

			logger.debug('enableAudioOnly()');

			this._dispatch(stateActions.setAudioOnlyInProgress(true));

			return _promise2.default.resolve().then(function () {
				if (_this10._webcamProducer) _this10._webcamProducer.close();

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = (0, _getIterator3.default)(_this10._room.peers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var peer = _step.value;
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = (0, _getIterator3.default)(peer.consumers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var consumer = _step2.value;

								if (consumer.kind !== 'video') continue;

								consumer.pause('audio-only-mode');
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				_this10._dispatch(stateActions.setAudioOnlyState(true));

				_this10._dispatch(stateActions.setAudioOnlyInProgress(false));
			}).catch(function (error) {
				logger.error('enableAudioOnly() failed: %o', error);

				_this10._dispatch(stateActions.setAudioOnlyInProgress(false));
			});
		}
	}, {
		key: 'disableAudioOnly',
		value: function disableAudioOnly() {
			var _this11 = this;

			logger.debug('disableAudioOnly()');

			this._dispatch(stateActions.setAudioOnlyInProgress(true));

			return _promise2.default.resolve().then(function () {
				if (!_this11._webcamProducer && _this11._room.canSend('video')) return _this11._activateWebcam();
			}).then(function () {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = (0, _getIterator3.default)(_this11._room.peers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var peer = _step3.value;
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = (0, _getIterator3.default)(peer.consumers), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var consumer = _step4.value;

								if (consumer.kind !== 'video' || !consumer.supported) continue;

								consumer.resume();
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4.return) {
									_iterator4.return();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				_this11._dispatch(stateActions.setAudioOnlyState(false));

				_this11._dispatch(stateActions.setAudioOnlyInProgress(false));
			}).catch(function (error) {
				logger.error('disableAudioOnly() failed: %o', error);

				_this11._dispatch(stateActions.setAudioOnlyInProgress(false));
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce() {
			var _this12 = this;

			logger.debug('restartIce()');

			this._dispatch(stateActions.setRestartIceInProgress(true));

			return _promise2.default.resolve().then(function () {
				_this12._room.restartIce();

				// Make it artificially longer.
				setTimeout(function () {
					_this12._dispatch(stateActions.setRestartIceInProgress(false));
				}, 500);
			}).catch(function (error) {
				logger.error('restartIce() failed: %o', error);

				_this12._dispatch(stateActions.setRestartIceInProgress(false));
			});
		}
	}, {
		key: '_join',
		value: function _join(_ref2) {
			var _this13 = this;

			var displayName = _ref2.displayName,
			    device = _ref2.device;

			this._dispatch(stateActions.setRoomState('connecting'));

			this._protoo.on('open', function () {
				logger.debug('protoo Peer "open" event');
				if (_this13._room._state != "joined") _this13._joinRoom({ displayName: displayName, device: device });
			});

			this._protoo.on('disconnected', function () {
				logger.warn('protoo Peer "disconnected" event');

				_this13._dispatch(requestActions.notify({
					type: 'error',
					text: 'WebSocket disconnected'
				}));

				// Leave Room.
				try {
					_this13._room.remoteClose({ cause: 'protoo disconnected' });
				} catch (error) {}

				_this13._dispatch(stateActions.setRoomState('connecting'));
			});

			this._protoo.on('close', function () {
				if (_this13._closed) return;

				logger.warn('protoo Peer "close" event');

				if (_this13._room._state != "joined") _this13.close();
			});

			this._protoo.on('request', function (request, accept, reject) {
				logger.debug('_handleProtooRequest() [method:%s, data:%o]', request.method, request.data);

				switch (request.method) {
					case 'mediasoup-notification':
						{
							accept();

							var notification = request.data;

							_this13._room.receiveNotification(notification);

							break;
						}

					case 'active-speaker':
						{
							accept();

							var peerName = request.data.peerName;


							_this13._dispatch(stateActions.setRoomActiveSpeaker(peerName));

							break;
						}

					case 'display-name-changed':
						{
							accept();

							// eslint-disable-next-line no-shadow
							var _request$data = request.data,
							    _peerName = _request$data.peerName,
							    _displayName = _request$data.displayName,
							    oldDisplayName = _request$data.oldDisplayName;

							// NOTE: Hack, we shouldn't do this, but this is just a demo.

							var peer = _this13._room.getPeerByName(_peerName);

							if (!peer) {
								logger.error('peer not found');

								break;
							}

							peer.appData.displayName = _displayName;

							_this13._dispatch(stateActions.setPeerDisplayName(_displayName, _peerName));

							_this13._dispatch(requestActions.notify({
								text: oldDisplayName + ' is now ' + _displayName
							}));

							break;
						}

					default:
						{
							logger.error('unknown protoo method "%s"', request.method);

							reject(404, 'unknown method');
						}
				}
			});
		}
	}, {
		key: '_joinRoom',
		value: function _joinRoom(_ref3) {
			var _this14 = this;

			var displayName = _ref3.displayName,
			    device = _ref3.device;

			logger.debug('_joinRoom()');

			// NOTE: We allow rejoining (room.join()) the same mediasoup Room when Protoo
			// WebSocket re-connects, so we must clean existing event listeners. Otherwise
			// they will be called twice after the reconnection.
			this._room.removeAllListeners();

			this._room.on('close', function (originator, appData) {
				if (originator === 'remote') {
					logger.warn('mediasoup Peer/Room remotely closed [appData:%o]', appData);

					_this14._dispatch(stateActions.setRoomState('closed'));

					return;
				}
			});

			this._room.on('request', function (request, callback, errback) {
				logger.debug('sending mediasoup request [method:%s]:%o', request.method, request);

				_this14._protoo.send('mediasoup-request', request).then(callback).catch(errback);
			});

			this._room.on('notify', function (notification) {
				logger.debug('sending mediasoup notification [method:%s]:%o', notification.method, notification);

				_this14._protoo.send('mediasoup-notification', notification).catch(function (error) {
					logger.warn('could not send mediasoup notification:%o', error);
				});
			});

			this._room.on('newpeer', function (peer) {
				logger.debug('room "newpeer" event [name:"%s", peer:%o]', peer.name, peer);

				_this14._handlePeer(peer);
			});

			this._room.join(this._peerName, { displayName: displayName, device: device }).then(function () {
				// Create Transport for sending.
				_this14._sendTransport = _this14._room.createTransport('send', { media: 'SEND_MIC_WEBCAM' });

				_this14._sendTransport.on('close', function (originator) {
					logger.debug('Transport "close" event [originator:%s]', originator);
				});

				// Create Transport for receiving.
				_this14._recvTransport = _this14._room.createTransport('recv', { media: 'RECV' });

				_this14._recvTransport.on('close', function (originator) {
					logger.debug('receiving Transport "close" event [originator:%s]', originator);
				});
			}).then(function () {
				// Set our media capabilities.
				_this14._dispatch(stateActions.setMediaCapabilities({
					canSendMic: _this14._room.canSend('audio'),
					canSendWebcam: _this14._room.canSend('video') //,
					//canSendScreenShare : this._room.canSend('screen')
				}));
			}).then(function () {
				// Don't produce if explicitely requested to not to do it.
				if (!_this14._produce) return;

				// NOTE: Don't depend on this Promise to continue (so we don't do return).
				_promise2.default.resolve()
				// Add our mic.
				.then(function () {
					if (!_this14._room.canSend('audio')) return;

					_this14._activateMic();
					// 	.catch(() => {});
				})
				// Add our webcam (unless the cookie says no).
				.then(function () {
					if (!_this14._room.canSend('video')) return;

					// const devicesCookie = cookiesManager.getDevices();

					// if (!devicesCookie || devicesCookie.webcamEnabled)
					_this14._activateWebcam();
				});
			}).then(function () {
				_this14._dispatch(stateActions.setRoomState('connected'));

				// Clean all the existing notifcations.
				_this14._dispatch(stateActions.removeAllNotifications());

				_this14._dispatch(requestActions.notify({
					text: 'You are in the room',
					timeout: 5000
				}));

				var peers = _this14._room.peers;

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = (0, _getIterator3.default)(peers), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var peer = _step5.value;

						_this14._handlePeer(peer, { notify: false });
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}
			}).catch(function (error) {
				logger.error('_joinRoom() failed:%o', error);

				_this14._dispatch(requestActions.notify({
					type: 'error',
					text: 'Could not join the room: ' + error.toString()
				}));

				_this14.close();
			});
		}
	}, {
		key: '_setMicProducer',
		value: function _setMicProducer() {
			var _this15 = this;

			//console.log('inside mic producer');
			//console.log(this._mic.deviceId);

			if (!this._room.canSend('audio')) {
				return _promise2.default.reject(new Error('cannot send audio'));
			}

			if (this._micProducer) {
				return _promise2.default.reject(new Error('mic Producer already exists'));
			}

			var producer = void 0;
			if (!this._micProducer) {
				return _promise2.default.resolve().then(function () {
					logger.debug('_setMicProducer() | calling getUserMedia()');

					return navigator.mediaDevices.getUserMedia({
						audio: {
							deviceId: _this15._mic.deviceId ? { exact: _this15._mic.deviceId } : undefined
						},
						video: false
					});
				}).then(function (stream) {
					var track = stream.getAudioTracks()[0];

					producer = _this15._room.createProducer(track, null, { source: 'mic' });

					//disable audio if it's muted
					if (!_this15._is_audio_enabled) {
						producer.pause();
						_this15.is_audio_initialized = true;
					}
					// No need to keep original track.
					track.stop();

					// Send it.
					return producer.send(_this15._sendTransport);
				}).then(function () {
					_this15._micProducer = producer;

					_this15._dispatch(stateActions.addProducer({
						id: producer.id,
						source: 'mic',
						locallyPaused: producer.locallyPaused,
						remotelyPaused: producer.remotelyPaused,
						track: producer.track,
						codec: producer.rtpParameters.codecs[0].name
					}));

					producer.on('close', function (originator) {
						logger.debug('mic Producer "close" event [originator:%s]', originator);

						_this15._micProducer = null;
						_this15._dispatch(stateActions.removeProducer(producer.id));
					});

					producer.on('pause', function (originator) {
						logger.debug('mic Producer "pause" event [originator:%s]', originator);

						_this15._dispatch(stateActions.setProducerPaused(producer.id, originator));
					});

					producer.on('resume', function (originator) {
						logger.debug('mic Producer "resume" event [originator:%s]', originator);

						_this15._dispatch(stateActions.setProducerResumed(producer.id, originator));
					});

					producer.on('handled', function () {
						logger.debug('mic Producer "handled" event');
					});

					producer.on('unhandled', function () {
						logger.debug('mic Producer "unhandled" event');
					});
				}).then(function () {
					logger.debug('_setMicProducer() succeeded');
				}).catch(function (error) {
					logger.error('_setMicProducer() failed:%o', error);

					_this15._dispatch(requestActions.notify({
						text: 'Mic producer failed: ' + error.name + ':' + error.message
					}));

					if (producer) producer.close();

					throw error;
				});
			} else {
				return this._micProducer;
			}
		}
	}, {
		key: '_setWebcamProducer',
		value: function _setWebcamProducer() {
			var _this16 = this;

			if (!this._is_webcam_enabled) return 0;

			// if (!this._room.canSend('video'))
			// {
			// 	return Promise.reject(
			// 		new Error('cannot send video'));
			// }

			if (this._webcamProducer) {
				return _promise2.default.reject(new Error('webcam Producer already exists'));
			}

			var producer = void 0;
			if (!this._room._webcamProducer) {
				return _promise2.default.resolve().then(function () {
					var _webcam4 = _this16._webcam,
					    device = _webcam4.device,
					    resolution = _webcam4.resolution;


					if (!device) throw new Error('no webcam devices');

					logger.debug('_setWebcamProducer() | calling getUserMedia()');

					// return navigator.mediaDevices.getUserMedia(
					// 	{
					// 		video :
					// 		{
					// 			deviceId : { exact: device.deviceId },
					// 			...VIDEO_CONSTRAINS[resolution]
					// 		}
					// 	});

					return navigator.mediaDevices.getUserMedia((0, _extends3.default)({
						deviceId: { exact: device.deviceId },
						audio: false
					}, VIDEO_CONSTRAINS[resolution], {
						video: true
					}));
				}).then(function (stream) {
					var track = stream.getVideoTracks()[0];

					producer = _this16._room.createProducer(track, { simulcast: _this16._useSimulcast ? SIMULCAST_OPTIONS : false }, { source: 'webcam' });

					// No need to keep original track.
					track.stop();

					// Send it.
					return producer.send(_this16._sendTransport);
				}).then(function () {
					_this16._webcamProducer = producer;

					var device = _this16._webcam.device;


					_this16._dispatch(stateActions.addProducer({
						id: producer.id,
						source: 'webcam',
						deviceLabel: device.label,
						type: _this16._getWebcamType(device),
						locallyPaused: producer.locallyPaused,
						remotelyPaused: producer.remotelyPaused,
						track: producer.track,
						codec: producer.rtpParameters.codecs[0].name
					}));

					producer.on('close', function (originator) {
						logger.debug('webcam Producer "close" event [originator:%s]', originator);

						_this16._webcamProducer = null;
						_this16._dispatch(stateActions.removeProducer(producer.id));
					});

					producer.on('pause', function (originator) {
						logger.debug('webcam Producer "pause" event [originator:%s]', originator);

						_this16._dispatch(stateActions.setProducerPaused(producer.id, originator));
					});

					producer.on('resume', function (originator) {
						logger.debug('webcam Producer "resume" event [originator:%s]', originator);

						_this16._dispatch(stateActions.setProducerResumed(producer.id, originator));
					});

					producer.on('handled', function () {
						logger.debug('webcam Producer "handled" event');
					});

					producer.on('unhandled', function () {
						logger.debug('webcam Producer "unhandled" event');
					});
				}).then(function () {
					logger.debug('_setWebcamProducer() succeeded');
				}).catch(function (error) {
					logger.error('_setWebcamProducer() failed:%o', error);

					_this16._dispatch(requestActions.notify({
						text: 'Webcam producer failed: ' + error.name + ':' + error.message
					}));

					if (producer) producer.close();

					throw error;
				});
			} else {
				return this._room._webcamProducer;
			}
		}
	}, {
		key: '_changeScreenForShare',
		value: function _changeScreenForShare() {
			var _this17 = this;

			logger.debug('_changeScreenForShare()');

			this._is_screenshare_enabled = true;
			this._dispatch(stateActions.setScreenShareInProgress(true));

			return _promise2.default.resolve().then(function () {
				logger.debug('_changeScreenForShare() | calling getUserMedia()');

				return navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: _this17._screenStreamId,
							maxWidth: 1280,
							maxHeight: 720
						}
					}
				});
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				return _this17._screenShareProducer.replaceTrack(track).then(function (newTrack) {
					track.stop();

					return newTrack;
				});
			}).then(function (newTrack) {
				_this17._dispatch(stateActions.setProducerTrack(_this17._screenShareProducer.id, newTrack));

				_this17._dispatch(stateActions.setScreenShareInProgress(false));
			}).catch(function (error) {
				logger.error('_changeScreenForShare() failed: %o', error);

				_this17._dispatch(stateActions.setScreenShareInProgress(false));
			});
		}
	}, {
		key: '_setScreenShareProducer',
		value: function _setScreenShareProducer() {
			var _this18 = this;

			if (!this._is_screenshare_enabled) return 0;

			if (this._screenShareProducer) {
				return _promise2.default.reject(new Error('screenshare Producer already exists'));
			}

			var producer = void 0;
			return _promise2.default.resolve().then(function () {
				logger.debug('_setScreenShareProducer() | calling getUserMedia()');

				return navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: _this18._screenStreamId,
							maxWidth: 1280,
							maxHeight: 720
						}
					}
				});
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				producer = _this18._room.createProducer(track, { simulcast: _this18._useSimulcast ? SIMULCAST_OPTIONS : false }, { source: 'screen' });
				track.stop();

				return producer.send(_this18._sendTransport);
			}).then(function () {
				_this18._screenShareProducer = producer;

				_this18._dispatch(stateActions.addProducer({
					id: producer.id,
					source: 'screen',
					locallyPaused: producer.locallyPaused,
					remotelyPaused: producer.remotelyPaused,
					track: producer.track,
					codec: producer.rtpParameters.codecs[0].name
				}));

				producer.on('close', function (originator) {
					logger.debug('screenshare Producer "close" event [originator:%s]', originator);

					_this18._screenShareProducer = null;
					_this18._dispatch(stateActions.removeProducer(producer.id));
				});

				producer.on('pause', function (originator) {
					logger.debug('screenshare Producer "pause" event [originator:%s]', originator);

					_this18._dispatch(stateActions.setProducerPaused(producer.id, originator));
				});

				producer.on('resume', function (originator) {
					logger.debug('screenshare Producer "resume" event [originator:%s]', originator);

					_this18._dispatch(stateActions.setProducerResumed(producer.id, originator));
				});

				producer.on('handled', function () {
					logger.debug('screenshare Producer "handled" event');
				});

				producer.on('unhandled', function () {
					logger.debug('screenshare Producer "unhandled" event');
				});
			}).then(function () {
				logger.debug('_setScreenShareProducer() succeeded');
			}).catch(function (error) {
				logger.error('_setScreenShareProducer() failed:%o', error);

				_this18._dispatch(requestActions.notify({
					text: 'screenshare Producer failed: ' + error.name + ':' + error.message
				}));

				if (producer) producer.close();

				throw error;
			});
		}

		//Метод принимает MediaDeviceInfo и запоминает его в клиенте в зависимости от типа устройства

	}, {
		key: 'setDevice',
		value: function setDevice(device) {
			var _this19 = this;

			if (!device) {
				return _promise2.default.reject(new Error('setDevice error: no device provided!'));
			}

			if (device.kind === 'audioinput') {
				return _promise2.default.resolve().then(function () {
					_this19._dispatch(stateActions.setMicInProgress(true));
				}).then(function () {
					_this19._mic = device;

					return navigator.mediaDevices.getUserMedia({
						audio: {
							deviceId: _this19._mic.deviceId ? { exact: _this19._mic.deviceId } : undefined
						},
						video: false
					});
				}).then(function (stream) {
					var track = stream.getAudioTracks()[0];

					return _this19._micProducer.replaceTrack(track).then(function (newTrack) {
						track.stop();

						return newTrack;
					});
				}).then(function (newTrack) {
					_this19._dispatch(stateActions.setProducerTrack(_this19._micProducer.id, newTrack));

					_this19._dispatch(stateActions.setMicInProgress(false));
				}).catch(function (err) {
					console.log(err);
				});
			}

			if (device.kind === 'videoinput') {
				return _promise2.default.resolve().then(function () {
					_this19._dispatch(stateActions.setWebcamInProgress(true));
				}).then(function () {
					_this19._webcam.device = device;

					return navigator.mediaDevices.getUserMedia((0, _extends3.default)({
						deviceId: _this19._webcam.device.deviceId ? { exact: _this19._webcam.webcam.deviceId } : undefined,
						audio: false
					}, VIDEO_CONSTRAINS[resolution], {
						video: true
					}));
				}).then(function (stream) {
					var track = stream.getVideoTracks()[0];

					return _this19._webcamProducer.replaceTrack(track).then(function (newTrack) {
						track.stop();

						return newTrack;
					});
				}).then(function (newTrack) {
					_this19._dispatch(stateActions.setProducerTrack(_this19._webcamProducer.id, newTrack));

					_this19._dispatch(stateActions.setWebcamInProgress(false));
				}).catch(function (err) {
					console.log(err);
				});
			}

			return _promise2.default.reject(new Error('setDevice error: wrong type of device!'));
		}
	}, {
		key: '_updateWebcams',
		value: function _updateWebcams() {
			var _this20 = this;

			logger.debug('_updateWebcams()');

			// Reset the list.
			this._webcams = new _map2.default();

			return _promise2.default.resolve().then(function () {
				logger.debug('_updateWebcams() | calling enumerateDevices()');

				return navigator.mediaDevices.enumerateDevices();
			}).then(function (devices) {
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = (0, _getIterator3.default)(devices), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var device = _step6.value;

						if (device.kind !== 'videoinput') continue;

						_this20._webcams.set(device.deviceId, device);
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}
			}).then(function () {
				var storageWebcam = _this20._storage.getItem('training-space-video-output-device-id');
				var array = (0, _from2.default)(_this20._webcams.values());

				if (_this20._webcams.has(storageWebcam)) {
					console.log('Обнаружена камера с ID:' + storageWebcam + " в localStorage");
					_this20._webcam.device = _this20._webcams.get(storageWebcam);
					return;
				}

				var len = array.length;
				var currentWebcamId = _this20._webcam.device ? _this20._webcam.device.deviceId : undefined;

				logger.debug('_updateWebcams() [webcams:%o]', array);

				if (len === 0) _this20._webcam.device = null;else if (!_this20._webcams.has(currentWebcamId)) _this20._webcam.device = array[0];

				_this20._dispatch(stateActions.setCanChangeWebcam(_this20._webcams.size >= 2));
			});
		}
	}, {
		key: '_updateMics',
		value: function _updateMics() {
			var _this21 = this;

			logger.debug('_updateMics()');
			//console.log('inside updateMics()');

			// Reset the list.
			this._mics = new _map2.default();

			return _promise2.default.resolve().then(function () {
				logger.debug('_updateMics() | calling enumerateDevices()');

				return navigator.mediaDevices.enumerateDevices();
			}).then(function (devices) {
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = (0, _getIterator3.default)(devices), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var device = _step7.value;

						if (device.kind !== 'audioinput') continue;

						_this21._mics.set(device.deviceId, device);
					}
				} catch (err) {
					_didIteratorError7 = true;
					_iteratorError7 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion7 && _iterator7.return) {
							_iterator7.return();
						}
					} finally {
						if (_didIteratorError7) {
							throw _iteratorError7;
						}
					}
				}
			}).then(function () {
				var storageMic = _this21._storage.getItem('training-space-audio-input-device-id');
				var array = (0, _from2.default)(_this21._mics.values());

				if (_this21._mics.has(storageMic)) {
					//console.log('Обнаружен микрофон с ID:' + storageMic + " в localStorage");
					_this21._mic = _this21._mics.get(storageMic);
					return;
				}

				var len = array.length;
				var currentMicId = _this21._mic ? _this21._mic.deviceId : undefined;

				logger.debug('_updateMics() [microphones:%o]', array);

				if (len === 0) _this21._mic = null;else if (!_this21._mics.has(currentMicId)) _this21._mic = array[0];

				// this._dispatch(
				// 	stateActions.setCanChangeWebcam(this._mics.size > 1)
				// );
			});
		}
	}, {
		key: '_getWebcamType',
		value: function _getWebcamType(device) {
			if (/(back|rear)/i.test(device.label)) {
				logger.debug('_getWebcamType() | it seems to be a back camera');

				return 'back';
			} else {
				logger.debug('_getWebcamType() | it seems to be a front camera');

				return 'front';
			}
		}
	}, {
		key: '_handlePeer',
		value: function _handlePeer(peer) {
			var _this22 = this;

			var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref4$notify = _ref4.notify,
			    notify = _ref4$notify === undefined ? true : _ref4$notify;

			var displayName = peer.appData.displayName;

			this._dispatch(stateActions.addPeer({
				name: peer.name,
				displayName: displayName,
				device: peer.appData.device,
				consumers: []
			}));

			if (notify) {
				this._dispatch(requestActions.notify({
					text: displayName + ' joined the room'
				}));
			}

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = (0, _getIterator3.default)(peer.consumers), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var consumer = _step8.value;

					this._handleConsumer(consumer);
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			peer.on('close', function (originator) {
				logger.debug('peer "close" event [name:"%s", originator:%s]', peer.name, originator);

				_this22._dispatch(stateActions.removePeer(peer.name));

				if (_this22._room.joined) {
					_this22._dispatch(requestActions.notify({
						text: peer.appData.displayName + ' left the room'
					}));
				}
			});

			peer.on('newconsumer', function (consumer) {
				logger.debug('peer "newconsumer" event [name:"%s", id:%s, consumer:%o]', peer.name, consumer.id, consumer);

				_this22._handleConsumer(consumer);
			});
		}
	}, {
		key: '_handleConsumer',
		value: function _handleConsumer(consumer) {
			var _this23 = this;

			var codec = consumer.rtpParameters.codecs[0];

			this._dispatch(stateActions.addConsumer({
				id: consumer.id,
				peerName: consumer.peer.name,
				source: consumer.appData.source,
				supported: consumer.supported,
				locallyPaused: consumer.locallyPaused,
				remotelyPaused: consumer.remotelyPaused,
				track: null,
				codec: codec ? codec.name : null
			}, consumer.peer.name));

			consumer.on('close', function (originator) {
				logger.debug('consumer "close" event [id:%s, originator:%s, consumer:%o]', consumer.id, originator, consumer);

				_this23._dispatch(stateActions.removeConsumer(consumer.id, consumer.peer.name));
			});

			consumer.on('pause', function (originator) {
				logger.debug('consumer "pause" event [id:%s, originator:%s, consumer:%o]', consumer.id, originator, consumer);

				_this23._dispatch(stateActions.setConsumerPaused(consumer.id, originator));
			});

			consumer.on('resume', function (originator) {
				logger.debug('consumer "resume" event [id:%s, originator:%s, consumer:%o]', consumer.id, originator, consumer);

				_this23._dispatch(stateActions.setConsumerResumed(consumer.id, originator));
			});

			consumer.on('effectiveprofilechange', function (profile) {
				consumer.setPreferredProfile(profile);
				logger.debug('consumer "effectiveprofilechange" event [id:%s, consumer:%o, profile:%s]', consumer.id, consumer, profile);

				_this23._dispatch(stateActions.setConsumerEffectiveProfile(consumer.id, profile));
			});

			// Receive the consumer (if we can).
			if (consumer.supported) {
				// Pause it if video and we are in audio-only mode.
				if (consumer.kind === 'video' && this._getState().me.audioOnly) consumer.pause('audio-only-mode');

				consumer.receive(this._recvTransport).then(function (track) {
					_this23._dispatch(stateActions.setConsumerTrack(consumer.id, track));
				}).catch(function (error) {
					logger.error('unexpected error while receiving a new Consumer:%o', error);
				});
			}
		}
	}, {
		key: 'changeRecordSource',
		value: function changeRecordSource() {
			//TODO: переключение источника ввода видео
		}
	}, {
		key: 'record',
		value: function record(interval) {
			var _this24 = this;

			var dataType = { VIDEO: 'video', AUDIO: 'audio' };

			console.log("Starting Media Recorder...");
			var videoStream = new MediaStream(),
			    audioStream = new MediaStream();

			if (this._screenShareProducer) {
				videoStream.addTrack(this._screenShareProducer.track);
			} else if (this._webcamProducer) {
				videoStream.addTrack(this._webcamProducer.track);
			}
			if (this._micProducer) {
				audioStream.addTrack(this._micProducer.track);
			}

			var videoOptions = { mimeType: 'video/webcam; codecs=vp8' };
			var audioOptions = { mimeType: 'audio/ogg; codecs=opus' };

			this._videoRecorder = new _msr2.default(videoStream, videoOptions);
			this._audioRecorder = new _msr2.default(audioStream, audioOptions);

			// this._videoRecorder = new RecordRtc(videoStream, videoOptions);
			// this._audioRecorder = new RecordRtc(audioStream, audioOptions);

			this._videoRecorder.ondataavailable = function (blob) {
				uploadBlob(_this24._videoRecorder, blob, dataType.VIDEO);
			};

			this._audioRecorder.ondataavailable = function (blob) {
				uploadBlob(_this24._audioRecorder, blob, dataType.AUDIO);
			};

			_axios2.default.get('http://127.0.0.1:5000/begin').then(function (res) {
				console.log('Server is ready, start sending data...');

				_this24._recordState = 'recording';
				_this24._videoRecorder.start(interval);
				_this24._audioRecorder.start(interval);
			});

			function uploadBlob(recorder, blob, datatype, index) {
				var data = new FormData();
				data.append('name', datatype + '-' + index);
				data.append('file', blob);
				data.append('datatype', datatype);

				var url = 'http://127.0.0.1:5000/data-' + datatype;
				_axios2.default.post(url, data).then(function (res) {
					console.log(datatype + '-data blob sent.');
				}).catch(function (err) {
					console.log('error:' + err);
				});
			}
		}
	}, {
		key: 'stopRecord',
		value: function stopRecord() {
			console.log('Deactivating recorder...');
			this._recordState = 'inactive';
			this._audioRecorder.stop();
			this._videoRecorder.stop();
			setTimeout(this.finishRecord, 500);
		}
	}, {
		key: 'finishRecord',
		value: function finishRecord() {
			this._recordState = 'inactive';
			this._videoRecorder = null;
			this._audioRecorder = null;
			_axios2.default.get('http://127.0.0.1:5000/end').then(function (res) {
				console.log('Data transfer complete');
				return 5;
			});
		}
	}]);
	return RoomClient;
}();

exports.default = RoomClient;
},{"./Logger":1,"./redux/requestActions":11,"./redux/stateActions":13,"./urlFactory":14,"axios":16,"babel-runtime/core-js/array/from":41,"babel-runtime/core-js/get-iterator":42,"babel-runtime/core-js/map":43,"babel-runtime/core-js/promise":46,"babel-runtime/helpers/classCallCheck":47,"babel-runtime/helpers/createClass":48,"babel-runtime/helpers/extends":50,"mediasoup-client":188,"msr":192,"protoo-client":196}],3:[function(require,module,exports){
(function (process,global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Init = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _mediasoupClient = require('mediasoup-client');

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _requestActions = require('./redux/requestActions');

var requestActions = _interopRequireWildcard(_requestActions);

var _stateActions = require('./redux/stateActions');

var stateActions = _interopRequireWildcard(_stateActions);

var _reducers = require('./redux/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _roomClientMiddleware = require('./redux/roomClientMiddleware');

var _roomClientMiddleware2 = _interopRequireDefault(_roomClientMiddleware);

var _wildemitter = require('wildemitter');

var emitter = _interopRequireWildcard(_wildemitter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Room from './components/Room';

var Init = exports.Init = function Init(config) {
	var _this = this;

	(0, _classCallCheck3.default)(this, Init);

	console.warn('Easy mediasoup v1.1.2');
	global.emitter = this.emitter = new emitter.default();
	this.roomClientMiddleware = _roomClientMiddleware2.default;
	var logger = new _Logger2.default();

	this.emitter.on("joinRoom", function (client) {
		_this.client = client;
	});

	//settingup redux
	var reduxMiddlewares = [_reduxThunk2.default, _roomClientMiddleware2.default];

	if (process.env.NODE_ENV === 'development') {
		var reduxLogger = (0, _reduxLogger.createLogger)({
			duration: true,
			timestamp: false,
			level: 'log',
			logErrors: true
		});

		reduxMiddlewares.push(reduxLogger);
	}

	var store = this.store = (0, _redux.createStore)(_reducers2.default, undefined, _redux.applyMiddleware.apply(undefined, reduxMiddlewares));
	//room settings
	var peerName = config.peerName;
	// const urlParser = new UrlParse(window.location.href, true);
	var roomId = config.roomId;
	var produce = config.produce || true;
	var displayName = config.displayName;
	var isSipEndpoint = config.sipEndpoint || false;
	var useSimulcast = config.useSimulcast || false;
	var media_server_wss = config.media_server_wss;
	var turnservers = config.turnservers || [];
	var args = [];

	args.video_constrains = config.video_constrains || [];
	args.simulcast_options = config.simulcast_options || [];
	args.initially_muted = config.initially_muted || false;

	// if (!roomId)
	// {
	// 	roomId = randomString({ length: 8 }).toLowerCase();

	// 	urlParser.query.roomId = roomId;
	// 	window.history.pushState('', '', urlParser.toString());
	// }

	// Get the effective/shareable Room URL.
	// const roomUrlParser = new UrlParse(window.location.href, true);

	// for (const key of Object.keys(roomUrlParser.query))
	// {
	// 	// Don't keep some custom params.
	// 	switch (key)
	// 	{
	// 		case 'roomId':
	// 		case 'simulcast':
	// 			break;
	// 		default:
	// 			delete roomUrlParser.query[key];
	// 	}
	// }
	// delete roomUrlParser.hash;

	// const roomUrl = roomUrlParser.toString();

	// Get displayName from cookie (if not already given as param).
	// const userCookie = cookiesManager.getUser() || {};
	var displayNameSet = void 0;

	// if (!displayName)
	// 	displayName = userCookie.displayName;

	if (displayName) {
		displayNameSet = true;
	} else {
		displayName = "";
		displayNameSet = false;
	}

	// Get current device.
	var device = (0, _mediasoupClient.getDeviceInfo)();

	// If a SIP endpoint mangle device info.
	if (isSipEndpoint) {
		device.flag = 'sipendpoint';
		device.name = 'SIP Endpoint';
		device.version = undefined;
	}

	// // NOTE: I don't like this.
	// store.dispatch(
	// 	stateActions.setRoomUrl(roomUrl));

	// NOTE: I don't like this.
	store.dispatch(stateActions.setMe({ peerName: peerName, displayName: displayName, displayNameSet: displayNameSet, device: device }));

	// NOTE: I don't like this.
	store.dispatch(requestActions.joinRoom({ media_server_wss: media_server_wss, roomId: roomId, peerName: peerName, displayName: displayName, device: device, useSimulcast: useSimulcast, produce: produce, turnservers: turnservers, args: args }));

	// TODO: Debugging stuff.

	// setInterval(() =>
	// {
	// 	if (!global.CLIENT._room.peers[0])
	// 	{
	// 		delete global.CONSUMER;

	// 		return;
	// 	}

	// 	const peer = global.CLIENT._room.peers[0];

	// 	global.CONSUMER = peer.consumers[peer.consumers.length - 1];
	// }, 2000);

	// global.sendSdp = function()
	// {
	// 	logger.debug('---------- SEND_TRANSPORT LOCAL SDP OFFER:');
	// 	logger.debug(
	// 		global.CLIENT._sendTransport._handler._pc.localDescription.sdp);

	// 	logger.debug('---------- SEND_TRANSPORT REMOTE SDP ANSWER:');
	// 	logger.debug(
	// 		global.CLIENT._sendTransport._handler._pc.remoteDescription.sdp);
	// };

	// global.recvSdp = function()
	// {
	// 	logger.debug('---------- RECV_TRANSPORT REMOTE SDP OFFER:');
	// 	logger.debug(
	// 		global.CLIENT._recvTransport._handler._pc.remoteDescription.sdp);

	// 	logger.debug('---------- RECV_TRANSPORT LOCAL SDP ANSWER:');
	// 	logger.debug(
	// 		global.CLIENT._recvTransport._handler._pc.localDescription.sdp);
	// };
};
// import * as cookiesManager from './cookiesManager';

// import randomString from 'random-string';
// import randomName from 'node-random-name';
// import domready from 'domready';
// import UrlParse from 'url-parse';
// import React from 'react';
// import { render } from 'react-dom';
// import { Provider } from 'react-redux';
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Logger":1,"./redux/reducers":5,"./redux/requestActions":11,"./redux/roomClientMiddleware":12,"./redux/stateActions":13,"./utils":15,"_process":193,"babel-runtime/helpers/classCallCheck":47,"mediasoup-client":188,"redux":210,"redux-logger":203,"redux-thunk":204,"wildemitter":225}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends7 = require('babel-runtime/helpers/extends');

var _extends8 = _interopRequireDefault(_extends7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var consumers = function consumers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_CONSUMER':
			{
				var consumer = action.payload.consumer;

				global.emitter.emit("ADD_CONSUMER", action.payload);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, consumer.id, consumer));
			}

		case 'REMOVE_CONSUMER':
			{
				var consumerId = action.payload.consumerId;

				var newState = (0, _extends8.default)({}, state);

				delete newState[consumerId];
				global.emitter.emit("REMOVE_CONSUMER", action.payload);
				return newState;
			}

		case 'SET_CONSUMER_PAUSED':
			{
				var _action$payload = action.payload,
				    _consumerId = _action$payload.consumerId,
				    originator = _action$payload.originator;

				var _consumer = state[_consumerId];
				var newConsumer = void 0;

				if (originator === 'local') newConsumer = (0, _extends8.default)({}, _consumer, { locallyPaused: true });else newConsumer = (0, _extends8.default)({}, _consumer, { remotelyPaused: true });

				global.emitter.emit("SET_CONSUMER_PAUSED", action.payload);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId, newConsumer));
			}

		case 'SET_CONSUMER_RESUMED':
			{
				var _action$payload2 = action.payload,
				    _consumerId2 = _action$payload2.consumerId,
				    _originator = _action$payload2.originator;

				var _consumer2 = state[_consumerId2];
				var _newConsumer = void 0;

				if (_originator === 'local') _newConsumer = (0, _extends8.default)({}, _consumer2, { locallyPaused: false });else _newConsumer = (0, _extends8.default)({}, _consumer2, { remotelyPaused: false });

				global.emitter.emit("SET_CONSUMER_RESUMED", action.payload);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId2, _newConsumer));
			}

		case 'SET_CONSUMER_EFFECTIVE_PROFILE':
			{
				var _action$payload3 = action.payload,
				    _consumerId3 = _action$payload3.consumerId,
				    profile = _action$payload3.profile;

				var _consumer3 = state[_consumerId3];
				var _newConsumer2 = (0, _extends8.default)({}, _consumer3, { profile: profile });

				global.emitter.emit("SET_CONSUMER_EFFECTIVE_PROFILE", _newConsumer2);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId3, _newConsumer2));
			}

		case 'SET_CONSUMER_TRACK':
			{
				var _action$payload4 = action.payload,
				    _consumerId4 = _action$payload4.consumerId,
				    track = _action$payload4.track;

				var _consumer4 = state[_consumerId4];
				var _newConsumer3 = (0, _extends8.default)({}, _consumer4, { track: track });

				global.emitter.emit("SET_CONSUMER_TRACK", _newConsumer3);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId4, _newConsumer3));
			}

		default:
			return state;
	}
};

exports.default = consumers;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/helpers/defineProperty":49,"babel-runtime/helpers/extends":50}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _redux = require('redux');

var _room = require('./room');

var _room2 = _interopRequireDefault(_room);

var _me = require('./me');

var _me2 = _interopRequireDefault(_me);

var _producers = require('./producers');

var _producers2 = _interopRequireDefault(_producers);

var _peers = require('./peers');

var _peers2 = _interopRequireDefault(_peers);

var _consumers = require('./consumers');

var _consumers2 = _interopRequireDefault(_consumers);

var _notifications = require('./notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = (0, _redux.combineReducers)({
	room: _room2.default,
	me: _me2.default,
	producers: _producers2.default,
	peers: _peers2.default,
	consumers: _consumers2.default,
	notifications: _notifications2.default
});

exports.default = reducers;
},{"./consumers":4,"./me":6,"./notifications":7,"./peers":8,"./producers":9,"./room":10,"redux":210}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
	name: null,
	displayName: null,
	displayNameSet: false,
	device: null,
	canSendMic: false,
	canSendWebcam: false,
	canChangeWebcam: false,
	webcamInProgress: false,
	audioOnly: false,
	audioOnlyInProgress: false,
	restartIceInProgress: false
};

var me = function me() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'SET_ME':
			{
				var _action$payload = action.payload,
				    peerName = _action$payload.peerName,
				    displayName = _action$payload.displayName,
				    displayNameSet = _action$payload.displayNameSet,
				    device = _action$payload.device;

				global.emitter.emit("SET_ME", action.payload);
				return (0, _extends3.default)({}, state, { name: peerName, displayName: displayName, displayNameSet: displayNameSet, device: device });
			}

		case 'SET_MEDIA_CAPABILITIES':
			{
				var _action$payload2 = action.payload,
				    canSendMic = _action$payload2.canSendMic,
				    canSendWebcam = _action$payload2.canSendWebcam;


				return (0, _extends3.default)({}, state, { canSendMic: canSendMic, canSendWebcam: canSendWebcam });
			}

		case 'SET_CAN_CHANGE_WEBCAM':
			{
				var canChangeWebcam = action.payload;
				global.emitter.emit("SET_CAN_CHANGE_WEBCAM", action.payload);
				return (0, _extends3.default)({}, state, { canChangeWebcam: canChangeWebcam });
			}

		case 'SET_WEBCAM_IN_PROGRESS':
			{
				var flag = action.payload.flag;

				global.emitter.emit("SET_WEBCAM_IN_PROGRESS", action.payload);
				return (0, _extends3.default)({}, state, { webcamInProgress: flag });
			}

		case 'SET_DISPLAY_NAME':
			{
				var _displayName = action.payload.displayName;

				// Be ready for undefined displayName (so keep previous one).

				if (!_displayName) _displayName = state.displayName;

				return (0, _extends3.default)({}, state, { displayName: _displayName, displayNameSet: true });
			}

		case 'SET_AUDIO_ONLY_STATE':
			{
				var enabled = action.payload.enabled;


				return (0, _extends3.default)({}, state, { audioOnly: enabled });
			}

		case 'SET_AUDIO_ONLY_IN_PROGRESS':
			{
				var _flag = action.payload.flag;


				return (0, _extends3.default)({}, state, { audioOnlyInProgress: _flag });
			}

		case 'SET_RESTART_ICE_IN_PROGRESS':
			{
				var _flag2 = action.payload.flag;


				return (0, _extends3.default)({}, state, { restartIceInProgress: _flag2 });
			}

		default:
			return state;
	}
};

exports.default = me;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/helpers/extends":50}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = [];

var notifications = function notifications() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_NOTIFICATION':
			{
				var notification = action.payload.notification;


				return [].concat((0, _toConsumableArray3.default)(state), [notification]);
			}

		case 'REMOVE_NOTIFICATION':
			{
				var notificationId = action.payload.notificationId;


				return state.filter(function (notification) {
					return notification.id !== notificationId;
				});
			}

		case 'REMOVE_ALL_NOTIFICATIONS':
			{
				return [];
			}

		default:
			return state;
	}
};

exports.default = notifications;
},{"babel-runtime/helpers/toConsumableArray":51}],8:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var peers = function peers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_PEER':
			{
				var peer = action.payload.peer;

				global.emitter.emit("peerAdded", peer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, peer.name, peer));
			}

		case 'REMOVE_PEER':
			{
				var peerName = action.payload.peerName;

				var newState = (0, _extends7.default)({}, state);

				delete newState[peerName];
				global.emitter.emit("peerRemoved", peerName);
				return newState;
			}

		case 'SET_PEER_DISPLAY_NAME':
			{
				var _action$payload = action.payload,
				    displayName = _action$payload.displayName,
				    _peerName = _action$payload.peerName;

				var _peer = state[_peerName];

				if (!_peer) throw new Error('no Peer found');

				var newPeer = (0, _extends7.default)({}, _peer, { displayName: displayName });

				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, newPeer.name, newPeer));
			}

		case 'ADD_CONSUMER':
			{
				var _action$payload2 = action.payload,
				    consumer = _action$payload2.consumer,
				    _peerName2 = _action$payload2.peerName;

				var _peer2 = state[_peerName2];

				if (!_peer2) throw new Error('no Peer found for new Consumer');

				var newConsumers = [].concat((0, _toConsumableArray3.default)(_peer2.consumers), [consumer.id]);
				var _newPeer = (0, _extends7.default)({}, _peer2, { consumers: newConsumers });
				global.emitter.emit("peerConsumerAdded", _newPeer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _newPeer.name, _newPeer));
			}

		case 'REMOVE_CONSUMER':
			{
				var _action$payload3 = action.payload,
				    consumerId = _action$payload3.consumerId,
				    _peerName3 = _action$payload3.peerName;

				var _peer3 = state[_peerName3];

				// NOTE: This means that the Peer was closed before, so it's ok.
				if (!_peer3) return state;

				var idx = _peer3.consumers.indexOf(consumerId);

				if (idx === -1) throw new Error('Consumer not found');

				var _newConsumers = _peer3.consumers.slice();

				_newConsumers.splice(idx, 1);

				var _newPeer2 = (0, _extends7.default)({}, _peer3, { consumers: _newConsumers });
				global.emitter.emit("peerConsumerRemoved", _newPeer2);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _newPeer2.name, _newPeer2));
			}

		default:
			return state;
	}
};

exports.default = peers;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/helpers/defineProperty":49,"babel-runtime/helpers/extends":50,"babel-runtime/helpers/toConsumableArray":51}],9:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var producers = function producers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_PRODUCER':
			{
				var _producer = action.payload.producer;

				global.emitter.emit("ADD_PRODUCER", _producer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producer.id, _producer));
			}

		case 'REMOVE_PRODUCER':
			{
				var producerId = action.payload.producerId;

				var newState = (0, _extends7.default)({}, state);

				delete newState[producerId];
				global.emitter.emit("REMOVE_PRODUCER", producer);
				return newState;
			}

		case 'SET_PRODUCER_PAUSED':
			{
				var _action$payload = action.payload,
				    _producerId = _action$payload.producerId,
				    originator = _action$payload.originator;

				var _producer2 = state[_producerId];
				var newProducer = void 0;

				if (originator === 'local') newProducer = (0, _extends7.default)({}, _producer2, { locallyPaused: true });else newProducer = (0, _extends7.default)({}, _producer2, { remotelyPaused: true });

				global.emitter.emit("SET_PRODUCER_PAUSED", newProducer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producerId, newProducer));
			}

		case 'SET_PRODUCER_RESUMED':
			{
				var _action$payload2 = action.payload,
				    _producerId2 = _action$payload2.producerId,
				    _originator = _action$payload2.originator;

				var _producer3 = state[_producerId2];
				var _newProducer = void 0;

				if (_originator === 'local') _newProducer = (0, _extends7.default)({}, _producer3, { locallyPaused: false });else _newProducer = (0, _extends7.default)({}, _producer3, { remotelyPaused: false });

				global.emitter.emit("SET_PRODUCER_RESUMED", _newProducer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producerId2, _newProducer));
			}

		case 'SET_PRODUCER_TRACK':
			{
				var _action$payload3 = action.payload,
				    _producerId3 = _action$payload3.producerId,
				    track = _action$payload3.track;

				var _producer4 = state[_producerId3];
				var _newProducer2 = (0, _extends7.default)({}, _producer4, { track: track });

				global.emitter.emit("SET_PRODUCER_TRACK", _newProducer2);

				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producerId3, _newProducer2));
			}

		default:
			return state;
	}
};

exports.default = producers;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/helpers/defineProperty":49,"babel-runtime/helpers/extends":50}],10:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
	url: null,
	state: 'new', // new/connecting/connected/disconnected/closed,
	activeSpeakerName: null
};

var room = function room() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'SET_ROOM_URL':
			{
				var url = action.payload.url;


				return (0, _extends3.default)({}, state, { url: url });
			}

		case 'SET_ROOM_STATE':
			{
				var roomState = action.payload.state;
				global.emitter.emit("SET_ROOM_STATE", roomState);
				if (roomState == 'connected') return (0, _extends3.default)({}, state, { state: roomState });else return (0, _extends3.default)({}, state, { state: roomState, activeSpeakerName: null });
			}

		case 'SET_ROOM_ACTIVE_SPEAKER':
			{
				var peerName = action.payload.peerName;

				global.emitter.emit("SET_ROOM_ACTIVE_SPEAKER", peerName);
				return (0, _extends3.default)({}, state, { activeSpeakerName: peerName });
			}

		default:
			return state;
	}
};

exports.default = room;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/helpers/extends":50}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.notify = exports.restartIce = exports.disableAudioOnly = exports.enableAudioOnly = exports.changeWebcam = exports.disableWebcam = exports.enableWebcam = exports.unmuteMic = exports.muteMic = exports.changeDisplayName = exports.leaveRoom = exports.joinRoom = undefined;

var _randomString = require('random-string');

var _randomString2 = _interopRequireDefault(_randomString);

var _stateActions = require('./stateActions');

var stateActions = _interopRequireWildcard(_stateActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joinRoom = exports.joinRoom = function joinRoom(_ref) {
	var media_server_wss = _ref.media_server_wss,
	    roomId = _ref.roomId,
	    peerName = _ref.peerName,
	    displayName = _ref.displayName,
	    device = _ref.device,
	    useSimulcast = _ref.useSimulcast,
	    produce = _ref.produce,
	    turnservers = _ref.turnservers,
	    args = _ref.args;

	return {
		type: 'JOIN_ROOM',
		payload: { media_server_wss: media_server_wss, roomId: roomId, peerName: peerName, displayName: displayName, device: device, useSimulcast: useSimulcast, produce: produce, turnservers: turnservers, args: args }
	};
};

var leaveRoom = exports.leaveRoom = function leaveRoom() {
	return {
		type: 'LEAVE_ROOM'
	};
};

var changeDisplayName = exports.changeDisplayName = function changeDisplayName(displayName) {
	return {
		type: 'CHANGE_DISPLAY_NAME',
		payload: { displayName: displayName }
	};
};

var muteMic = exports.muteMic = function muteMic() {
	return {
		type: 'MUTE_MIC'
	};
};

var unmuteMic = exports.unmuteMic = function unmuteMic() {
	return {
		type: 'UNMUTE_MIC'
	};
};

var enableWebcam = exports.enableWebcam = function enableWebcam() {
	return {
		type: 'ENABLE_WEBCAM'
	};
};

var disableWebcam = exports.disableWebcam = function disableWebcam() {
	return {
		type: 'DISABLE_WEBCAM'
	};
};

var changeWebcam = exports.changeWebcam = function changeWebcam() {
	return {
		type: 'CHANGE_WEBCAM'
	};
};

var enableAudioOnly = exports.enableAudioOnly = function enableAudioOnly() {
	return {
		type: 'ENABLE_AUDIO_ONLY'
	};
};

var disableAudioOnly = exports.disableAudioOnly = function disableAudioOnly() {
	return {
		type: 'DISABLE_AUDIO_ONLY'
	};
};

var restartIce = exports.restartIce = function restartIce() {
	return {
		type: 'RESTART_ICE'
	};
};

// This returns a redux-thunk action (a function).
var notify = exports.notify = function notify(_ref2) {
	var _ref2$type = _ref2.type,
	    type = _ref2$type === undefined ? 'info' : _ref2$type,
	    text = _ref2.text,
	    timeout = _ref2.timeout;

	if (!timeout) {
		switch (type) {
			case 'info':
				timeout = 3000;
				break;
			case 'error':
				timeout = 5000;
				break;
		}
	}

	var notification = {
		id: (0, _randomString2.default)({ length: 6 }).toLowerCase(),
		type: type,
		text: text,
		timeout: timeout
	};

	return function (dispatch) {
		dispatch(stateActions.addNotification(notification));

		setTimeout(function () {
			dispatch(stateActions.removeNotification(notification.id));
		}, timeout);
	};
};
},{"./stateActions":13,"random-string":202}],12:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _RoomClient = require('../RoomClient');

var _RoomClient2 = _interopRequireDefault(_RoomClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var dispatch = _ref.dispatch,
	    getState = _ref.getState;
	return function (next) {
		var client = void 0;
		return function (action) {
			switch (action.type) {
				case 'JOIN_ROOM':
					{
						var _action$payload = action.payload,
						    media_server_wss = _action$payload.media_server_wss,
						    roomId = _action$payload.roomId,
						    peerName = _action$payload.peerName,
						    displayName = _action$payload.displayName,
						    device = _action$payload.device,
						    useSimulcast = _action$payload.useSimulcast,
						    produce = _action$payload.produce,
						    turnservers = _action$payload.turnservers,
						    args = _action$payload.args;


						client = new _RoomClient2.default({
							media_server_wss: media_server_wss,
							roomId: roomId,
							peerName: peerName,
							displayName: displayName,
							device: device,
							useSimulcast: useSimulcast,
							produce: produce,
							dispatch: dispatch,
							getState: getState,
							turnservers: turnservers,
							args: args
						});

						// TODO: TMP
						global.CLIENT = client;
						global.emitter.emit("joinRoom", client);
						break;
					}

				case 'LEAVE_ROOM':
					{
						client.close();
						global.emitter.emit("leaveRoom", client);
						break;
					}

				case 'CHANGE_DISPLAY_NAME':
					{
						var _displayName = action.payload.displayName;


						client.changeDisplayName(_displayName);
						global.emitter.emit("changeDisplayName", client);
						break;
					}

				case 'MUTE_MIC':
					{
						client.muteMic();
						global.emitter.emit("muteMic", client);
						break;
					}

				case 'UNMUTE_MIC':
					{
						client.unmuteMic();
						global.emitter.emit("unmuteMic", client);
						break;
					}

				case 'ENABLE_WEBCAM':
					{
						client.enableWebcam();
						global.emitter.emit("enableWebcam", client);
						break;
					}

				case 'DISABLE_WEBCAM':
					{
						client.disableWebcam();
						global.emitter.emit("disableWebcam", client);
						break;
					}

				case 'CHANGE_WEBCAM':
					{
						client.changeWebcam();
						global.emitter.emit("changeWebcam", client);
						break;
					}

				case 'ENABLE_AUDIO_ONLY':
					{
						client.enableAudioOnly();
						global.emitter.emit("enableAudioOnly", client);
						break;
					}

				case 'DISABLE_AUDIO_ONLY':
					{
						client.disableAudioOnly();
						global.emitter.emit("disableAudioOnly", client);
						break;
					}

				case 'RESTART_ICE':
					{
						client.restartIce();
						global.emitter.emit("restartIce", client);
						break;
					}
			}

			return next(action);
		};
	};
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../RoomClient":2}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var setRoomUrl = exports.setRoomUrl = function setRoomUrl(url) {
	return {
		type: 'SET_ROOM_URL',
		payload: { url: url }
	};
};

var setRoomState = exports.setRoomState = function setRoomState(state) {
	return {
		type: 'SET_ROOM_STATE',
		payload: { state: state }
	};
};

var setRoomActiveSpeaker = exports.setRoomActiveSpeaker = function setRoomActiveSpeaker(peerName) {
	return {
		type: 'SET_ROOM_ACTIVE_SPEAKER',
		payload: { peerName: peerName }
	};
};

var setMe = exports.setMe = function setMe(_ref) {
	var peerName = _ref.peerName,
	    displayName = _ref.displayName,
	    displayNameSet = _ref.displayNameSet,
	    device = _ref.device;

	return {
		type: 'SET_ME',
		payload: { peerName: peerName, displayName: displayName, displayNameSet: displayNameSet, device: device }
	};
};

var setMediaCapabilities = exports.setMediaCapabilities = function setMediaCapabilities(_ref2) {
	var canSendMic = _ref2.canSendMic,
	    canSendWebcam = _ref2.canSendWebcam,
	    canSendScreenShare = _ref2.canSendScreenShare;

	return {
		type: 'SET_MEDIA_CAPABILITIES',
		payload: { canSendMic: canSendMic, canSendWebcam: canSendWebcam }
	};
};

var setCanChangeWebcam = exports.setCanChangeWebcam = function setCanChangeWebcam(flag) {
	return {
		type: 'SET_CAN_CHANGE_WEBCAM',
		payload: flag
	};
};

var setDisplayName = exports.setDisplayName = function setDisplayName(displayName) {
	return {
		type: 'SET_DISPLAY_NAME',
		payload: { displayName: displayName }
	};
};

var setAudioOnlyState = exports.setAudioOnlyState = function setAudioOnlyState(enabled) {
	return {
		type: 'SET_AUDIO_ONLY_STATE',
		payload: { enabled: enabled }
	};
};

var setAudioOnlyInProgress = exports.setAudioOnlyInProgress = function setAudioOnlyInProgress(flag) {
	return {
		type: 'SET_AUDIO_ONLY_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var setRestartIceInProgress = exports.setRestartIceInProgress = function setRestartIceInProgress(flag) {
	return {
		type: 'SET_RESTART_ICE_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var addProducer = exports.addProducer = function addProducer(producer) {
	return {
		type: 'ADD_PRODUCER',
		payload: { producer: producer }
	};
};

var removeProducer = exports.removeProducer = function removeProducer(producerId) {
	return {
		type: 'REMOVE_PRODUCER',
		payload: { producerId: producerId }
	};
};

var setProducerPaused = exports.setProducerPaused = function setProducerPaused(producerId, originator) {
	return {
		type: 'SET_PRODUCER_PAUSED',
		payload: { producerId: producerId, originator: originator }
	};
};

var setProducerResumed = exports.setProducerResumed = function setProducerResumed(producerId, originator) {
	return {
		type: 'SET_PRODUCER_RESUMED',
		payload: { producerId: producerId, originator: originator }
	};
};

var setProducerTrack = exports.setProducerTrack = function setProducerTrack(producerId, track) {
	return {
		type: 'SET_PRODUCER_TRACK',
		payload: { producerId: producerId, track: track }
	};
};

var setWebcamInProgress = exports.setWebcamInProgress = function setWebcamInProgress(flag) {
	return {
		type: 'SET_WEBCAM_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var setMicInProgress = exports.setMicInProgress = function setMicInProgress(flag) {
	return {
		type: 'SET_MIC_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var setScreenShareInProgress = exports.setScreenShareInProgress = function setScreenShareInProgress(flag) {
	return {
		type: 'SET_SCREENSHARE_IN_PROGRESS',
		payload: { flag: flag }
	};
};

var addPeer = exports.addPeer = function addPeer(peer) {
	return {
		type: 'ADD_PEER',
		payload: { peer: peer }
	};
};

var removePeer = exports.removePeer = function removePeer(peerName) {
	return {
		type: 'REMOVE_PEER',
		payload: { peerName: peerName }
	};
};

var setPeerDisplayName = exports.setPeerDisplayName = function setPeerDisplayName(displayName, peerName) {
	return {
		type: 'SET_PEER_DISPLAY_NAME',
		payload: { displayName: displayName, peerName: peerName }
	};
};

var addConsumer = exports.addConsumer = function addConsumer(consumer, peerName) {
	return {
		type: 'ADD_CONSUMER',
		payload: { consumer: consumer, peerName: peerName }
	};
};

var removeConsumer = exports.removeConsumer = function removeConsumer(consumerId, peerName) {
	return {
		type: 'REMOVE_CONSUMER',
		payload: { consumerId: consumerId, peerName: peerName }
	};
};

var setConsumerPaused = exports.setConsumerPaused = function setConsumerPaused(consumerId, originator) {
	return {
		type: 'SET_CONSUMER_PAUSED',
		payload: { consumerId: consumerId, originator: originator }
	};
};

var setConsumerResumed = exports.setConsumerResumed = function setConsumerResumed(consumerId, originator) {
	return {
		type: 'SET_CONSUMER_RESUMED',
		payload: { consumerId: consumerId, originator: originator }
	};
};

var setConsumerEffectiveProfile = exports.setConsumerEffectiveProfile = function setConsumerEffectiveProfile(consumerId, profile) {
	return {
		type: 'SET_CONSUMER_EFFECTIVE_PROFILE',
		payload: { consumerId: consumerId, profile: profile }
	};
};

var setConsumerTrack = exports.setConsumerTrack = function setConsumerTrack(consumerId, track) {
	return {
		type: 'SET_CONSUMER_TRACK',
		payload: { consumerId: consumerId, track: track }
	};
};

var addNotification = exports.addNotification = function addNotification(notification) {
	return {
		type: 'ADD_NOTIFICATION',
		payload: { notification: notification }
	};
};

var removeNotification = exports.removeNotification = function removeNotification(notificationId) {
	return {
		type: 'REMOVE_NOTIFICATION',
		payload: { notificationId: notificationId }
	};
};

var removeAllNotifications = exports.removeAllNotifications = function removeAllNotifications() {
	return {
		type: 'REMOVE_ALL_NOTIFICATIONS'
	};
};
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getProtooUrl = getProtooUrl;
function getProtooUrl(media_server_wss, peerName, roomId) {
	var hostname = window.location.hostname;
	// const url = `wss://${hostname}:3443/?peerName=${peerName}&roomId=${roomId}`;
	// const url = `wss://demo.mediasoup.org:3443/?peerName=${peerName}&roomId=${roomId}`;
	if (!media_server_wss) console.error("config.media_server_wss don't set.");
	var url = media_server_wss + ("/?peerName=" + peerName + "&roomId=" + roomId);

	return url;
}
},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.initialize = initialize;
exports.isDesktop = isDesktop;
exports.isMobile = isMobile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mediaQueryDetectorElem = void 0;

function initialize() {
	// Media query detector stuff.
	mediaQueryDetectorElem = document.getElementById('mediasoup-demo-app-media-query-detector');

	return _promise2.default.resolve();
}

function isDesktop() {
	return Boolean(mediaQueryDetectorElem.offsetParent);
}

function isMobile() {
	return !mediaQueryDetectorElem.offsetParent;
}
},{"babel-runtime/core-js/promise":46}],16:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":18}],17:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

}).call(this,require('_process'))
},{"../core/createError":24,"./../core/settle":27,"./../helpers/btoa":31,"./../helpers/buildURL":32,"./../helpers/cookies":34,"./../helpers/isURLSameOrigin":36,"./../helpers/parseHeaders":38,"./../utils":40,"_process":193}],18:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":19,"./cancel/CancelToken":20,"./cancel/isCancel":21,"./core/Axios":22,"./defaults":29,"./helpers/bind":30,"./helpers/spread":39,"./utils":40}],19:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],20:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":19}],21:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],22:[function(require,module,exports){
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":29,"./../utils":40,"./InterceptorManager":23,"./dispatchRequest":25}],23:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":40}],24:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":26}],25:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":21,"../defaults":29,"./../helpers/combineURLs":33,"./../helpers/isAbsoluteURL":35,"./../utils":40,"./transformData":28}],26:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],27:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":24}],28:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":40}],29:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":17,"./adapters/xhr":17,"./helpers/normalizeHeaderName":37,"./utils":40,"_process":193}],30:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],31:[function(require,module,exports){
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],32:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":40}],33:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],34:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":40}],35:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],36:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":40}],37:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":40}],38:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":40}],39:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],40:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":30,"is-buffer":154}],41:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":53}],42:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":54}],43:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":55}],44:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":56}],45:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":57}],46:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":58}],47:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],48:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":45}],49:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
},{"../core-js/object/define-property":45}],50:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
},{"../core-js/object/assign":44}],51:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":41}],52:[function(require,module,exports){
/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */

!function (root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else root[name] = definition()
}(this, 'bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
      , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
      , chromeos = /CrOS/.test(ua)
      , silk = /silk/i.test(ua)
      , sailfish = /sailfish/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webos = /(web|hpw)os/i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , samsungBrowser = /SamsungBrowser/i.test(ua)
      , windows = !windowsphone && /windows/i.test(ua)
      , mac = !iosdevice && !silk && /macintosh/i.test(ua)
      , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
      , edgeVersion = getSecondMatch(/edg([ea]|ios)\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua) && !/tablet pc/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , xbox = /xbox/i.test(ua)
      , result

    if (/opera/i.test(ua)) {
      //  an old Opera
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/opr\/|opios/i.test(ua)) {
      // a new Opera
      result = {
        name: 'Opera'
        , opera: t
        , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/SamsungBrowser/i.test(ua)) {
      result = {
        name: 'Samsung Internet for Android'
        , samsungBrowser: t
        , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/coast/i.test(ua)) {
      result = {
        name: 'Opera Coast'
        , coast: t
        , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/ucbrowser/i.test(ua)) {
      result = {
          name: 'UC Browser'
        , ucbrowser: t
        , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/mxios/i.test(ua)) {
      result = {
        name: 'Maxthon'
        , maxthon: t
        , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/epiphany/i.test(ua)) {
      result = {
        name: 'Epiphany'
        , epiphany: t
        , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/puffin/i.test(ua)) {
      result = {
        name: 'Puffin'
        , puffin: t
        , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
      }
    }
    else if (/sleipnir/i.test(ua)) {
      result = {
        name: 'Sleipnir'
        , sleipnir: t
        , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/k-meleon/i.test(ua)) {
      result = {
        name: 'K-Meleon'
        , kMeleon: t
        , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (windowsphone) {
      result = {
        name: 'Windows Phone'
      , osname: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeos) {
      result = {
        name: 'Chrome'
      , osname: 'Chrome OS'
      , chromeos: t
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/edg([ea]|ios)/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/vivaldi/i.test(ua)) {
      result = {
        name: 'Vivaldi'
        , vivaldi: t
        , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (sailfish) {
      result = {
        name: 'Sailfish'
      , osname: 'Sailfish OS'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel|fxios/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
        result.osname = 'Firefox OS'
      }
    }
    else if (silk) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/slimerjs/i.test(ua)) {
      result = {
        name: 'SlimerJS'
        , slimer: t
        , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , osname: 'BlackBerry OS'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (webos) {
      result = {
        name: 'WebOS'
      , osname: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , osname: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (tizen) {
      result = {
        name: 'Tizen'
      , osname: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/qupzilla/i.test(ua)) {
      result = {
        name: 'QupZilla'
        , qupzilla: t
        , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
      }
    }
    else if (/chromium/i.test(ua)) {
      result = {
        name: 'Chromium'
        , chromium: t
        , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
        , chrome: t
        , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
        , version: versionIdentifier
      }
    }
    else if (/safari|applewebkit/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      }
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if(/googlebot/i.test(ua)) {
      result = {
        name: 'Googlebot'
      , googlebot: t
      , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      if (/(apple)?webkit\/537\.36/i.test(ua)) {
        result.name = result.name || "Blink"
        result.blink = t
      } else {
        result.name = result.name || "Webkit"
        result.webkit = t
      }
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.windowsphone && (android || result.silk)) {
      result.android = t
      result.osname = 'Android'
    } else if (!result.windowsphone && iosdevice) {
      result[iosdevice] = t
      result.ios = t
      result.osname = 'iOS'
    } else if (mac) {
      result.mac = t
      result.osname = 'macOS'
    } else if (xbox) {
      result.xbox = t
      result.osname = 'Xbox'
    } else if (windows) {
      result.windows = t
      result.osname = 'Windows'
    } else if (linux) {
      result.linux = t
      result.osname = 'Linux'
    }

    function getWindowsVersion (s) {
      switch (s) {
        case 'NT': return 'NT'
        case 'XP': return 'XP'
        case 'NT 5.0': return '2000'
        case 'NT 5.1': return 'XP'
        case 'NT 5.2': return '2003'
        case 'NT 6.0': return 'Vista'
        case 'NT 6.1': return '7'
        case 'NT 6.2': return '8'
        case 'NT 6.3': return '8.1'
        case 'NT 10.0': return '10'
        default: return undefined
      }
    }

    // OS version extraction
    var osVersion = '';
    if (result.windows) {
      osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i))
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.mac) {
      osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = !result.windows && osVersion.split('.')[0];
    if (
         tablet
      || nexusTablet
      || iosdevice == 'ipad'
      || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
      || result.silk
    ) {
      result.tablet = t
    } else if (
         mobile
      || iosdevice == 'iphone'
      || iosdevice == 'ipod'
      || android
      || nexusMobile
      || result.blackberry
      || result.webos
      || result.bada
    ) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
		    (result.vivaldi && result.version >= 1.0) ||
        (result.chrome && result.version >= 20) ||
        (result.samsungBrowser && result.version >= 4) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        || (result.chromium && result.version >= 20)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        || (result.chromium && result.version < 20)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  function getVersionPrecision(version) {
    return version.split(".").length;
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  function map(arr, iterator) {
    var result = [], i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i++) {
      result.push(iterator(arr[i]));
    }
    return result;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param  {Array<String>} versions versions to compare
   * @return {Number} comparison result
   */
  function compareVersions(versions) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    var precision = Math.max(getVersionPrecision(versions[0]), getVersionPrecision(versions[1]));
    var chunks = map(versions, function (version) {
      var delta = precision - getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      version = version + new Array(delta + 1).join(".0");

      // 3) "9.0" -> ["000000000"", "000000009"]
      return map(version.split("."), function (chunk) {
        return new Array(20 - chunk.length).join("0") + chunk;
      }).reverse();
    });

    // iterate in reverse order by reversed chunks array
    while (--precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      }
      else {
        return -1;
      }
    }
  }

  /**
   * Check if browser is unsupported
   *
   * @example
   *   bowser.isUnsupportedBrowser({
   *     msie: "10",
   *     firefox: "23",
   *     chrome: "29",
   *     safari: "5.1",
   *     opera: "16",
   *     phantom: "534"
   *   });
   *
   * @param  {Object}  minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function isUnsupportedBrowser(minVersions, strictMode, ua) {
    var _bowser = bowser;

    // make strictMode param optional with ua param usage
    if (typeof strictMode === 'string') {
      ua = strictMode;
      strictMode = void(0);
    }

    if (strictMode === void(0)) {
      strictMode = false;
    }
    if (ua) {
      _bowser = detect(ua);
    }

    var version = "" + _bowser.version;
    for (var browser in minVersions) {
      if (minVersions.hasOwnProperty(browser)) {
        if (_bowser[browser]) {
          if (typeof minVersions[browser] !== 'string') {
            throw new Error('Browser version in the minVersion map should be a string: ' + browser + ': ' + String(minVersions));
          }

          // browser version and min supported version.
          return compareVersions([version, minVersions[browser]]) < 0;
        }
      }
    }

    return strictMode; // not found
  }

  /**
   * Check if browser is supported
   *
   * @param  {Object} minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function check(minVersions, strictMode, ua) {
    return !isUnsupportedBrowser(minVersions, strictMode, ua);
  }

  bowser.isUnsupportedBrowser = isUnsupportedBrowser;
  bowser.compareVersions = compareVersions;
  bowser.check = check;

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  /*
   * Set our detect public method to the main bowser object
   * This is needed to implement bowser in server side
   */
  bowser.detect = detect;
  return bowser
});

},{}],53:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":73,"../../modules/es6.array.from":137,"../../modules/es6.string.iterator":144}],54:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/core.get-iterator":136,"../modules/es6.string.iterator":144,"../modules/web.dom.iterable":150}],55:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
require('../modules/es7.map.of');
require('../modules/es7.map.from');
module.exports = require('../modules/_core').Map;

},{"../modules/_core":73,"../modules/es6.map":139,"../modules/es6.object.to-string":142,"../modules/es6.string.iterator":144,"../modules/es7.map.from":145,"../modules/es7.map.of":146,"../modules/es7.map.to-json":147,"../modules/web.dom.iterable":150}],56:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":73,"../../modules/es6.object.assign":140}],57:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":73,"../../modules/es6.object.define-property":141}],58:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
require('../modules/es7.promise.finally');
require('../modules/es7.promise.try');
module.exports = require('../modules/_core').Promise;

},{"../modules/_core":73,"../modules/es6.object.to-string":142,"../modules/es6.promise":143,"../modules/es6.string.iterator":144,"../modules/es7.promise.finally":148,"../modules/es7.promise.try":149,"../modules/web.dom.iterable":150}],59:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],60:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],61:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],62:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":92}],63:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":82}],64:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":126,"./_to-iobject":128,"./_to-length":129}],65:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":67,"./_ctx":75,"./_iobject":89,"./_to-length":129,"./_to-object":130}],66:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":91,"./_is-object":92,"./_wks":134}],67:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":66}],68:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":69,"./_wks":134}],69:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],70:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":61,"./_ctx":75,"./_descriptors":77,"./_for-of":82,"./_iter-define":95,"./_iter-step":97,"./_meta":100,"./_object-create":104,"./_object-dp":105,"./_redefine-all":115,"./_set-species":119,"./_validate-collection":133}],71:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":63,"./_classof":68}],72:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var meta = require('./_meta');
var fails = require('./_fails');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var setToStringTag = require('./_set-to-string-tag');
var dP = require('./_object-dp').f;
var each = require('./_array-methods')(0);
var DESCRIPTORS = require('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":61,"./_array-methods":65,"./_descriptors":77,"./_export":80,"./_fails":81,"./_for-of":82,"./_global":83,"./_hide":85,"./_is-object":92,"./_meta":100,"./_object-dp":105,"./_redefine-all":115,"./_set-to-string-tag":120}],73:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],74:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":105,"./_property-desc":114}],75:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":59}],76:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],77:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":81}],78:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":83,"./_is-object":92}],79:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],80:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":73,"./_ctx":75,"./_global":83,"./_hide":85}],81:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],82:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":62,"./_ctx":75,"./_is-array-iter":90,"./_iter-call":93,"./_to-length":129,"./core.get-iterator-method":135}],83:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],84:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],85:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":77,"./_object-dp":105,"./_property-desc":114}],86:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":83}],87:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":77,"./_dom-create":78,"./_fails":81}],88:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],89:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":69}],90:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":98,"./_wks":134}],91:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":69}],92:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],93:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":62}],94:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":85,"./_object-create":104,"./_property-desc":114,"./_set-to-string-tag":120,"./_wks":134}],95:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":80,"./_has":84,"./_hide":85,"./_iter-create":94,"./_iterators":98,"./_library":99,"./_object-gpo":108,"./_redefine":116,"./_set-to-string-tag":120,"./_wks":134}],96:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":134}],97:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],98:[function(require,module,exports){
module.exports = {};

},{}],99:[function(require,module,exports){
module.exports = true;

},{}],100:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":81,"./_has":84,"./_is-object":92,"./_object-dp":105,"./_uid":132}],101:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":69,"./_global":83,"./_task":125}],102:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":59}],103:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":81,"./_iobject":89,"./_object-gops":107,"./_object-keys":110,"./_object-pie":111,"./_to-object":130}],104:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":62,"./_dom-create":78,"./_enum-bug-keys":79,"./_html":86,"./_object-dps":106,"./_shared-key":121}],105:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":62,"./_descriptors":77,"./_ie8-dom-define":87,"./_to-primitive":131}],106:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":62,"./_descriptors":77,"./_object-dp":105,"./_object-keys":110}],107:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],108:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":84,"./_shared-key":121,"./_to-object":130}],109:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":64,"./_has":84,"./_shared-key":121,"./_to-iobject":128}],110:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":79,"./_object-keys-internal":109}],111:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],112:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],113:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":62,"./_is-object":92,"./_new-promise-capability":102}],114:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],115:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":85}],116:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":85}],117:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":59,"./_ctx":75,"./_export":80,"./_for-of":82}],118:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":80}],119:[function(require,module,exports){
'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":73,"./_descriptors":77,"./_global":83,"./_object-dp":105,"./_wks":134}],120:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":84,"./_object-dp":105,"./_wks":134}],121:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":122,"./_uid":132}],122:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":83}],123:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":59,"./_an-object":62,"./_wks":134}],124:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":76,"./_to-integer":127}],125:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":69,"./_ctx":75,"./_dom-create":78,"./_global":83,"./_html":86,"./_invoke":88}],126:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":127}],127:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],128:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":76,"./_iobject":89}],129:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":127}],130:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":76}],131:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":92}],132:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],133:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":92}],134:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":83,"./_shared":122,"./_uid":132}],135:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":68,"./_core":73,"./_iterators":98,"./_wks":134}],136:[function(require,module,exports){
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":62,"./_core":73,"./core.get-iterator-method":135}],137:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":74,"./_ctx":75,"./_export":80,"./_is-array-iter":90,"./_iter-call":93,"./_iter-detect":96,"./_to-length":129,"./_to-object":130,"./core.get-iterator-method":135}],138:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":60,"./_iter-define":95,"./_iter-step":97,"./_iterators":98,"./_to-iobject":128}],139:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":72,"./_collection-strong":70,"./_validate-collection":133}],140:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":80,"./_object-assign":103}],141:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":77,"./_export":80,"./_object-dp":105}],142:[function(require,module,exports){

},{}],143:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":59,"./_an-instance":61,"./_classof":68,"./_core":73,"./_ctx":75,"./_export":80,"./_for-of":82,"./_global":83,"./_is-object":92,"./_iter-detect":96,"./_library":99,"./_microtask":101,"./_new-promise-capability":102,"./_perform":112,"./_promise-resolve":113,"./_redefine-all":115,"./_set-species":119,"./_set-to-string-tag":120,"./_species-constructor":123,"./_task":125,"./_wks":134}],144:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":95,"./_string-at":124}],145:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":117}],146:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":118}],147:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":71,"./_export":80}],148:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":73,"./_export":80,"./_global":83,"./_promise-resolve":113,"./_species-constructor":123}],149:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":80,"./_new-promise-capability":102,"./_perform":112}],150:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":83,"./_hide":85,"./_iterators":98,"./_wks":134,"./es6.array.iterator":138}],151:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))
},{"./debug":152,"_process":193}],152:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":191}],153:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],154:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],155:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":162}],156:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":155,"./_getRawTag":159,"./_objectToString":160}],157:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],158:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":161}],159:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":155}],160:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],161:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],162:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":157}],163:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],164:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":156,"./_getPrototype":158,"./isObjectLike":163}],165:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('CommandQueue');

var CommandQueue = function (_EventEmitter) {
	_inherits(CommandQueue, _EventEmitter);

	function CommandQueue() {
		_classCallCheck(this, CommandQueue);

		var _this = _possibleConstructorReturn(this, (CommandQueue.__proto__ || Object.getPrototypeOf(CommandQueue)).call(this));

		_this.setMaxListeners(Infinity);

		// Closed flag.
		// @type {Boolean}
		_this._closed = false;

		// Busy running a command.
		// @type {Boolean}
		_this._busy = false;

		// Queue for pending commands. Each command is an Object with method,
		// resolve, reject, and other members (depending the case).
		// @type {Array<Object>}
		_this._queue = [];
		return _this;
	}

	_createClass(CommandQueue, [{
		key: 'close',
		value: function close() {
			this._closed = true;
		}
	}, {
		key: 'push',
		value: function push(method, data) {
			var _this2 = this;

			var command = Object.assign({ method: method }, data);

			logger.debug('push() [method:%s]', method);

			return new Promise(function (resolve, reject) {
				var queue = _this2._queue;

				command.resolve = resolve;
				command.reject = reject;

				// Append command to the queue.
				queue.push(command);
				_this2._handlePendingCommands();
			});
		}
	}, {
		key: '_handlePendingCommands',
		value: function _handlePendingCommands() {
			var _this3 = this;

			if (this._busy) return;

			var queue = this._queue;

			// Take the first command.
			var command = queue[0];

			if (!command) return;

			this._busy = true;

			// Execute it.
			this._handleCommand(command).then(function () {
				_this3._busy = false;

				// Remove the first command (the completed one) from the queue.
				queue.shift();

				// And continue.
				_this3._handlePendingCommands();
			});
		}
	}, {
		key: '_handleCommand',
		value: function _handleCommand(command) {
			var _this4 = this;

			logger.debug('_handleCommand() [method:%s]', command.method);

			if (this._closed) {
				command.reject(new _errors.InvalidStateError('closed'));

				return Promise.resolve();
			}

			var promiseHolder = { promise: null };

			this.emit('exec', command, promiseHolder);

			return Promise.resolve().then(function () {
				return promiseHolder.promise;
			}).then(function (result) {
				logger.debug('_handleCommand() | command succeeded [method:%s]', command.method);

				if (_this4._closed) {
					command.reject(new _errors.InvalidStateError('closed'));

					return;
				}

				// Resolve the command with the given result (if any).
				command.resolve(result);
			}).catch(function (error) {
				logger.error('_handleCommand() | command failed [method:%s]: %o', command.method, error);

				// Reject the command with the error.
				command.reject(error);
			});
		}
	}]);

	return CommandQueue;
}(_events.EventEmitter);

exports.default = CommandQueue;
},{"./Logger":169,"./errors":174,"events":153}],166:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('./EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PROFILES = new Set(['default', 'low', 'medium', 'high']);
var DEFAULT_STATS_INTERVAL = 1000;

var logger = new _Logger2.default('Consumer');

var Consumer = function (_EnhancedEventEmitter) {
	_inherits(Consumer, _EnhancedEventEmitter);

	/**
  * @private
  *
  * @emits {originator: String, [appData]: Any} pause
  * @emits {originator: String, [appData]: Any} resume
  * @emits {profile: String} effectiveprofilechange
  * @emits {stats: Object} stats
  * @emits handled
  * @emits unhandled
  * @emits {originator: String} close
  *
  * @emits @close
  */
	function Consumer(id, kind, rtpParameters, peer, appData) {
		_classCallCheck(this, Consumer);

		// Id.
		// @type {Number}
		var _this = _possibleConstructorReturn(this, (Consumer.__proto__ || Object.getPrototypeOf(Consumer)).call(this, logger));

		_this._id = id;

		// Closed flag.
		// @type {Boolean}
		_this._closed = false;

		// Media kind.
		// @type {String}
		_this._kind = kind;

		// RTP parameters.
		// @type {RTCRtpParameters}
		_this._rtpParameters = rtpParameters;

		// Associated Peer.
		// @type {Peer}
		_this._peer = peer;

		// App custom data.
		// @type {Any}
		_this._appData = appData;

		// Whether we can receive this Consumer (based on our RTP capabilities).
		// @type {Boolean}
		_this._supported = false;

		// Associated Transport.
		// @type {Transport}
		_this._transport = null;

		// Remote track.
		// @type {MediaStreamTrack}
		_this._track = null;

		// Locally paused flag.
		// @type {Boolean}
		_this._locallyPaused = false;

		// Remotely paused flag.
		// @type {Boolean}
		_this._remotelyPaused = false;

		// Periodic stats flag.
		// @type {Boolean}
		_this._statsEnabled = false;

		// Periodic stats gathering interval (milliseconds).
		// @type {Number}
		_this._statsInterval = DEFAULT_STATS_INTERVAL;

		// Preferred profile.
		// @type {String}
		_this._preferredProfile = 'default';

		// Effective profile.
		// @type {String}
		_this._effectiveProfile = null;
		return _this;
	}

	/**
  * Consumer id.
  *
  * @return {Number}
  */


	_createClass(Consumer, [{
		key: 'close',


		/**
   * Closes the Consumer.
   * This is called when the local Room is closed.
   *
   * @private
   */
		value: function close() {
			logger.debug('close()');

			if (this._closed) return;

			this._closed = true;

			if (this._statsEnabled) {
				this._statsEnabled = false;

				if (this.transport) this.transport.disableConsumerStats(this);
			}

			this.emit('@close');
			this.safeEmit('close', 'local');

			this._destroy();
		}

		/**
   * My remote Consumer was closed.
   * Invoked via remote notification.
   *
   * @private
   */

	}, {
		key: 'remoteClose',
		value: function remoteClose() {
			logger.debug('remoteClose()');

			if (this._closed) return;

			this._closed = true;

			if (this._transport) this._transport.removeConsumer(this);

			this._destroy();

			this.emit('@close');
			this.safeEmit('close', 'remote');
		}
	}, {
		key: '_destroy',
		value: function _destroy() {
			this._transport = null;

			try {
				this._track.stop();
			} catch (error) {}

			this._track = null;
		}

		/**
   * Receives RTP.
   *
   * @param {transport} Transport instance.
   *
   * @return {Promise} Resolves with a remote MediaStreamTrack.
   */

	}, {
		key: 'receive',
		value: function receive(transport) {
			var _this2 = this;

			logger.debug('receive() [transport:%o]', transport);

			if (this._closed) return Promise.reject(new _errors.InvalidStateError('Consumer closed'));else if (!this._supported) return Promise.reject(new Error('unsupported codecs'));else if (this._transport) return Promise.reject(new Error('already handled by a Transport'));else if ((typeof transport === 'undefined' ? 'undefined' : _typeof(transport)) !== 'object') return Promise.reject(new TypeError('invalid Transport'));

			this._transport = transport;

			return transport.addConsumer(this).then(function (track) {
				_this2._track = track;

				// If we were paused, disable the track.
				if (_this2.paused) track.enabled = false;

				transport.once('@close', function () {
					if (_this2._closed || _this2._transport !== transport) return;

					_this2._transport = null;

					try {
						_this2._track.stop();
					} catch (error) {}

					_this2._track = null;

					_this2.safeEmit('unhandled');
				});

				_this2.safeEmit('handled');

				if (_this2._statsEnabled) transport.enableConsumerStats(_this2, _this2._statsInterval);

				return track;
			}).catch(function (error) {
				_this2._transport = null;

				throw error;
			});
		}

		/**
   * Pauses receiving media.
   *
   * @param {Any} [appData] - App custom data.
   *
   * @return {Boolean} true if paused.
   */

	}, {
		key: 'pause',
		value: function pause(appData) {
			logger.debug('pause()');

			if (this._closed) {
				logger.error('pause() | Consumer closed');

				return false;
			} else if (this._locallyPaused) {
				return true;
			}

			this._locallyPaused = true;

			if (this._track) this._track.enabled = false;

			if (this._transport) this._transport.pauseConsumer(this, appData);

			this.safeEmit('pause', 'local', appData);

			// Return true if really paused.
			return this.paused;
		}

		/**
   * My remote Consumer was paused.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remotePause',
		value: function remotePause(appData) {
			logger.debug('remotePause()');

			if (this._closed || this._remotelyPaused) return;

			this._remotelyPaused = true;

			if (this._track) this._track.enabled = false;

			this.safeEmit('pause', 'remote', appData);
		}

		/**
   * Resumes receiving media.
   *
   * @param {Any} [appData] - App custom data.
   *
   * @return {Boolean} true if not paused.
   */

	}, {
		key: 'resume',
		value: function resume(appData) {
			logger.debug('resume()');

			if (this._closed) {
				logger.error('resume() | Consumer closed');

				return false;
			} else if (!this._locallyPaused) {
				return true;
			}

			this._locallyPaused = false;

			if (this._track && !this._remotelyPaused) this._track.enabled = true;

			if (this._transport) this._transport.resumeConsumer(this, appData);

			this.safeEmit('resume', 'local', appData);

			// Return true if not paused.
			return !this.paused;
		}

		/**
   * My remote Consumer was resumed.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remoteResume',
		value: function remoteResume(appData) {
			logger.debug('remoteResume()');

			if (this._closed || !this._remotelyPaused) return;

			this._remotelyPaused = false;

			if (this._track && !this._locallyPaused) this._track.enabled = true;

			this.safeEmit('resume', 'remote', appData);
		}

		/**
   * Set preferred receiving profile.
   *
   * @param {String} profile
   */

	}, {
		key: 'setPreferredProfile',
		value: function setPreferredProfile(profile) {
			logger.debug('setPreferredProfile() [profile:%s]', profile);

			if (this._closed) {
				logger.error('setPreferredProfile() | Consumer closed');

				return;
			} else if (profile === this._preferredProfile) {
				return;
			} else if (!PROFILES.has(profile)) {
				logger.error('setPreferredProfile() | invalid profile "%s"', profile);

				return;
			}

			this._preferredProfile = profile;

			if (this._transport) this._transport.setConsumerPreferredProfile(this, this._preferredProfile);
		}

		/**
   * Preferred receiving profile was set on my remote Consumer.
   *
   * @param {String} profile
   */

	}, {
		key: 'remoteSetPreferredProfile',
		value: function remoteSetPreferredProfile(profile) {
			logger.debug('remoteSetPreferredProfile() [profile:%s]', profile);

			if (this._closed || profile === this._preferredProfile) return;

			this._preferredProfile = profile;
		}

		/**
   * Effective receiving profile changed on my remote Consumer.
   *
   * @param {String} profile
   */

	}, {
		key: 'remoteEffectiveProfileChanged',
		value: function remoteEffectiveProfileChanged(profile) {
			logger.debug('remoteEffectiveProfileChanged() [profile:%s]', profile);

			if (this._closed || profile === this._effectiveProfile) return;

			this._effectiveProfile = profile;

			this.safeEmit('effectiveprofilechange', this._effectiveProfile);
		}

		/**
   * Enables periodic stats retrieval.
   */

	}, {
		key: 'enableStats',
		value: function enableStats() {
			var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATS_INTERVAL;

			logger.debug('enableStats() [interval:%s]', interval);

			if (this._closed) {
				logger.error('enableStats() | Consumer closed');

				return;
			}

			if (this._statsEnabled) return;

			if (typeof interval !== 'number' || interval < 1000) this._statsInterval = DEFAULT_STATS_INTERVAL;else this._statsInterval = interval;

			this._statsEnabled = true;

			if (this._transport) this._transport.enableConsumerStats(this, this._statsInterval);
		}

		/**
   * Disables periodic stats retrieval.
   */

	}, {
		key: 'disableStats',
		value: function disableStats() {
			logger.debug('disableStats()');

			if (this._closed) {
				logger.error('disableStats() | Consumer closed');

				return;
			}

			if (!this._statsEnabled) return;

			this._statsEnabled = false;

			if (this._transport) this._transport.disableConsumerStats(this);
		}

		/**
   * Mark this Consumer as suitable for reception or not.
   *
   * @private
   *
   * @param {Boolean} flag
   */

	}, {
		key: 'setSupported',
		value: function setSupported(flag) {
			this._supported = flag;
		}

		/**
   * Receive remote stats.
   *
   * @private
   *
   * @param {Object} stats
   */

	}, {
		key: 'remoteStats',
		value: function remoteStats(stats) {
			this.safeEmit('stats', stats);
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}

		/**
   * Whether the Consumer is closed.
   *
   * @return {Boolean}
   */

	}, {
		key: 'closed',
		get: function get() {
			return this._closed;
		}

		/**
   * Media kind.
   *
   * @return {String}
   */

	}, {
		key: 'kind',
		get: function get() {
			return this._kind;
		}

		/**
   * RTP parameters.
   *
   * @return {RTCRtpParameters}
   */

	}, {
		key: 'rtpParameters',
		get: function get() {
			return this._rtpParameters;
		}

		/**
   * Associated Peer.
   *
   * @return {Peer}
   */

	}, {
		key: 'peer',
		get: function get() {
			return this._peer;
		}

		/**
   * App custom data.
   *
   * @return {Any}
   */

	}, {
		key: 'appData',
		get: function get() {
			return this._appData;
		}

		/**
   * Whether we can receive this Consumer (based on our RTP capabilities).
   *
   * @return {Boolean}
   */

	}, {
		key: 'supported',
		get: function get() {
			return this._supported;
		}

		/**
   * Associated Transport.
   *
   * @return {Transport}
   */

	}, {
		key: 'transport',
		get: function get() {
			return this._transport;
		}

		/**
   * The associated track (if any yet).
   *
   * @return {MediaStreamTrack|Null}
   */

	}, {
		key: 'track',
		get: function get() {
			return this._track;
		}

		/**
   * Whether the Consumer is locally paused.
   *
   * @return {Boolean}
   */

	}, {
		key: 'locallyPaused',
		get: function get() {
			return this._locallyPaused;
		}

		/**
   * Whether the Consumer is remotely paused.
   *
   * @return {Boolean}
   */

	}, {
		key: 'remotelyPaused',
		get: function get() {
			return this._remotelyPaused;
		}

		/**
   * Whether the Consumer is paused.
   *
   * @return {Boolean}
   */

	}, {
		key: 'paused',
		get: function get() {
			return this._locallyPaused || this._remotelyPaused;
		}

		/**
   * The preferred profile.
   *
   * @type {String}
   */

	}, {
		key: 'preferredProfile',
		get: function get() {
			return this._preferredProfile;
		}

		/**
   * The effective profile.
   *
   * @type {String}
   */

	}, {
		key: 'effectiveProfile',
		get: function get() {
			return this._effectiveProfile;
		}
	}]);

	return Consumer;
}(_EnhancedEventEmitter3.default);

exports.default = Consumer;
},{"./EnhancedEventEmitter":168,"./Logger":169,"./errors":174}],167:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bowser = require('bowser');

var _bowser2 = _interopRequireDefault(_bowser);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Chrome = require('./handlers/Chrome55');

var _Chrome2 = _interopRequireDefault(_Chrome);

var _Chrome3 = require('./handlers/Chrome67');

var _Chrome4 = _interopRequireDefault(_Chrome3);

var _Safari = require('./handlers/Safari11');

var _Safari2 = _interopRequireDefault(_Safari);

var _Firefox = require('./handlers/Firefox50');

var _Firefox2 = _interopRequireDefault(_Firefox);

var _Firefox3 = require('./handlers/Firefox59');

var _Firefox4 = _interopRequireDefault(_Firefox3);

var _Edge = require('./handlers/Edge11');

var _Edge2 = _interopRequireDefault(_Edge);

var _ReactNative = require('./handlers/ReactNative');

var _ReactNative2 = _interopRequireDefault(_ReactNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = new _Logger2.default('Device');

/**
 * Class with static members representing the underlying device or browser.
 */

var Device = function () {
	function Device() {
		_classCallCheck(this, Device);
	}

	_createClass(Device, null, [{
		key: 'getFlag',

		/**
   * Get the device flag.
   *
   * @return {String}
   */
		value: function getFlag() {
			if (!Device._detected) Device._detect();

			return Device._flag;
		}

		/**
   * Get the device name.
   *
   * @return {String}
   */

	}, {
		key: 'getName',
		value: function getName() {
			if (!Device._detected) Device._detect();

			return Device._name;
		}

		/**
   * Get the device version.
   *
   * @return {String}
   */

	}, {
		key: 'getVersion',
		value: function getVersion() {
			if (!Device._detected) Device._detect();

			return Device._version;
		}

		/**
   * Get the bowser module Object.
   *
   * @return {Object}
   */

	}, {
		key: 'getBowser',
		value: function getBowser() {
			if (!Device._detected) Device._detect();

			return Device._bowser;
		}

		/**
   * Whether this device is supported.
   *
   * @return {Boolean}
   */

	}, {
		key: 'isSupported',
		value: function isSupported() {
			if (!Device._detected) Device._detect();

			return Boolean(Device._handlerClass);
		}

		/**
   * Returns a suitable WebRTC handler class.
   *
   * @type {Class}
   */

	}, {
		key: '_detect',


		/**
   * Detects the current device/browser.
   *
   * @private
   */
		value: function _detect() {
			Device._detected = true;

			// If this is React-Native manually fill data.
			if (global.navigator && global.navigator.product === 'ReactNative') {
				Device._flag = 'react-native';
				Device._name = 'ReactNative';
				Device._version = undefined; // NOTE: No idea how to know it.
				Device._bowser = {};
				Device._handlerClass = _ReactNative2.default;
			}
			// If this is a browser use bowser module detection.
			else if (global.navigator && typeof global.navigator.userAgent === 'string') {
					var ua = global.navigator.userAgent;
					var browser = _bowser2.default.detect(ua);

					Device._flag = undefined;
					Device._name = browser.name || undefined;
					Device._version = browser.version || undefined;
					Device._bowser = browser;
					Device._handlerClass = null;

					// Chrome, Chromium (desktop and mobile).
					if (_bowser2.default.check({ chrome: '67', chromium: '67' }, true, ua)) {
						Device._flag = 'chrome';
						Device._handlerClass = _Chrome4.default;
					} else if (_bowser2.default.check({ chrome: '55', chromium: '55' }, true, ua)) {
						Device._flag = 'chrome';
						Device._handlerClass = _Chrome2.default;
					}
					// Firefox (desktop and mobile).
					else if (_bowser2.default.check({ firefox: '59' }, true, ua)) {
							Device._flag = 'firefox';
							Device._handlerClass = _Firefox4.default;
						} else if (_bowser2.default.check({ firefox: '50' }, true, ua)) {
							Device._flag = 'firefox';
							Device._handlerClass = _Firefox2.default;
						}
						// Safari (desktop and mobile).
						else if (_bowser2.default.check({ safari: '11' }, true, ua)) {
								Device._flag = 'safari';
								Device._handlerClass = _Safari2.default;
							}
							// Edge (desktop).
							else if (_bowser2.default.check({ msedge: '11' }, true, ua)) {
									Device._flag = 'msedge';
									Device._handlerClass = _Edge2.default;
								}
					// Opera (desktop and mobile).
					if (_bowser2.default.check({ opera: '44' }, true, ua)) {
						Device._flag = 'opera';
						Device._handlerClass = _Chrome2.default;
					}

					if (Device.isSupported()) {
						logger.debug('browser supported [flag:%s, name:"%s", version:%s, handler:%s]', Device._flag, Device._name, Device._version, Device._handlerClass.tag);
					} else {
						logger.warn('browser not supported [name:%s, version:%s]', Device._name, Device._version);
					}
				}
				// Otherwise fail.
				else {
						logger.warn('device not supported');
					}
		}
	}, {
		key: 'Handler',
		get: function get() {
			if (!Device._detected) Device._detect();

			return Device._handlerClass;
		}
	}]);

	return Device;
}();

// Initialized flag.
// @type {Boolean}


exports.default = Device;
Device._detected = false;

// Device flag.
// @type {String}
Device._flag = undefined;

// Device name.
// @type {String}
Device._name = undefined;

// Device version.
// @type {String}
Device._version = undefined;

// bowser module Object.
// @type {Object}
Device._bowser = undefined;

// WebRTC hander for this device.
// @type {Class}
Device._handlerClass = null;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Logger":169,"./handlers/Chrome55":175,"./handlers/Chrome67":176,"./handlers/Edge11":177,"./handlers/Firefox50":178,"./handlers/Firefox59":179,"./handlers/ReactNative":180,"./handlers/Safari11":181,"bowser":52}],168:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnhancedEventEmitter = function (_EventEmitter) {
	_inherits(EnhancedEventEmitter, _EventEmitter);

	function EnhancedEventEmitter(logger) {
		_classCallCheck(this, EnhancedEventEmitter);

		var _this = _possibleConstructorReturn(this, (EnhancedEventEmitter.__proto__ || Object.getPrototypeOf(EnhancedEventEmitter)).call(this));

		_this.setMaxListeners(Infinity);

		_this._logger = logger || new _Logger2.default('EnhancedEventEmitter');
		return _this;
	}

	_createClass(EnhancedEventEmitter, [{
		key: 'safeEmit',
		value: function safeEmit(event) {
			try {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				this.emit.apply(this, [event].concat(args));
			} catch (error) {
				this._logger.error('safeEmit() | event listener threw an error [event:%s]:%o', event, error);
			}
		}
	}, {
		key: 'safeEmitAsPromise',
		value: function safeEmitAsPromise(event) {
			var _this2 = this;

			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			return new Promise(function (resolve, reject) {
				var callback = function callback(result) {
					resolve(result);
				};

				var errback = function errback(error) {
					_this2._logger.error('safeEmitAsPromise() | errback called [event:%s]:%o', event, error);

					reject(error);
				};

				_this2.safeEmit.apply(_this2, [event].concat(args, [callback, errback]));
			});
		}
	}]);

	return EnhancedEventEmitter;
}(_events.EventEmitter);

exports.default = EnhancedEventEmitter;
},{"./Logger":169,"events":153}],169:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var APP_NAME = 'mediasoup-client';

var Logger = function () {
	function Logger(prefix) {
		_classCallCheck(this, Logger);

		if (prefix) {
			this._debug = (0, _debug2.default)(APP_NAME + ':' + prefix);
			this._warn = (0, _debug2.default)(APP_NAME + ':WARN:' + prefix);
			this._error = (0, _debug2.default)(APP_NAME + ':ERROR:' + prefix);
		} else {
			this._debug = (0, _debug2.default)(APP_NAME);
			this._warn = (0, _debug2.default)(APP_NAME + ':WARN');
			this._error = (0, _debug2.default)(APP_NAME + ':ERROR');
		}

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}

	_createClass(Logger, [{
		key: 'debug',
		get: function get() {
			return this._debug;
		}
	}, {
		key: 'warn',
		get: function get() {
			return this._warn;
		}
	}, {
		key: 'error',
		get: function get() {
			return this._error;
		}
	}]);

	return Logger;
}();

exports.default = Logger;
},{"debug":151}],170:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('./EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Peer');

var Peer = function (_EnhancedEventEmitter) {
	_inherits(Peer, _EnhancedEventEmitter);

	/**
  * @private
  *
  * @emits {consumer: Consumer} newconsumer
  * @emits {originator: String, [appData]: Any} close
  *
  * @emits @close
  */
	function Peer(name, appData) {
		_classCallCheck(this, Peer);

		// Name.
		// @type {String}
		var _this = _possibleConstructorReturn(this, (Peer.__proto__ || Object.getPrototypeOf(Peer)).call(this, logger));

		_this._name = name;

		// Closed flag.
		// @type {Boolean}
		_this._closed = false;

		// App custom data.
		// @type {Any}
		_this._appData = appData;

		// Map of Consumers indexed by id.
		// @type {map<Number, Consumer>}
		_this._consumers = new Map();
		return _this;
	}

	/**
  * Peer name.
  *
  * @return {String}
  */


	_createClass(Peer, [{
		key: 'close',


		/**
   * Closes the Peer.
   * This is called when the local Room is closed.
   *
   * @private
   */
		value: function close() {
			logger.debug('close()');

			if (this._closed) return;

			this._closed = true;

			this.emit('@close');
			this.safeEmit('close', 'local');

			// Close all the Consumers.
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._consumers.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var consumer = _step.value;

					consumer.close();
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}

		/**
   * The remote Peer or Room was closed.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remoteClose',
		value: function remoteClose(appData) {
			logger.debug('remoteClose()');

			if (this._closed) return;

			this._closed = true;

			this.emit('@close');
			this.safeEmit('close', 'remote', appData);

			// Close all the Consumers.
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this._consumers.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var consumer = _step2.value;

					consumer.remoteClose();
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}

		/**
   * Get the Consumer with the given id.
   *
   * @param {Number} id
   *
   * @return {Consumer}
   */

	}, {
		key: 'getConsumerById',
		value: function getConsumerById(id) {
			return this._consumers.get(id);
		}

		/**
   * Add an associated Consumer.
   *
   * @private
   *
   * @param {Consumer} consumer
   */

	}, {
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this2 = this;

			if (this._consumers.has(consumer.id)) throw new Error('Consumer already exists [id:' + consumer.id + ']');

			// Store it.
			this._consumers.set(consumer.id, consumer);

			// Handle it.
			consumer.on('@close', function () {
				_this2._consumers.delete(consumer.id);
			});

			// Emit event.
			this.safeEmit('newconsumer', consumer);
		}
	}, {
		key: 'name',
		get: function get() {
			return this._name;
		}

		/**
   * Whether the Peer is closed.
   *
   * @return {Boolean}
   */

	}, {
		key: 'closed',
		get: function get() {
			return this._closed;
		}

		/**
   * App custom data.
   *
   * @return {Any}
   */

	}, {
		key: 'appData',
		get: function get() {
			return this._appData;
		}

		/**
   * The list of Consumers.
   *
   * @return {Array<Consumer>}
   */

	}, {
		key: 'consumers',
		get: function get() {
			return Array.from(this._consumers.values());
		}
	}]);

	return Peer;
}(_EnhancedEventEmitter3.default);

exports.default = Peer;
},{"./EnhancedEventEmitter":168,"./Logger":169}],171:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('./EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _errors = require('./errors');

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_STATS_INTERVAL = 1000;
var SIMULCAST_DEFAULT = {
	low: 100000,
	medium: 300000,
	high: 1500000
};

var logger = new _Logger2.default('Producer');

var Producer = function (_EnhancedEventEmitter) {
	_inherits(Producer, _EnhancedEventEmitter);

	/**
  * @private
  *
  * @emits {originator: String, [appData]: Any} pause
  * @emits {originator: String, [appData]: Any} resume
  * @emits {stats: Object} stats
  * @emits handled
  * @emits unhandled
  * @emits trackended
  * @emits {originator: String, [appData]: Any} close
  *
  * @emits {originator: String, [appData]: Any} @close
  */
	function Producer(track, options, appData) {
		_classCallCheck(this, Producer);

		// Id.
		// @type {Number}
		var _this = _possibleConstructorReturn(this, (Producer.__proto__ || Object.getPrototypeOf(Producer)).call(this, logger));

		_this._id = utils.randomNumber();

		// Closed flag.
		// @type {Boolean}
		_this._closed = false;

		// Original track.
		// @type {MediaStreamTrack}
		_this._originalTrack = track;

		// Track cloned from the original one (if supported).
		// @type {MediaStreamTrack}
		try {
			_this._track = track.clone();
		} catch (error) {
			_this._track = track;
		}

		// App custom data.
		// @type {Any}
		_this._appData = appData;

		// Simulcast.
		// @type {Object|false}
		_this._simulcast = false;

		if (_typeof(options.simulcast) === 'object') _this._simulcast = Object.assign({}, SIMULCAST_DEFAULT, options.simulcast);else if (options.simulcast === true) _this._simulcast = Object.assign({}, SIMULCAST_DEFAULT);

		// Associated Transport.
		// @type {Transport}
		_this._transport = null;

		// RTP parameters.
		// @type {RTCRtpParameters}
		_this._rtpParameters = null;

		// Locally paused flag.
		// @type {Boolean}
		_this._locallyPaused = !_this._track.enabled;

		// Remotely paused flag.
		// @type {Boolean}
		_this._remotelyPaused = false;

		// Periodic stats flag.
		// @type {Boolean}
		_this._statsEnabled = false;

		// Periodic stats gathering interval (milliseconds).
		// @type {Number}
		_this._statsInterval = DEFAULT_STATS_INTERVAL;

		// Handle the effective track.
		_this._handleTrack();
		return _this;
	}

	/**
  * Producer id.
  *
  * @return {Number}
  */


	_createClass(Producer, [{
		key: 'close',


		/**
   * Closes the Producer.
   *
   * @param {Any} [appData] - App custom data.
   */
		value: function close(appData) {
			logger.debug('close()');

			if (this._closed) return;

			this._closed = true;

			if (this._statsEnabled) {
				this._statsEnabled = false;

				if (this.transport) {
					this.transport.disableProducerStats(this);
				}
			}

			if (this._transport) this._transport.removeProducer(this, 'local', appData);

			this._destroy();

			this.emit('@close', 'local', appData);
			this.safeEmit('close', 'local', appData);
		}

		/**
   * My remote Producer was closed.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remoteClose',
		value: function remoteClose(appData) {
			logger.debug('remoteClose()');

			if (this._closed) return;

			this._closed = true;

			if (this._transport) this._transport.removeProducer(this, 'remote', appData);

			this._destroy();

			this.emit('@close', 'remote', appData);
			this.safeEmit('close', 'remote', appData);
		}
	}, {
		key: '_destroy',
		value: function _destroy() {
			this._transport = false;
			this._rtpParameters = null;

			try {
				this._track.stop();
			} catch (error) {}
		}

		/**
   * Sends RTP.
   *
   * @param {transport} Transport instance.
   *
   * @return {Promise}
   */

	}, {
		key: 'send',
		value: function send(transport) {
			var _this2 = this;

			logger.debug('send() [transport:%o]', transport);

			if (this._closed) return Promise.reject(new _errors.InvalidStateError('Producer closed'));else if (this._transport) return Promise.reject(new Error('already handled by a Transport'));else if ((typeof transport === 'undefined' ? 'undefined' : _typeof(transport)) !== 'object') return Promise.reject(new TypeError('invalid Transport'));

			this._transport = transport;

			return transport.addProducer(this).then(function () {
				transport.once('@close', function () {
					if (_this2._closed || _this2._transport !== transport) return;

					_this2._transport.removeProducer(_this2, 'local');

					_this2._transport = null;
					_this2._rtpParameters = null;

					_this2.safeEmit('unhandled');
				});

				_this2.safeEmit('handled');

				if (_this2._statsEnabled) transport.enableProducerStats(_this2, _this2._statsInterval);
			}).catch(function (error) {
				_this2._transport = null;

				throw error;
			});
		}

		/**
   * Pauses sending media.
   *
   * @param {Any} [appData] - App custom data.
   *
   * @return {Boolean} true if paused.
   */

	}, {
		key: 'pause',
		value: function pause(appData) {
			logger.debug('pause()');

			if (this._closed) {
				logger.error('pause() | Producer closed');

				return false;
			} else if (this._locallyPaused) {
				return true;
			}

			this._locallyPaused = true;
			this._track.enabled = false;

			if (this._transport) this._transport.pauseProducer(this, appData);

			this.safeEmit('pause', 'local', appData);

			// Return true if really paused.
			return this.paused;
		}

		/**
   * My remote Producer was paused.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remotePause',
		value: function remotePause(appData) {
			logger.debug('remotePause()');

			if (this._closed || this._remotelyPaused) return;

			this._remotelyPaused = true;
			this._track.enabled = false;

			this.safeEmit('pause', 'remote', appData);
		}

		/**
   * Resumes sending media.
   *
   * @param {Any} [appData] - App custom data.
   *
   * @return {Boolean} true if not paused.
   */

	}, {
		key: 'resume',
		value: function resume(appData) {
			logger.debug('resume()');

			if (this._closed) {
				logger.error('resume() | Producer closed');

				return false;
			} else if (!this._locallyPaused) {
				return true;
			}

			this._locallyPaused = false;

			if (!this._remotelyPaused) this._track.enabled = true;

			if (this._transport) this._transport.resumeProducer(this, appData);

			this.safeEmit('resume', 'local', appData);

			// Return true if not paused.
			return !this.paused;
		}

		/**
   * My remote Producer was resumed.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remoteResume',
		value: function remoteResume(appData) {
			logger.debug('remoteResume()');

			if (this._closed || !this._remotelyPaused) return;

			this._remotelyPaused = false;

			if (!this._locallyPaused) this._track.enabled = true;

			this.safeEmit('resume', 'remote', appData);
		}

		/**
   * Replaces the current track with a new one.
   *
   * @param {MediaStreamTrack} track - New track.
   *
   * @return {Promise} Resolves with the new track itself.
   */

	}, {
		key: 'replaceTrack',
		value: function replaceTrack(track) {
			var _this3 = this;

			logger.debug('replaceTrack() [track:%o]', track);

			if (this._closed) return Promise.reject(new _errors.InvalidStateError('Producer closed'));else if (!(track instanceof MediaStreamTrack)) return Promise.reject(new TypeError('track is not a MediaStreamTrack'));else if (track.readyState === 'ended') return Promise.reject(new Error('track.readyState is "ended"'));

			var clonedTrack = void 0;

			try {
				clonedTrack = track.clone();
			} catch (error) {
				clonedTrack = track;
			}

			return Promise.resolve().then(function () {
				// If this Producer is handled by a Transport, we need to tell it about
				// the new track.
				if (_this3._transport) return _this3._transport.replaceProducerTrack(_this3, clonedTrack);
			}).then(function () {
				// Stop the previous track.
				try {
					_this3._track.onended = null;_this3._track.stop();
				} catch (error) {}

				// If this Producer was locally paused/resumed and the state of the new
				// track does not match, fix it.
				if (!_this3.paused) clonedTrack.enabled = true;else clonedTrack.enabled = false;

				// Set the new tracks.
				_this3._originalTrack = track;
				_this3._track = clonedTrack;

				// Handle the effective track.
				_this3._handleTrack();

				// Return the new track.
				return _this3._track;
			});
		}

		/**
   * Set/update RTP parameters.
   *
   * @private
   *
   * @param {RTCRtpParameters} rtpParameters
   */

	}, {
		key: 'setRtpParameters',
		value: function setRtpParameters(rtpParameters) {
			this._rtpParameters = rtpParameters;
		}

		/**
   * Enables periodic stats retrieval.
   */

	}, {
		key: 'enableStats',
		value: function enableStats() {
			var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATS_INTERVAL;

			logger.debug('enableStats() [interval:%s]', interval);

			if (this._closed) {
				logger.error('enableStats() | Producer closed');

				return;
			}

			if (this._statsEnabled) return;

			if (typeof interval !== 'number' || interval < 1000) this._statsInterval = DEFAULT_STATS_INTERVAL;else this._statsInterval = interval;

			this._statsEnabled = true;

			if (this._transport) this._transport.enableProducerStats(this, this._statsInterval);
		}

		/**
   * Disables periodic stats retrieval.
   */

	}, {
		key: 'disableStats',
		value: function disableStats() {
			logger.debug('disableStats()');

			if (this._closed) {
				logger.error('disableStats() | Producer closed');

				return;
			}

			if (!this._statsEnabled) return;

			this._statsEnabled = false;

			if (this._transport) this._transport.disableProducerStats(this);
		}

		/**
   * Receive remote stats.
   *
   * @private
   *
   * @param {Object} stats
   */

	}, {
		key: 'remoteStats',
		value: function remoteStats(stats) {
			this.safeEmit('stats', stats);
		}

		/**
   * @private
   */

	}, {
		key: '_handleTrack',
		value: function _handleTrack() {
			var _this4 = this;

			// If the cloned track is closed (for example if the desktop sharing is closed
			// via chrome UI) notify the app and let it decide wheter to close the Producer
			// or not.
			this._track.onended = function () {
				if (_this4._closed) return;

				logger.warn('track "ended" event');

				_this4.safeEmit('trackended');
			};
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}

		/**
   * Whether the Producer is closed.
   *
   * @return {Boolean}
   */

	}, {
		key: 'closed',
		get: function get() {
			return this._closed;
		}

		/**
   * Media kind.
   *
   * @return {String}
   */

	}, {
		key: 'kind',
		get: function get() {
			return this._track.kind;
		}

		/**
   * The associated track.
   *
   * @return {MediaStreamTrack}
   */

	}, {
		key: 'track',
		get: function get() {
			return this._track;
		}

		/**
   * The associated original track.
   *
   * @return {MediaStreamTrack}
   */

	}, {
		key: 'originalTrack',
		get: function get() {
			return this._originalTrack;
		}

		/**
   * Simulcast settings.
   *
   * @return {Object|false}
   */

	}, {
		key: 'simulcast',
		get: function get() {
			return this._simulcast;
		}

		/**
   * App custom data.
   *
   * @return {Any}
   */

	}, {
		key: 'appData',
		get: function get() {
			return this._appData;
		}

		/**
   * Associated Transport.
   *
   * @return {Transport}
   */

	}, {
		key: 'transport',
		get: function get() {
			return this._transport;
		}

		/**
   * RTP parameters.
   *
   * @return {RTCRtpParameters}
   */

	}, {
		key: 'rtpParameters',
		get: function get() {
			return this._rtpParameters;
		}

		/**
   * Whether the Producer is locally paused.
   *
   * @return {Boolean}
   */

	}, {
		key: 'locallyPaused',
		get: function get() {
			return this._locallyPaused;
		}

		/**
   * Whether the Producer is remotely paused.
   *
   * @return {Boolean}
   */

	}, {
		key: 'remotelyPaused',
		get: function get() {
			return this._remotelyPaused;
		}

		/**
   * Whether the Producer is paused.
   *
   * @return {Boolean}
   */

	}, {
		key: 'paused',
		get: function get() {
			return this._locallyPaused || this._remotelyPaused;
		}
	}]);

	return Producer;
}(_EnhancedEventEmitter3.default);

exports.default = Producer;
},{"./EnhancedEventEmitter":168,"./Logger":169,"./errors":174,"./utils":190}],172:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('./EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _errors = require('./errors');

var _ortc = require('./ortc');

var ortc = _interopRequireWildcard(_ortc);

var _Device = require('./Device');

var _Device2 = _interopRequireDefault(_Device);

var _Transport = require('./Transport');

var _Transport2 = _interopRequireDefault(_Transport);

var _Producer = require('./Producer');

var _Producer2 = _interopRequireDefault(_Producer);

var _Peer = require('./Peer');

var _Peer2 = _interopRequireDefault(_Peer);

var _Consumer = require('./Consumer');

var _Consumer2 = _interopRequireDefault(_Consumer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Room');

var RoomState = {
	new: 'new',
	joining: 'joining',
	joined: 'joined',
	closed: 'closed'
};

/**
 * An instance of Room represents a remote multi conference and a local
 * peer that joins it.
 */

var Room = function (_EnhancedEventEmitter) {
	_inherits(Room, _EnhancedEventEmitter);

	/**
  * Room class.
  *
  * @param {Object} [options]
  * @param {Object} [roomSettings] Remote room settings, including its RTP
  * capabilities, mandatory codecs, etc. If given, no 'queryRoom' request is sent
  * to the server to discover them.
  * @param {Number} [options.requestTimeout=10000] - Timeout for sent requests
  * (in milliseconds). Defaults to 10000 (10 seconds).
  * @param {Object} [options.transportOptions] - Options for Transport created in mediasoup.
  * @param {Array<RTCIceServer>} [options.turnServers] - Array of TURN servers.
  *
  * @throws {Error} if device is not supported.
  *
  * @emits {request: Object, callback: Function, errback: Function} request
  * @emits {notification: Object} notify
  * @emits {peer: Peer} newpeer
  * @emits {originator: String, [appData]: Any} close
  */
	function Room(options) {
		_classCallCheck(this, Room);

		var _this = _possibleConstructorReturn(this, (Room.__proto__ || Object.getPrototypeOf(Room)).call(this, logger));

		logger.debug('constructor() [options:%o]', options);

		if (!_Device2.default.isSupported()) throw new Error('current browser/device not supported');

		options = options || {};

		// Computed settings.
		// @type {Object}
		_this._settings = {
			roomSettings: options.roomSettings,
			requestTimeout: options.requestTimeout || 10000,
			transportOptions: options.transportOptions || {},
			turnServers: options.turnServers || []
		};

		// Room state.
		// @type {Boolean}
		_this._state = RoomState.new;

		// My mediasoup Peer name.
		// @type {String}
		_this._peerName = null;

		// Map of Transports indexed by id.
		// @type {map<Number, Transport>}
		_this._transports = new Map();

		// Map of Producers indexed by id.
		// @type {map<Number, Producer>}
		_this._producers = new Map();

		// Map of Peers indexed by name.
		// @type {map<String, Peer>}
		_this._peers = new Map();

		// Extended RTP capabilities.
		// @type {Object}
		_this._extendedRtpCapabilities = null;

		// Whether we can send audio/video based on computed extended RTP
		// capabilities.
		// @type {Object}
		_this._canSendByKind = {
			audio: false,
			video: false
		};
		return _this;
	}

	/**
  * Whether the Room is joined.
  *
  * @return {Boolean}
  */


	_createClass(Room, [{
		key: 'getTransportById',


		/**
   * Get the Transport with the given id.
   *
   * @param {Number} id
   *
   * @return {Transport}
   */
		value: function getTransportById(id) {
			return this._transports.get(id);
		}

		/**
   * Get the Producer with the given id.
   *
   * @param {Number} id
   *
   * @return {Producer}
   */

	}, {
		key: 'getProducerById',
		value: function getProducerById(id) {
			return this._producers.get(id);
		}

		/**
   * Get the Peer with the given name.
   *
   * @param {String} name
   *
   * @return {Peer}
   */

	}, {
		key: 'getPeerByName',
		value: function getPeerByName(name) {
			return this._peers.get(name);
		}

		/**
   * Start the procedures to join a remote room.
   * @param {String} peerName - My mediasoup Peer name.
   * @param {Any} [appData] - App custom data.
   * @return {Promise}
   */

	}, {
		key: 'join',
		value: function join(peerName, appData) {
			var _this2 = this;

			logger.debug('join() [peerName:"%s"]', peerName);

			if (typeof peerName !== 'string') return Promise.reject(new TypeError('invalid peerName'));

			if (this._state !== RoomState.new && this._state !== RoomState.closed) {
				return Promise.reject(new _errors.InvalidStateError('invalid state "' + this._state + '"'));
			}

			this._peerName = peerName;
			this._state = RoomState.joining;

			var roomSettings = void 0;

			return Promise.resolve().then(function () {
				// If Room settings are provided don't query them.
				if (_this2._settings.roomSettings) {
					roomSettings = _this2._settings.roomSettings;

					return;
				} else {
					return _this2._sendRequest('queryRoom', { target: 'room' }).then(function (response) {
						roomSettings = response;

						logger.debug('join() | got Room settings:%o', roomSettings);
					});
				}
			}).then(function () {
				return _Device2.default.Handler.getNativeRtpCapabilities();
			}).then(function (nativeRtpCapabilities) {
				logger.debug('join() | native RTP capabilities:%o', nativeRtpCapabilities);

				// Get extended RTP capabilities.
				_this2._extendedRtpCapabilities = ortc.getExtendedRtpCapabilities(nativeRtpCapabilities, roomSettings.rtpCapabilities);

				logger.debug('join() | extended RTP capabilities:%o', _this2._extendedRtpCapabilities);

				// Check unsupported codecs.
				var unsupportedRoomCodecs = ortc.getUnsupportedCodecs(roomSettings.rtpCapabilities, roomSettings.mandatoryCodecPayloadTypes, _this2._extendedRtpCapabilities);

				if (unsupportedRoomCodecs.length > 0) {
					logger.error('%s mandatory room codecs not supported:%o', unsupportedRoomCodecs.length, unsupportedRoomCodecs);

					throw new _errors.UnsupportedError('mandatory room codecs not supported', unsupportedRoomCodecs);
				}

				// Check whether we can send audio/video.
				_this2._canSendByKind.audio = ortc.canSend('audio', _this2._extendedRtpCapabilities);
				_this2._canSendByKind.video = ortc.canSend('video', _this2._extendedRtpCapabilities);

				// Generate our effective RTP capabilities for receiving media.
				var effectiveLocalRtpCapabilities = ortc.getRtpCapabilities(_this2._extendedRtpCapabilities);

				logger.debug('join() | effective local RTP capabilities for receiving:%o', effectiveLocalRtpCapabilities);

				var data = {
					target: 'room',
					peerName: _this2._peerName,
					rtpCapabilities: effectiveLocalRtpCapabilities,
					appData: appData
				};

				return _this2._sendRequest('join', data).then(function (response) {
					return response.peers;
				});
			}).then(function (peers) {
				// Handle Peers already existing in the room.
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = (peers || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var peerData = _step.value;

						try {
							_this2._handlePeerData(peerData);
						} catch (error) {
							logger.error('join() | error handling Peer:%o', error);
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				_this2._state = RoomState.joined;

				logger.debug('join() | joined the Room');

				// Return the list of already existing Peers.
				return _this2.peers;
			}).catch(function (error) {
				_this2._state = RoomState.new;

				throw error;
			});
		}

		/**
   * Leave the Room.
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'leave',
		value: function leave(appData) {
			logger.debug('leave()');

			if (this.closed) return;

			// Send a notification.
			this._sendNotification('leave', { appData: appData });

			// Set closed state after sending the notification (otherwise the
			// notification won't be sent).
			this._state = RoomState.closed;

			this.safeEmit('close', 'local', appData);

			// Close all the Transports.
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this._transports.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var transport = _step2.value;

					transport.close();
				}

				// Close all the Producers.
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this._producers.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var producer = _step3.value;

					producer.close();
				}

				// Close all the Peers.
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this._peers.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var peer = _step4.value;

					peer.close();
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}

		/**
   * The remote Room was closed or our remote Peer has been closed.
   * Invoked via remote notification or via API.
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remoteClose',
		value: function remoteClose(appData) {
			logger.debug('remoteClose()');

			if (this.closed) return;

			this._state = RoomState.closed;

			this.safeEmit('close', 'remote', appData);

			// Close all the Transports.
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this._transports.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var transport = _step5.value;

					transport.remoteClose();
				}

				// Close all the Producers.
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this._producers.values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var producer = _step6.value;

					producer.remoteClose();
				}

				// Close all the Peers.
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this._peers.values()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var peer = _step7.value;

					peer.remoteClose();
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}
		}

		/**
   * Whether we can send audio/video.
   *
   * @param {String} kind - 'audio' or 'video'.
   *
   * @return {Boolean}
   */

	}, {
		key: 'canSend',
		value: function canSend(kind) {
			if (!this.joined) throw new _errors.InvalidStateError('invalid state "' + this._state + '"');else if (kind !== 'audio' && kind !== 'video') throw new TypeError('invalid kind "' + kind + '"');

			return this._canSendByKind[kind];
		}

		/**
   * Creates a Transport.
   *
   * @param {String} direction - Must be 'send' or 'recv'.
   * @param {Any} [appData] - App custom data.
   *
   * @return {Transport}
   *
   * @throws {InvalidStateError} if not joined.
   * @throws {TypeError} if wrong arguments.
   */

	}, {
		key: 'createTransport',
		value: function createTransport(direction, appData) {
			var _this3 = this;

			logger.debug('createTransport() [direction:%s]', direction);

			if (!this.joined) throw new _errors.InvalidStateError('invalid state "' + this._state + '"');else if (direction !== 'send' && direction !== 'recv') throw new TypeError('invalid direction "' + direction + '"');

			// Create a new Transport.
			var transport = new _Transport2.default(direction, this._extendedRtpCapabilities, this._settings, appData);

			// Store it.
			this._transports.set(transport.id, transport);

			transport.on('@request', function (method, data, callback, errback) {
				_this3._sendRequest(method, data).then(callback).catch(errback);
			});

			transport.on('@notify', function (method, data) {
				_this3._sendNotification(method, data);
			});

			transport.on('@close', function () {
				_this3._transports.delete(transport.id);
			});

			return transport;
		}

		/**
   * Creates a Producer.
   *
   * @param {MediaStreamTrack} track
   * @param {Object} [options]
   * @param {Object} [options.simulcast]
   * @param {Any} [appData] - App custom data.
   *
   * @return {Producer}
   *
   * @throws {InvalidStateError} if not joined.
   * @throws {TypeError} if wrong arguments.
   * @throws {Error} if cannot send the given kind.
   */

	}, {
		key: 'createProducer',
		value: function createProducer(track, options, appData) {
			var _this4 = this;

			logger.debug('createProducer() [track:%o, options:%o]', track, options);

			if (!this.joined) throw new _errors.InvalidStateError('invalid state "' + this._state + '"');else if (!(track instanceof MediaStreamTrack)) throw new TypeError('track is not a MediaStreamTrack');else if (!this._canSendByKind[track.kind]) throw new Error('cannot send ' + track.kind);else if (track.readyState === 'ended') throw new Error('track.readyState is "ended"');

			options = options || {};

			// Create a new Producer.
			var producer = new _Producer2.default(track, options, appData);

			// Store it.
			this._producers.set(producer.id, producer);

			producer.on('@close', function () {
				_this4._producers.delete(producer.id);
			});

			return producer;
		}

		/**
   * Produce a ICE restart in all the Transports.
   */

	}, {
		key: 'restartIce',
		value: function restartIce() {
			if (!this.joined) throw new _errors.InvalidStateError('invalid state "' + this._state + '"');

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = this._transports.values()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var transport = _step8.value;

					transport.restartIce();
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}
		}

		/**
   * Provide the local Room with a notification generated by mediasoup server.
   *
   * @param {Object} notification
   */

	}, {
		key: 'receiveNotification',
		value: function receiveNotification(notification) {
			var _this5 = this;

			if (this.closed) return Promise.reject(new _errors.InvalidStateError('Room closed'));else if ((typeof notification === 'undefined' ? 'undefined' : _typeof(notification)) !== 'object') return Promise.reject(new TypeError('wrong notification Object'));else if (notification.notification !== true) return Promise.reject(new TypeError('not a notification'));else if (typeof notification.method !== 'string') return Promise.reject(new TypeError('wrong/missing notification method'));

			var method = notification.method;


			logger.debug('receiveNotification() [method:%s, notification:%o]', method, notification);

			return Promise.resolve().then(function () {
				switch (method) {
					case 'closed':
						{
							var appData = notification.appData;


							_this5.remoteClose(appData);

							break;
						}

					case 'transportClosed':
						{
							var id = notification.id,
							    _appData = notification.appData;

							var transport = _this5._transports.get(id);

							if (!transport) throw new Error('Transport not found [id:"' + id + '"]');

							transport.remoteClose(_appData);

							break;
						}

					case 'transportStats':
						{
							var _id = notification.id,
							    stats = notification.stats;

							var _transport = _this5._transports.get(_id);

							if (!_transport) throw new Error('transport not found [id:' + _id + ']');

							_transport.remoteStats(stats);

							break;
						}

					case 'newPeer':
						{
							var name = notification.name;


							if (_this5._peers.has(name)) throw new Error('Peer already exists [name:"' + name + '"]');

							var peerData = notification;

							_this5._handlePeerData(peerData);

							break;
						}

					case 'peerClosed':
						{
							var peerName = notification.name;
							var _appData2 = notification.appData;

							var peer = _this5._peers.get(peerName);

							if (!peer) throw new Error('no Peer found [name:"' + peerName + '"]');

							peer.remoteClose(_appData2);

							break;
						}

					case 'producerPaused':
						{
							var _id2 = notification.id,
							    _appData3 = notification.appData;

							var producer = _this5._producers.get(_id2);

							if (!producer) throw new Error('Producer not found [id:' + _id2 + ']');

							producer.remotePause(_appData3);

							break;
						}

					case 'producerResumed':
						{
							var _id3 = notification.id,
							    _appData4 = notification.appData;

							var _producer = _this5._producers.get(_id3);

							if (!_producer) throw new Error('Producer not found [id:' + _id3 + ']');

							_producer.remoteResume(_appData4);

							break;
						}

					case 'producerClosed':
						{
							var _id4 = notification.id,
							    _appData5 = notification.appData;

							var _producer2 = _this5._producers.get(_id4);

							if (!_producer2) throw new Error('Producer not found [id:' + _id4 + ']');

							_producer2.remoteClose(_appData5);

							break;
						}

					case 'producerStats':
						{
							var _id5 = notification.id,
							    _stats = notification.stats;

							var _producer3 = _this5._producers.get(_id5);

							if (!_producer3) throw new Error('Producer not found [id:' + _id5 + ']');

							_producer3.remoteStats(_stats);

							break;
						}

					case 'newConsumer':
						{
							var _peerName = notification.peerName;

							var _peer = _this5._peers.get(_peerName);

							if (!_peer) throw new Error('no Peer found [name:"' + _peerName + '"]');

							var consumerData = notification;

							_this5._handleConsumerData(consumerData, _peer);

							break;
						}

					case 'consumerClosed':
						{
							var _id6 = notification.id,
							    _peerName2 = notification.peerName,
							    _appData6 = notification.appData;

							var _peer2 = _this5._peers.get(_peerName2);

							if (!_peer2) throw new Error('no Peer found [name:"' + _peerName2 + '"]');

							var consumer = _peer2.getConsumerById(_id6);

							if (!consumer) throw new Error('Consumer not found [id:' + _id6 + ']');

							consumer.remoteClose(_appData6);

							break;
						}

					case 'consumerPaused':
						{
							var _id7 = notification.id,
							    _peerName3 = notification.peerName,
							    _appData7 = notification.appData;

							var _peer3 = _this5._peers.get(_peerName3);

							if (!_peer3) throw new Error('no Peer found [name:"' + _peerName3 + '"]');

							var _consumer = _peer3.getConsumerById(_id7);

							if (!_consumer) throw new Error('Consumer not found [id:' + _id7 + ']');

							_consumer.remotePause(_appData7);

							break;
						}

					case 'consumerResumed':
						{
							var _id8 = notification.id,
							    _peerName4 = notification.peerName,
							    _appData8 = notification.appData;

							var _peer4 = _this5._peers.get(_peerName4);

							if (!_peer4) throw new Error('no Peer found [name:"' + _peerName4 + '"]');

							var _consumer2 = _peer4.getConsumerById(_id8);

							if (!_consumer2) throw new Error('Consumer not found [id:' + _id8 + ']');

							_consumer2.remoteResume(_appData8);

							break;
						}

					case 'consumerPreferredProfileSet':
						{
							var _id9 = notification.id,
							    _peerName5 = notification.peerName,
							    profile = notification.profile;

							var _peer5 = _this5._peers.get(_peerName5);

							if (!_peer5) throw new Error('no Peer found [name:"' + _peerName5 + '"]');

							var _consumer3 = _peer5.getConsumerById(_id9);

							if (!_consumer3) throw new Error('Consumer not found [id:' + _id9 + ']');

							_consumer3.remoteSetPreferredProfile(profile);

							break;
						}

					case 'consumerEffectiveProfileChanged':
						{
							var _id10 = notification.id,
							    _peerName6 = notification.peerName,
							    _profile = notification.profile;

							var _peer6 = _this5._peers.get(_peerName6);

							if (!_peer6) throw new Error('no Peer found [name:"' + _peerName6 + '"]');

							var _consumer4 = _peer6.getConsumerById(_id10);

							if (!_consumer4) throw new Error('Consumer not found [id:' + _id10 + ']');

							_consumer4.remoteEffectiveProfileChanged(_profile);

							break;
						}

					case 'consumerStats':
						{
							var _id11 = notification.id,
							    _peerName7 = notification.peerName,
							    _stats2 = notification.stats;

							var _peer7 = _this5._peers.get(_peerName7);

							if (!_peer7) throw new Error('no Peer found [name:"' + _peerName7 + '"]');

							var _consumer5 = _peer7.getConsumerById(_id11);

							if (!_consumer5) throw new Error('Consumer not found [id:' + _id11 + ']');

							_consumer5.remoteStats(_stats2);

							break;
						}

					default:
						throw new Error('unknown notification method "' + method + '"');
				}
			}).catch(function (error) {
				logger.error('receiveNotification() failed [notification:%o]: %s', notification, error);
			});
		}
	}, {
		key: '_sendRequest',
		value: function _sendRequest(method, data) {
			var _this6 = this;

			var request = Object.assign({ method: method, target: 'peer' }, data);

			// Should never happen.
			// Ignore if closed.
			if (this.closed) {
				logger.error('_sendRequest() | Room closed [method:%s, request:%o]', method, request);

				return Promise.reject(new _errors.InvalidStateError('Room closed'));
			}

			logger.debug('_sendRequest() [method:%s, request:%o]', method, request);

			return new Promise(function (resolve, reject) {
				var done = false;

				var timer = setTimeout(function () {
					logger.error('request failed [method:%s]: timeout', method);

					done = true;
					reject(new _errors.TimeoutError('timeout'));
				}, _this6._settings.requestTimeout);

				var callback = function callback(response) {
					if (done) return;

					done = true;
					clearTimeout(timer);

					if (_this6.closed) {
						logger.error('request failed [method:%s]: Room closed', method);

						reject(new Error('Room closed'));

						return;
					}

					logger.debug('request succeeded [method:%s, response:%o]', method, response);

					resolve(response);
				};

				var errback = function errback(error) {
					if (done) return;

					done = true;
					clearTimeout(timer);

					if (_this6.closed) {
						logger.error('request failed [method:%s]: Room closed', method);

						reject(new Error('Room closed'));

						return;
					}

					// Make sure message is an Error.
					if (!(error instanceof Error)) error = new Error(String(error));

					logger.error('request failed [method:%s]:%o', method, error);

					reject(error);
				};

				_this6.safeEmit('request', request, callback, errback);
			});
		}
	}, {
		key: '_sendNotification',
		value: function _sendNotification(method, data) {
			// Ignore if closed.
			if (this.closed) return;

			var notification = Object.assign({ method: method, target: 'peer', notification: true }, data);

			logger.debug('_sendNotification() [method:%s, notification:%o]', method, notification);

			this.safeEmit('notify', notification);
		}
	}, {
		key: '_handlePeerData',
		value: function _handlePeerData(peerData) {
			var _this7 = this;

			var name = peerData.name,
			    consumers = peerData.consumers,
			    appData = peerData.appData;

			var peer = new _Peer2.default(name, appData);

			// Store it.
			this._peers.set(peer.name, peer);

			peer.on('@close', function () {
				_this7._peers.delete(peer.name);
			});

			// Add consumers.
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = consumers[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var consumerData = _step9.value;

					try {
						this._handleConsumerData(consumerData, peer);
					} catch (error) {
						logger.error('error handling existing Consumer in Peer:%o', error);
					}
				}

				// If already joined emit event.
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			if (this.joined) this.safeEmit('newpeer', peer);
		}
	}, {
		key: '_handleConsumerData',
		value: function _handleConsumerData(producerData, peer) {
			var id = producerData.id,
			    kind = producerData.kind,
			    rtpParameters = producerData.rtpParameters,
			    paused = producerData.paused,
			    appData = producerData.appData;

			var consumer = new _Consumer2.default(id, kind, rtpParameters, peer, appData);
			var supported = ortc.canReceive(consumer.rtpParameters, this._extendedRtpCapabilities);

			if (supported) consumer.setSupported(true);

			if (paused) consumer.remotePause();

			peer.addConsumer(consumer);
		}
	}, {
		key: 'joined',
		get: function get() {
			return this._state === RoomState.joined;
		}

		/**
   * Whether the Room is closed.
   *
   * @return {Boolean}
   */

	}, {
		key: 'closed',
		get: function get() {
			return this._state === RoomState.closed;
		}

		/**
   * My mediasoup Peer name.
   *
   * @return {String}
   */

	}, {
		key: 'peerName',
		get: function get() {
			return this._peerName;
		}

		/**
   * The list of Transports.
   *
   * @return {Array<Transport>}
   */

	}, {
		key: 'transports',
		get: function get() {
			return Array.from(this._transports.values());
		}

		/**
   * The list of Producers.
   *
   * @return {Array<Producer>}
   */

	}, {
		key: 'producers',
		get: function get() {
			return Array.from(this._producers.values());
		}

		/**
   * The list of Peers.
   *
   * @return {Array<Peer>}
   */

	}, {
		key: 'peers',
		get: function get() {
			return Array.from(this._peers.values());
		}
	}]);

	return Room;
}(_EnhancedEventEmitter3.default);

exports.default = Room;
},{"./Consumer":166,"./Device":167,"./EnhancedEventEmitter":168,"./Logger":169,"./Peer":170,"./Producer":171,"./Transport":173,"./errors":174,"./ortc":189}],173:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('./EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _errors = require('./errors');

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _Device = require('./Device');

var _Device2 = _interopRequireDefault(_Device);

var _CommandQueue = require('./CommandQueue');

var _CommandQueue2 = _interopRequireDefault(_CommandQueue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_STATS_INTERVAL = 1000;

var logger = new _Logger2.default('Transport');

var Transport = function (_EnhancedEventEmitter) {
	_inherits(Transport, _EnhancedEventEmitter);

	/**
  * @private
  *
  * @emits {state: String} connectionstatechange
  * @emits {stats: Object} stats
  * @emits {originator: String, [appData]: Any} close
  *
  * @emits {method: String, [data]: Object, callback: Function, errback: Function} @request
  * @emits {method: String, [data]: Object} @notify
  * @emits @close
  */
	function Transport(direction, extendedRtpCapabilities, settings, appData) {
		_classCallCheck(this, Transport);

		var _this = _possibleConstructorReturn(this, (Transport.__proto__ || Object.getPrototypeOf(Transport)).call(this, logger));

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		// Id.
		// @type {Number}
		_this._id = utils.randomNumber();

		// Closed flag.
		// @type {Boolean}
		_this._closed = false;

		// Direction.
		// @type {String}
		_this._direction = direction;

		// Room settings.
		// @type {Object}
		_this._settings = settings;

		// App custom data.
		// @type {Any}
		_this._appData = appData;

		// Periodic stats flag.
		// @type {Boolean}
		_this._statsEnabled = false;

		// Commands handler.
		// @type {CommandQueue}
		_this._commandQueue = new _CommandQueue2.default();

		// Device specific handler.
		_this._handler = new _Device2.default.Handler(direction, extendedRtpCapabilities, settings);

		// Transport state. Values can be:
		// 'new'/'connecting'/'connected'/'failed'/'disconnected'/'closed'
		// @type {String}
		_this._connectionState = 'new';

		_this._commandQueue.on('exec', _this._execCommand.bind(_this));

		_this._handleHandler();
		return _this;
	}

	/**
  * Transport id.
  *
  * @return {Number}
  */


	_createClass(Transport, [{
		key: 'close',


		/**
   * Close the Transport.
   *
   * @param {Any} [appData] - App custom data.
   */
		value: function close(appData) {
			logger.debug('close()');

			if (this._closed) return;

			this._closed = true;

			if (this._statsEnabled) {
				this._statsEnabled = false;
				this.disableStats();
			}

			this.safeEmit('@notify', 'closeTransport', { id: this._id, appData: appData });

			this.emit('@close');
			this.safeEmit('close', 'local', appData);

			this._destroy();
		}

		/**
   * My remote Transport was closed.
   * Invoked via remote notification.
   *
   * @private
   *
   * @param {Any} [appData] - App custom data.
   */

	}, {
		key: 'remoteClose',
		value: function remoteClose(appData) {
			logger.debug('remoteClose()');

			if (this._closed) return;

			this._closed = true;

			this.emit('@close');
			this.safeEmit('close', 'remote', appData);

			this._destroy();
		}
	}, {
		key: '_destroy',
		value: function _destroy() {
			// Close the CommandQueue.
			this._commandQueue.close();

			// Close the handler.
			this._handler.close();
		}
	}, {
		key: 'restartIce',
		value: function restartIce() {
			var _this2 = this;

			logger.debug('restartIce()');

			if (this._closed) return;else if (this._connectionState === 'new') return;

			Promise.resolve().then(function () {
				var data = {
					id: _this2._id
				};

				return _this2.safeEmitAsPromise('@request', 'restartTransport', data);
			}).then(function (response) {
				var remoteIceParameters = response.iceParameters;

				// Enqueue command.
				return _this2._commandQueue.push('restartIce', { remoteIceParameters: remoteIceParameters });
			}).catch(function (error) {
				logger.error('restartIce() | failed: %o', error);
			});
		}
	}, {
		key: 'enableStats',
		value: function enableStats() {
			var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATS_INTERVAL;

			logger.debug('enableStats() [interval:%s]', interval);

			if (typeof interval !== 'number' || interval < 1000) interval = DEFAULT_STATS_INTERVAL;

			this._statsEnabled = true;

			var data = {
				id: this._id,
				interval: interval
			};

			this.safeEmit('@notify', 'enableTransportStats', data);
		}
	}, {
		key: 'disableStats',
		value: function disableStats() {
			logger.debug('disableStats()');

			this._statsEnabled = false;

			var data = {
				id: this._id
			};

			this.safeEmit('@notify', 'disableTransportStats', data);
		}
	}, {
		key: '_handleHandler',
		value: function _handleHandler() {
			var _this3 = this;

			var handler = this._handler;

			handler.on('@connectionstatechange', function (state) {
				if (_this3._connectionState === state) return;

				logger.debug('Transport connection state changed to %s', state);

				_this3._connectionState = state;

				if (!_this3._closed) _this3.safeEmit('connectionstatechange', state);
			});

			handler.on('@needcreatetransport', function (transportLocalParameters, callback, errback) {
				var data = {
					id: _this3._id,
					direction: _this3._direction,
					options: _this3._settings.transportOptions,
					appData: _this3._appData
				};

				if (transportLocalParameters) data.dtlsParameters = transportLocalParameters.dtlsParameters;

				_this3.safeEmit('@request', 'createTransport', data, callback, errback);
			});

			handler.on('@needupdatetransport', function (transportLocalParameters) {
				var data = {
					id: _this3._id,
					dtlsParameters: transportLocalParameters.dtlsParameters
				};

				_this3.safeEmit('@notify', 'updateTransport', data);
			});

			handler.on('@needupdateproducer', function (producer, rtpParameters) {
				var data = {
					id: producer.id,
					rtpParameters: rtpParameters
				};

				// Update Producer RTP parameters.
				producer.setRtpParameters(rtpParameters);

				// Notify the server.
				_this3.safeEmit('@notify', 'updateProducer', data);
			});
		}

		/**
   * Send the given Producer over this Transport.
   *
   * @private
   *
   * @param {Producer} producer
   *
   * @return {Promise}
   */

	}, {
		key: 'addProducer',
		value: function addProducer(producer) {
			logger.debug('addProducer() [producer:%o]', producer);

			if (this._closed) return Promise.reject(new _errors.InvalidStateError('Transport closed'));
			if (this._direction !== 'send') return Promise.reject(new Error('not a sending Transport'));

			// Enqueue command.
			return this._commandQueue.push('addProducer', { producer: producer });
		}

		/**
   * @private
   */

	}, {
		key: 'removeProducer',
		value: function removeProducer(producer, originator, appData) {
			logger.debug('removeProducer() [producer:%o]', producer);

			// Enqueue command.
			if (!this._closed) {
				this._commandQueue.push('removeProducer', { producer: producer }).catch(function () {});
			}

			if (originator === 'local') this.safeEmit('@notify', 'closeProducer', { id: producer.id, appData: appData });
		}

		/**
   * @private
   */

	}, {
		key: 'pauseProducer',
		value: function pauseProducer(producer, appData) {
			logger.debug('pauseProducer() [producer:%o]', producer);

			var data = {
				id: producer.id,
				appData: appData
			};

			this.safeEmit('@notify', 'pauseProducer', data);
		}

		/**
   * @private
   */

	}, {
		key: 'resumeProducer',
		value: function resumeProducer(producer, appData) {
			logger.debug('resumeProducer() [producer:%o]', producer);

			var data = {
				id: producer.id,
				appData: appData
			};

			this.safeEmit('@notify', 'resumeProducer', data);
		}

		/**
   * @private
   *
   * @return {Promise}
   */

	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			logger.debug('replaceProducerTrack() [producer:%o]', producer);

			return this._commandQueue.push('replaceProducerTrack', { producer: producer, track: track });
		}

		/**
   * @private
   */

	}, {
		key: 'enableProducerStats',
		value: function enableProducerStats(producer, interval) {
			logger.debug('enableProducerStats() [producer:%o]', producer);

			var data = {
				id: producer.id,
				interval: interval
			};

			this.safeEmit('@notify', 'enableProducerStats', data);
		}

		/**
   * @private
   */

	}, {
		key: 'disableProducerStats',
		value: function disableProducerStats(producer) {
			logger.debug('disableProducerStats() [producer:%o]', producer);

			var data = {
				id: producer.id
			};

			this.safeEmit('@notify', 'disableProducerStats', data);
		}

		/**
   * Receive the given Consumer over this Transport.
   *
   * @private
   *
   * @param {Consumer} consumer
   *
   * @return {Promise} Resolves to a remote MediaStreamTrack.
   */

	}, {
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			logger.debug('addConsumer() [consumer:%o]', consumer);

			if (this._closed) return Promise.reject(new _errors.InvalidStateError('Transport closed'));
			if (this._direction !== 'recv') return Promise.reject(new Error('not a receiving Transport'));

			// Enqueue command.
			return this._commandQueue.push('addConsumer', { consumer: consumer });
		}

		/**
   * @private
   */

	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			logger.debug('removeConsumer() [consumer:%o]', consumer);

			// Enqueue command.
			this._commandQueue.push('removeConsumer', { consumer: consumer }).catch(function () {});
		}

		/**
   * @private
   */

	}, {
		key: 'pauseConsumer',
		value: function pauseConsumer(consumer, appData) {
			logger.debug('pauseConsumer() [consumer:%o]', consumer);

			var data = {
				id: consumer.id,
				appData: appData
			};

			this.safeEmit('@notify', 'pauseConsumer', data);
		}

		/**
   * @private
   */

	}, {
		key: 'resumeConsumer',
		value: function resumeConsumer(consumer, appData) {
			logger.debug('resumeConsumer() [consumer:%o]', consumer);

			var data = {
				id: consumer.id,
				appData: appData
			};

			this.safeEmit('@notify', 'resumeConsumer', data);
		}

		/**
   * @private
   */

	}, {
		key: 'setConsumerPreferredProfile',
		value: function setConsumerPreferredProfile(consumer, profile) {
			logger.debug('setConsumerPreferredProfile() [consumer:%o]', consumer);

			var data = {
				id: consumer.id,
				profile: profile
			};

			this.safeEmit('@notify', 'setConsumerPreferredProfile', data);
		}

		/**
   * @private
   */

	}, {
		key: 'enableConsumerStats',
		value: function enableConsumerStats(consumer, interval) {
			logger.debug('enableConsumerStats() [consumer:%o]', consumer);

			var data = {
				id: consumer.id,
				interval: interval
			};

			this.safeEmit('@notify', 'enableConsumerStats', data);
		}

		/**
   * @private
   */

	}, {
		key: 'disableConsumerStats',
		value: function disableConsumerStats(consumer) {
			logger.debug('disableConsumerStats() [consumer:%o]', consumer);

			var data = {
				id: consumer.id
			};

			this.safeEmit('@notify', 'disableConsumerStats', data);
		}

		/**
   * Receive remote stats.
   *
   * @private
   *
   * @param {Object} stats
   */

	}, {
		key: 'remoteStats',
		value: function remoteStats(stats) {
			this.safeEmit('stats', stats);
		}
	}, {
		key: '_execCommand',
		value: function _execCommand(command, promiseHolder) {
			var promise = void 0;

			try {
				switch (command.method) {
					case 'addProducer':
						{
							var producer = command.producer;


							promise = this._execAddProducer(producer);
							break;
						}

					case 'removeProducer':
						{
							var _producer = command.producer;


							promise = this._execRemoveProducer(_producer);
							break;
						}

					case 'replaceProducerTrack':
						{
							var _producer2 = command.producer,
							    track = command.track;


							promise = this._execReplaceProducerTrack(_producer2, track);
							break;
						}

					case 'addConsumer':
						{
							var consumer = command.consumer;


							promise = this._execAddConsumer(consumer);
							break;
						}

					case 'removeConsumer':
						{
							var _consumer = command.consumer;


							promise = this._execRemoveConsumer(_consumer);
							break;
						}

					case 'restartIce':
						{
							var remoteIceParameters = command.remoteIceParameters;


							promise = this._execRestartIce(remoteIceParameters);
							break;
						}

					default:
						{
							promise = Promise.reject(new Error('unknown command method "' + command.method + '"'));
						}
				}
			} catch (error) {
				promise = Promise.reject(error);
			}

			// Fill the given Promise holder.
			promiseHolder.promise = promise;
		}
	}, {
		key: '_execAddProducer',
		value: function _execAddProducer(producer) {
			var _this4 = this;

			logger.debug('_execAddProducer()');

			var producerRtpParameters = void 0;

			// Call the handler.
			return Promise.resolve().then(function () {
				return _this4._handler.addProducer(producer);
			}).then(function (rtpParameters) {
				producerRtpParameters = rtpParameters;

				var data = {
					id: producer.id,
					kind: producer.kind,
					transportId: _this4._id,
					rtpParameters: rtpParameters,
					paused: producer.locallyPaused,
					appData: producer.appData
				};

				return _this4.safeEmitAsPromise('@request', 'createProducer', data);
			}).then(function () {
				producer.setRtpParameters(producerRtpParameters);
			});
		}
	}, {
		key: '_execRemoveProducer',
		value: function _execRemoveProducer(producer) {
			logger.debug('_execRemoveProducer()');

			// Call the handler.
			return this._handler.removeProducer(producer);
		}
	}, {
		key: '_execReplaceProducerTrack',
		value: function _execReplaceProducerTrack(producer, track) {
			logger.debug('_execReplaceProducerTrack()');

			// Call the handler.
			return this._handler.replaceProducerTrack(producer, track);
		}
	}, {
		key: '_execAddConsumer',
		value: function _execAddConsumer(consumer) {
			var _this5 = this;

			logger.debug('_execAddConsumer()');

			var consumerTrack = void 0;

			// Call the handler.
			return Promise.resolve().then(function () {
				return _this5._handler.addConsumer(consumer);
			}).then(function (track) {
				consumerTrack = track;

				var data = {
					id: consumer.id,
					transportId: _this5.id,
					paused: consumer.locallyPaused,
					preferredProfile: consumer.preferredProfile
				};

				return _this5.safeEmitAsPromise('@request', 'enableConsumer', data);
			}).then(function (response) {
				var paused = response.paused,
				    preferredProfile = response.preferredProfile,
				    effectiveProfile = response.effectiveProfile;


				if (paused) consumer.remotePause();

				if (preferredProfile) consumer.remoteSetPreferredProfile(preferredProfile);

				if (effectiveProfile) consumer.remoteEffectiveProfileChanged(effectiveProfile);

				return consumerTrack;
			});
		}
	}, {
		key: '_execRemoveConsumer',
		value: function _execRemoveConsumer(consumer) {
			logger.debug('_execRemoveConsumer()');

			// Call the handler.
			return this._handler.removeConsumer(consumer);
		}
	}, {
		key: '_execRestartIce',
		value: function _execRestartIce(remoteIceParameters) {
			logger.debug('_execRestartIce()');

			// Call the handler.
			return this._handler.restartIce(remoteIceParameters);
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}

		/**
   * Whether the Transport is closed.
   *
   * @return {Boolean}
   */

	}, {
		key: 'closed',
		get: function get() {
			return this._closed;
		}

		/**
   * Transport direction.
   *
   * @return {String}
   */

	}, {
		key: 'direction',
		get: function get() {
			return this._direction;
		}

		/**
   * App custom data.
   *
   * @return {Any}
   */

	}, {
		key: 'appData',
		get: function get() {
			return this._appData;
		}

		/**
   * Connection state.
   *
   * @return {String}
   */

	}, {
		key: 'connectionState',
		get: function get() {
			return this._connectionState;
		}
	}]);

	return Transport;
}(_EnhancedEventEmitter3.default);

exports.default = Transport;
},{"./CommandQueue":165,"./Device":167,"./EnhancedEventEmitter":168,"./Logger":169,"./errors":174,"./utils":190}],174:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fixBabelExtend = function (O) {
	var gPO = O.getPrototypeOf || function (o) {
		return o.__proto__;
	},
	    sPO = O.setPrototypeOf || function (o, p) {
		o.__proto__ = p;
		return o;
	},
	    construct = (typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' ? Reflect.construct : function (Parent, args, Class) {
		var Constructor,
		    a = [null];
		a.push.apply(a, args);
		Constructor = Parent.bind.apply(Parent, a);
		return sPO(new Constructor(), Class.prototype);
	};

	return function fixBabelExtend(Class) {
		var Parent = gPO(Class);
		return sPO(Class, sPO(function Super() {
			return construct(Parent, arguments, gPO(this).constructor);
		}, Parent));
	};
}(Object);

/**
 * Error produced when calling a method in an invalid state.
 */
var InvalidStateError = exports.InvalidStateError = _fixBabelExtend(function (_Error) {
	_inherits(InvalidStateError, _Error);

	function InvalidStateError(message) {
		_classCallCheck(this, InvalidStateError);

		var _this = _possibleConstructorReturn(this, (InvalidStateError.__proto__ || Object.getPrototypeOf(InvalidStateError)).call(this, message));

		_this.name = 'InvalidStateError';

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
			Error.captureStackTrace(_this, InvalidStateError);else _this.stack = new Error(message).stack;
		return _this;
	}

	return InvalidStateError;
}(Error));

/**
 * Error produced when a Promise is rejected due to a timeout.
 */


var TimeoutError = exports.TimeoutError = _fixBabelExtend(function (_Error2) {
	_inherits(TimeoutError, _Error2);

	function TimeoutError(message) {
		_classCallCheck(this, TimeoutError);

		var _this2 = _possibleConstructorReturn(this, (TimeoutError.__proto__ || Object.getPrototypeOf(TimeoutError)).call(this, message));

		_this2.name = 'TimeoutError';

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
			Error.captureStackTrace(_this2, InvalidStateError);else _this2.stack = new Error(message).stack;
		return _this2;
	}

	return TimeoutError;
}(Error));

/**
 * Error indicating not support for something.
 */


var UnsupportedError = exports.UnsupportedError = _fixBabelExtend(function (_Error3) {
	_inherits(UnsupportedError, _Error3);

	function UnsupportedError(message, data) {
		_classCallCheck(this, UnsupportedError);

		var _this3 = _possibleConstructorReturn(this, (UnsupportedError.__proto__ || Object.getPrototypeOf(UnsupportedError)).call(this, message));

		_this3.name = 'UnsupportedError';

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
			Error.captureStackTrace(_this3, InvalidStateError);else _this3.stack = new Error(message).stack;

		_this3.data = data;
		return _this3;
	}

	return UnsupportedError;
}(Error));
},{}],175:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _commonUtils = require('./sdp/commonUtils');

var sdpCommonUtils = _interopRequireWildcard(_commonUtils);

var _planBUtils = require('./sdp/planBUtils');

var sdpPlanBUtils = _interopRequireWildcard(_planBUtils);

var _RemotePlanBSdp = require('./sdp/RemotePlanBSdp');

var _RemotePlanBSdp2 = _interopRequireDefault(_RemotePlanBSdp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Chrome55');

var Handler = function (_EnhancedEventEmitter) {
	_inherits(Handler, _EnhancedEventEmitter);

	function Handler(direction, rtpParametersByKind, settings) {
		_classCallCheck(this, Handler);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, logger));

		_this._pc = new RTCPeerConnection({
			iceServers: settings.turnServers || [],
			iceTransportPolicy: 'all',
			bundlePolicy: 'max-bundle',
			rtcpMuxPolicy: 'require'
		});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemotePlanBSdp}
		_this._remoteSdp = new _RemotePlanBSdp2.default(direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		_this._pc.addEventListener('iceconnectionstatechange', function () {
			switch (_this._pc.iceConnectionState) {
				case 'checking':
					_this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					_this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					_this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					_this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					_this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
		return _this;
	}

	_createClass(Handler, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close RTCPeerConnection.
			try {
				this._pc.close();
			} catch (error) {}
		}
	}]);

	return Handler;
}(_EnhancedEventEmitter3.default);

var SendHandler = function (_Handler) {
	_inherits(SendHandler, _Handler);

	function SendHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, SendHandler);

		// Got transport local and remote parameters.
		// @type {Boolean}
		var _this2 = _possibleConstructorReturn(this, (SendHandler.__proto__ || Object.getPrototypeOf(SendHandler)).call(this, 'send', rtpParametersByKind, settings));

		_this2._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		_this2._stream = new MediaStream();
		return _this2;
	}

	_createClass(SendHandler, [{
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._stream.getTrackById(track.id)) return Promise.reject(new Error('track already added'));

			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				// Add the track to the local stream.
				_this3._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				_this3._pc.addStream(_this3._stream);

				return _this3._pc.createOffer();
			}).then(function (offer) {
				// If simulcast is set, mangle the offer.
				if (producer.simulcast) {
					logger.debug('addProducer() | enabling simulcast');

					var sdpObject = _sdpTransform2.default.parse(offer.sdp);

					sdpPlanBUtils.addSimulcastForTrack(sdpObject, track);

					var offerSdp = _sdpTransform2.default.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this3._pc.setLocalDescription(offer);
			}).then(function () {
				if (!_this3._transportReady) return _this3._setupTransport();
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this3._pc.localDescription.sdp);

				var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this3._pc.setRemoteDescription(answer);
			}).then(function () {
				var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				sdpPlanBUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				return rtpParameters;
			}).catch(function (error) {
				// Panic here. Try to undo things.

				_this3._stream.removeTrack(track);
				_this3._pc.addStream(_this3._stream);

				throw error;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this4 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				// Remove the track from the local stream.
				_this4._stream.removeTrack(track);

				// Add the stream to the PeerConnection.
				_this4._pc.addStream(_this4._stream);

				return _this4._pc.createOffer();
			}).then(function (offer) {
				logger.debug('removeProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this4._pc.setLocalDescription(offer);
			}).catch(function (error) {
				// NOTE: If there are no sending tracks, setLocalDescription() will fail with
				// "Failed to create channels". If so, ignore it.
				if (_this4._stream.getTracks().length === 0) {
					logger.warn('removeProducer() | ignoring expected error due no sending tracks: %s', error.toString());

					return;
				}

				throw error;
			}).then(function () {
				if (_this4._pc.signalingState === 'stable') return;

				var localSdpObj = _sdpTransform2.default.parse(_this4._pc.localDescription.sdp);
				var remoteSdp = _this4._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('removeProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this4._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this5 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			var oldTrack = producer.track;
			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				// Remove the old track from the local stream.
				_this5._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				_this5._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				_this5._pc.addStream(_this5._stream);

				return _this5._pc.createOffer();
			}).then(function (offer) {
				// If simulcast is set, mangle the offer.
				if (producer.simulcast) {
					logger.debug('addProducer() | enabling simulcast');

					var sdpObject = _sdpTransform2.default.parse(offer.sdp);

					sdpPlanBUtils.addSimulcastForTrack(sdpObject, track);

					var offerSdp = _sdpTransform2.default.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug('replaceProducerTrack() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this5._pc.setLocalDescription(offer);
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this5._pc.localDescription.sdp);

				var remoteSdp = _this5._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('replaceProducerTrack() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this5._pc.setRemoteDescription(answer);
			}).then(function () {
				var rtpParameters = utils.clone(_this5._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for the new track.
				sdpPlanBUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				// We need to provide new RTP parameters.
				_this5.safeEmit('@needupdateproducer', producer, rtpParameters);
			}).catch(function (error) {
				// Panic here. Try to undo things.

				_this5._stream.removeTrack(track);
				_this5._stream.addTrack(oldTrack);
				_this5._pc.addStream(_this5._stream);

				throw error;
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this6 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				return _this6._pc.createOffer({ iceRestart: true });
			}).then(function (offer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this6._pc.setLocalDescription(offer);
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this6._pc.localDescription.sdp);
				var remoteSdp = _this6._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this6._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this7 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var sdp = _this7._pc.localDescription.sdp;
				var sdpObj = _sdpTransform2.default.parse(sdp);
				var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				_this7._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this7._transportReady = true;
			});
		}
	}]);

	return SendHandler;
}(Handler);

var RecvHandler = function (_Handler2) {
	_inherits(RecvHandler, _Handler2);

	function RecvHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, RecvHandler);

		// Got transport remote parameters.
		// @type {Boolean}
		var _this8 = _possibleConstructorReturn(this, (RecvHandler.__proto__ || Object.getPrototypeOf(RecvHandler)).call(this, 'recv', rtpParametersByKind, settings));

		_this8._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		_this8._transportUpdated = false;

		// Seen media kinds.
		// @type {Set<String>}
		_this8._kinds = new Set();

		// Map of Consumers information indexed by consumer.id.
		// - kind {String}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		_this8._consumerInfos = new Map();
		return _this8;
	}

	_createClass(RecvHandler, [{
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this9 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			var encoding = consumer.rtpParameters.encodings[0];
			var cname = consumer.rtpParameters.rtcp.cname;
			var consumerInfo = {
				kind: consumer.kind,
				streamId: 'recv-stream-' + consumer.id,
				trackId: 'consumer-' + consumer.kind + '-' + consumer.id,
				ssrc: encoding.ssrc,
				cname: cname
			};

			if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

			this._consumerInfos.set(consumer.id, consumerInfo);
			this._kinds.add(consumer.kind);

			return Promise.resolve().then(function () {
				if (!_this9._transportCreated) return _this9._setupTransport();
			}).then(function () {
				var remoteSdp = _this9._remoteSdp.createOfferSdp(Array.from(_this9._kinds), Array.from(_this9._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('addConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this9._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this9._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('addConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this9._pc.setLocalDescription(answer);
			}).then(function () {
				if (!_this9._transportUpdated) return _this9._updateTransport();
			}).then(function () {
				var stream = _this9._pc.getRemoteStreams().find(function (s) {
					return s.id === consumerInfo.streamId;
				});
				var track = stream.getTrackById(consumerInfo.trackId);

				if (!track) throw new Error('remote track not found');

				return track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this10 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (!this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer not found'));

			this._consumerInfos.delete(consumer.id);

			return Promise.resolve().then(function () {
				var remoteSdp = _this10._remoteSdp.createOfferSdp(Array.from(_this10._kinds), Array.from(_this10._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('removeConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this10._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this10._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('removeConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this10._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this11 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				var remoteSdp = _this11._remoteSdp.createOfferSdp(Array.from(_this11._kinds), Array.from(_this11._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this11._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this11._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this11._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this12 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// We need transport remote parameters.
				return _this12.safeEmitAsPromise('@needcreatetransport', null);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this12._transportCreated = true;
			});
		}
	}, {
		key: '_updateTransport',
		value: function _updateTransport() {
			logger.debug('_updateTransport()');

			// Get our local DTLS parameters.
			// const transportLocalParameters = {};
			var sdp = this._pc.localDescription.sdp;
			var sdpObj = _sdpTransform2.default.parse(sdp);
			var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);
			var transportLocalParameters = { dtlsParameters: dtlsParameters };

			// We need to provide transport local parameters.
			this.safeEmit('@needupdatetransport', transportLocalParameters);

			this._transportUpdated = true;
		}
	}]);

	return RecvHandler;
}(Handler);

var Chrome55 = function () {
	_createClass(Chrome55, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			var pc = new RTCPeerConnection({
				iceServers: [],
				iceTransportPolicy: 'all',
				bundlePolicy: 'max-bundle',
				rtcpMuxPolicy: 'require'
			});

			return pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			}).then(function (offer) {
				try {
					pc.close();
				} catch (error) {}

				var sdpObj = _sdpTransform2.default.parse(offer.sdp);
				var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);

				return nativeRtpCapabilities;
			}).catch(function (error) {
				try {
					pc.close();
				} catch (error2) {}

				throw error;
			});
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'Chrome55';
		}
	}]);

	function Chrome55(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, Chrome55);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		var rtpParametersByKind = void 0;

		switch (direction) {
			case 'send':
				{
					rtpParametersByKind = {
						audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
					};

					return new SendHandler(rtpParametersByKind, settings);
				}
			case 'recv':
				{
					rtpParametersByKind = {
						audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
					};

					return new RecvHandler(rtpParametersByKind, settings);
				}
		}
	}

	return Chrome55;
}();

exports.default = Chrome55;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./sdp/RemotePlanBSdp":183,"./sdp/commonUtils":185,"./sdp/planBUtils":186,"sdp-transform":216}],176:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _commonUtils = require('./sdp/commonUtils');

var sdpCommonUtils = _interopRequireWildcard(_commonUtils);

var _planBUtils = require('./sdp/planBUtils');

var sdpPlanBUtils = _interopRequireWildcard(_planBUtils);

var _RemotePlanBSdp = require('./sdp/RemotePlanBSdp');

var _RemotePlanBSdp2 = _interopRequireDefault(_RemotePlanBSdp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Chrome67');

var Handler = function (_EnhancedEventEmitter) {
	_inherits(Handler, _EnhancedEventEmitter);

	function Handler(direction, rtpParametersByKind, settings) {
		_classCallCheck(this, Handler);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, logger));

		_this._pc = new RTCPeerConnection({
			iceServers: settings.turnServers || [],
			iceTransportPolicy: 'all',
			bundlePolicy: 'max-bundle',
			rtcpMuxPolicy: 'require'
		});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemotePlanBSdp}
		_this._remoteSdp = new _RemotePlanBSdp2.default(direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		_this._pc.addEventListener('iceconnectionstatechange', function () {
			switch (_this._pc.iceConnectionState) {
				case 'checking':
					_this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					_this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					_this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					_this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					_this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
		return _this;
	}

	_createClass(Handler, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close RTCPeerConnection.
			try {
				this._pc.close();
			} catch (error) {}
		}
	}]);

	return Handler;
}(_EnhancedEventEmitter3.default);

var SendHandler = function (_Handler) {
	_inherits(SendHandler, _Handler);

	function SendHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, SendHandler);

		// Got transport local and remote parameters.
		// @type {Boolean}
		var _this2 = _possibleConstructorReturn(this, (SendHandler.__proto__ || Object.getPrototypeOf(SendHandler)).call(this, 'send', rtpParametersByKind, settings));

		_this2._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		_this2._stream = new MediaStream();
		return _this2;
	}

	_createClass(SendHandler, [{
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._stream.getTrackById(track.id)) return Promise.reject(new Error('track already added'));

			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				// Add the track to the local stream.
				_this3._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				_this3._pc.addStream(_this3._stream);

				return _this3._pc.createOffer();
			}).then(function (offer) {
				// If simulcast is set, mangle the offer.
				if (producer.simulcast) {
					logger.debug('addProducer() | enabling simulcast');

					var sdpObject = _sdpTransform2.default.parse(offer.sdp);

					sdpPlanBUtils.addSimulcastForTrack(sdpObject, track);

					var offerSdp = _sdpTransform2.default.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this3._pc.setLocalDescription(offer);
			}).then(function () {
				if (!_this3._transportReady) return _this3._setupTransport();
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this3._pc.localDescription.sdp);

				var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this3._pc.setRemoteDescription(answer);
			}).then(function () {
				var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				sdpPlanBUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				return rtpParameters;
			}).catch(function (error) {
				// Panic here. Try to undo things.

				_this3._stream.removeTrack(track);
				_this3._pc.addStream(_this3._stream);

				throw error;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this4 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				// Remove the track from the local stream.
				_this4._stream.removeTrack(track);

				// Add the stream to the PeerConnection.
				_this4._pc.addStream(_this4._stream);

				return _this4._pc.createOffer();
			}).then(function (offer) {
				logger.debug('removeProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this4._pc.setLocalDescription(offer);
			}).catch(function (error) {
				// NOTE: If there are no sending tracks, setLocalDescription() will fail with
				// "Failed to create channels". If so, ignore it.
				if (_this4._stream.getTracks().length === 0) {
					logger.warn('removeProducer() | ignoring expected error due no sending tracks: %s', error.toString());

					return;
				}

				throw error;
			}).then(function () {
				if (_this4._pc.signalingState === 'stable') return;

				var localSdpObj = _sdpTransform2.default.parse(_this4._pc.localDescription.sdp);
				var remoteSdp = _this4._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('removeProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this4._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this5 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			var oldTrack = producer.track;

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this5._pc.getSenders().find(function (s) {
					return s.track === oldTrack;
				});

				if (!rtpSender) throw new Error('local track not found');

				return rtpSender.replaceTrack(track);
			}).then(function () {
				// Remove the old track from the local stream.
				_this5._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				_this5._stream.addTrack(track);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this6 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				return _this6._pc.createOffer({ iceRestart: true });
			}).then(function (offer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this6._pc.setLocalDescription(offer);
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this6._pc.localDescription.sdp);
				var remoteSdp = _this6._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this6._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this7 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var sdp = _this7._pc.localDescription.sdp;
				var sdpObj = _sdpTransform2.default.parse(sdp);
				var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				_this7._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this7._transportReady = true;
			});
		}
	}]);

	return SendHandler;
}(Handler);

var RecvHandler = function (_Handler2) {
	_inherits(RecvHandler, _Handler2);

	function RecvHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, RecvHandler);

		// Got transport remote parameters.
		// @type {Boolean}
		var _this8 = _possibleConstructorReturn(this, (RecvHandler.__proto__ || Object.getPrototypeOf(RecvHandler)).call(this, 'recv', rtpParametersByKind, settings));

		_this8._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		_this8._transportUpdated = false;

		// Seen media kinds.
		// @type {Set<String>}
		_this8._kinds = new Set();

		// Map of Consumers information indexed by consumer.id.
		// - kind {String}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		_this8._consumerInfos = new Map();
		return _this8;
	}

	_createClass(RecvHandler, [{
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this9 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			var encoding = consumer.rtpParameters.encodings[0];
			var cname = consumer.rtpParameters.rtcp.cname;
			var consumerInfo = {
				kind: consumer.kind,
				streamId: 'recv-stream-' + consumer.id,
				trackId: 'consumer-' + consumer.kind + '-' + consumer.id,
				ssrc: encoding.ssrc,
				cname: cname
			};

			if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

			this._consumerInfos.set(consumer.id, consumerInfo);
			this._kinds.add(consumer.kind);

			return Promise.resolve().then(function () {
				if (!_this9._transportCreated) return _this9._setupTransport();
			}).then(function () {
				var remoteSdp = _this9._remoteSdp.createOfferSdp(Array.from(_this9._kinds), Array.from(_this9._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('addConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this9._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this9._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('addConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this9._pc.setLocalDescription(answer);
			}).then(function () {
				if (!_this9._transportUpdated) return _this9._updateTransport();
			}).then(function () {
				var stream = _this9._pc.getRemoteStreams().find(function (s) {
					return s.id === consumerInfo.streamId;
				});
				var track = stream.getTrackById(consumerInfo.trackId);

				if (!track) throw new Error('remote track not found');

				return track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this10 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (!this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer not found'));

			this._consumerInfos.delete(consumer.id);

			return Promise.resolve().then(function () {
				var remoteSdp = _this10._remoteSdp.createOfferSdp(Array.from(_this10._kinds), Array.from(_this10._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('removeConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this10._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this10._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('removeConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this10._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this11 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				var remoteSdp = _this11._remoteSdp.createOfferSdp(Array.from(_this11._kinds), Array.from(_this11._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this11._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this11._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this11._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this12 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// We need transport remote parameters.
				return _this12.safeEmitAsPromise('@needcreatetransport', null);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this12._transportCreated = true;
			});
		}
	}, {
		key: '_updateTransport',
		value: function _updateTransport() {
			logger.debug('_updateTransport()');

			// Get our local DTLS parameters.
			// const transportLocalParameters = {};
			var sdp = this._pc.localDescription.sdp;
			var sdpObj = _sdpTransform2.default.parse(sdp);
			var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);
			var transportLocalParameters = { dtlsParameters: dtlsParameters };

			// We need to provide transport local parameters.
			this.safeEmit('@needupdatetransport', transportLocalParameters);

			this._transportUpdated = true;
		}
	}]);

	return RecvHandler;
}(Handler);

var Chrome67 = function () {
	_createClass(Chrome67, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			var pc = new RTCPeerConnection({
				iceServers: [],
				iceTransportPolicy: 'all',
				bundlePolicy: 'max-bundle',
				rtcpMuxPolicy: 'require'
			});

			return pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			}).then(function (offer) {
				try {
					pc.close();
				} catch (error) {}

				var sdpObj = _sdpTransform2.default.parse(offer.sdp);
				var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);

				return nativeRtpCapabilities;
			}).catch(function (error) {
				try {
					pc.close();
				} catch (error2) {}

				throw error;
			});
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'Chrome67';
		}
	}]);

	function Chrome67(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, Chrome67);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		var rtpParametersByKind = void 0;

		switch (direction) {
			case 'send':
				{
					rtpParametersByKind = {
						audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
					};

					return new SendHandler(rtpParametersByKind, settings);
				}
			case 'recv':
				{
					rtpParametersByKind = {
						audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
					};

					return new RecvHandler(rtpParametersByKind, settings);
				}
		}
	}

	return Chrome67;
}();

exports.default = Chrome67;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./sdp/RemotePlanBSdp":183,"./sdp/commonUtils":185,"./sdp/planBUtils":186,"sdp-transform":216}],177:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _edgeUtils = require('./ortc/edgeUtils');

var edgeUtils = _interopRequireWildcard(_edgeUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global RTCIceGatherer, RTCIceTransport, RTCDtlsTransport, RTCRtpReceiver, RTCRtpSender */

var CNAME = 'CNAME-EDGE-' + utils.randomNumber();

var logger = new _Logger2.default('Edge11');

var Edge11 = function (_EnhancedEventEmitter) {
	_inherits(Edge11, _EnhancedEventEmitter);

	_createClass(Edge11, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			return edgeUtils.getCapabilities();
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'Edge11';
		}
	}]);

	function Edge11(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, Edge11);

		var _this = _possibleConstructorReturn(this, (Edge11.__proto__ || Object.getPrototypeOf(Edge11)).call(this, logger));

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = {
			audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
			video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
		};

		// Got transport local and remote parameters.
		// @type {Boolean}
		_this._transportReady = false;

		// ICE gatherer.
		_this._iceGatherer = null;

		// ICE transport.
		_this._iceTransport = null;

		// DTLS transport.
		// @type {RTCDtlsTransport}
		_this._dtlsTransport = null;

		// Map of RTCRtpSenders indexed by Producer.id.
		// @type {Map<Number, RTCRtpSender}
		_this._rtpSenders = new Map();

		// Map of RTCRtpReceivers indexed by Consumer.id.
		// @type {Map<Number, RTCRtpReceiver}
		_this._rtpReceivers = new Map();

		// Remote Transport parameters.
		// @type {Object}
		_this._transportRemoteParameters = null;

		_this._setIceGatherer(settings);
		_this._setIceTransport();
		_this._setDtlsTransport();
		return _this;
	}

	_createClass(Edge11, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close the ICE gatherer.
			// NOTE: Not yet implemented by Edge.
			try {
				this._iceGatherer.close();
			} catch (error) {}

			// Close the ICE transport.
			try {
				this._iceTransport.stop();
			} catch (error) {}

			// Close the DTLS transport.
			try {
				this._dtlsTransport.stop();
			} catch (error) {}

			// Close RTCRtpSenders.
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._rtpSenders.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var rtpSender = _step.value;

					try {
						rtpSender.stop();
					} catch (error) {}
				}

				// Close RTCRtpReceivers.
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this._rtpReceivers.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var rtpReceiver = _step2.value;

					try {
						rtpReceiver.stop();
					} catch (error) {}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	}, {
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this2 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._rtpSenders.has(producer.id)) return Promise.reject(new Error('Producer already added'));

			return Promise.resolve().then(function () {
				if (!_this2._transportReady) return _this2._setupTransport();
			}).then(function () {
				logger.debug('addProducer() | calling new RTCRtpSender()');

				var rtpSender = new RTCRtpSender(track, _this2._dtlsTransport);
				var rtpParameters = utils.clone(_this2._rtpParametersByKind[producer.kind]);

				// Fill RTCRtpParameters.encodings.
				var encoding = {
					ssrc: utils.randomNumber()
				};

				if (rtpParameters.codecs.some(function (codec) {
					return codec.name === 'rtx';
				})) {
					encoding.rtx = {
						ssrc: utils.randomNumber()
					};
				}

				rtpParameters.encodings.push(encoding);

				// Fill RTCRtpParameters.rtcp.
				rtpParameters.rtcp = {
					cname: CNAME,
					reducedSize: true,
					mux: true
				};

				// NOTE: Convert our standard RTCRtpParameters into those that Edge
				// expects.
				var edgeRtpParameters = edgeUtils.mangleRtpParameters(rtpParameters);

				logger.debug('addProducer() | calling rtpSender.send() [params:%o]', edgeRtpParameters);

				rtpSender.send(edgeRtpParameters);

				// Store it.
				_this2._rtpSenders.set(producer.id, rtpSender);

				return rtpParameters;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				var rtpSender = _this3._rtpSenders.get(producer.id);

				if (!rtpSender) throw new Error('RTCRtpSender not found');

				_this3._rtpSenders.delete(producer.id);

				try {
					logger.debug('removeProducer() | calling rtpSender.stop()');

					rtpSender.stop();
				} catch (error) {
					logger.warn('rtpSender.stop() failed:%o', error);
				}
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this4 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				var rtpSender = _this4._rtpSenders.get(producer.id);

				if (!rtpSender) throw new Error('RTCRtpSender not found');

				rtpSender.setTrack(track);
			});
		}
	}, {
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this5 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._rtpReceivers.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			return Promise.resolve().then(function () {
				if (!_this5._transportReady) return _this5._setupTransport();
			}).then(function () {
				logger.debug('addProducer() | calling new RTCRtpReceiver()');

				var rtpReceiver = new RTCRtpReceiver(_this5._dtlsTransport, consumer.kind);

				rtpReceiver.addEventListener('error', function (event) {
					logger.error('iceGatherer "error" event [event:%o]', event);
				});

				// NOTE: Convert our standard RTCRtpParameters into those that Edge
				// expects.
				var edgeRtpParameters = edgeUtils.mangleRtpParameters(consumer.rtpParameters);

				logger.debug('addProducer() | calling rtpReceiver.receive() [params:%o]', edgeRtpParameters);

				rtpReceiver.receive(edgeRtpParameters);

				// Store it.
				_this5._rtpReceivers.set(consumer.id, rtpReceiver);

				return rtpReceiver.track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this6 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			return Promise.resolve().then(function () {
				var rtpReceiver = _this6._rtpReceivers.get(consumer.id);

				if (!rtpReceiver) throw new Error('RTCRtpReceiver not found');

				_this6._rtpReceivers.delete(consumer.id);

				try {
					logger.debug('removeConsumer() | calling rtpReceiver.stop()');

					rtpReceiver.stop();
				} catch (error) {
					logger.warn('rtpReceiver.stop() failed:%o', error);
				}
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this7 = this;

			logger.debug('restartIce()');

			Promise.resolve().then(function () {
				_this7._transportRemoteParameters.iceParameters = remoteIceParameters;

				var remoteIceCandidates = _this7._transportRemoteParameters.iceCandidates;

				logger.debug('restartIce() | calling iceTransport.start()');

				_this7._iceTransport.start(_this7._iceGatherer, remoteIceParameters, 'controlling');

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = remoteIceCandidates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var candidate = _step3.value;

						_this7._iceTransport.addRemoteCandidate(candidate);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				_this7._iceTransport.addRemoteCandidate({});
			});
		}
	}, {
		key: '_setIceGatherer',
		value: function _setIceGatherer(settings) {
			var iceGatherer = new RTCIceGatherer({
				iceServers: settings.turnServers || [],
				gatherPolicy: 'all'
			});

			iceGatherer.addEventListener('error', function (event) {
				logger.error('iceGatherer "error" event [event:%o]', event);
			});

			// NOTE: Not yet implemented by Edge, which starts gathering automatically.
			try {
				iceGatherer.gather();
			} catch (error) {
				logger.debug('iceGatherer.gather() failed: %s', error.toString());
			}

			this._iceGatherer = iceGatherer;
		}
	}, {
		key: '_setIceTransport',
		value: function _setIceTransport() {
			var _this8 = this;

			var iceTransport = new RTCIceTransport(this._iceGatherer);

			// NOTE: Not yet implemented by Edge.
			iceTransport.addEventListener('statechange', function () {
				switch (iceTransport.state) {
					case 'checking':
						_this8.emit('@connectionstatechange', 'connecting');
						break;
					case 'connected':
					case 'completed':
						_this8.emit('@connectionstatechange', 'connected');
						break;
					case 'failed':
						_this8.emit('@connectionstatechange', 'failed');
						break;
					case 'disconnected':
						_this8.emit('@connectionstatechange', 'disconnected');
						break;
					case 'closed':
						_this8.emit('@connectionstatechange', 'closed');
						break;
				}
			});

			// NOTE: Not standard, but implemented by Edge.
			iceTransport.addEventListener('icestatechange', function () {
				switch (iceTransport.state) {
					case 'checking':
						_this8.emit('@connectionstatechange', 'connecting');
						break;
					case 'connected':
					case 'completed':
						_this8.emit('@connectionstatechange', 'connected');
						break;
					case 'failed':
						_this8.emit('@connectionstatechange', 'failed');
						break;
					case 'disconnected':
						_this8.emit('@connectionstatechange', 'disconnected');
						break;
					case 'closed':
						_this8.emit('@connectionstatechange', 'closed');
						break;
				}
			});

			iceTransport.addEventListener('candidatepairchange', function (event) {
				logger.debug('iceTransport "candidatepairchange" event [pair:%o]', event.pair);
			});

			this._iceTransport = iceTransport;
		}
	}, {
		key: '_setDtlsTransport',
		value: function _setDtlsTransport() {
			var dtlsTransport = new RTCDtlsTransport(this._iceTransport);

			// NOTE: Not yet implemented by Edge.
			dtlsTransport.addEventListener('statechange', function () {
				logger.debug('dtlsTransport "statechange" event [state:%s]', dtlsTransport.state);
			});

			// NOTE: Not standard, but implemented by Edge.
			dtlsTransport.addEventListener('dtlsstatechange', function () {
				logger.debug('dtlsTransport "dtlsstatechange" event [state:%s]', dtlsTransport.state);
			});

			dtlsTransport.addEventListener('error', function (event) {
				logger.error('dtlsTransport "error" event [event:%o]', event);
			});

			this._dtlsTransport = dtlsTransport;
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this9 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var dtlsParameters = _this9._dtlsTransport.getLocalParameters();

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// We need transport remote parameters.
				return _this9.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				_this9._transportRemoteParameters = transportRemoteParameters;

				var remoteIceParameters = transportRemoteParameters.iceParameters;
				var remoteIceCandidates = transportRemoteParameters.iceCandidates;
				var remoteDtlsParameters = transportRemoteParameters.dtlsParameters;

				// Start the RTCIceTransport.
				_this9._iceTransport.start(_this9._iceGatherer, remoteIceParameters, 'controlling');

				// Add remote ICE candidates.
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = remoteIceCandidates[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var candidate = _step4.value;

						_this9._iceTransport.addRemoteCandidate(candidate);
					}

					// Also signal a 'complete' candidate as per spec.
					// NOTE: It should be {complete: true} but Edge prefers {}.
					// NOTE: If we don't signal end of candidates, the Edge RTCIceTransport
					// won't enter the 'completed' state.
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}

				_this9._iceTransport.addRemoteCandidate({});

				// NOTE: Edge does not like SHA less than 256.
				remoteDtlsParameters.fingerprints = remoteDtlsParameters.fingerprints.filter(function (fingerprint) {
					return fingerprint.algorithm === 'sha-256' || fingerprint.algorithm === 'sha-384' || fingerprint.algorithm === 'sha-512';
				});

				// Start the RTCDtlsTransport.
				_this9._dtlsTransport.start(remoteDtlsParameters);

				_this9._transportReady = true;
			});
		}
	}]);

	return Edge11;
}(_EnhancedEventEmitter3.default);

exports.default = Edge11;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./ortc/edgeUtils":182}],178:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _commonUtils = require('./sdp/commonUtils');

var sdpCommonUtils = _interopRequireWildcard(_commonUtils);

var _unifiedPlanUtils = require('./sdp/unifiedPlanUtils');

var sdpUnifiedPlanUtils = _interopRequireWildcard(_unifiedPlanUtils);

var _RemoteUnifiedPlanSdp = require('./sdp/RemoteUnifiedPlanSdp');

var _RemoteUnifiedPlanSdp2 = _interopRequireDefault(_RemoteUnifiedPlanSdp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Firefox50');

var Handler = function (_EnhancedEventEmitter) {
	_inherits(Handler, _EnhancedEventEmitter);

	function Handler(direction, rtpParametersByKind, settings) {
		_classCallCheck(this, Handler);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, logger));

		_this._pc = new RTCPeerConnection({
			iceServers: settings.turnServers || [],
			iceTransportPolicy: 'all',
			bundlePolicy: 'max-bundle',
			rtcpMuxPolicy: 'require'
		});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemoteUnifiedPlanSdp}
		_this._remoteSdp = new _RemoteUnifiedPlanSdp2.default(direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		_this._pc.addEventListener('iceconnectionstatechange', function () {
			switch (_this._pc.iceConnectionState) {
				case 'checking':
					_this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					_this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					_this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					_this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					_this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
		return _this;
	}

	_createClass(Handler, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close RTCPeerConnection.
			try {
				this._pc.close();
			} catch (error) {}
		}
	}]);

	return Handler;
}(_EnhancedEventEmitter3.default);

var SendHandler = function (_Handler) {
	_inherits(SendHandler, _Handler);

	function SendHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, SendHandler);

		// Got transport local and remote parameters.
		// @type {Boolean}
		var _this2 = _possibleConstructorReturn(this, (SendHandler.__proto__ || Object.getPrototypeOf(SendHandler)).call(this, 'send', rtpParametersByKind, settings));

		_this2._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		_this2._stream = new MediaStream();

		// RID value counter for simulcast (so they never match).
		// @type {Number}
		_this2._nextRid = 1;
		return _this2;
	}

	_createClass(SendHandler, [{
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._stream.getTrackById(track.id)) return Promise.reject(new Error('track already added'));

			var rtpSender = void 0;
			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				_this3._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				rtpSender = _this3._pc.addTrack(track, _this3._stream);
			}).then(function () {
				// If simulcast is not enabled, do nothing.
				if (!producer.simulcast) return;

				logger.debug('addProducer() | enabling simulcast');

				var encodings = [];

				if (producer.simulcast.high) {
					encodings.push({
						rid: 'high' + _this3._nextRid,
						active: true,
						priority: 'high',
						maxBitrate: producer.simulcast.high
					});
				}

				if (producer.simulcast.medium) {
					encodings.push({
						rid: 'medium' + _this3._nextRid,
						active: true,
						priority: 'medium',
						maxBitrate: producer.simulcast.medium
					});
				}

				if (producer.simulcast.low) {
					encodings.push({
						rid: 'low' + _this3._nextRid,
						active: true,
						priority: 'low',
						maxBitrate: producer.simulcast.low
					});
				}

				// Update RID counter for future ones.
				_this3._nextRid++;

				return rtpSender.setParameters({ encodings: encodings });
			}).then(function () {
				return _this3._pc.createOffer();
			}).then(function (offer) {
				logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this3._pc.setLocalDescription(offer);
			}).then(function () {
				if (!_this3._transportReady) return _this3._setupTransport();
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this3._pc.localDescription.sdp);

				var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this3._pc.setRemoteDescription(answer);
			}).then(function () {
				var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				sdpUnifiedPlanUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				return rtpParameters;
			}).catch(function (error) {
				// Panic here. Try to undo things.

				try {
					_this3._pc.removeTrack(rtpSender);
				} catch (error2) {}

				_this3._stream.removeTrack(track);

				throw error;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this4 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this4._pc.getSenders().find(function (s) {
					return s.track === track;
				});

				if (!rtpSender) throw new Error('RTCRtpSender found');

				// Remove the associated RtpSender.
				_this4._pc.removeTrack(rtpSender);

				// Remove the track from the local stream.
				_this4._stream.removeTrack(track);

				return Promise.resolve().then(function () {
					return _this4._pc.createOffer();
				}).then(function (offer) {
					logger.debug('removeProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

					return _this4._pc.setLocalDescription(offer);
				});
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this4._pc.localDescription.sdp);
				var remoteSdp = _this4._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('removeProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this4._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this5 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			var oldTrack = producer.track;

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this5._pc.getSenders().find(function (s) {
					return s.track === oldTrack;
				});

				if (!rtpSender) throw new Error('local track not found');

				return rtpSender.replaceTrack(track);
			}).then(function () {
				// Remove the old track from the local stream.
				_this5._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				_this5._stream.addTrack(track);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this6 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				return _this6._pc.createOffer({ iceRestart: true });
			}).then(function (offer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this6._pc.setLocalDescription(offer);
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this6._pc.localDescription.sdp);
				var remoteSdp = _this6._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this6._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this7 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var sdp = _this7._pc.localDescription.sdp;
				var sdpObj = _sdpTransform2.default.parse(sdp);
				var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				_this7._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this7._transportReady = true;
			});
		}
	}]);

	return SendHandler;
}(Handler);

var RecvHandler = function (_Handler2) {
	_inherits(RecvHandler, _Handler2);

	function RecvHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, RecvHandler);

		// Got transport remote parameters.
		// @type {Boolean}
		var _this8 = _possibleConstructorReturn(this, (RecvHandler.__proto__ || Object.getPrototypeOf(RecvHandler)).call(this, 'recv', rtpParametersByKind, settings));

		_this8._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		_this8._transportUpdated = false;

		// Map of Consumers information indexed by consumer.id.
		// - mid {String}
		// - kind {String}
		// - closed {Boolean}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		_this8._consumerInfos = new Map();

		// Add an entry into consumers info to hold a fake DataChannel, so
		// the first m= section of the remote SDP is always "active" and Firefox
		// does not close the transport when there is no remote audio/video Consumers.
		//
		// ISSUE: https://github.com/versatica/mediasoup-client/issues/2
		var fakeDataChannelConsumerInfo = {
			mid: 'fake-dc',
			kind: 'application',
			closed: false,
			cname: null
		};

		_this8._consumerInfos.set(555, fakeDataChannelConsumerInfo);
		return _this8;
	}

	_createClass(RecvHandler, [{
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this9 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			var encoding = consumer.rtpParameters.encodings[0];
			var cname = consumer.rtpParameters.rtcp.cname;
			var consumerInfo = {
				mid: '' + consumer.kind[0] + consumer.id,
				kind: consumer.kind,
				closed: consumer.closed,
				streamId: 'recv-stream-' + consumer.id,
				trackId: 'consumer-' + consumer.kind + '-' + consumer.id,
				ssrc: encoding.ssrc,
				cname: cname
			};

			if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

			this._consumerInfos.set(consumer.id, consumerInfo);

			return Promise.resolve().then(function () {
				if (!_this9._transportCreated) return _this9._setupTransport();
			}).then(function () {
				var remoteSdp = _this9._remoteSdp.createOfferSdp(Array.from(_this9._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('addConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this9._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this9._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('addConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this9._pc.setLocalDescription(answer);
			}).then(function () {
				if (!_this9._transportUpdated) return _this9._updateTransport();
			}).then(function () {
				var newRtpReceiver = _this9._pc.getReceivers().find(function (rtpReceiver) {
					var track = rtpReceiver.track;


					if (!track) return false;

					return track.id === consumerInfo.trackId;
				});

				if (!newRtpReceiver) throw new Error('remote track not found');

				return newRtpReceiver.track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this10 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			var consumerInfo = this._consumerInfos.get(consumer.id);

			if (!consumerInfo) return Promise.reject(new Error('Consumer not found'));

			consumerInfo.closed = true;

			return Promise.resolve().then(function () {
				var remoteSdp = _this10._remoteSdp.createOfferSdp(Array.from(_this10._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('removeConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this10._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this10._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('removeConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this10._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this11 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				var remoteSdp = _this11._remoteSdp.createOfferSdp(Array.from(_this11._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this11._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this11._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this11._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this12 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// We need transport remote parameters.
				return _this12.safeEmitAsPromise('@needcreatetransport', null);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this12._transportCreated = true;
			});
		}
	}, {
		key: '_updateTransport',
		value: function _updateTransport() {
			logger.debug('_updateTransport()');

			// Get our local DTLS parameters.
			// const transportLocalParameters = {};
			var sdp = this._pc.localDescription.sdp;
			var sdpObj = _sdpTransform2.default.parse(sdp);
			var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);
			var transportLocalParameters = { dtlsParameters: dtlsParameters };

			// We need to provide transport local parameters.
			this.safeEmit('@needupdatetransport', transportLocalParameters);

			this._transportUpdated = true;
		}
	}]);

	return RecvHandler;
}(Handler);

var Firefox50 = function () {
	_createClass(Firefox50, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			var pc = new RTCPeerConnection({
				iceServers: [],
				iceTransportPolicy: 'all',
				bundlePolicy: 'max-bundle',
				rtcpMuxPolicy: 'require'
			});

			// NOTE: We need to add a real video track to get the RID extension mapping.
			var canvas = document.createElement('canvas');

			// NOTE: Otherwise Firefox fails in next line.
			canvas.getContext('2d');

			var fakeStream = canvas.captureStream();
			var fakeVideoTrack = fakeStream.getVideoTracks()[0];
			var rtpSender = pc.addTrack(fakeVideoTrack, fakeStream);

			rtpSender.setParameters({
				encodings: [{ rid: 'RID1', maxBitrate: 40000 }, { rid: 'RID2', maxBitrate: 10000 }]
			});

			return pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			}).then(function (offer) {
				try {
					canvas.remove();
				} catch (error) {}

				try {
					pc.close();
				} catch (error) {}

				var sdpObj = _sdpTransform2.default.parse(offer.sdp);
				var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);

				return nativeRtpCapabilities;
			}).catch(function (error) {
				try {
					canvas.remove();
				} catch (error2) {}

				try {
					pc.close();
				} catch (error2) {}

				throw error;
			});
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'Firefox50';
		}
	}]);

	function Firefox50(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, Firefox50);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		var rtpParametersByKind = void 0;

		switch (direction) {
			case 'send':
				{
					rtpParametersByKind = {
						audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
					};

					return new SendHandler(rtpParametersByKind, settings);
				}
			case 'recv':
				{
					rtpParametersByKind = {
						audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
					};

					return new RecvHandler(rtpParametersByKind, settings);
				}
		}
	}

	return Firefox50;
}();

exports.default = Firefox50;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./sdp/RemoteUnifiedPlanSdp":184,"./sdp/commonUtils":185,"./sdp/unifiedPlanUtils":187,"sdp-transform":216}],179:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _commonUtils = require('./sdp/commonUtils');

var sdpCommonUtils = _interopRequireWildcard(_commonUtils);

var _unifiedPlanUtils = require('./sdp/unifiedPlanUtils');

var sdpUnifiedPlanUtils = _interopRequireWildcard(_unifiedPlanUtils);

var _RemoteUnifiedPlanSdp = require('./sdp/RemoteUnifiedPlanSdp');

var _RemoteUnifiedPlanSdp2 = _interopRequireDefault(_RemoteUnifiedPlanSdp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Firefox59');

var Handler = function (_EnhancedEventEmitter) {
	_inherits(Handler, _EnhancedEventEmitter);

	function Handler(direction, rtpParametersByKind, settings) {
		_classCallCheck(this, Handler);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, logger));

		_this._pc = new RTCPeerConnection({
			iceServers: settings.turnServers || [],
			iceTransportPolicy: 'all',
			bundlePolicy: 'max-bundle',
			rtcpMuxPolicy: 'require'
		});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemoteUnifiedPlanSdp}
		_this._remoteSdp = new _RemoteUnifiedPlanSdp2.default(direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		_this._pc.addEventListener('iceconnectionstatechange', function () {
			switch (_this._pc.iceConnectionState) {
				case 'checking':
					_this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					_this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					_this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					_this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					_this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
		return _this;
	}

	_createClass(Handler, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close RTCPeerConnection.
			try {
				this._pc.close();
			} catch (error) {}
		}
	}]);

	return Handler;
}(_EnhancedEventEmitter3.default);

var SendHandler = function (_Handler) {
	_inherits(SendHandler, _Handler);

	function SendHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, SendHandler);

		// Got transport local and remote parameters.
		// @type {Boolean}
		var _this2 = _possibleConstructorReturn(this, (SendHandler.__proto__ || Object.getPrototypeOf(SendHandler)).call(this, 'send', rtpParametersByKind, settings));

		_this2._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		_this2._stream = new MediaStream();

		// RID value counter for simulcast (so they never match).
		// @type {Number}
		_this2._nextRid = 1;
		return _this2;
	}

	_createClass(SendHandler, [{
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._stream.getTrackById(track.id)) return Promise.reject(new Error('track already added'));

			var rtpSender = void 0;
			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				_this3._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				rtpSender = _this3._pc.addTrack(track, _this3._stream);
			}).then(function () {
				// If simulcast is not enabled, do nothing.
				if (!producer.simulcast) return;

				logger.debug('addProducer() | enabling simulcast');

				var encodings = [];

				if (producer.simulcast.high) {
					encodings.push({
						rid: 'high' + _this3._nextRid,
						active: true,
						priority: 'high',
						maxBitrate: producer.simulcast.high
					});
				}

				if (producer.simulcast.medium) {
					encodings.push({
						rid: 'medium' + _this3._nextRid,
						active: true,
						priority: 'medium',
						maxBitrate: producer.simulcast.medium
					});
				}

				if (producer.simulcast.low) {
					encodings.push({
						rid: 'low' + _this3._nextRid,
						active: true,
						priority: 'low',
						maxBitrate: producer.simulcast.low
					});
				}

				// Update RID counter for future ones.
				_this3._nextRid++;

				return rtpSender.setParameters({ encodings: encodings });
			}).then(function () {
				return _this3._pc.createOffer();
			}).then(function (offer) {
				logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this3._pc.setLocalDescription(offer);
			}).then(function () {
				if (!_this3._transportReady) return _this3._setupTransport();
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this3._pc.localDescription.sdp);

				var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this3._pc.setRemoteDescription(answer);
			}).then(function () {
				var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				sdpUnifiedPlanUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				return rtpParameters;
			}).catch(function (error) {
				// Panic here. Try to undo things.

				try {
					_this3._pc.removeTrack(rtpSender);
				} catch (error2) {}

				_this3._stream.removeTrack(track);

				throw error;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this4 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this4._pc.getSenders().find(function (s) {
					return s.track === track;
				});

				if (!rtpSender) throw new Error('RTCRtpSender found');

				// Remove the associated RtpSender.
				_this4._pc.removeTrack(rtpSender);

				// Remove the track from the local stream.
				_this4._stream.removeTrack(track);

				return Promise.resolve().then(function () {
					return _this4._pc.createOffer();
				}).then(function (offer) {
					logger.debug('removeProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

					return _this4._pc.setLocalDescription(offer);
				});
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this4._pc.localDescription.sdp);
				var remoteSdp = _this4._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('removeProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this4._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this5 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			var oldTrack = producer.track;

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this5._pc.getSenders().find(function (s) {
					return s.track === oldTrack;
				});

				if (!rtpSender) throw new Error('local track not found');

				return rtpSender.replaceTrack(track);
			}).then(function () {
				// Remove the old track from the local stream.
				_this5._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				_this5._stream.addTrack(track);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this6 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				return _this6._pc.createOffer({ iceRestart: true });
			}).then(function (offer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this6._pc.setLocalDescription(offer);
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this6._pc.localDescription.sdp);
				var remoteSdp = _this6._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this6._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this7 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var sdp = _this7._pc.localDescription.sdp;
				var sdpObj = _sdpTransform2.default.parse(sdp);
				var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				_this7._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this7._transportReady = true;
			});
		}
	}]);

	return SendHandler;
}(Handler);

var RecvHandler = function (_Handler2) {
	_inherits(RecvHandler, _Handler2);

	function RecvHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, RecvHandler);

		// Got transport remote parameters.
		// @type {Boolean}
		var _this8 = _possibleConstructorReturn(this, (RecvHandler.__proto__ || Object.getPrototypeOf(RecvHandler)).call(this, 'recv', rtpParametersByKind, settings));

		_this8._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		_this8._transportUpdated = false;

		// Map of Consumers information indexed by consumer.id.
		// - mid {String}
		// - kind {String}
		// - closed {Boolean}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		_this8._consumerInfos = new Map();
		return _this8;
	}

	_createClass(RecvHandler, [{
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this9 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			var encoding = consumer.rtpParameters.encodings[0];
			var cname = consumer.rtpParameters.rtcp.cname;
			var consumerInfo = {
				mid: '' + consumer.kind[0] + consumer.id,
				kind: consumer.kind,
				closed: consumer.closed,
				streamId: 'recv-stream-' + consumer.id,
				trackId: 'consumer-' + consumer.kind + '-' + consumer.id,
				ssrc: encoding.ssrc,
				cname: cname
			};

			if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

			this._consumerInfos.set(consumer.id, consumerInfo);

			return Promise.resolve().then(function () {
				if (!_this9._transportCreated) return _this9._setupTransport();
			}).then(function () {
				var remoteSdp = _this9._remoteSdp.createOfferSdp(Array.from(_this9._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('addConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this9._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this9._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('addConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this9._pc.setLocalDescription(answer);
			}).then(function () {
				if (!_this9._transportUpdated) return _this9._updateTransport();
			}).then(function () {
				var newTransceiver = _this9._pc.getTransceivers().find(function (transceiver) {
					var receiver = transceiver.receiver;


					if (!receiver) return false;

					var track = receiver.track;


					if (!track) return false;

					return transceiver.mid === consumerInfo.mid;
				});

				if (!newTransceiver) throw new Error('remote track not found');

				return newTransceiver.receiver.track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this10 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			var consumerInfo = this._consumerInfos.get(consumer.id);

			if (!consumerInfo) return Promise.reject(new Error('Consumer not found'));

			consumerInfo.closed = true;

			return Promise.resolve().then(function () {
				var remoteSdp = _this10._remoteSdp.createOfferSdp(Array.from(_this10._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('removeConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this10._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this10._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('removeConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this10._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this11 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				var remoteSdp = _this11._remoteSdp.createOfferSdp(Array.from(_this11._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this11._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this11._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this11._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this12 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// We need transport remote parameters.
				return _this12.safeEmitAsPromise('@needcreatetransport', null);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this12._transportCreated = true;
			});
		}
	}, {
		key: '_updateTransport',
		value: function _updateTransport() {
			logger.debug('_updateTransport()');

			// Get our local DTLS parameters.
			// const transportLocalParameters = {};
			var sdp = this._pc.localDescription.sdp;
			var sdpObj = _sdpTransform2.default.parse(sdp);
			var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);
			var transportLocalParameters = { dtlsParameters: dtlsParameters };

			// We need to provide transport local parameters.
			this.safeEmit('@needupdatetransport', transportLocalParameters);

			this._transportUpdated = true;
		}
	}]);

	return RecvHandler;
}(Handler);

var Firefox59 = function () {
	_createClass(Firefox59, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			var pc = new RTCPeerConnection({
				iceServers: [],
				iceTransportPolicy: 'all',
				bundlePolicy: 'max-bundle',
				rtcpMuxPolicy: 'require'
			});

			// NOTE: We need to add a real video track to get the RID extension mapping.
			var canvas = document.createElement('canvas');

			// NOTE: Otherwise Firefox fails in next line.
			canvas.getContext('2d');

			var fakeStream = canvas.captureStream();
			var fakeVideoTrack = fakeStream.getVideoTracks()[0];
			var rtpSender = pc.addTrack(fakeVideoTrack, fakeStream);

			rtpSender.setParameters({
				encodings: [{ rid: 'RID1', maxBitrate: 40000 }, { rid: 'RID2', maxBitrate: 10000 }]
			});

			return pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			}).then(function (offer) {
				try {
					canvas.remove();
				} catch (error) {}

				try {
					pc.close();
				} catch (error) {}

				var sdpObj = _sdpTransform2.default.parse(offer.sdp);
				var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);

				return nativeRtpCapabilities;
			}).catch(function (error) {
				try {
					canvas.remove();
				} catch (error2) {}

				try {
					pc.close();
				} catch (error2) {}

				throw error;
			});
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'Firefox59';
		}
	}]);

	function Firefox59(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, Firefox59);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		var rtpParametersByKind = void 0;

		switch (direction) {
			case 'send':
				{
					rtpParametersByKind = {
						audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
					};

					return new SendHandler(rtpParametersByKind, settings);
				}
			case 'recv':
				{
					rtpParametersByKind = {
						audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
					};

					return new RecvHandler(rtpParametersByKind, settings);
				}
		}
	}

	return Firefox59;
}();

exports.default = Firefox59;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./sdp/RemoteUnifiedPlanSdp":184,"./sdp/commonUtils":185,"./sdp/unifiedPlanUtils":187,"sdp-transform":216}],180:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _commonUtils = require('./sdp/commonUtils');

var sdpCommonUtils = _interopRequireWildcard(_commonUtils);

var _planBUtils = require('./sdp/planBUtils');

var sdpPlanBUtils = _interopRequireWildcard(_planBUtils);

var _RemotePlanBSdp = require('./sdp/RemotePlanBSdp');

var _RemotePlanBSdp2 = _interopRequireDefault(_RemotePlanBSdp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('ReactNative');

var Handler = function (_EnhancedEventEmitter) {
	_inherits(Handler, _EnhancedEventEmitter);

	function Handler(direction, rtpParametersByKind, settings) {
		_classCallCheck(this, Handler);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, logger));

		_this._pc = new RTCPeerConnection({
			iceServers: settings.turnServers || [],
			iceTransportPolicy: 'all',
			bundlePolicy: 'max-bundle',
			rtcpMuxPolicy: 'require'
		});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemotePlanBSdp}
		_this._remoteSdp = new _RemotePlanBSdp2.default(direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		_this._pc.addEventListener('iceconnectionstatechange', function () {
			switch (_this._pc.iceConnectionState) {
				case 'checking':
					_this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					_this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					_this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					_this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					_this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
		return _this;
	}

	_createClass(Handler, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close RTCPeerConnection.
			try {
				this._pc.close();
			} catch (error) {}
		}
	}]);

	return Handler;
}(_EnhancedEventEmitter3.default);

var SendHandler = function (_Handler) {
	_inherits(SendHandler, _Handler);

	function SendHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, SendHandler);

		// Got transport local and remote parameters.
		// @type {Boolean}
		var _this2 = _possibleConstructorReturn(this, (SendHandler.__proto__ || Object.getPrototypeOf(SendHandler)).call(this, 'send', rtpParametersByKind, settings));

		_this2._transportReady = false;

		// Handled tracks.
		// @type {Set<MediaStreamTrack>}
		_this2._tracks = new Set();
		return _this2;
	}

	_createClass(SendHandler, [{
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._tracks.has(track)) return Promise.reject(new Error('track already added'));

			if (!track.streamReactTag) return Promise.reject(new Error('no track.streamReactTag property'));

			var stream = void 0;
			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				// Add the track to the Set.
				_this3._tracks.add(track);

				// Hack: Create a new stream with track.streamReactTag as id.
				stream = new MediaStream(track.streamReactTag);

				// Add the track to the stream.
				stream.addTrack(track);

				// Add the stream to the PeerConnection.
				_this3._pc.addStream(stream);

				return _this3._pc.createOffer();
			}).then(function (offer) {
				// If simulcast is set, mangle the offer.
				if (producer.simulcast) {
					logger.debug('addProducer() | enabling simulcast');

					var sdpObject = _sdpTransform2.default.parse(offer.sdp);

					sdpPlanBUtils.addSimulcastForTrack(sdpObject, track);

					var offerSdp = _sdpTransform2.default.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				var offerDesc = new RTCSessionDescription(offer);

				return _this3._pc.setLocalDescription(offerDesc);
			}).then(function () {
				if (!_this3._transportReady) return _this3._setupTransport();
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this3._pc.localDescription.sdp);

				var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				var answerDesc = new RTCSessionDescription(answer);

				return _this3._pc.setRemoteDescription(answerDesc);
			}).then(function () {
				var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				sdpPlanBUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				return rtpParameters;
			}).catch(function (error) {
				// Panic here. Try to undo things.

				_this3._tracks.delete(track);
				stream.removeTrack(track);
				_this3._pc.addStream(stream);

				throw error;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this4 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (!track.streamReactTag) return Promise.reject(new Error('no track.streamReactTag property'));

			return Promise.resolve().then(function () {
				// Remove the track from the Set.
				_this4._tracks.delete(track);

				// Hack: Create a new stream with track.streamReactTag as id.
				var stream = new MediaStream(track.streamReactTag);

				// Add the track to the stream.
				stream.addTrack(track);

				// Add the stream to the PeerConnection.
				_this4._pc.addStream(stream);

				return _this4._pc.createOffer();
			}).then(function (offer) {
				logger.debug('removeProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this4._pc.setLocalDescription(offer);
			}).catch(function (error) {
				// NOTE: If there are no sending tracks, setLocalDescription() will fail with
				// "Failed to create channels". If so, ignore it.
				if (_this4._tracks.size === 0) {
					logger.warn('removeProducer() | ignoring expected error due no sending tracks: %s', error.toString());

					return;
				}

				throw error;
			}).then(function () {
				if (_this4._pc.signalingState === 'stable') return;

				var localSdpObj = _sdpTransform2.default.parse(_this4._pc.localDescription.sdp);
				var remoteSdp = _this4._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('removeProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				var answerDesc = new RTCSessionDescription(answer);

				return _this4._pc.setRemoteDescription(answerDesc);
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this5 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (!track.streamReactTag) return Promise.reject(new Error('no track.streamReactTag property'));

			var oldTrack = producer.track;
			var stream = void 0;
			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				// Add the new Track to the Set and remove the old one.
				_this5._tracks.add(track);
				_this5._tracks.delete(oldTrack);

				// Hack: Create a new stream with track.streamReactTag as id.
				stream = new MediaStream(track.streamReactTag);

				// Add the track to the stream and remove the old one.
				stream.addTrack(track);
				stream.removeTrack(oldTrack);

				// Add the stream to the PeerConnection.
				_this5._pc.addStream(stream);

				return _this5._pc.createOffer();
			}).then(function (offer) {
				// If simulcast is set, mangle the offer.
				if (producer.simulcast) {
					logger.debug('addProducer() | enabling simulcast');

					var sdpObject = _sdpTransform2.default.parse(offer.sdp);

					sdpPlanBUtils.addSimulcastForTrack(sdpObject, track);

					var offerSdp = _sdpTransform2.default.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug('replaceProducerTrack() | calling pc.setLocalDescription() [offer:%o]', offer);

				var offerDesc = new RTCSessionDescription(offer);

				return _this5._pc.setLocalDescription(offerDesc);
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this5._pc.localDescription.sdp);

				var remoteSdp = _this5._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('replaceProducerTrack() | calling pc.setRemoteDescription() [answer:%o]', answer);

				var answerDesc = new RTCSessionDescription(answer);

				return _this5._pc.setRemoteDescription(answerDesc);
			}).then(function () {
				var rtpParameters = utils.clone(_this5._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for the new track.
				sdpPlanBUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				// We need to provide new RTP parameters.
				_this5.safeEmit('@needupdateproducer', producer, rtpParameters);
			}).catch(function (error) {
				// Panic here. Try to undo things.

				_this5._tracks.delete(track);
				stream.removeTrack(track);
				_this5._pc.addStream(stream);

				throw error;
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this6 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				return _this6._pc.createOffer({ iceRestart: true });
			}).then(function (offer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this6._pc.setLocalDescription(offer);
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this6._pc.localDescription.sdp);
				var remoteSdp = _this6._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

				var answerDesc = new RTCSessionDescription(answer);

				return _this6._pc.setRemoteDescription(answerDesc);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this7 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var sdp = _this7._pc.localDescription.sdp;
				var sdpObj = _sdpTransform2.default.parse(sdp);
				var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				_this7._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this7._transportReady = true;
			});
		}
	}]);

	return SendHandler;
}(Handler);

var RecvHandler = function (_Handler2) {
	_inherits(RecvHandler, _Handler2);

	function RecvHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, RecvHandler);

		// Got transport remote parameters.
		// @type {Boolean}
		var _this8 = _possibleConstructorReturn(this, (RecvHandler.__proto__ || Object.getPrototypeOf(RecvHandler)).call(this, 'recv', rtpParametersByKind, settings));

		_this8._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		_this8._transportUpdated = false;

		// Seen media kinds.
		// @type {Set<String>}
		_this8._kinds = new Set();

		// Map of Consumers information indexed by consumer.id.
		// - kind {String}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		_this8._consumerInfos = new Map();
		return _this8;
	}

	_createClass(RecvHandler, [{
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this9 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			var encoding = consumer.rtpParameters.encodings[0];
			var cname = consumer.rtpParameters.rtcp.cname;
			var consumerInfo = {
				kind: consumer.kind,
				streamId: 'recv-stream-' + consumer.id,
				trackId: 'consumer-' + consumer.kind + '-' + consumer.id,
				ssrc: encoding.ssrc,
				cname: cname
			};

			if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

			this._consumerInfos.set(consumer.id, consumerInfo);
			this._kinds.add(consumer.kind);

			return Promise.resolve().then(function () {
				if (!_this9._transportCreated) return _this9._setupTransport();
			}).then(function () {
				var remoteSdp = _this9._remoteSdp.createOfferSdp(Array.from(_this9._kinds), Array.from(_this9._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('addConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				var offerDesc = new RTCSessionDescription(offer);

				return _this9._pc.setRemoteDescription(offerDesc);
			}).then(function () {
				return _this9._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('addConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this9._pc.setLocalDescription(answer);
			}).then(function () {
				if (!_this9._transportUpdated) return _this9._updateTransport();
			}).then(function () {
				var stream = _this9._pc.getRemoteStreams().find(function (s) {
					return s.id === consumerInfo.streamId;
				});
				var track = stream.getTrackById(consumerInfo.trackId);

				// Hack: Add a streamReactTag property with the reactTag of the MediaStream
				// generated by react-native-webrtc (this is needed because react-native-webrtc
				// assumes that we're gonna use the streams generated by it).
				track.streamReactTag = stream.reactTag;

				if (!track) throw new Error('remote track not found');

				return track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this10 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (!this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer not found'));

			this._consumerInfos.delete(consumer.id);

			return Promise.resolve().then(function () {
				var remoteSdp = _this10._remoteSdp.createOfferSdp(Array.from(_this10._kinds), Array.from(_this10._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('removeConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				var offerDesc = new RTCSessionDescription(offer);

				return _this10._pc.setRemoteDescription(offerDesc);
			}).then(function () {
				return _this10._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('removeConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this10._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this11 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				var remoteSdp = _this11._remoteSdp.createOfferSdp(Array.from(_this11._kinds), Array.from(_this11._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

				var offerDesc = new RTCSessionDescription(offer);

				return _this11._pc.setRemoteDescription(offerDesc);
			}).then(function () {
				return _this11._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this11._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this12 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// We need transport remote parameters.
				return _this12.safeEmitAsPromise('@needcreatetransport', null);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this12._transportCreated = true;
			});
		}
	}, {
		key: '_updateTransport',
		value: function _updateTransport() {
			logger.debug('_updateTransport()');

			// Get our local DTLS parameters.
			// const transportLocalParameters = {};
			var sdp = this._pc.localDescription.sdp;
			var sdpObj = _sdpTransform2.default.parse(sdp);
			var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);
			var transportLocalParameters = { dtlsParameters: dtlsParameters };

			// We need to provide transport local parameters.
			this.safeEmit('@needupdatetransport', transportLocalParameters);

			this._transportUpdated = true;
		}
	}]);

	return RecvHandler;
}(Handler);

var ReactNative = function () {
	_createClass(ReactNative, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			var pc = new RTCPeerConnection({
				iceServers: [],
				iceTransportPolicy: 'all',
				bundlePolicy: 'max-bundle',
				rtcpMuxPolicy: 'require'
			});

			return pc.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
			}).then(function (offer) {
				try {
					pc.close();
				} catch (error) {}

				var sdpObj = _sdpTransform2.default.parse(offer.sdp);
				var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);

				return nativeRtpCapabilities;
			}).catch(function (error) {
				try {
					pc.close();
				} catch (error2) {}

				throw error;
			});
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'ReactNative';
		}
	}]);

	function ReactNative(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, ReactNative);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		var rtpParametersByKind = void 0;

		switch (direction) {
			case 'send':
				{
					rtpParametersByKind = {
						audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
					};

					return new SendHandler(rtpParametersByKind, settings);
				}
			case 'recv':
				{
					rtpParametersByKind = {
						audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
					};

					return new RecvHandler(rtpParametersByKind, settings);
				}
		}
	}

	return ReactNative;
}();

exports.default = ReactNative;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./sdp/RemotePlanBSdp":183,"./sdp/commonUtils":185,"./sdp/planBUtils":186,"sdp-transform":216}],181:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _EnhancedEventEmitter2 = require('../EnhancedEventEmitter');

var _EnhancedEventEmitter3 = _interopRequireDefault(_EnhancedEventEmitter2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _ortc = require('../ortc');

var ortc = _interopRequireWildcard(_ortc);

var _commonUtils = require('./sdp/commonUtils');

var sdpCommonUtils = _interopRequireWildcard(_commonUtils);

var _planBUtils = require('./sdp/planBUtils');

var sdpPlanBUtils = _interopRequireWildcard(_planBUtils);

var _RemotePlanBSdp = require('./sdp/RemotePlanBSdp');

var _RemotePlanBSdp2 = _interopRequireDefault(_RemotePlanBSdp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _Logger2.default('Safari11');

var Handler = function (_EnhancedEventEmitter) {
	_inherits(Handler, _EnhancedEventEmitter);

	function Handler(direction, rtpParametersByKind, settings) {
		_classCallCheck(this, Handler);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		var _this = _possibleConstructorReturn(this, (Handler.__proto__ || Object.getPrototypeOf(Handler)).call(this, logger));

		_this._pc = new RTCPeerConnection({
			iceServers: settings.turnServers || [],
			iceTransportPolicy: 'all',
			bundlePolicy: 'max-bundle',
			rtcpMuxPolicy: 'require'
		});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		_this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemotePlanBSdp}
		_this._remoteSdp = new _RemotePlanBSdp2.default(direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		_this._pc.addEventListener('iceconnectionstatechange', function () {
			switch (_this._pc.iceConnectionState) {
				case 'checking':
					_this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					_this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					_this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					_this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					_this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
		return _this;
	}

	_createClass(Handler, [{
		key: 'close',
		value: function close() {
			logger.debug('close()');

			// Close RTCPeerConnection.
			try {
				this._pc.close();
			} catch (error) {}
		}
	}]);

	return Handler;
}(_EnhancedEventEmitter3.default);

var SendHandler = function (_Handler) {
	_inherits(SendHandler, _Handler);

	function SendHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, SendHandler);

		// Got transport local and remote parameters.
		// @type {Boolean}
		var _this2 = _possibleConstructorReturn(this, (SendHandler.__proto__ || Object.getPrototypeOf(SendHandler)).call(this, 'send', rtpParametersByKind, settings));

		_this2._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		_this2._stream = new MediaStream();
		return _this2;
	}

	_createClass(SendHandler, [{
		key: 'addProducer',
		value: function addProducer(producer) {
			var _this3 = this;

			var track = producer.track;


			logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			if (this._stream.getTrackById(track.id)) return Promise.reject(new Error('track already added'));

			var rtpSender = void 0;
			var localSdpObj = void 0;

			return Promise.resolve().then(function () {
				_this3._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				rtpSender = _this3._pc.addTrack(track, _this3._stream);

				return _this3._pc.createOffer();
			}).then(function (offer) {
				logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this3._pc.setLocalDescription(offer);
			}).then(function () {
				if (!_this3._transportReady) return _this3._setupTransport();
			}).then(function () {
				localSdpObj = _sdpTransform2.default.parse(_this3._pc.localDescription.sdp);

				var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this3._pc.setRemoteDescription(answer);
			}).then(function () {
				var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				sdpPlanBUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track);

				return rtpParameters;
			}).catch(function (error) {
				// Panic here. Try to undo things.

				try {
					_this3._pc.removeTrack(rtpSender);
				} catch (error2) {}

				_this3._stream.removeTrack(track);

				throw error;
			});
		}
	}, {
		key: 'removeProducer',
		value: function removeProducer(producer) {
			var _this4 = this;

			var track = producer.track;


			logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this4._pc.getSenders().find(function (s) {
					return s.track === track;
				});

				if (!rtpSender) throw new Error('RTCRtpSender found');

				// Remove the associated RtpSender.
				_this4._pc.removeTrack(rtpSender);

				// Remove the track from the local stream.
				_this4._stream.removeTrack(track);

				return _this4._pc.createOffer();
			}).then(function (offer) {
				logger.debug('removeProducer() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this4._pc.setLocalDescription(offer);
			}).catch(function (error) {
				// NOTE: If there are no sending tracks, setLocalDescription() will fail with
				// "Failed to create channels". If so, ignore it.
				if (_this4._stream.getTracks().length === 0) {
					logger.warn('removeLocalTrack() | ignoring expected error due no sending tracks: %s', error.toString());

					return;
				}

				throw error;
			}).then(function () {
				if (_this4._pc.signalingState === 'stable') return;

				var localSdpObj = _sdpTransform2.default.parse(_this4._pc.localDescription.sdp);
				var remoteSdp = _this4._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('removeProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this4._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: 'replaceProducerTrack',
		value: function replaceProducerTrack(producer, track) {
			var _this5 = this;

			logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);

			var oldTrack = producer.track;

			return Promise.resolve().then(function () {
				// Get the associated RTCRtpSender.
				var rtpSender = _this5._pc.getSenders().find(function (s) {
					return s.track === oldTrack;
				});

				if (!rtpSender) throw new Error('local track not found');

				return rtpSender.replaceTrack(track);
			}).then(function () {
				// Remove the old track from the local stream.
				_this5._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				_this5._stream.addTrack(track);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this6 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				return _this6._pc.createOffer({ iceRestart: true });
			}).then(function (offer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

				return _this6._pc.setLocalDescription(offer);
			}).then(function () {
				var localSdpObj = _sdpTransform2.default.parse(_this6._pc.localDescription.sdp);
				var remoteSdp = _this6._remoteSdp.createAnswerSdp(localSdpObj);
				var answer = { type: 'answer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

				return _this6._pc.setRemoteDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this7 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// Get our local DTLS parameters.
				var transportLocalParameters = {};
				var sdp = _this7._pc.localDescription.sdp;
				var sdpObj = _sdpTransform2.default.parse(sdp);
				var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				_this7._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this7._transportReady = true;
			});
		}
	}]);

	return SendHandler;
}(Handler);

var RecvHandler = function (_Handler2) {
	_inherits(RecvHandler, _Handler2);

	function RecvHandler(rtpParametersByKind, settings) {
		_classCallCheck(this, RecvHandler);

		// Got transport remote parameters.
		// @type {Boolean}
		var _this8 = _possibleConstructorReturn(this, (RecvHandler.__proto__ || Object.getPrototypeOf(RecvHandler)).call(this, 'recv', rtpParametersByKind, settings));

		_this8._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		_this8._transportUpdated = false;

		// Seen media kinds.
		// @type {Set<String>}
		_this8._kinds = new Set();

		// Map of Consumers information indexed by consumer.id.
		// - kind {String}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		_this8._consumerInfos = new Map();
		return _this8;
	}

	_createClass(RecvHandler, [{
		key: 'addConsumer',
		value: function addConsumer(consumer) {
			var _this9 = this;

			logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));

			var encoding = consumer.rtpParameters.encodings[0];
			var cname = consumer.rtpParameters.rtcp.cname;
			var consumerInfo = {
				kind: consumer.kind,
				streamId: 'recv-stream-' + consumer.id,
				trackId: 'consumer-' + consumer.kind + '-' + consumer.id,
				ssrc: encoding.ssrc,
				cname: cname
			};

			if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

			this._consumerInfos.set(consumer.id, consumerInfo);
			this._kinds.add(consumer.kind);

			return Promise.resolve().then(function () {
				if (!_this9._transportCreated) return _this9._setupTransport();
			}).then(function () {
				var remoteSdp = _this9._remoteSdp.createOfferSdp(Array.from(_this9._kinds), Array.from(_this9._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('addConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this9._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this9._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('addConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this9._pc.setLocalDescription(answer);
			}).then(function () {
				if (!_this9._transportUpdated) return _this9._updateTransport();
			}).then(function () {
				var newRtpReceiver = _this9._pc.getReceivers().find(function (rtpReceiver) {
					var track = rtpReceiver.track;


					if (!track) return false;

					return track.id === consumerInfo.trackId;
				});

				if (!newRtpReceiver) throw new Error('remote track not found');

				return newRtpReceiver.track;
			});
		}
	}, {
		key: 'removeConsumer',
		value: function removeConsumer(consumer) {
			var _this10 = this;

			logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

			if (!this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer not found'));

			this._consumerInfos.delete(consumer.id);

			return Promise.resolve().then(function () {
				var remoteSdp = _this10._remoteSdp.createOfferSdp(Array.from(_this10._kinds), Array.from(_this10._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('removeConsumer() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this10._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this10._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('removeConsumer() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this10._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce(remoteIceParameters) {
			var _this11 = this;

			logger.debug('restartIce()');

			// Provide the remote SDP handler with new remote ICE parameters.
			this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

			return Promise.resolve().then(function () {
				var remoteSdp = _this11._remoteSdp.createOfferSdp(Array.from(_this11._kinds), Array.from(_this11._consumerInfos.values()));
				var offer = { type: 'offer', sdp: remoteSdp };

				logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

				return _this11._pc.setRemoteDescription(offer);
			}).then(function () {
				return _this11._pc.createAnswer();
			}).then(function (answer) {
				logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

				return _this11._pc.setLocalDescription(answer);
			});
		}
	}, {
		key: '_setupTransport',
		value: function _setupTransport() {
			var _this12 = this;

			logger.debug('_setupTransport()');

			return Promise.resolve().then(function () {
				// We need transport remote parameters.
				return _this12.safeEmitAsPromise('@needcreatetransport', null);
			}).then(function (transportRemoteParameters) {
				// Provide the remote SDP handler with transport remote parameters.
				_this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				_this12._transportCreated = true;
			});
		}
	}, {
		key: '_updateTransport',
		value: function _updateTransport() {
			logger.debug('_updateTransport()');

			// Get our local DTLS parameters.
			// const transportLocalParameters = {};
			var sdp = this._pc.localDescription.sdp;
			var sdpObj = _sdpTransform2.default.parse(sdp);
			var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj);
			var transportLocalParameters = { dtlsParameters: dtlsParameters };

			// We need to provide transport local parameters.
			this.safeEmit('@needupdatetransport', transportLocalParameters);

			this._transportUpdated = true;
		}
	}]);

	return RecvHandler;
}(Handler);

var Safari11 = function () {
	_createClass(Safari11, null, [{
		key: 'getNativeRtpCapabilities',
		value: function getNativeRtpCapabilities() {
			logger.debug('getNativeRtpCapabilities()');

			var pc = new RTCPeerConnection({
				iceServers: [],
				iceTransportPolicy: 'all',
				bundlePolicy: 'max-bundle',
				rtcpMuxPolicy: 'require'
			});

			pc.addTransceiver('audio');
			pc.addTransceiver('video');

			return pc.createOffer().then(function (offer) {
				try {
					pc.close();
				} catch (error) {}

				var sdpObj = _sdpTransform2.default.parse(offer.sdp);
				var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);

				return nativeRtpCapabilities;
			}).catch(function (error) {
				try {
					pc.close();
				} catch (error2) {}

				throw error;
			});
		}
	}, {
		key: 'tag',
		get: function get() {
			return 'Safari11';
		}
	}]);

	function Safari11(direction, extendedRtpCapabilities, settings) {
		_classCallCheck(this, Safari11);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);

		var rtpParametersByKind = void 0;

		switch (direction) {
			case 'send':
				{
					rtpParametersByKind = {
						audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
					};

					return new SendHandler(rtpParametersByKind, settings);
				}
			case 'recv':
				{
					rtpParametersByKind = {
						audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
						video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
					};

					return new RecvHandler(rtpParametersByKind, settings);
				}
		}
	}

	return Safari11;
}();

exports.default = Safari11;
},{"../EnhancedEventEmitter":168,"../Logger":169,"../ortc":189,"../utils":190,"./sdp/RemotePlanBSdp":183,"./sdp/commonUtils":185,"./sdp/planBUtils":186,"sdp-transform":216}],182:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getCapabilities = getCapabilities;
exports.mangleRtpParameters = mangleRtpParameters;

var _utils = require('../../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Normalize Edge's RTCRtpReceiver.getCapabilities() to produce a full
 * compliant ORTC RTCRtpCapabilities.
 *
 * @return {RTCRtpCapabilities}
 */
function getCapabilities() {
	var nativeCaps = RTCRtpReceiver.getCapabilities();
	var caps = utils.clone(nativeCaps);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = caps.codecs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var codec = _step.value;

			// Rename numChannels to channels.
			codec.channels = codec.numChannels;
			delete codec.numChannels;

			// Normalize channels.
			if (codec.kind !== 'audio') delete codec.channels;else if (!codec.channels) codec.channels = 1;

			// Add mimeType.
			codec.mimeType = codec.kind + '/' + codec.name;

			// NOTE: Edge sets some numeric parameters as String rather than Number. Fix them.
			if (codec.parameters) {
				var parameters = codec.parameters;

				if (parameters.apt) parameters.apt = Number(parameters.apt);

				if (parameters['packetization-mode']) parameters['packetization-mode'] = Number(parameters['packetization-mode']);
			}

			// Delete emty parameter String in rtcpFeedback.
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = (codec.rtcpFeedback || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var feedback = _step2.value;

					if (!feedback.parameter) delete feedback.parameter;
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return caps;
}

/**
 * Generate RTCRtpParameters as Edge like them.
 *
 * @param  {RTCRtpParameters} rtpParameters
 * @return {RTCRtpParameters}
 */
/* global RTCRtpReceiver */

function mangleRtpParameters(rtpParameters) {
	var params = utils.clone(rtpParameters);

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = params.codecs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var codec = _step3.value;

			// Rename channels to numChannels.
			if (codec.channels) {
				codec.numChannels = codec.channels;
				delete codec.channels;
			}

			// Remove mimeType.
			delete codec.mimeType;
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	return params;
}
},{"../../utils":190}],183:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _utils = require('../../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = new _Logger2.default('RemotePlanBSdp');

var RemoteSdp = function () {
	function RemoteSdp(rtpParametersByKind) {
		_classCallCheck(this, RemoteSdp);

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Transport local parameters, including DTLS parameteres.
		// @type {Object}
		this._transportLocalParameters = null;

		// Transport remote parameters, including ICE parameters, ICE candidates
		// and DTLS parameteres.
		// @type {Object}
		this._transportRemoteParameters = null;

		// SDP global fields.
		// @type {Object}
		this._sdpGlobalFields = {
			id: utils.randomNumber(),
			version: 0
		};
	}

	_createClass(RemoteSdp, [{
		key: 'setTransportLocalParameters',
		value: function setTransportLocalParameters(transportLocalParameters) {
			logger.debug('setTransportLocalParameters() [transportLocalParameters:%o]', transportLocalParameters);

			this._transportLocalParameters = transportLocalParameters;
		}
	}, {
		key: 'setTransportRemoteParameters',
		value: function setTransportRemoteParameters(transportRemoteParameters) {
			logger.debug('setTransportRemoteParameters() [transportRemoteParameters:%o]', transportRemoteParameters);

			this._transportRemoteParameters = transportRemoteParameters;
		}
	}, {
		key: 'updateTransportRemoteIceParameters',
		value: function updateTransportRemoteIceParameters(remoteIceParameters) {
			logger.debug('updateTransportRemoteIceParameters() [remoteIceParameters:%o]', remoteIceParameters);

			this._transportRemoteParameters.iceParameters = remoteIceParameters;
		}
	}]);

	return RemoteSdp;
}();

var SendRemoteSdp = function (_RemoteSdp) {
	_inherits(SendRemoteSdp, _RemoteSdp);

	function SendRemoteSdp(rtpParametersByKind) {
		_classCallCheck(this, SendRemoteSdp);

		return _possibleConstructorReturn(this, (SendRemoteSdp.__proto__ || Object.getPrototypeOf(SendRemoteSdp)).call(this, rtpParametersByKind));
	}

	_createClass(SendRemoteSdp, [{
		key: 'createAnswerSdp',
		value: function createAnswerSdp(localSdpObj) {
			logger.debug('createAnswerSdp()');

			if (!this._transportLocalParameters) throw new Error('no transport local parameters');else if (!this._transportRemoteParameters) throw new Error('no transport remote parameters');

			var remoteIceParameters = this._transportRemoteParameters.iceParameters;
			var remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
			var remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
			var sdpObj = {};
			var mids = (localSdpObj.media || []).map(function (m) {
				return m.mid;
			});

			// Increase our SDP version.
			this._sdpGlobalFields.version++;

			sdpObj.version = 0;
			sdpObj.origin = {
				address: '0.0.0.0',
				ipVer: 4,
				netType: 'IN',
				sessionId: this._sdpGlobalFields.id,
				sessionVersion: this._sdpGlobalFields.version,
				username: 'mediasoup-client'
			};
			sdpObj.name = '-';
			sdpObj.timing = { start: 0, stop: 0 };
			sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
			sdpObj.msidSemantic = {
				semantic: 'WMS',
				token: '*'
			};
			sdpObj.groups = [{
				type: 'BUNDLE',
				mids: mids.join(' ')
			}];
			sdpObj.media = [];

			// NOTE: We take the latest fingerprint.
			var numFingerprints = remoteDtlsParameters.fingerprints.length;

			sdpObj.fingerprint = {
				type: remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
				hash: remoteDtlsParameters.fingerprints[numFingerprints - 1].value
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (localSdpObj.media || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var localMediaObj = _step.value;

					var kind = localMediaObj.type;
					var codecs = this._rtpParametersByKind[kind].codecs;
					var headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
					var remoteMediaObj = {};

					remoteMediaObj.type = localMediaObj.type;
					remoteMediaObj.port = 7;
					remoteMediaObj.protocol = 'RTP/SAVPF';
					remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
					remoteMediaObj.mid = localMediaObj.mid;

					remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
					remoteMediaObj.icePwd = remoteIceParameters.password;
					remoteMediaObj.candidates = [];

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = remoteIceCandidates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var candidate = _step2.value;

							var candidateObj = {};

							// mediasoup does not support non rtcp-mux so candidates component is
							// always RTP (1).
							candidateObj.component = 1;
							candidateObj.foundation = candidate.foundation;
							candidateObj.ip = candidate.ip;
							candidateObj.port = candidate.port;
							candidateObj.priority = candidate.priority;
							candidateObj.transport = candidate.protocol;
							candidateObj.type = candidate.type;
							if (candidate.tcpType) candidateObj.tcptype = candidate.tcpType;

							remoteMediaObj.candidates.push(candidateObj);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					remoteMediaObj.endOfCandidates = 'end-of-candidates';

					// Announce support for ICE renomination.
					// https://tools.ietf.org/html/draft-thatcher-ice-renomination
					remoteMediaObj.iceOptions = 'renomination';

					switch (remoteDtlsParameters.role) {
						case 'client':
							remoteMediaObj.setup = 'active';
							break;
						case 'server':
							remoteMediaObj.setup = 'passive';
							break;
					}

					switch (localMediaObj.direction) {
						case 'sendrecv':
						case 'sendonly':
							remoteMediaObj.direction = 'recvonly';
							break;
						case 'recvonly':
						case 'inactive':
							remoteMediaObj.direction = 'inactive';
							break;
					}

					// If video, be ready for simulcast.
					if (kind === 'video') remoteMediaObj.xGoogleFlag = 'conference';

					remoteMediaObj.rtp = [];
					remoteMediaObj.rtcpFb = [];
					remoteMediaObj.fmtp = [];

					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = codecs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var codec = _step3.value;

							var rtp = {
								payload: codec.payloadType,
								codec: codec.name,
								rate: codec.clockRate
							};

							if (codec.channels > 1) rtp.encoding = codec.channels;

							remoteMediaObj.rtp.push(rtp);

							if (codec.parameters) {
								var paramFmtp = {
									payload: codec.payloadType,
									config: ''
								};

								var _iteratorNormalCompletion5 = true;
								var _didIteratorError5 = false;
								var _iteratorError5 = undefined;

								try {
									for (var _iterator5 = Object.keys(codec.parameters)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
										var key = _step5.value;

										if (paramFmtp.config) paramFmtp.config += ';';

										paramFmtp.config += key + '=' + codec.parameters[key];
									}
								} catch (err) {
									_didIteratorError5 = true;
									_iteratorError5 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion5 && _iterator5.return) {
											_iterator5.return();
										}
									} finally {
										if (_didIteratorError5) {
											throw _iteratorError5;
										}
									}
								}

								if (paramFmtp.config) remoteMediaObj.fmtp.push(paramFmtp);
							}

							if (codec.rtcpFeedback) {
								var _iteratorNormalCompletion6 = true;
								var _didIteratorError6 = false;
								var _iteratorError6 = undefined;

								try {
									for (var _iterator6 = codec.rtcpFeedback[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
										var fb = _step6.value;

										remoteMediaObj.rtcpFb.push({
											payload: codec.payloadType,
											type: fb.type,
											subtype: fb.parameter || ''
										});
									}
								} catch (err) {
									_didIteratorError6 = true;
									_iteratorError6 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion6 && _iterator6.return) {
											_iterator6.return();
										}
									} finally {
										if (_didIteratorError6) {
											throw _iteratorError6;
										}
									}
								}
							}
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					remoteMediaObj.payloads = codecs.map(function (codec) {
						return codec.payloadType;
					}).join(' ');

					remoteMediaObj.ext = [];

					var _loop = function _loop(ext) {
						// Don't add a header extension if not present in the offer.
						var matchedLocalExt = (localMediaObj.ext || []).find(function (localExt) {
							return localExt.uri === ext.uri;
						});

						if (!matchedLocalExt) return 'continue';

						remoteMediaObj.ext.push({
							uri: ext.uri,
							value: ext.id
						});
					};

					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = headerExtensions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var ext = _step4.value;

							var _ret = _loop(ext);

							if (_ret === 'continue') continue;
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					remoteMediaObj.rtcpMux = 'rtcp-mux';
					remoteMediaObj.rtcpRsize = 'rtcp-rsize';

					// Push it.
					sdpObj.media.push(remoteMediaObj);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var sdp = _sdpTransform2.default.write(sdpObj);

			return sdp;
		}
	}]);

	return SendRemoteSdp;
}(RemoteSdp);

var RecvRemoteSdp = function (_RemoteSdp2) {
	_inherits(RecvRemoteSdp, _RemoteSdp2);

	function RecvRemoteSdp(rtpParametersByKind) {
		_classCallCheck(this, RecvRemoteSdp);

		return _possibleConstructorReturn(this, (RecvRemoteSdp.__proto__ || Object.getPrototypeOf(RecvRemoteSdp)).call(this, rtpParametersByKind));
	}

	/**
  * @param {Array<String>} kinds - Media kinds.
  * @param {Array<Object>} consumerInfos - Consumer informations.
  * @return {String}
  */


	_createClass(RecvRemoteSdp, [{
		key: 'createOfferSdp',
		value: function createOfferSdp(kinds, consumerInfos) {
			var _this3 = this;

			logger.debug('createOfferSdp()');

			if (!this._transportRemoteParameters) throw new Error('no transport remote parameters');

			var remoteIceParameters = this._transportRemoteParameters.iceParameters;
			var remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
			var remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
			var sdpObj = {};
			var mids = kinds;

			// Increase our SDP version.
			this._sdpGlobalFields.version++;

			sdpObj.version = 0;
			sdpObj.origin = {
				address: '0.0.0.0',
				ipVer: 4,
				netType: 'IN',
				sessionId: this._sdpGlobalFields.id,
				sessionVersion: this._sdpGlobalFields.version,
				username: 'mediasoup-client'
			};
			sdpObj.name = '-';
			sdpObj.timing = { start: 0, stop: 0 };
			sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
			sdpObj.msidSemantic = {
				semantic: 'WMS',
				token: '*'
			};
			sdpObj.groups = [{
				type: 'BUNDLE',
				mids: mids.join(' ')
			}];
			sdpObj.media = [];

			// NOTE: We take the latest fingerprint.
			var numFingerprints = remoteDtlsParameters.fingerprints.length;

			sdpObj.fingerprint = {
				type: remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
				hash: remoteDtlsParameters.fingerprints[numFingerprints - 1].value
			};

			var _loop2 = function _loop2(kind) {
				var codecs = _this3._rtpParametersByKind[kind].codecs;
				var headerExtensions = _this3._rtpParametersByKind[kind].headerExtensions;
				var remoteMediaObj = {};

				remoteMediaObj.type = kind;
				remoteMediaObj.port = 7;
				remoteMediaObj.protocol = 'RTP/SAVPF';
				remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
				remoteMediaObj.mid = kind;

				remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
				remoteMediaObj.icePwd = remoteIceParameters.password;
				remoteMediaObj.candidates = [];

				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = remoteIceCandidates[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var candidate = _step8.value;

						var candidateObj = {};

						// mediasoup does not support non rtcp-mux so candidates component is
						// always RTP (1).
						candidateObj.component = 1;
						candidateObj.foundation = candidate.foundation;
						candidateObj.ip = candidate.ip;
						candidateObj.port = candidate.port;
						candidateObj.priority = candidate.priority;
						candidateObj.transport = candidate.protocol;
						candidateObj.type = candidate.type;
						if (candidate.tcpType) candidateObj.tcptype = candidate.tcpType;

						remoteMediaObj.candidates.push(candidateObj);
					}
				} catch (err) {
					_didIteratorError8 = true;
					_iteratorError8 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion8 && _iterator8.return) {
							_iterator8.return();
						}
					} finally {
						if (_didIteratorError8) {
							throw _iteratorError8;
						}
					}
				}

				remoteMediaObj.endOfCandidates = 'end-of-candidates';

				// Announce support for ICE renomination.
				// https://tools.ietf.org/html/draft-thatcher-ice-renomination
				remoteMediaObj.iceOptions = 'renomination';

				remoteMediaObj.setup = 'actpass';

				if (consumerInfos.some(function (info) {
					return info.kind === kind;
				})) remoteMediaObj.direction = 'sendonly';else remoteMediaObj.direction = 'inactive';

				remoteMediaObj.rtp = [];
				remoteMediaObj.rtcpFb = [];
				remoteMediaObj.fmtp = [];

				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = codecs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var codec = _step9.value;

						var rtp = {
							payload: codec.payloadType,
							codec: codec.name,
							rate: codec.clockRate
						};

						if (codec.channels > 1) rtp.encoding = codec.channels;

						remoteMediaObj.rtp.push(rtp);

						if (codec.parameters) {
							var paramFmtp = {
								payload: codec.payloadType,
								config: ''
							};

							var _iteratorNormalCompletion12 = true;
							var _didIteratorError12 = false;
							var _iteratorError12 = undefined;

							try {
								for (var _iterator12 = Object.keys(codec.parameters)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
									var key = _step12.value;

									if (paramFmtp.config) paramFmtp.config += ';';

									paramFmtp.config += key + '=' + codec.parameters[key];
								}
							} catch (err) {
								_didIteratorError12 = true;
								_iteratorError12 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion12 && _iterator12.return) {
										_iterator12.return();
									}
								} finally {
									if (_didIteratorError12) {
										throw _iteratorError12;
									}
								}
							}

							if (paramFmtp.config) remoteMediaObj.fmtp.push(paramFmtp);
						}

						if (codec.rtcpFeedback) {
							var _iteratorNormalCompletion13 = true;
							var _didIteratorError13 = false;
							var _iteratorError13 = undefined;

							try {
								for (var _iterator13 = codec.rtcpFeedback[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
									var fb = _step13.value;

									remoteMediaObj.rtcpFb.push({
										payload: codec.payloadType,
										type: fb.type,
										subtype: fb.parameter || ''
									});
								}
							} catch (err) {
								_didIteratorError13 = true;
								_iteratorError13 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion13 && _iterator13.return) {
										_iterator13.return();
									}
								} finally {
									if (_didIteratorError13) {
										throw _iteratorError13;
									}
								}
							}
						}
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
						}
					}
				}

				remoteMediaObj.payloads = codecs.map(function (codec) {
					return codec.payloadType;
				}).join(' ');

				remoteMediaObj.ext = [];

				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = headerExtensions[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var ext = _step10.value;

						remoteMediaObj.ext.push({
							uri: ext.uri,
							value: ext.id
						});
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}

				remoteMediaObj.rtcpMux = 'rtcp-mux';
				remoteMediaObj.rtcpRsize = 'rtcp-rsize';

				remoteMediaObj.ssrcs = [];
				remoteMediaObj.ssrcGroups = [];

				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = consumerInfos[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var info = _step11.value;

						if (info.kind !== kind) continue;

						remoteMediaObj.ssrcs.push({
							id: info.ssrc,
							attribute: 'msid',
							value: info.streamId + ' ' + info.trackId
						});

						remoteMediaObj.ssrcs.push({
							id: info.ssrc,
							attribute: 'mslabel',
							value: info.streamId
						});

						remoteMediaObj.ssrcs.push({
							id: info.ssrc,
							attribute: 'label',
							value: info.trackId
						});

						remoteMediaObj.ssrcs.push({
							id: info.ssrc,
							attribute: 'cname',
							value: info.cname
						});

						if (info.rtxSsrc) {
							remoteMediaObj.ssrcs.push({
								id: info.rtxSsrc,
								attribute: 'msid',
								value: info.streamId + ' ' + info.trackId
							});

							remoteMediaObj.ssrcs.push({
								id: info.rtxSsrc,
								attribute: 'mslabel',
								value: info.streamId
							});

							remoteMediaObj.ssrcs.push({
								id: info.rtxSsrc,
								attribute: 'label',
								value: info.trackId
							});

							remoteMediaObj.ssrcs.push({
								id: info.rtxSsrc,
								attribute: 'cname',
								value: info.cname
							});

							// Associate original and retransmission SSRC.
							remoteMediaObj.ssrcGroups.push({
								semantics: 'FID',
								ssrcs: info.ssrc + ' ' + info.rtxSsrc
							});
						}
					}

					// Push it.
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}

				sdpObj.media.push(remoteMediaObj);
			};

			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = kinds[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var kind = _step7.value;

					_loop2(kind);
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			var sdp = _sdpTransform2.default.write(sdpObj);

			return sdp;
		}
	}]);

	return RecvRemoteSdp;
}(RemoteSdp);

var RemotePlanBSdp = function RemotePlanBSdp(direction, rtpParametersByKind) {
	_classCallCheck(this, RemotePlanBSdp);

	logger.debug('constructor() [direction:%s, rtpParametersByKind:%o]', direction, rtpParametersByKind);

	switch (direction) {
		case 'send':
			return new SendRemoteSdp(rtpParametersByKind);
		case 'recv':
			return new RecvRemoteSdp(rtpParametersByKind);
	}
};

exports.default = RemotePlanBSdp;
},{"../../Logger":169,"../../utils":190,"sdp-transform":216}],184:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

var _Logger = require('../../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _utils = require('../../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = new _Logger2.default('RemoteUnifiedPlanSdp');

var RemoteSdp = function () {
	function RemoteSdp(rtpParametersByKind) {
		_classCallCheck(this, RemoteSdp);

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Transport local parameters, including DTLS parameteres.
		// @type {Object}
		this._transportLocalParameters = null;

		// Transport remote parameters, including ICE parameters, ICE candidates
		// and DTLS parameteres.
		// @type {Object}
		this._transportRemoteParameters = null;

		// SDP global fields.
		// @type {Object}
		this._sdpGlobalFields = {
			id: utils.randomNumber(),
			version: 0
		};
	}

	_createClass(RemoteSdp, [{
		key: 'setTransportLocalParameters',
		value: function setTransportLocalParameters(transportLocalParameters) {
			logger.debug('setTransportLocalParameters() [transportLocalParameters:%o]', transportLocalParameters);

			this._transportLocalParameters = transportLocalParameters;
		}
	}, {
		key: 'setTransportRemoteParameters',
		value: function setTransportRemoteParameters(transportRemoteParameters) {
			logger.debug('setTransportRemoteParameters() [transportRemoteParameters:%o]', transportRemoteParameters);

			this._transportRemoteParameters = transportRemoteParameters;
		}
	}, {
		key: 'updateTransportRemoteIceParameters',
		value: function updateTransportRemoteIceParameters(remoteIceParameters) {
			logger.debug('updateTransportRemoteIceParameters() [remoteIceParameters:%o]', remoteIceParameters);

			this._transportRemoteParameters.iceParameters = remoteIceParameters;
		}
	}]);

	return RemoteSdp;
}();

var SendRemoteSdp = function (_RemoteSdp) {
	_inherits(SendRemoteSdp, _RemoteSdp);

	function SendRemoteSdp(rtpParametersByKind) {
		_classCallCheck(this, SendRemoteSdp);

		return _possibleConstructorReturn(this, (SendRemoteSdp.__proto__ || Object.getPrototypeOf(SendRemoteSdp)).call(this, rtpParametersByKind));
	}

	_createClass(SendRemoteSdp, [{
		key: 'createAnswerSdp',
		value: function createAnswerSdp(localSdpObj) {
			logger.debug('createAnswerSdp()');

			if (!this._transportLocalParameters) throw new Error('no transport local parameters');else if (!this._transportRemoteParameters) throw new Error('no transport remote parameters');

			var remoteIceParameters = this._transportRemoteParameters.iceParameters;
			var remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
			var remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
			var sdpObj = {};
			var mids = (localSdpObj.media || []).filter(function (m) {
				return m.mid;
			}).map(function (m) {
				return m.mid;
			});

			// Increase our SDP version.
			this._sdpGlobalFields.version++;

			sdpObj.version = 0;
			sdpObj.origin = {
				address: '0.0.0.0',
				ipVer: 4,
				netType: 'IN',
				sessionId: this._sdpGlobalFields.id,
				sessionVersion: this._sdpGlobalFields.version,
				username: 'mediasoup-client'
			};
			sdpObj.name = '-';
			sdpObj.timing = { start: 0, stop: 0 };
			sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
			sdpObj.msidSemantic = {
				semantic: 'WMS',
				token: '*'
			};

			if (mids.length > 0) {
				sdpObj.groups = [{
					type: 'BUNDLE',
					mids: mids.join(' ')
				}];
			}

			sdpObj.media = [];

			// NOTE: We take the latest fingerprint.
			var numFingerprints = remoteDtlsParameters.fingerprints.length;

			sdpObj.fingerprint = {
				type: remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
				hash: remoteDtlsParameters.fingerprints[numFingerprints - 1].value
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (localSdpObj.media || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var localMediaObj = _step.value;

					var closed = localMediaObj.direction === 'inactive';
					var kind = localMediaObj.type;
					var codecs = this._rtpParametersByKind[kind].codecs;
					var headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
					var remoteMediaObj = {};

					remoteMediaObj.type = localMediaObj.type;
					remoteMediaObj.port = 7;
					remoteMediaObj.protocol = 'RTP/SAVPF';
					remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
					remoteMediaObj.mid = localMediaObj.mid;

					remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
					remoteMediaObj.icePwd = remoteIceParameters.password;
					remoteMediaObj.candidates = [];

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = remoteIceCandidates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var candidate = _step2.value;

							var candidateObj = {};

							// mediasoup does not support non rtcp-mux so candidates component is
							// always RTP (1).
							candidateObj.component = 1;
							candidateObj.foundation = candidate.foundation;
							candidateObj.ip = candidate.ip;
							candidateObj.port = candidate.port;
							candidateObj.priority = candidate.priority;
							candidateObj.transport = candidate.protocol;
							candidateObj.type = candidate.type;
							if (candidate.tcpType) candidateObj.tcptype = candidate.tcpType;

							remoteMediaObj.candidates.push(candidateObj);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					remoteMediaObj.endOfCandidates = 'end-of-candidates';

					// Announce support for ICE renomination.
					// https://tools.ietf.org/html/draft-thatcher-ice-renomination
					remoteMediaObj.iceOptions = 'renomination';

					switch (remoteDtlsParameters.role) {
						case 'client':
							remoteMediaObj.setup = 'active';
							break;
						case 'server':
							remoteMediaObj.setup = 'passive';
							break;
					}

					switch (localMediaObj.direction) {
						case 'sendrecv':
						case 'sendonly':
							remoteMediaObj.direction = 'recvonly';
							break;
						case 'recvonly':
						case 'inactive':
							remoteMediaObj.direction = 'inactive';
							break;
					}

					remoteMediaObj.rtp = [];
					remoteMediaObj.rtcpFb = [];
					remoteMediaObj.fmtp = [];

					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = codecs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var codec = _step3.value;

							var rtp = {
								payload: codec.payloadType,
								codec: codec.name,
								rate: codec.clockRate
							};

							if (codec.channels > 1) rtp.encoding = codec.channels;

							remoteMediaObj.rtp.push(rtp);

							if (codec.parameters) {
								var paramFmtp = {
									payload: codec.payloadType,
									config: ''
								};

								var _iteratorNormalCompletion6 = true;
								var _didIteratorError6 = false;
								var _iteratorError6 = undefined;

								try {
									for (var _iterator6 = Object.keys(codec.parameters)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
										var key = _step6.value;

										if (paramFmtp.config) paramFmtp.config += ';';

										paramFmtp.config += key + '=' + codec.parameters[key];
									}
								} catch (err) {
									_didIteratorError6 = true;
									_iteratorError6 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion6 && _iterator6.return) {
											_iterator6.return();
										}
									} finally {
										if (_didIteratorError6) {
											throw _iteratorError6;
										}
									}
								}

								if (paramFmtp.config) remoteMediaObj.fmtp.push(paramFmtp);
							}

							if (codec.rtcpFeedback) {
								var _iteratorNormalCompletion7 = true;
								var _didIteratorError7 = false;
								var _iteratorError7 = undefined;

								try {
									for (var _iterator7 = codec.rtcpFeedback[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
										var fb = _step7.value;

										remoteMediaObj.rtcpFb.push({
											payload: codec.payloadType,
											type: fb.type,
											subtype: fb.parameter || ''
										});
									}
								} catch (err) {
									_didIteratorError7 = true;
									_iteratorError7 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion7 && _iterator7.return) {
											_iterator7.return();
										}
									} finally {
										if (_didIteratorError7) {
											throw _iteratorError7;
										}
									}
								}
							}
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					remoteMediaObj.payloads = codecs.map(function (codec) {
						return codec.payloadType;
					}).join(' ');

					// NOTE: Firefox does not like a=extmap lines if a=inactive.
					if (!closed) {
						remoteMediaObj.ext = [];

						var _loop = function _loop(ext) {
							// Don't add a header extension if not present in the offer.
							var matchedLocalExt = (localMediaObj.ext || []).find(function (localExt) {
								return localExt.uri === ext.uri;
							});

							if (!matchedLocalExt) return 'continue';

							remoteMediaObj.ext.push({
								uri: ext.uri,
								value: ext.id
							});
						};

						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = headerExtensions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var ext = _step4.value;

								var _ret = _loop(ext);

								if (_ret === 'continue') continue;
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4.return) {
									_iterator4.return();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}
					}

					// Simulcast.
					if (localMediaObj.simulcast_03) {
						// eslint-disable-next-line camelcase
						remoteMediaObj.simulcast_03 = {
							value: localMediaObj.simulcast_03.value.replace(/send/g, 'recv')
						};

						remoteMediaObj.rids = [];

						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = (localMediaObj.rids || [])[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var rid = _step5.value;

								if (rid.direction !== 'send') continue;

								remoteMediaObj.rids.push({
									id: rid.id,
									direction: 'recv'
								});
							}
						} catch (err) {
							_didIteratorError5 = true;
							_iteratorError5 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion5 && _iterator5.return) {
									_iterator5.return();
								}
							} finally {
								if (_didIteratorError5) {
									throw _iteratorError5;
								}
							}
						}
					}

					remoteMediaObj.rtcpMux = 'rtcp-mux';
					remoteMediaObj.rtcpRsize = 'rtcp-rsize';

					// Push it.
					sdpObj.media.push(remoteMediaObj);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var sdp = _sdpTransform2.default.write(sdpObj);

			return sdp;
		}
	}]);

	return SendRemoteSdp;
}(RemoteSdp);

var RecvRemoteSdp = function (_RemoteSdp2) {
	_inherits(RecvRemoteSdp, _RemoteSdp2);

	function RecvRemoteSdp(rtpParametersByKind) {
		_classCallCheck(this, RecvRemoteSdp);

		return _possibleConstructorReturn(this, (RecvRemoteSdp.__proto__ || Object.getPrototypeOf(RecvRemoteSdp)).call(this, rtpParametersByKind));
	}

	/**
  * @param {Array<Object>} consumerInfos - Consumer informations.
  * @return {String}
  */


	_createClass(RecvRemoteSdp, [{
		key: 'createOfferSdp',
		value: function createOfferSdp(consumerInfos) {
			logger.debug('createOfferSdp()');

			if (!this._transportRemoteParameters) throw new Error('no transport remote parameters');

			var remoteIceParameters = this._transportRemoteParameters.iceParameters;
			var remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
			var remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
			var sdpObj = {};
			var mids = consumerInfos.map(function (info) {
				return info.mid;
			});

			// Increase our SDP version.
			this._sdpGlobalFields.version++;

			sdpObj.version = 0;
			sdpObj.origin = {
				address: '0.0.0.0',
				ipVer: 4,
				netType: 'IN',
				sessionId: this._sdpGlobalFields.id,
				sessionVersion: this._sdpGlobalFields.version,
				username: 'mediasoup-client'
			};
			sdpObj.name = '-';
			sdpObj.timing = { start: 0, stop: 0 };
			sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
			sdpObj.msidSemantic = {
				semantic: 'WMS',
				token: '*'
			};

			if (mids.length > 0) {
				sdpObj.groups = [{
					type: 'BUNDLE',
					mids: mids.join(' ')
				}];
			}

			sdpObj.media = [];

			// NOTE: We take the latest fingerprint.
			var numFingerprints = remoteDtlsParameters.fingerprints.length;

			sdpObj.fingerprint = {
				type: remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
				hash: remoteDtlsParameters.fingerprints[numFingerprints - 1].value
			};

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = consumerInfos[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var info = _step8.value;

					var closed = info.closed;
					var kind = info.kind;
					var codecs = void 0;
					var headerExtensions = void 0;

					if (info.kind !== 'application') {
						codecs = this._rtpParametersByKind[kind].codecs;
						headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
					}

					var remoteMediaObj = {};

					if (info.kind !== 'application') {
						remoteMediaObj.type = kind;
						remoteMediaObj.port = 7;
						remoteMediaObj.protocol = 'RTP/SAVPF';
						remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
						remoteMediaObj.mid = info.mid;
						remoteMediaObj.msid = info.streamId + ' ' + info.trackId;
					} else {
						remoteMediaObj.type = kind;
						remoteMediaObj.port = 9;
						remoteMediaObj.protocol = 'DTLS/SCTP';
						remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
						remoteMediaObj.mid = info.mid;
					}

					remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
					remoteMediaObj.icePwd = remoteIceParameters.password;
					remoteMediaObj.candidates = [];

					var _iteratorNormalCompletion9 = true;
					var _didIteratorError9 = false;
					var _iteratorError9 = undefined;

					try {
						for (var _iterator9 = remoteIceCandidates[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
							var candidate = _step9.value;

							var candidateObj = {};

							// mediasoup does not support non rtcp-mux so candidates component is
							// always RTP (1).
							candidateObj.component = 1;
							candidateObj.foundation = candidate.foundation;
							candidateObj.ip = candidate.ip;
							candidateObj.port = candidate.port;
							candidateObj.priority = candidate.priority;
							candidateObj.transport = candidate.protocol;
							candidateObj.type = candidate.type;
							if (candidate.tcpType) candidateObj.tcptype = candidate.tcpType;

							remoteMediaObj.candidates.push(candidateObj);
						}
					} catch (err) {
						_didIteratorError9 = true;
						_iteratorError9 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion9 && _iterator9.return) {
								_iterator9.return();
							}
						} finally {
							if (_didIteratorError9) {
								throw _iteratorError9;
							}
						}
					}

					remoteMediaObj.endOfCandidates = 'end-of-candidates';

					// Announce support for ICE renomination.
					// https://tools.ietf.org/html/draft-thatcher-ice-renomination
					remoteMediaObj.iceOptions = 'renomination';

					remoteMediaObj.setup = 'actpass';

					if (info.kind !== 'application') {
						if (!closed) remoteMediaObj.direction = 'sendonly';else remoteMediaObj.direction = 'inactive';

						remoteMediaObj.rtp = [];
						remoteMediaObj.rtcpFb = [];
						remoteMediaObj.fmtp = [];

						var _iteratorNormalCompletion10 = true;
						var _didIteratorError10 = false;
						var _iteratorError10 = undefined;

						try {
							for (var _iterator10 = codecs[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
								var codec = _step10.value;

								var rtp = {
									payload: codec.payloadType,
									codec: codec.name,
									rate: codec.clockRate
								};

								if (codec.channels > 1) rtp.encoding = codec.channels;

								remoteMediaObj.rtp.push(rtp);

								if (codec.parameters) {
									var paramFmtp = {
										payload: codec.payloadType,
										config: ''
									};

									var _iteratorNormalCompletion12 = true;
									var _didIteratorError12 = false;
									var _iteratorError12 = undefined;

									try {
										for (var _iterator12 = Object.keys(codec.parameters)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
											var key = _step12.value;

											if (paramFmtp.config) paramFmtp.config += ';';

											paramFmtp.config += key + '=' + codec.parameters[key];
										}
									} catch (err) {
										_didIteratorError12 = true;
										_iteratorError12 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion12 && _iterator12.return) {
												_iterator12.return();
											}
										} finally {
											if (_didIteratorError12) {
												throw _iteratorError12;
											}
										}
									}

									if (paramFmtp.config) remoteMediaObj.fmtp.push(paramFmtp);
								}

								if (codec.rtcpFeedback) {
									var _iteratorNormalCompletion13 = true;
									var _didIteratorError13 = false;
									var _iteratorError13 = undefined;

									try {
										for (var _iterator13 = codec.rtcpFeedback[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
											var fb = _step13.value;

											remoteMediaObj.rtcpFb.push({
												payload: codec.payloadType,
												type: fb.type,
												subtype: fb.parameter || ''
											});
										}
									} catch (err) {
										_didIteratorError13 = true;
										_iteratorError13 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion13 && _iterator13.return) {
												_iterator13.return();
											}
										} finally {
											if (_didIteratorError13) {
												throw _iteratorError13;
											}
										}
									}
								}
							}
						} catch (err) {
							_didIteratorError10 = true;
							_iteratorError10 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion10 && _iterator10.return) {
									_iterator10.return();
								}
							} finally {
								if (_didIteratorError10) {
									throw _iteratorError10;
								}
							}
						}

						remoteMediaObj.payloads = codecs.map(function (codec) {
							return codec.payloadType;
						}).join(' ');

						// NOTE: Firefox does not like a=extmap lines if a=inactive.
						if (!closed) {
							remoteMediaObj.ext = [];

							var _iteratorNormalCompletion11 = true;
							var _didIteratorError11 = false;
							var _iteratorError11 = undefined;

							try {
								for (var _iterator11 = headerExtensions[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
									var ext = _step11.value;

									remoteMediaObj.ext.push({
										uri: ext.uri,
										value: ext.id
									});
								}
							} catch (err) {
								_didIteratorError11 = true;
								_iteratorError11 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion11 && _iterator11.return) {
										_iterator11.return();
									}
								} finally {
									if (_didIteratorError11) {
										throw _iteratorError11;
									}
								}
							}
						}

						remoteMediaObj.rtcpMux = 'rtcp-mux';
						remoteMediaObj.rtcpRsize = 'rtcp-rsize';

						if (!closed) {
							remoteMediaObj.ssrcs = [];
							remoteMediaObj.ssrcGroups = [];

							remoteMediaObj.ssrcs.push({
								id: info.ssrc,
								attribute: 'cname',
								value: info.cname
							});

							if (info.rtxSsrc) {
								remoteMediaObj.ssrcs.push({
									id: info.rtxSsrc,
									attribute: 'cname',
									value: info.cname
								});

								// Associate original and retransmission SSRC.
								remoteMediaObj.ssrcGroups.push({
									semantics: 'FID',
									ssrcs: info.ssrc + ' ' + info.rtxSsrc
								});
							}
						}
					} else {
						remoteMediaObj.payloads = 5000;
						remoteMediaObj.sctpmap = {
							app: 'webrtc-datachannel',
							maxMessageSize: 256,
							sctpmapNumber: 5000
						};
					}

					// Push it.
					sdpObj.media.push(remoteMediaObj);
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			var sdp = _sdpTransform2.default.write(sdpObj);

			return sdp;
		}
	}]);

	return RecvRemoteSdp;
}(RemoteSdp);

var RemoteUnifiedPlanSdp = function RemoteUnifiedPlanSdp(direction, rtpParametersByKind) {
	_classCallCheck(this, RemoteUnifiedPlanSdp);

	logger.debug('constructor() [direction:%s, rtpParametersByKind:%o]', direction, rtpParametersByKind);

	switch (direction) {
		case 'send':
			return new SendRemoteSdp(rtpParametersByKind);
		case 'recv':
			return new RecvRemoteSdp(rtpParametersByKind);
	}
};

exports.default = RemoteUnifiedPlanSdp;
},{"../../Logger":169,"../../utils":190,"sdp-transform":216}],185:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.extractRtpCapabilities = extractRtpCapabilities;
exports.extractDtlsParameters = extractDtlsParameters;

var _sdpTransform = require('sdp-transform');

var _sdpTransform2 = _interopRequireDefault(_sdpTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extract RTP capabilities from a SDP.
 *
 * @param {Object} sdpObj - SDP Object generated by sdp-transform.
 * @return {RTCRtpCapabilities}
 */
function extractRtpCapabilities(sdpObj) {
	// Map of RtpCodecParameters indexed by payload type.
	var codecsMap = new Map();

	// Array of RtpHeaderExtensions.
	var headerExtensions = [];

	// Whether a m=audio/video section has been already found.
	var gotAudio = false;
	var gotVideo = false;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = sdpObj.media[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var m = _step.value;

			var kind = m.type;

			switch (kind) {
				case 'audio':
					{
						if (gotAudio) continue;

						gotAudio = true;
						break;
					}
				case 'video':
					{
						if (gotVideo) continue;

						gotVideo = true;
						break;
					}
				default:
					{
						continue;
					}
			}

			// Get codecs.
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = m.rtp[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var rtp = _step2.value;

					var codec = {
						name: rtp.codec,
						mimeType: kind + '/' + rtp.codec,
						kind: kind,
						clockRate: rtp.rate,
						preferredPayloadType: rtp.payload,
						channels: rtp.encoding,
						rtcpFeedback: [],
						parameters: {}
					};

					if (codec.kind !== 'audio') delete codec.channels;else if (!codec.channels) codec.channels = 1;

					codecsMap.set(codec.preferredPayloadType, codec);
				}

				// Get codec parameters.
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = (m.fmtp || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var fmtp = _step3.value;

					var parameters = _sdpTransform2.default.parseFmtpConfig(fmtp.config);
					var codec = codecsMap.get(fmtp.payload);

					if (!codec) continue;

					codec.parameters = parameters;
				}

				// Get RTCP feedback for each codec.
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = (m.rtcpFb || [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var fb = _step4.value;

					var codec = codecsMap.get(fb.payload);

					if (!codec) continue;

					var feedback = {
						type: fb.type,
						parameter: fb.subtype
					};

					if (!feedback.parameter) delete feedback.parameter;

					codec.rtcpFeedback.push(feedback);
				}

				// Get RTP header extensions.
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = (m.ext || [])[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var ext = _step5.value;

					var headerExtension = {
						kind: kind,
						uri: ext.uri,
						preferredId: ext.value
					};

					headerExtensions.push(headerExtension);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var rtpCapabilities = {
		codecs: Array.from(codecsMap.values()),
		headerExtensions: headerExtensions,
		fecMechanisms: [] // TODO
	};

	return rtpCapabilities;
}

/**
 * Extract DTLS parameters from a SDP.
 *
 * @param {Object} sdpObj - SDP Object generated by sdp-transform.
 * @return {RTCDtlsParameters}
 */
function extractDtlsParameters(sdpObj) {
	var media = getFirstActiveMediaSection(sdpObj);
	var fingerprint = media.fingerprint || sdpObj.fingerprint;
	var role = void 0;

	switch (media.setup) {
		case 'active':
			role = 'client';
			break;
		case 'passive':
			role = 'server';
			break;
		case 'actpass':
			role = 'auto';
			break;
	}

	var dtlsParameters = {
		role: role,
		fingerprints: [{
			algorithm: fingerprint.type,
			value: fingerprint.hash
		}]
	};

	return dtlsParameters;
}

/**
 * Get the first acive media section.
 *
 * @private
 * @param {Object} sdpObj - SDP Object generated by sdp-transform.
 * @return {Object} SDP media section as parsed by sdp-transform.
 */
function getFirstActiveMediaSection(sdpObj) {
	return (sdpObj.media || []).find(function (m) {
		return m.iceUfrag && m.port !== 0;
	});
}
},{"sdp-transform":216}],186:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.fillRtpParametersForTrack = fillRtpParametersForTrack;
exports.addSimulcastForTrack = addSimulcastForTrack;
/**
 * Fill the given RTP parameters for the given track.
 *
 * @param {RTCRtpParameters} rtpParameters -  RTP parameters to be filled.
 * @param {Object} sdpObj - Local SDP Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 */
function fillRtpParametersForTrack(rtpParameters, sdpObj, track) {
	var kind = track.kind;
	var rtcp = {
		cname: null,
		reducedSize: true,
		mux: true
	};

	var mSection = (sdpObj.media || []).find(function (m) {
		return m.type === kind;
	});

	if (!mSection) throw new Error('m=' + kind + ' section not found');

	// First media SSRC (or the only one).
	var firstSsrc = void 0;

	// Get all the SSRCs.

	var ssrcs = new Set();

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (mSection.ssrcs || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var line = _step.value;

			if (line.attribute !== 'msid') continue;

			var trackId = line.value.split(' ')[1];

			if (trackId === track.id) {
				var _ssrc2 = line.id;

				ssrcs.add(_ssrc2);

				if (!firstSsrc) firstSsrc = _ssrc2;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	if (ssrcs.size === 0) throw new Error('a=ssrc line not found for local track [track.id:' + track.id + ']');

	// Get media and RTX SSRCs.

	var ssrcToRtxSsrc = new Map();

	// First assume RTX is used.
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = (mSection.ssrcGroups || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _line = _step2.value;

			if (_line.semantics !== 'FID') continue;

			var _line$ssrcs$split = _line.ssrcs.split(/\s+/),
			    _line$ssrcs$split2 = _slicedToArray(_line$ssrcs$split, 2),
			    ssrc = _line$ssrcs$split2[0],
			    rtxSsrc = _line$ssrcs$split2[1];

			ssrc = Number(ssrc);
			rtxSsrc = Number(rtxSsrc);

			if (ssrcs.has(ssrc)) {
				// Remove both the SSRC and RTX SSRC from the Set so later we know that they
				// are already handled.
				ssrcs.delete(ssrc);
				ssrcs.delete(rtxSsrc);

				// Add to the map.
				ssrcToRtxSsrc.set(ssrc, rtxSsrc);
			}
		}

		// If the Set of SSRCs is not empty it means that RTX is not being used, so take
		// media SSRCs from there.
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = ssrcs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var ssrc = _step3.value;

			// Add to the map.
			ssrcToRtxSsrc.set(ssrc, null);
		}

		// Get RTCP info.
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	var ssrcCnameLine = mSection.ssrcs.find(function (line) {
		return line.attribute === 'cname' && line.id === firstSsrc;
	});

	if (ssrcCnameLine) rtcp.cname = ssrcCnameLine.value;

	// Fill RTP parameters.

	rtpParameters.rtcp = rtcp;
	rtpParameters.encodings = [];

	var simulcast = ssrcToRtxSsrc.size > 1;
	var simulcastProfiles = ['low', 'medium', 'high'];

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = ssrcToRtxSsrc[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var _ref = _step4.value;

			var _ref2 = _slicedToArray(_ref, 2);

			var _ssrc = _ref2[0];
			var rtxSsrc = _ref2[1];

			var encoding = { ssrc: _ssrc };

			if (rtxSsrc) encoding.rtx = { ssrc: rtxSsrc };

			if (simulcast) encoding.profile = simulcastProfiles.shift();

			rtpParameters.encodings.push(encoding);
		}
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4.return) {
				_iterator4.return();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}
}

/**
 * Adds simulcast into the given SDP for the given track.
 *
 * @param {Object} sdpObj - Local SDP Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 */
function addSimulcastForTrack(sdpObj, track) {
	var kind = track.kind;

	var mSection = (sdpObj.media || []).find(function (m) {
		return m.type === kind;
	});

	if (!mSection) throw new Error('m=' + kind + ' section not found');

	var ssrc = void 0;
	var rtxSsrc = void 0;
	var msid = void 0;

	// Get the SSRC.

	var ssrcMsidLine = (mSection.ssrcs || []).find(function (line) {
		if (line.attribute !== 'msid') return false;

		var trackId = line.value.split(' ')[1];

		if (trackId === track.id) {
			ssrc = line.id;
			msid = line.value.split(' ')[0];

			return true;
		}
	});

	if (!ssrcMsidLine) throw new Error('a=ssrc line not found for local track [track.id:' + track.id + ']');

	// Get the SSRC for RTX.

	(mSection.ssrcGroups || []).some(function (line) {
		if (line.semantics !== 'FID') return;

		var ssrcs = line.ssrcs.split(/\s+/);

		if (Number(ssrcs[0]) === ssrc) {
			rtxSsrc = Number(ssrcs[1]);

			return true;
		}
	});

	var ssrcCnameLine = mSection.ssrcs.find(function (line) {
		return line.attribute === 'cname' && line.id === ssrc;
	});

	if (!ssrcCnameLine) throw new Error('CNAME line not found for local track [track.id:' + track.id + ']');

	var cname = ssrcCnameLine.value;
	var ssrc2 = ssrc + 1;
	var ssrc3 = ssrc + 2;

	mSection.ssrcGroups = mSection.ssrcGroups || [];

	mSection.ssrcGroups.push({
		semantics: 'SIM',
		ssrcs: ssrc + ' ' + ssrc2 + ' ' + ssrc3
	});

	mSection.ssrcs.push({
		id: ssrc2,
		attribute: 'cname',
		value: cname
	});

	mSection.ssrcs.push({
		id: ssrc2,
		attribute: 'msid',
		value: msid + ' ' + track.id
	});

	mSection.ssrcs.push({
		id: ssrc3,
		attribute: 'cname',
		value: cname
	});

	mSection.ssrcs.push({
		id: ssrc3,
		attribute: 'msid',
		value: msid + ' ' + track.id
	});

	if (rtxSsrc) {
		var rtxSsrc2 = rtxSsrc + 1;
		var rtxSsrc3 = rtxSsrc + 2;

		mSection.ssrcGroups.push({
			semantics: 'FID',
			ssrcs: ssrc2 + ' ' + rtxSsrc2
		});

		mSection.ssrcs.push({
			id: rtxSsrc2,
			attribute: 'cname',
			value: cname
		});

		mSection.ssrcs.push({
			id: rtxSsrc2,
			attribute: 'msid',
			value: msid + ' ' + track.id
		});

		mSection.ssrcGroups.push({
			semantics: 'FID',
			ssrcs: ssrc3 + ' ' + rtxSsrc3
		});

		mSection.ssrcs.push({
			id: rtxSsrc3,
			attribute: 'cname',
			value: cname
		});

		mSection.ssrcs.push({
			id: rtxSsrc3,
			attribute: 'msid',
			value: msid + ' ' + track.id
		});
	}
}
},{}],187:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fillRtpParametersForTrack = fillRtpParametersForTrack;
/**
 * Fill the given RTP parameters for the given track.
 *
 * @param {RTCRtpParameters} rtpParameters -  RTP parameters to be filled.
 * @param {Object} sdpObj - Local SDP Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 */
function fillRtpParametersForTrack(rtpParameters, sdpObj, track) {
	var kind = track.kind;
	var rtcp = {
		cname: null,
		reducedSize: true,
		mux: true
	};

	var mSection = (sdpObj.media || []).find(function (m) {
		if (m.type !== kind) return;

		var msidLine = m.msid;

		if (!msidLine) return;

		var trackId = msidLine.split(' ')[1];

		if (trackId === track.id) return true;
	});

	if (!mSection) throw new Error('m=' + kind + ' section not found');

	// Get the SSRC and CNAME.

	var ssrcCnameLine = (mSection.ssrcs || []).find(function (line) {
		return line.attribute === 'cname';
	});

	var ssrc = void 0;

	if (ssrcCnameLine) {
		ssrc = ssrcCnameLine.id;
		rtcp.cname = ssrcCnameLine.value;
	}

	// Get a=rid lines.

	// Array of Objects with rid and profile keys.
	var simulcastStreams = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (mSection.rids || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var rid = _step.value;

			if (rid.direction !== 'send') continue;

			if (/^low/.test(rid.id)) simulcastStreams.push({ rid: rid.id, profile: 'low' });else if (/^medium/.test(rid.id)) simulcastStreams.push({ rid: rid.id, profile: 'medium' });
			if (/^high/.test(rid.id)) simulcastStreams.push({ rid: rid.id, profile: 'high' });
		}

		// Fill RTP parameters.
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	rtpParameters.rtcp = rtcp;
	rtpParameters.encodings = [];

	if (simulcastStreams.length === 0) {
		var encoding = { ssrc: ssrc };

		rtpParameters.encodings.push(encoding);
	} else {
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = simulcastStreams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var simulcastStream = _step2.value;

				var _encoding = {
					encodingId: simulcastStream.rid,
					profile: simulcastStream.profile
				};

				rtpParameters.encodings.push(_encoding);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	}
}
},{}],188:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Room = undefined;
exports.isDeviceSupported = isDeviceSupported;
exports.getDeviceInfo = getDeviceInfo;
exports.checkCapabilitiesForRoom = checkCapabilitiesForRoom;

var _ortc = require('./ortc');

var ortc = _interopRequireWildcard(_ortc);

var _Device = require('./Device');

var _Device2 = _interopRequireDefault(_Device);

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Whether the current browser or device is supported.
 *
 * @return {Boolean}
 *
 * @example
 * isDeviceSupported()
 * // => true
 */
function isDeviceSupported() {
  return _Device2.default.isSupported();
}

/**
 * Get information regarding the current browser or device.
 *
 * @return {Object} - Object with `name` (String) and version {String}.
 *
 * @example
 * getDeviceInfo()
 * // => { flag: 'chrome', name: 'Chrome', version: '59.0', bowser: {} }
 */
function getDeviceInfo() {
  return {
    flag: _Device2.default.getFlag(),
    name: _Device2.default.getName(),
    version: _Device2.default.getVersion(),
    bowser: _Device2.default.getBowser()
  };
}

/**
 * Check whether this device/browser can send/receive audio/video in a room
 * whose RTP capabilities are given.
 *
 * @param {Object} Room RTP capabilities.
 *
 * @return {Promise} Resolves to an Object with 'audio' and 'video' Booleans.
 */
function checkCapabilitiesForRoom(roomRtpCapabilities) {
  if (!_Device2.default.isSupported()) return Promise.reject(new Error('current browser/device not supported'));

  return _Device2.default.Handler.getNativeRtpCapabilities().then(function (nativeRtpCapabilities) {
    var extendedRtpCapabilities = ortc.getExtendedRtpCapabilities(nativeRtpCapabilities, roomRtpCapabilities);

    return {
      audio: ortc.canSend('audio', extendedRtpCapabilities),
      video: ortc.canSend('video', extendedRtpCapabilities)
    };
  });
}

/**
 * Expose the Room class.
 *
 * @example
 * const room = new Room();`
 */
exports.Room = _Room2.default;
},{"./Device":167,"./Room":172,"./ortc":189}],189:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getExtendedRtpCapabilities = getExtendedRtpCapabilities;
exports.getRtpCapabilities = getRtpCapabilities;
exports.getUnsupportedCodecs = getUnsupportedCodecs;
exports.canSend = canSend;
exports.canReceive = canReceive;
exports.getSendingRtpParameters = getSendingRtpParameters;
exports.getReceivingFullRtpParameters = getReceivingFullRtpParameters;
/**
 * Generate extended RTP capabilities for sending and receiving.
 *
 * @param {RTCRtpCapabilities} localCaps - Local capabilities.
 * @param {RTCRtpCapabilities} remoteCaps - Remote capabilities.
 *
 * @return {RTCExtendedRtpCapabilities}
 */
function getExtendedRtpCapabilities(localCaps, remoteCaps) {
	var extendedCaps = {
		codecs: [],
		headerExtensions: [],
		fecMechanisms: []
	};

	// Match media codecs and keep the order preferred by remoteCaps.

	var _loop = function _loop(remoteCodec) {
		// TODO: Ignore pseudo-codecs and feature codecs.
		if (remoteCodec.name === 'rtx') return 'continue';

		var matchingLocalCodec = (localCaps.codecs || []).find(function (localCodec) {
			return matchCapCodecs(localCodec, remoteCodec);
		});

		if (matchingLocalCodec) {
			var extendedCodec = {
				name: remoteCodec.name,
				mimeType: remoteCodec.mimeType,
				kind: remoteCodec.kind,
				clockRate: remoteCodec.clockRate,
				sendPayloadType: matchingLocalCodec.preferredPayloadType,
				sendRtxPayloadType: null,
				recvPayloadType: remoteCodec.preferredPayloadType,
				recvRtxPayloadType: null,
				channels: remoteCodec.channels,
				rtcpFeedback: reduceRtcpFeedback(matchingLocalCodec, remoteCodec),
				parameters: remoteCodec.parameters
			};

			if (!extendedCodec.channels) delete extendedCodec.channels;

			extendedCaps.codecs.push(extendedCodec);
		}
	};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (remoteCaps.codecs || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var remoteCodec = _step.value;

			var _ret = _loop(remoteCodec);

			if (_ret === 'continue') continue;
		}

		// Match RTX codecs.
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var _loop2 = function _loop2(extendedCodec) {
		var matchingLocalRtxCodec = (localCaps.codecs || []).find(function (localCodec) {
			return localCodec.name === 'rtx' && localCodec.parameters.apt === extendedCodec.sendPayloadType;
		});

		var matchingRemoteRtxCodec = (remoteCaps.codecs || []).find(function (remoteCodec) {
			return remoteCodec.name === 'rtx' && remoteCodec.parameters.apt === extendedCodec.recvPayloadType;
		});

		if (matchingLocalRtxCodec && matchingRemoteRtxCodec) {
			extendedCodec.sendRtxPayloadType = matchingLocalRtxCodec.preferredPayloadType;
			extendedCodec.recvRtxPayloadType = matchingRemoteRtxCodec.preferredPayloadType;
		}
	};

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = (extendedCaps.codecs || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var extendedCodec = _step2.value;

			_loop2(extendedCodec);
		}

		// Match header extensions.
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	var _loop3 = function _loop3(remoteExt) {
		var matchingLocalExt = (localCaps.headerExtensions || []).find(function (localExt) {
			return matchCapHeaderExtensions(localExt, remoteExt);
		});

		if (matchingLocalExt) {
			var extendedExt = {
				kind: remoteExt.kind,
				uri: remoteExt.uri,
				sendId: matchingLocalExt.preferredId,
				recvId: remoteExt.preferredId
			};

			extendedCaps.headerExtensions.push(extendedExt);
		}
	};

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = (remoteCaps.headerExtensions || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var remoteExt = _step3.value;

			_loop3(remoteExt);
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	return extendedCaps;
}

/**
 * Generate RTP capabilities for receiving media based on the given extended
 * RTP capabilities.
 *
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {RTCRtpCapabilities}
 */
function getRtpCapabilities(extendedRtpCapabilities) {
	var caps = {
		codecs: [],
		headerExtensions: [],
		fecMechanisms: []
	};

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = extendedRtpCapabilities.codecs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var capCodec = _step4.value;

			var codec = {
				name: capCodec.name,
				mimeType: capCodec.mimeType,
				kind: capCodec.kind,
				clockRate: capCodec.clockRate,
				preferredPayloadType: capCodec.recvPayloadType,
				channels: capCodec.channels,
				rtcpFeedback: capCodec.rtcpFeedback,
				parameters: capCodec.parameters
			};

			if (!codec.channels) delete codec.channels;

			caps.codecs.push(codec);

			// Add RTX codec.
			if (capCodec.recvRtxPayloadType) {
				var rtxCapCodec = {
					name: 'rtx',
					mimeType: capCodec.kind + '/rtx',
					kind: capCodec.kind,
					clockRate: capCodec.clockRate,
					preferredPayloadType: capCodec.recvRtxPayloadType,
					parameters: {
						apt: capCodec.recvPayloadType
					}
				};

				caps.codecs.push(rtxCapCodec);
			}

			// TODO: In the future, we need to add FEC, CN, etc, codecs.
		}
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4.return) {
				_iterator4.return();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}

	var _iteratorNormalCompletion5 = true;
	var _didIteratorError5 = false;
	var _iteratorError5 = undefined;

	try {
		for (var _iterator5 = extendedRtpCapabilities.headerExtensions[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
			var capExt = _step5.value;

			var ext = {
				kind: capExt.kind,
				uri: capExt.uri,
				preferredId: capExt.recvId
			};

			caps.headerExtensions.push(ext);
		}
	} catch (err) {
		_didIteratorError5 = true;
		_iteratorError5 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion5 && _iterator5.return) {
				_iterator5.return();
			}
		} finally {
			if (_didIteratorError5) {
				throw _iteratorError5;
			}
		}
	}

	caps.fecMechanisms = extendedRtpCapabilities.fecMechanisms;

	return caps;
}

/**
 * Get unsupported remote codecs.
 *
 * @param {RTCRtpCapabilities} remoteCaps - Remote capabilities.
 * @param {Array<Number>} mandatoryCodecPayloadTypes - List of codec PT values.
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {Boolean}
 */
function getUnsupportedCodecs(remoteCaps, mandatoryCodecPayloadTypes, extendedRtpCapabilities) {
	// If not given just ignore.
	if (!Array.isArray(mandatoryCodecPayloadTypes)) return [];

	var unsupportedCodecs = [];
	var remoteCodecs = remoteCaps.codecs;
	var supportedCodecs = extendedRtpCapabilities.codecs;

	var _loop4 = function _loop4(pt) {
		if (!supportedCodecs.some(function (codec) {
			return codec.recvPayloadType === pt;
		})) {
			var unsupportedCodec = remoteCodecs.find(function (codec) {
				return codec.preferredPayloadType === pt;
			});

			if (!unsupportedCodec) throw new Error('mandatory codec PT ' + pt + ' not found in remote codecs');

			unsupportedCodecs.push(unsupportedCodec);
		}
	};

	var _iteratorNormalCompletion6 = true;
	var _didIteratorError6 = false;
	var _iteratorError6 = undefined;

	try {
		for (var _iterator6 = mandatoryCodecPayloadTypes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
			var pt = _step6.value;

			_loop4(pt);
		}
	} catch (err) {
		_didIteratorError6 = true;
		_iteratorError6 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion6 && _iterator6.return) {
				_iterator6.return();
			}
		} finally {
			if (_didIteratorError6) {
				throw _iteratorError6;
			}
		}
	}

	return unsupportedCodecs;
}

/**
 * Whether media can be sent based on the given RTP capabilities.
 *
 * @param {String} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {Boolean}
 */
function canSend(kind, extendedRtpCapabilities) {
	return extendedRtpCapabilities.codecs.some(function (codec) {
		return codec.kind === kind;
	});
}

/**
 * Whether the given RTP parameters can be received with the given RTP
 * capabilities.
 *
 * @param {RTCRtpParameters} rtpParameters
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {Boolean}
 */
function canReceive(rtpParameters, extendedRtpCapabilities) {
	if (rtpParameters.codecs.length === 0) return false;

	var firstMediaCodec = rtpParameters.codecs[0];

	return extendedRtpCapabilities.codecs.some(function (codec) {
		return codec.recvPayloadType === firstMediaCodec.payloadType;
	});
}

/**
 * Generate RTP parameters of the given kind for sending media.
 * Just the first media codec per kind is considered.
 * NOTE: muxId, encodings and rtcp fields are left empty.
 *
 * @param {kind} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {RTCRtpParameters}
 */
function getSendingRtpParameters(kind, extendedRtpCapabilities) {
	var params = {
		muxId: null,
		codecs: [],
		headerExtensions: [],
		encodings: [],
		rtcp: {}
	};

	var _iteratorNormalCompletion7 = true;
	var _didIteratorError7 = false;
	var _iteratorError7 = undefined;

	try {
		for (var _iterator7 = extendedRtpCapabilities.codecs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
			var capCodec = _step7.value;

			if (capCodec.kind !== kind) continue;

			var codec = {
				name: capCodec.name,
				mimeType: capCodec.mimeType,
				clockRate: capCodec.clockRate,
				payloadType: capCodec.sendPayloadType,
				channels: capCodec.channels,
				rtcpFeedback: capCodec.rtcpFeedback,
				parameters: capCodec.parameters
			};

			if (!codec.channels) delete codec.channels;

			params.codecs.push(codec);

			// Add RTX codec.
			if (capCodec.sendRtxPayloadType) {
				var rtxCodec = {
					name: 'rtx',
					mimeType: capCodec.kind + '/rtx',
					clockRate: capCodec.clockRate,
					payloadType: capCodec.sendRtxPayloadType,
					parameters: {
						apt: capCodec.sendPayloadType
					}
				};

				params.codecs.push(rtxCodec);
			}

			// NOTE: We assume a single media codec plus an optional RTX codec for now.
			// TODO: In the future, we need to add FEC, CN, etc, codecs.
			break;
		}
	} catch (err) {
		_didIteratorError7 = true;
		_iteratorError7 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion7 && _iterator7.return) {
				_iterator7.return();
			}
		} finally {
			if (_didIteratorError7) {
				throw _iteratorError7;
			}
		}
	}

	var _iteratorNormalCompletion8 = true;
	var _didIteratorError8 = false;
	var _iteratorError8 = undefined;

	try {
		for (var _iterator8 = extendedRtpCapabilities.headerExtensions[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
			var capExt = _step8.value;

			if (capExt.kind && capExt.kind !== kind) continue;

			var ext = {
				uri: capExt.uri,
				id: capExt.sendId
			};

			params.headerExtensions.push(ext);
		}
	} catch (err) {
		_didIteratorError8 = true;
		_iteratorError8 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion8 && _iterator8.return) {
				_iterator8.return();
			}
		} finally {
			if (_didIteratorError8) {
				throw _iteratorError8;
			}
		}
	}

	return params;
}

/**
 * Generate RTP parameters of the given kind for receiving media.
 * All the media codecs per kind are considered. This is useful for generating
 * a SDP remote offer.
 * NOTE: muxId, encodings and rtcp fields are left empty.
 *
 * @param {String} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {RTCRtpParameters}
 */
function getReceivingFullRtpParameters(kind, extendedRtpCapabilities) {
	var params = {
		muxId: null,
		codecs: [],
		headerExtensions: [],
		encodings: [],
		rtcp: {}
	};

	var _iteratorNormalCompletion9 = true;
	var _didIteratorError9 = false;
	var _iteratorError9 = undefined;

	try {
		for (var _iterator9 = extendedRtpCapabilities.codecs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
			var capCodec = _step9.value;

			if (capCodec.kind !== kind) continue;

			var codec = {
				name: capCodec.name,
				mimeType: capCodec.mimeType,
				clockRate: capCodec.clockRate,
				payloadType: capCodec.recvPayloadType,
				channels: capCodec.channels,
				rtcpFeedback: capCodec.rtcpFeedback,
				parameters: capCodec.parameters
			};

			if (!codec.channels) delete codec.channels;

			params.codecs.push(codec);

			// Add RTX codec.
			if (capCodec.recvRtxPayloadType) {
				var rtxCodec = {
					name: 'rtx',
					mimeType: capCodec.kind + '/rtx',
					clockRate: capCodec.clockRate,
					payloadType: capCodec.recvRtxPayloadType,
					parameters: {
						apt: capCodec.recvPayloadType
					}
				};

				params.codecs.push(rtxCodec);
			}

			// TODO: In the future, we need to add FEC, CN, etc, codecs.
		}
	} catch (err) {
		_didIteratorError9 = true;
		_iteratorError9 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion9 && _iterator9.return) {
				_iterator9.return();
			}
		} finally {
			if (_didIteratorError9) {
				throw _iteratorError9;
			}
		}
	}

	var _iteratorNormalCompletion10 = true;
	var _didIteratorError10 = false;
	var _iteratorError10 = undefined;

	try {
		for (var _iterator10 = extendedRtpCapabilities.headerExtensions[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
			var capExt = _step10.value;

			if (capExt.kind && capExt.kind !== kind) continue;

			var ext = {
				uri: capExt.uri,
				id: capExt.recvId
			};

			params.headerExtensions.push(ext);
		}
	} catch (err) {
		_didIteratorError10 = true;
		_iteratorError10 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion10 && _iterator10.return) {
				_iterator10.return();
			}
		} finally {
			if (_didIteratorError10) {
				throw _iteratorError10;
			}
		}
	}

	return params;
}

function matchCapCodecs(aCodec, bCodec) {
	var aMimeType = aCodec.mimeType.toLowerCase();
	var bMimeType = bCodec.mimeType.toLowerCase();

	if (aMimeType !== bMimeType) return false;

	if (aCodec.clockRate !== bCodec.clockRate) return false;

	if (aCodec.channels !== bCodec.channels) return false;

	// Match H264 parameters.
	if (aMimeType === 'video/h264') {
		var aPacketizationMode = (aCodec.parameters || {})['packetization-mode'] || 0;
		var bPacketizationMode = (bCodec.parameters || {})['packetization-mode'] || 0;

		if (aPacketizationMode !== bPacketizationMode) return false;
	}

	return true;
}

function matchCapHeaderExtensions(aExt, bExt) {
	if (aExt.kind && bExt.kind && aExt.kind !== bExt.kind) return false;

	if (aExt.uri !== bExt.uri) return false;

	return true;
}

function reduceRtcpFeedback(codecA, codecB) {
	var reducedRtcpFeedback = [];

	var _loop5 = function _loop5(aFb) {
		var matchingBFb = (codecB.rtcpFeedback || []).find(function (bFb) {
			return bFb.type === aFb.type && bFb.parameter === aFb.parameter;
		});

		if (matchingBFb) reducedRtcpFeedback.push(matchingBFb);
	};

	var _iteratorNormalCompletion11 = true;
	var _didIteratorError11 = false;
	var _iteratorError11 = undefined;

	try {
		for (var _iterator11 = (codecA.rtcpFeedback || [])[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
			var aFb = _step11.value;

			_loop5(aFb);
		}
	} catch (err) {
		_didIteratorError11 = true;
		_iteratorError11 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion11 && _iterator11.return) {
				_iterator11.return();
			}
		} finally {
			if (_didIteratorError11) {
				throw _iteratorError11;
			}
		}
	}

	return reducedRtcpFeedback;
}
},{}],190:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomNumber = randomNumber;
exports.clone = clone;

var _randomNumber = require('random-number');

var _randomNumber2 = _interopRequireDefault(_randomNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var randomNumberGenerator = _randomNumber2.default.generator({
  min: 10000000,
  max: 99999999,
  integer: true
});

/**
 * Generates a random positive number between 10000000 and 99999999.
 *
 * @return {Number}
 */
function randomNumber() {
  return randomNumberGenerator();
}

/**
 * Clones the given Object/Array.
 *
 * @param {Object|Array} obj
 *
 * @return {Object|Array}
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
},{"random-number":201}],191:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],192:[function(require,module,exports){
(function (global){
// Last time updated: 2016-07-03 8:51:35 AM UTC

// links:
// Open-Sourced: https://github.com/streamproc/MediaStreamRecorder
// https://cdn.WebRTC-Experiment.com/MediaStreamRecorder.js
// https://www.WebRTC-Experiment.com/MediaStreamRecorder.js
// npm install msr

//------------------------------------

// Browsers Support::
// Chrome (all versions) [ audio/video separately ]
// Firefox ( >= 29 ) [ audio/video in single webm/mp4 container or only audio in ogg ]
// Opera (all versions) [ same as chrome ]
// Android (Chrome) [ only video ]
// Android (Opera) [ only video ]
// Android (Firefox) [ only video ]
// Microsoft Edge (Only Audio & Gif)

//------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
//------------------------------------

// ______________________
// MediaStreamRecorder.js

function MediaStreamRecorder(mediaStream) {
    if (!mediaStream) {
        throw 'MediaStream is mandatory.';
    }

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        var Recorder;

        if (typeof MediaRecorder !== 'undefined') {
            Recorder = MediaRecorderWrapper;
        } else if (IsChrome || IsOpera || IsEdge) {
            if (this.mimeType.indexOf('video') !== -1) {
                Recorder = WhammyRecorder;
            } else if (this.mimeType.indexOf('audio') !== -1) {
                Recorder = StereoAudioRecorder;
            }
        }

        // video recorder (in GIF format)
        if (this.mimeType === 'image/gif') {
            Recorder = GifRecorder;
        }

        // audio/wav is supported only via StereoAudioRecorder
        // audio/pcm (int16) is supported only via StereoAudioRecorder
        if (this.mimeType === 'audio/wav' || this.mimeType === 'audio/pcm') {
            Recorder = StereoAudioRecorder;
        }

        // allows forcing StereoAudioRecorder.js on Edge/Firefox
        if (this.recorderType) {
            Recorder = this.recorderType;
        }

        mediaRecorder = new Recorder(mediaStream);
        mediaRecorder.blobs = [];

        var self = this;
        mediaRecorder.ondataavailable = function(data) {
            mediaRecorder.blobs.push(data);
            self.ondataavailable(data);
        };
        mediaRecorder.onstop = this.onstop;
        mediaRecorder.onStartedDrawingNonBlankFrames = this.onStartedDrawingNonBlankFrames;

        // Merge all data-types except "function"
        mediaRecorder = mergeProps(mediaRecorder, this);

        mediaRecorder.start(timeSlice);
    };

    this.onStartedDrawingNonBlankFrames = function() {};
    this.clearOldRecordedFrames = function() {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.clearOldRecordedFrames();
    };

    this.stop = function() {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    this.ondataavailable = function(blob) {
        console.log('ondataavailable..', blob);
    };

    this.onstop = function(error) {
        console.warn('stopped..', error);
    };

    this.save = function(file, fileName) {
        if (!file) {
            if (!mediaRecorder) {
                return;
            }

            ConcatenateBlobs(mediaRecorder.blobs, mediaRecorder.blobs[0].type, function(concatenatedBlob) {
                invokeSaveAsDialog(concatenatedBlob);
            });
            return;
        }
        invokeSaveAsDialog(file, fileName);
    };

    this.pause = function() {
        if (!mediaRecorder) {
            return;
        }
        mediaRecorder.pause();
        console.log('Paused recording.', this.mimeType || mediaRecorder.mimeType);
    };

    this.resume = function() {
        if (!mediaRecorder) {
            return;
        }
        mediaRecorder.resume();
        console.log('Resumed recording.', this.mimeType || mediaRecorder.mimeType);
    };

    // StereoAudioRecorder || WhammyRecorder || MediaRecorderWrapper || GifRecorder
    this.recorderType = null;

    // video/webm or audio/webm or audio/ogg or audio/wav
    this.mimeType = 'video/webm';

    // logs are enabled by default
    this.disableLogs = false;

    // Reference to "MediaRecorder.js"
    var mediaRecorder;
}

// ______________________
// MultiStreamRecorder.js

function MultiStreamRecorder(mediaStream) {
    if (!mediaStream) {
        throw 'MediaStream is mandatory.';
    }

    var self = this;
    var isMediaRecorder = isMediaRecorderCompatible();

    this.stream = mediaStream;

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        audioRecorder = new MediaStreamRecorder(mediaStream);
        videoRecorder = new MediaStreamRecorder(mediaStream);

        audioRecorder.mimeType = 'audio/ogg';
        videoRecorder.mimeType = 'video/webm';

        for (var prop in this) {
            if (typeof this[prop] !== 'function') {
                audioRecorder[prop] = videoRecorder[prop] = this[prop];
            }
        }

        audioRecorder.ondataavailable = function(blob) {
            if (!audioVideoBlobs[recordingInterval]) {
                audioVideoBlobs[recordingInterval] = {};
            }

            audioVideoBlobs[recordingInterval].audio = blob;

            if (audioVideoBlobs[recordingInterval].video && !audioVideoBlobs[recordingInterval].onDataAvailableEventFired) {
                audioVideoBlobs[recordingInterval].onDataAvailableEventFired = true;
                fireOnDataAvailableEvent(audioVideoBlobs[recordingInterval]);
            }
        };

        videoRecorder.ondataavailable = function(blob) {
            if (isMediaRecorder) {
                return self.ondataavailable({
                    video: blob,
                    audio: blob
                });
            }

            if (!audioVideoBlobs[recordingInterval]) {
                audioVideoBlobs[recordingInterval] = {};
            }

            audioVideoBlobs[recordingInterval].video = blob;

            if (audioVideoBlobs[recordingInterval].audio && !audioVideoBlobs[recordingInterval].onDataAvailableEventFired) {
                audioVideoBlobs[recordingInterval].onDataAvailableEventFired = true;
                fireOnDataAvailableEvent(audioVideoBlobs[recordingInterval]);
            }
        };

        function fireOnDataAvailableEvent(blobs) {
            recordingInterval++;
            self.ondataavailable(blobs);
        }

        videoRecorder.onstop = audioRecorder.onstop = function(error) {
            self.onstop(error);
        };

        if (!isMediaRecorder) {
            // to make sure both audio/video are synced.
            videoRecorder.onStartedDrawingNonBlankFrames = function() {
                videoRecorder.clearOldRecordedFrames();
                audioRecorder.start(timeSlice);
            };
            videoRecorder.start(timeSlice);
        } else {
            videoRecorder.start(timeSlice);
        }
    };

    this.stop = function() {
        if (audioRecorder) {
            audioRecorder.stop();
        }
        if (videoRecorder) {
            videoRecorder.stop();
        }
    };

    this.ondataavailable = function(blob) {
        console.log('ondataavailable..', blob);
    };

    this.onstop = function(error) {
        console.warn('stopped..', error);
    };

    this.pause = function() {
        if (audioRecorder) {
            audioRecorder.pause();
        }
        if (videoRecorder) {
            videoRecorder.pause();
        }
    };

    this.resume = function() {
        if (audioRecorder) {
            audioRecorder.resume();
        }
        if (videoRecorder) {
            videoRecorder.resume();
        }
    };

    var audioRecorder;
    var videoRecorder;

    var audioVideoBlobs = {};
    var recordingInterval = 0;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.MultiStreamRecorder = MultiStreamRecorder;
}

// _____________________________
// Cross-Browser-Declarations.js

var browserFakeUserAgent = 'Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45';

(function(that) {
    if (typeof window !== 'undefined') {
        return;
    }

    if (typeof window === 'undefined' && typeof global !== 'undefined') {
        global.navigator = {
            userAgent: browserFakeUserAgent,
            getUserMedia: function() {}
        };

        /*global window:true */
        that.window = global;
    } else if (typeof window === 'undefined') {
        // window = this;
    }

    if (typeof document === 'undefined') {
        /*global document:true */
        that.document = {};

        document.createElement = document.captureStream = document.mozCaptureStream = function() {
            return {};
        };
    }

    if (typeof location === 'undefined') {
        /*global location:true */
        that.location = {
            protocol: 'file:',
            href: '',
            hash: ''
        };
    }

    if (typeof screen === 'undefined') {
        /*global screen:true */
        that.screen = {
            width: 0,
            height: 0
        };
    }
})(typeof global !== 'undefined' ? global : window);

// WebAudio API representer
var AudioContext = window.AudioContext;

if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = mozAudioContext;
    }
}

if (typeof window === 'undefined') {
    /*jshint -W020 */
    window = {};
}

// WebAudio API representer
var AudioContext = window.AudioContext;

if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = mozAudioContext;
    }
}

/*jshint -W079 */
var URL = window.URL;

if (typeof URL === 'undefined' && typeof webkitURL !== 'undefined') {
    /*global URL:true */
    URL = webkitURL;
}

if (typeof navigator !== 'undefined') {
    if (typeof navigator.webkitGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    }

    if (typeof navigator.mozGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }
} else {
    navigator = {
        getUserMedia: function() {},
        userAgent: browserFakeUserAgent
    };
}

var IsEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveBlob || !!navigator.msSaveOrOpenBlob);

var IsOpera = false;
if (typeof opera !== 'undefined' && navigator.userAgent && navigator.userAgent.indexOf('OPR/') !== -1) {
    IsOpera = true;
}
var IsChrome = !IsEdge && !IsEdge && !!navigator.webkitGetUserMedia;

var MediaStream = window.MediaStream;

if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
    MediaStream = webkitMediaStream;
}

/*global MediaStream:true */
if (typeof MediaStream !== 'undefined') {
    if (!('getVideoTracks' in MediaStream.prototype)) {
        MediaStream.prototype.getVideoTracks = function() {
            if (!this.getTracks) {
                return [];
            }

            var tracks = [];
            this.getTracks.forEach(function(track) {
                if (track.kind.toString().indexOf('video') !== -1) {
                    tracks.push(track);
                }
            });
            return tracks;
        };

        MediaStream.prototype.getAudioTracks = function() {
            if (!this.getTracks) {
                return [];
            }

            var tracks = [];
            this.getTracks.forEach(function(track) {
                if (track.kind.toString().indexOf('audio') !== -1) {
                    tracks.push(track);
                }
            });
            return tracks;
        };
    }

    if (!('stop' in MediaStream.prototype)) {
        MediaStream.prototype.stop = function() {
            this.getAudioTracks().forEach(function(track) {
                if (!!track.stop) {
                    track.stop();
                }
            });

            this.getVideoTracks().forEach(function(track) {
                if (!!track.stop) {
                    track.stop();
                }
            });
        };
    }
}

if (typeof location !== 'undefined') {
    if (location.href.indexOf('file:') === 0) {
        console.error('Please load this HTML file on HTTP or HTTPS.');
    }
}

// Merge all other data-types except "function"

function mergeProps(mergein, mergeto) {
    for (var t in mergeto) {
        if (typeof mergeto[t] !== 'function') {
            mergein[t] = mergeto[t];
        }
    }
    return mergein;
}

// "dropFirstFrame" has been added by Graham Roth
// https://github.com/gsroth

function dropFirstFrame(arr) {
    arr.shift();
    return arr;
}

/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "Recorded-Video.webm"
 * @example
 * invokeSaveAsDialog(blob or file, [optional] fileName);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        try {
            file.type = 'video/webm';
        } catch (e) {}
    }

    var fileExtension = (file.type || 'video/webm').split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function() {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}

function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Bytes';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// ______________ (used to handle stuff like http://goo.gl/xmE5eg) issue #129
// ObjectStore.js
var ObjectStore = {
    AudioContext: AudioContext
};

function isMediaRecorderCompatible() {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isChrome = !!window.chrome && !isOpera;
    var isFirefox = typeof window.InstallTrigger !== 'undefined';

    if (isFirefox) {
        return true;
    }

    if (!isChrome) {
        return false;
    }

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    if (isChrome) {
        verOffset = nAgt.indexOf('Chrome');
        fullVersion = nAgt.substring(verOffset + 7);
    }

    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    majorVersion = parseInt('' + fullVersion, 10);

    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return majorVersion >= 49;
}

// ______________ (used to handle stuff like http://goo.gl/xmE5eg) issue #129
// ObjectStore.js
var ObjectStore = {
    AudioContext: window.AudioContext || window.webkitAudioContext
};

// ==================
// MediaRecorder.js

/**
 * Implementation of https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html
 * The MediaRecorder accepts a mediaStream as input source passed from UA. When recorder starts,
 * a MediaEncoder will be created and accept the mediaStream as input source.
 * Encoder will get the raw data by track data changes, encode it by selected MIME Type, then store the encoded in EncodedBufferCache object.
 * The encoded data will be extracted on every timeslice passed from Start function call or by RequestData function.
 * Thread model:
 * When the recorder starts, it creates a "Media Encoder" thread to read data from MediaEncoder object and store buffer in EncodedBufferCache object.
 * Also extract the encoded data and create blobs on every timeslice passed from start function or RequestData function called by UA.
 */

function MediaRecorderWrapper(mediaStream) {
    var self = this;

    /**
     * This method records MediaStream.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.record();
     */
    this.start = function(timeSlice, __disableLogs) {
        if (!self.mimeType) {
            self.mimeType = 'video/webm';
        }

        if (self.mimeType.indexOf('audio') !== -1) {
            if (mediaStream.getVideoTracks().length && mediaStream.getAudioTracks().length) {
                var stream;
                if (!!navigator.mozGetUserMedia) {
                    stream = new MediaStream();
                    stream.addTrack(mediaStream.getAudioTracks()[0]);
                } else {
                    // webkitMediaStream
                    stream = new MediaStream(mediaStream.getAudioTracks());
                }
                mediaStream = stream;
            }
        }

        if (self.mimeType.indexOf('audio') !== -1) {
            self.mimeType = IsChrome ? 'audio/webm' : 'audio/ogg';
        }

        self.dontFireOnDataAvailableEvent = false;

        var recorderHints = {
            mimeType: self.mimeType
        };

        if (!self.disableLogs && !__disableLogs) {
            console.log('Passing following params over MediaRecorder API.', recorderHints);
        }

        if (mediaRecorder) {
            // mandatory to make sure Firefox doesn't fails to record streams 3-4 times without reloading the page.
            mediaRecorder = null;
        }

        if (IsChrome && !isMediaRecorderCompatible()) {
            // to support video-only recording on stable
            recorderHints = 'video/vp8';
        }

        // http://dxr.mozilla.org/mozilla-central/source/content/media/MediaRecorder.cpp
        // https://wiki.mozilla.org/Gecko:MediaRecorder
        // https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html

        // starting a recording session; which will initiate "Reading Thread"
        // "Reading Thread" are used to prevent main-thread blocking scenarios
        try {
            mediaRecorder = new MediaRecorder(mediaStream, recorderHints);
        } catch (e) {
            // if someone passed NON_supported mimeType
            // or if Firefox on Android
            mediaRecorder = new MediaRecorder(mediaStream);
        }

        if ('canRecordMimeType' in mediaRecorder && mediaRecorder.canRecordMimeType(self.mimeType) === false) {
            if (!self.disableLogs) {
                console.warn('MediaRecorder API seems unable to record mimeType:', self.mimeType);
            }
        }

        // i.e. stop recording when <video> is paused by the user; and auto restart recording 
        // when video is resumed. E.g. yourStream.getVideoTracks()[0].muted = true; // it will auto-stop recording.
        mediaRecorder.ignoreMutedMedia = self.ignoreMutedMedia || false;

        var firedOnDataAvailableOnce = false;

        // Dispatching OnDataAvailable Handler
        mediaRecorder.ondataavailable = function(e) {
            if (self.dontFireOnDataAvailableEvent) {
                return;
            }

            // how to fix FF-corrupt-webm issues?
            // should we leave this?          e.data.size < 26800
            if (!e.data || !e.data.size || e.data.size < 26800 || firedOnDataAvailableOnce) {
                return;
            }

            firedOnDataAvailableOnce = true;

            var blob = self.getNativeBlob ? e.data : new Blob([e.data], {
                type: self.mimeType || 'video/webm'
            });

            self.ondataavailable(blob);

            self.dontFireOnDataAvailableEvent = true;

            if (!!mediaRecorder) {
                mediaRecorder.stop();
                mediaRecorder = null;
            }

            // record next interval
            self.start(timeSlice, '__disableLogs');
        };

        mediaRecorder.onerror = function(error) {
            if (!self.disableLogs) {
                if (error.name === 'InvalidState') {
                    console.error('The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.');
                } else if (error.name === 'OutOfMemory') {
                    console.error('The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'IllegalStreamModification') {
                    console.error('A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'OtherRecordingError') {
                    console.error('Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'GenericError') {
                    console.error('The UA cannot provide the codec or recording option that has been requested.', error);
                } else {
                    console.error('MediaRecorder Error', error);
                }
            }

            // When the stream is "ended" set recording to 'inactive' 
            // and stop gathering data. Callers should not rely on 
            // exactness of the timeSlice value, especially 
            // if the timeSlice value is small. Callers should 
            // consider timeSlice as a minimum value

            if (!!mediaRecorder && mediaRecorder.state !== 'inactive' && mediaRecorder.state !== 'stopped') {
                mediaRecorder.stop();
            }
        };

        // void start(optional long mTimeSlice)
        // The interval of passing encoded data from EncodedBufferCache to onDataAvailable
        // handler. "mTimeSlice < 0" means Session object does not push encoded data to
        // onDataAvailable, instead, it passive wait the client side pull encoded data
        // by calling requestData API.
        try {
            mediaRecorder.start(3.6e+6);
        } catch (e) {
            mediaRecorder = null;
        }

        setTimeout(function() {
            if (!mediaRecorder) {
                return;
            }

            if (mediaRecorder.state === 'recording') {
                // "stop" method auto invokes "requestData"!
                mediaRecorder.requestData();
                // mediaRecorder.stop();
            }
        }, timeSlice);

        // Start recording. If timeSlice has been provided, mediaRecorder will
        // raise a dataavailable event containing the Blob of collected data on every timeSlice milliseconds.
        // If timeSlice isn't provided, UA should call the RequestData to obtain the Blob data, also set the mTimeSlice to zero.
    };

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        if (!mediaRecorder) {
            return;
        }

        // mediaRecorder.state === 'recording' means that media recorder is associated with "session"
        // mediaRecorder.state === 'stopped' means that media recorder is detached from the "session" ... in this case; "session" will also be deleted.

        if (mediaRecorder.state === 'recording') {
            // "stop" method auto invokes "requestData"!
            mediaRecorder.requestData();

            setTimeout(function() {
                self.dontFireOnDataAvailableEvent = true;
                if (!!mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                mediaRecorder = null;
            }, 2000);
        }
    };

    /**
     * This method pauses the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
        }
    };

    /**
     * The recorded blobs are passed over this event.
     * @event
     * @memberof MediaStreamRecorder
     * @example
     * recorder.ondataavailable = function(data) {};
     */
    this.ondataavailable = function(blob) {
        console.log('recorded-blob', blob);
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (this.dontFireOnDataAvailableEvent) {
            this.dontFireOnDataAvailableEvent = false;

            var disableLogs = self.disableLogs;
            self.disableLogs = true;
            this.record();
            self.disableLogs = disableLogs;
            return;
        }

        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (!mediaRecorder) {
            return;
        }

        this.pause();

        this.dontFireOnDataAvailableEvent = true;
        this.stop();
    };

    // Reference to "MediaRecorder" object
    var mediaRecorder;

    function isMediaStreamActive() {
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                return false;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    // this method checks if media stream is stopped
    // or any track is ended.
    (function looper() {
        if (!mediaRecorder) {
            return;
        }

        if (isMediaStreamActive() === false) {
            self.stop();
            return;
        }

        setTimeout(looper, 1000); // check every second
    })();
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.MediaRecorderWrapper = MediaRecorderWrapper;
}

// ======================
// StereoAudioRecorder.js

function StereoAudioRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        mediaRecorder = new StereoAudioRecorderHelper(mediaStream, this);

        mediaRecorder.record();

        timeout = setInterval(function() {
            mediaRecorder.requestData();
        }, timeSlice);
    };

    this.stop = function() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            clearTimeout(timeout);
        }
    };

    this.pause = function() {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.pause();
    };

    this.resume = function() {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.resume();
    };

    this.ondataavailable = function() {};

    // Reference to "StereoAudioRecorder" object
    var mediaRecorder;
    var timeout;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.StereoAudioRecorder = StereoAudioRecorder;
}

// ============================
// StereoAudioRecorderHelper.js

// source code from: http://typedarray.org/wp-content/projects/WebAudioRecorder/script.js

function StereoAudioRecorderHelper(mediaStream, root) {

    // variables    
    var deviceSampleRate = 44100; // range: 22050 to 96000

    if (!ObjectStore.AudioContextConstructor) {
        ObjectStore.AudioContextConstructor = new ObjectStore.AudioContext();
    }

    // check device sample rate
    deviceSampleRate = ObjectStore.AudioContextConstructor.sampleRate;

    var leftchannel = [];
    var rightchannel = [];
    var scriptprocessornode;
    var recording = false;
    var recordingLength = 0;
    var volume;
    var audioInput;
    var sampleRate = root.sampleRate || deviceSampleRate;

    var mimeType = root.mimeType || 'audio/wav';
    var isPCM = mimeType.indexOf('audio/pcm') > -1;

    var context;

    var numChannels = root.audioChannels || 2;

    this.record = function() {
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
    };

    this.requestData = function() {
        if (isPaused) {
            return;
        }

        if (recordingLength === 0) {
            requestDataInvoked = false;
            return;
        }

        requestDataInvoked = true;
        // clone stuff
        var internalLeftChannel = leftchannel.slice(0);
        var internalRightChannel = rightchannel.slice(0);
        var internalRecordingLength = recordingLength;

        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = [];
        recordingLength = 0;
        requestDataInvoked = false;

        // we flat the left and right channels down
        var leftBuffer = mergeBuffers(internalLeftChannel, internalRecordingLength);

        var interleaved = leftBuffer;

        // we interleave both channels together
        if (numChannels === 2) {
            var rightBuffer = mergeBuffers(internalRightChannel, internalRecordingLength); // bug fixed via #70,#71
            interleaved = interleave(leftBuffer, rightBuffer);
        }

        if (isPCM) {
            // our final binary blob
            var blob = new Blob([convertoFloat32ToInt16(interleaved)], {
                type: 'audio/pcm'
            });

            console.debug('audio recorded blob size:', bytesToSize(blob.size));
            root.ondataavailable(blob);
            return;
        }

        // we create our wav file
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        var view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, 'RIFF');

        // -8 (via #97)
        view.setUint32(4, 44 + interleaved.length * 2 - 8, true);

        writeUTFBytes(view, 8, 'WAVE');
        // FMT sub-chunk
        writeUTFBytes(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        // stereo (2 channels)
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true); // numChannels * 2 (via #71)
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        // data sub-chunk
        writeUTFBytes(view, 36, 'data');
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        var lng = interleaved.length;
        var index = 44;
        var volume = 1;
        for (var i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        // our final binary blob
        var blob = new Blob([view], {
            type: 'audio/wav'
        });

        console.debug('audio recorded blob size:', bytesToSize(blob.size));

        root.ondataavailable(blob);
    };

    this.stop = function() {
        // we stop recording
        recording = false;
        this.requestData();

        audioInput.disconnect();
    };

    function interleave(leftChannel, rightChannel) {
        var length = leftChannel.length + rightChannel.length;
        var result = new Float32Array(length);

        var inputIndex = 0;

        for (var index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }

    function mergeBuffers(channelBuffer, recordingLength) {
        var result = new Float32Array(recordingLength);
        var offset = 0;
        var lng = channelBuffer.length;
        for (var i = 0; i < lng; i++) {
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    function writeUTFBytes(view, offset, string) {
        var lng = string.length;
        for (var i = 0; i < lng; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function convertoFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l)

        while (l--) {
            buf[l] = buffer[l] * 0xFFFF; //convert to 16 bit
        }
        return buf.buffer
    }

    // creates the audio context
    var context = ObjectStore.AudioContextConstructor;

    // creates a gain node
    ObjectStore.VolumeGainNode = context.createGain();

    var volume = ObjectStore.VolumeGainNode;

    // creates an audio node from the microphone incoming stream
    ObjectStore.AudioInput = context.createMediaStreamSource(mediaStream);

    // creates an audio node from the microphone incoming stream
    var audioInput = ObjectStore.AudioInput;

    // connect the stream to the gain node
    audioInput.connect(volume);

    /* From the spec: This value controls how frequently the audioprocess event is
    dispatched and how many sample-frames need to be processed each call.
    Lower values for buffer size will result in a lower (better) latency.
    Higher values will be necessary to avoid audio breakup and glitches 
    Legal values are 256, 512, 1024, 2048, 4096, 8192, and 16384.*/
    var bufferSize = root.bufferSize || 2048;
    if (root.bufferSize === 0) {
        bufferSize = 0;
    }

    if (context.createJavaScriptNode) {
        scriptprocessornode = context.createJavaScriptNode(bufferSize, numChannels, numChannels);
    } else if (context.createScriptProcessor) {
        scriptprocessornode = context.createScriptProcessor(bufferSize, numChannels, numChannels);
    } else {
        throw 'WebAudio API has no support on this browser.';
    }

    bufferSize = scriptprocessornode.bufferSize;

    console.debug('using audio buffer-size:', bufferSize);

    var requestDataInvoked = false;

    // sometimes "scriptprocessornode" disconnects from he destination-node
    // and there is no exception thrown in this case.
    // and obviously no further "ondataavailable" events will be emitted.
    // below global-scope variable is added to debug such unexpected but "rare" cases.
    window.scriptprocessornode = scriptprocessornode;

    if (numChannels === 1) {
        console.debug('All right-channels are skipped.');
    }

    var isPaused = false;

    this.pause = function() {
        isPaused = true;
    };

    this.resume = function() {
        isPaused = false;
    };

    // http://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface
    scriptprocessornode.onaudioprocess = function(e) {
        if (!recording || requestDataInvoked || isPaused) {
            return;
        }

        var left = e.inputBuffer.getChannelData(0);
        leftchannel.push(new Float32Array(left));

        if (numChannels === 2) {
            var right = e.inputBuffer.getChannelData(1);
            rightchannel.push(new Float32Array(right));
        }
        recordingLength += bufferSize;
    };

    volume.connect(scriptprocessornode);
    scriptprocessornode.connect(context.destination);
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.StereoAudioRecorderHelper = StereoAudioRecorderHelper;
}

// ===================
// WhammyRecorder.js

function WhammyRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        mediaRecorder = new WhammyRecorderHelper(mediaStream, this);

        for (var prop in this) {
            if (typeof this[prop] !== 'function') {
                mediaRecorder[prop] = this[prop];
            }
        }

        mediaRecorder.record();

        timeout = setInterval(function() {
            mediaRecorder.requestData();
        }, timeSlice);
    };

    this.stop = function() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            clearTimeout(timeout);
        }
    };

    this.clearOldRecordedFrames = function() {
        if (mediaRecorder) {
            mediaRecorder.clearOldRecordedFrames();
        }
    };

    this.pause = function() {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.pause();
    };

    this.resume = function() {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.resume();
    };

    this.ondataavailable = function() {};

    // Reference to "WhammyRecorder" object
    var mediaRecorder;
    var timeout;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.WhammyRecorder = WhammyRecorder;
}

// ==========================
// WhammyRecorderHelper.js

function WhammyRecorderHelper(mediaStream, root) {
    this.record = function(timeSlice) {
        if (!this.width) {
            this.width = 320;
        }
        if (!this.height) {
            this.height = 240;
        }

        if (this.video && this.video instanceof HTMLVideoElement) {
            if (!this.width) {
                this.width = video.videoWidth || video.clientWidth || 320;
            }
            if (!this.height) {
                this.height = video.videoHeight || video.clientHeight || 240;
            }
        }

        if (!this.video) {
            this.video = {
                width: this.width,
                height: this.height
            };
        }

        if (!this.canvas || !this.canvas.width || !this.canvas.height) {
            this.canvas = {
                width: this.width,
                height: this.height
            };
        }

        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        // setting defaults
        if (this.video && this.video instanceof HTMLVideoElement) {
            this.isHTMLObject = true;
            video = this.video.cloneNode();
        } else {
            video = document.createElement('video');
            video.src = URL.createObjectURL(mediaStream);

            video.width = this.video.width;
            video.height = this.video.height;
        }

        video.muted = true;
        video.play();

        lastTime = new Date().getTime();
        whammy = new Whammy.Video(root.speed, root.quality);

        console.log('canvas resolutions', canvas.width, '*', canvas.height);
        console.log('video width/height', video.width || canvas.width, '*', video.height || canvas.height);

        drawFrames();
    };

    this.clearOldRecordedFrames = function() {
        whammy.frames = [];
    };

    var requestDataInvoked = false;
    this.requestData = function() {
        if (isPaused) {
            return;
        }

        if (!whammy.frames.length) {
            requestDataInvoked = false;
            return;
        }

        requestDataInvoked = true;
        // clone stuff
        var internalFrames = whammy.frames.slice(0);

        // reset the frames for the new recording

        whammy.frames = dropBlackFrames(internalFrames, -1);

        whammy.compile(function(whammyBlob) {
            root.ondataavailable(whammyBlob);
            console.debug('video recorded blob size:', bytesToSize(whammyBlob.size));
        });

        whammy.frames = [];

        requestDataInvoked = false;
    };

    var isOnStartedDrawingNonBlankFramesInvoked = false;

    function drawFrames() {
        if (isPaused) {
            lastTime = new Date().getTime();
            setTimeout(drawFrames, 500);
            return;
        }

        if (isStopDrawing) {
            return;
        }

        if (requestDataInvoked) {
            return setTimeout(drawFrames, 100);
        }

        var duration = new Date().getTime() - lastTime;
        if (!duration) {
            return drawFrames();
        }

        // via webrtc-experiment#206, by Jack i.e. @Seymourr
        lastTime = new Date().getTime();

        if (!self.isHTMLObject && video.paused) {
            video.play(); // Android
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (!isStopDrawing) {
            whammy.frames.push({
                duration: duration,
                image: canvas.toDataURL('image/webp')
            });
        }

        if (!isOnStartedDrawingNonBlankFramesInvoked && !isBlankFrame(whammy.frames[whammy.frames.length - 1])) {
            isOnStartedDrawingNonBlankFramesInvoked = true;
            root.onStartedDrawingNonBlankFrames();
        }

        setTimeout(drawFrames, 10);
    }

    var isStopDrawing = false;

    this.stop = function() {
        isStopDrawing = true;
        this.requestData();
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video;
    var lastTime;
    var whammy;

    var self = this;

    function isBlankFrame(frame, _pixTolerance, _frameTolerance) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');

        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(
            Math.pow(255, 2) +
            Math.pow(255, 2) +
            Math.pow(255, 2)
        );
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;

        var matchPixCount, endPixCheck, maxPixCount;

        var image = new Image();
        image.src = frame.image;
        context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
        var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
        matchPixCount = 0;
        endPixCheck = imageData.data.length;
        maxPixCount = imageData.data.length / 4;

        for (var pix = 0; pix < endPixCheck; pix += 4) {
            var currentColor = {
                r: imageData.data[pix],
                g: imageData.data[pix + 1],
                b: imageData.data[pix + 2]
            };
            var colorDifference = Math.sqrt(
                Math.pow(currentColor.r - sampleColor.r, 2) +
                Math.pow(currentColor.g - sampleColor.g, 2) +
                Math.pow(currentColor.b - sampleColor.b, 2)
            );
            // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
            if (colorDifference <= maxColorDifference * pixTolerance) {
                matchPixCount++;
            }
        }

        if (maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
            return false;
        } else {
            return true;
        }
    }

    function dropBlackFrames(_frames, _framesToCheck, _pixTolerance, _frameTolerance) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');
        var resultFrames = [];

        var checkUntilNotBlack = _framesToCheck === -1;
        var endCheckFrame = (_framesToCheck && _framesToCheck > 0 && _framesToCheck <= _frames.length) ?
            _framesToCheck : _frames.length;
        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(
            Math.pow(255, 2) +
            Math.pow(255, 2) +
            Math.pow(255, 2)
        );
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;
        var doNotCheckNext = false;

        for (var f = 0; f < endCheckFrame; f++) {
            var matchPixCount, endPixCheck, maxPixCount;

            if (!doNotCheckNext) {
                var image = new Image();
                image.src = _frames[f].image;
                context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
                var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
                matchPixCount = 0;
                endPixCheck = imageData.data.length;
                maxPixCount = imageData.data.length / 4;

                for (var pix = 0; pix < endPixCheck; pix += 4) {
                    var currentColor = {
                        r: imageData.data[pix],
                        g: imageData.data[pix + 1],
                        b: imageData.data[pix + 2]
                    };
                    var colorDifference = Math.sqrt(
                        Math.pow(currentColor.r - sampleColor.r, 2) +
                        Math.pow(currentColor.g - sampleColor.g, 2) +
                        Math.pow(currentColor.b - sampleColor.b, 2)
                    );
                    // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
                    if (colorDifference <= maxColorDifference * pixTolerance) {
                        matchPixCount++;
                    }
                }
            }

            if (!doNotCheckNext && maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
                // console.log('removed black frame : ' + f + ' ; frame duration ' + _frames[f].duration);
            } else {
                // console.log('frame is passed : ' + f);
                if (checkUntilNotBlack) {
                    doNotCheckNext = true;
                }
                resultFrames.push(_frames[f]);
            }
        }

        resultFrames = resultFrames.concat(_frames.slice(endCheckFrame));

        if (resultFrames.length <= 0) {
            // at least one last frame should be available for next manipulation
            // if total duration of all frames will be < 1000 than ffmpeg doesn't work well...
            resultFrames.push(_frames[_frames.length - 1]);
        }

        return resultFrames;
    }

    var isPaused = false;

    this.pause = function() {
        isPaused = true;
    };

    this.resume = function() {
        isPaused = false;
    };
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.WhammyRecorderHelper = WhammyRecorderHelper;
}

// --------------
// GifRecorder.js

function GifRecorder(mediaStream) {
    if (typeof GIFEncoder === 'undefined') {
        throw 'Please link: https://cdn.webrtc-experiment.com/gif-recorder.js';
    }

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        var imageWidth = this.videoWidth || 320;
        var imageHeight = this.videoHeight || 240;

        canvas.width = video.width = imageWidth;
        canvas.height = video.height = imageHeight;

        // external library to record as GIF images
        gifEncoder = new GIFEncoder();

        // void setRepeat(int iter)
        // Sets the number of times the set of GIF frames should be played.
        // Default is 1; 0 means play indefinitely.
        gifEncoder.setRepeat(0);

        // void setFrameRate(Number fps)
        // Sets frame rate in frames per second.
        // Equivalent to setDelay(1000/fps).
        // Using "setDelay" instead of "setFrameRate"
        gifEncoder.setDelay(this.frameRate || this.speed || 200);

        // void setQuality(int quality)
        // Sets quality of color quantization (conversion of images to the
        // maximum 256 colors allowed by the GIF specification).
        // Lower values (minimum = 1) produce better colors,
        // but slow processing significantly. 10 is the default,
        // and produces good color mapping at reasonable speeds.
        // Values greater than 20 do not yield significant improvements in speed.
        gifEncoder.setQuality(this.quality || 1);

        // Boolean start()
        // This writes the GIF Header and returns false if it fails.
        gifEncoder.start();

        startTime = Date.now();

        function drawVideoFrame(time) {
            if (isPaused) {
                setTimeout(drawVideoFrame, 500, time);
                return;
            }

            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if (typeof lastFrameTime === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) {
                return;
            }

            if (video.paused) {
                video.play(); // Android
            }

            context.drawImage(video, 0, 0, imageWidth, imageHeight);

            gifEncoder.addFrame(context);

            // console.log('Recording...' + Math.round((Date.now() - startTime) / 1000) + 's');
            // console.log("fps: ", 1000 / (time - lastFrameTime));

            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        timeout = setTimeout(doneRecording, timeSlice);
    };

    function doneRecording() {
        endTime = Date.now();

        var gifBlob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
            type: 'image/gif'
        });
        self.ondataavailable(gifBlob);

        // todo: find a way to clear old recorded blobs
        gifEncoder.stream().bin = [];
    }

    this.stop = function() {
        if (lastAnimationFrame) {
            cancelAnimationFrame(lastAnimationFrame);
            clearTimeout(timeout);
            doneRecording();
        }
    };

    var isPaused = false;

    this.pause = function() {
        isPaused = true;
    };

    this.resume = function() {
        isPaused = false;
    };

    this.ondataavailable = function() {};
    this.onstop = function() {};

    // Reference to itself
    var self = this;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.src = URL.createObjectURL(mediaStream);
    video.play();

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;

    var gifEncoder;
    var timeout;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.GifRecorder = GifRecorder;
}

// https://github.com/antimatter15/whammy/blob/master/LICENSE
// _________
// Whammy.js

// todo: Firefox now supports webp for webm containers!
// their MediaRecorder implementation works well!
// should we provide an option to record via Whammy.js or MediaRecorder API is a better solution?

/**
 * Whammy is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It is written by {@link https://github.com/antimatter15|antimatter15}
 * @summary A real time javascript webm encoder based on a canvas hack.
 * @typedef Whammy
 * @class
 * @example
 * var recorder = new Whammy().Video(15);
 * recorder.add(context || canvas || dataURL);
 * var output = recorder.compile();
 */

var Whammy = (function() {
    // a more abstract-ish API

    function WhammyVideo(duration, quality) {
        this.frames = [];
        if (!duration) {
            duration = 1;
        }
        this.duration = 1000 / duration;
        this.quality = quality || 0.8;
    }

    /**
     * Pass Canvas or Context or image/webp(string) to {@link Whammy} encoder.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.add(canvas || context || 'image/webp');
     * @param {string} frame - Canvas || Context || image/webp
     * @param {number} duration - Stick a duration (in milliseconds)
     */
    WhammyVideo.prototype.add = function(frame, duration) {
        if ('canvas' in frame) { //CanvasRenderingContext2D
            frame = frame.canvas;
        }

        if ('toDataURL' in frame) {
            frame = frame.toDataURL('image/webp', this.quality);
        }

        if (!(/^data:image\/webp;base64,/ig).test(frame)) {
            throw 'Input must be formatted properly as a base64 encoded DataURI of type image/webp';
        }
        this.frames.push({
            image: frame,
            duration: duration || this.duration
        });
    };

    function processInWebWorker(_function) {
        var blob = URL.createObjectURL(new Blob([_function.toString(),
            'this.onmessage =  function (e) {' + _function.name + '(e.data);}'
        ], {
            type: 'application/javascript'
        }));

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }

    function whammyInWebWorker(frames) {
        function ArrayToWebM(frames) {
            var info = checkFrames(frames);
            if (!info) {
                return [];
            }

            var clusterMaxDuration = 30000;

            var EBML = [{
                'id': 0x1a45dfa3, // EBML
                'data': [{
                    'data': 1,
                    'id': 0x4286 // EBMLVersion
                }, {
                    'data': 1,
                    'id': 0x42f7 // EBMLReadVersion
                }, {
                    'data': 4,
                    'id': 0x42f2 // EBMLMaxIDLength
                }, {
                    'data': 8,
                    'id': 0x42f3 // EBMLMaxSizeLength
                }, {
                    'data': 'webm',
                    'id': 0x4282 // DocType
                }, {
                    'data': 2,
                    'id': 0x4287 // DocTypeVersion
                }, {
                    'data': 2,
                    'id': 0x4285 // DocTypeReadVersion
                }]
            }, {
                'id': 0x18538067, // Segment
                'data': [{
                    'id': 0x1549a966, // Info
                    'data': [{
                        'data': 1e6, //do things in millisecs (num of nanosecs for duration scale)
                        'id': 0x2ad7b1 // TimecodeScale
                    }, {
                        'data': 'whammy',
                        'id': 0x4d80 // MuxingApp
                    }, {
                        'data': 'whammy',
                        'id': 0x5741 // WritingApp
                    }, {
                        'data': doubleToString(info.duration),
                        'id': 0x4489 // Duration
                    }]
                }, {
                    'id': 0x1654ae6b, // Tracks
                    'data': [{
                        'id': 0xae, // TrackEntry
                        'data': [{
                            'data': 1,
                            'id': 0xd7 // TrackNumber
                        }, {
                            'data': 1,
                            'id': 0x73c5 // TrackUID
                        }, {
                            'data': 0,
                            'id': 0x9c // FlagLacing
                        }, {
                            'data': 'und',
                            'id': 0x22b59c // Language
                        }, {
                            'data': 'V_VP8',
                            'id': 0x86 // CodecID
                        }, {
                            'data': 'VP8',
                            'id': 0x258688 // CodecName
                        }, {
                            'data': 1,
                            'id': 0x83 // TrackType
                        }, {
                            'id': 0xe0, // Video
                            'data': [{
                                'data': info.width,
                                'id': 0xb0 // PixelWidth
                            }, {
                                'data': info.height,
                                'id': 0xba // PixelHeight
                            }]
                        }]
                    }]
                }]
            }];

            //Generate clusters (max duration)
            var frameNumber = 0;
            var clusterTimecode = 0;
            while (frameNumber < frames.length) {

                var clusterFrames = [];
                var clusterDuration = 0;
                do {
                    clusterFrames.push(frames[frameNumber]);
                    clusterDuration += frames[frameNumber].duration;
                    frameNumber++;
                } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration);

                var clusterCounter = 0;
                var cluster = {
                    'id': 0x1f43b675, // Cluster
                    'data': getClusterData(clusterTimecode, clusterCounter, clusterFrames)
                }; //Add cluster to segment
                EBML[1].data.push(cluster);
                clusterTimecode += clusterDuration;
            }

            return generateEBML(EBML);
        }

        function getClusterData(clusterTimecode, clusterCounter, clusterFrames) {
            return [{
                'data': clusterTimecode,
                'id': 0xe7 // Timecode
            }].concat(clusterFrames.map(function(webp) {
                var block = makeSimpleBlock({
                    discardable: 0,
                    frame: webp.data.slice(4),
                    invisible: 0,
                    keyframe: 1,
                    lacing: 0,
                    trackNum: 1,
                    timecode: Math.round(clusterCounter)
                });
                clusterCounter += webp.duration;
                return {
                    data: block,
                    id: 0xa3
                };
            }));
        }

        // sums the lengths of all the frames and gets the duration

        function checkFrames(frames) {
            if (!frames[0]) {
                postMessage({
                    error: 'Something went wrong. Maybe WebP format is not supported in the current browser.'
                });
                return;
            }

            var width = frames[0].width,
                height = frames[0].height,
                duration = frames[0].duration;

            for (var i = 1; i < frames.length; i++) {
                duration += frames[i].duration;
            }
            return {
                duration: duration,
                width: width,
                height: height
            };
        }

        function numToBuffer(num) {
            var parts = [];
            while (num > 0) {
                parts.push(num & 0xff);
                num = num >> 8;
            }
            return new Uint8Array(parts.reverse());
        }

        function strToBuffer(str) {
            return new Uint8Array(str.split('').map(function(e) {
                return e.charCodeAt(0);
            }));
        }

        function bitsToBuffer(bits) {
            var data = [];
            var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data.push(parseInt(bits.substr(i, 8), 2));
            }
            return new Uint8Array(data);
        }

        function generateEBML(json) {
            var ebml = [];
            for (var i = 0; i < json.length; i++) {
                var data = json[i].data;

                if (typeof data === 'object') {
                    data = generateEBML(data);
                }

                if (typeof data === 'number') {
                    data = bitsToBuffer(data.toString(2));
                }

                if (typeof data === 'string') {
                    data = strToBuffer(data);
                }

                var len = data.size || data.byteLength || data.length;
                var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
                var sizeToString = len.toString(2);
                var padded = (new Array((zeroes * 7 + 7 + 1) - sizeToString.length)).join('0') + sizeToString;
                var size = (new Array(zeroes)).join('0') + '1' + padded;

                ebml.push(numToBuffer(json[i].id));
                ebml.push(bitsToBuffer(size));
                ebml.push(data);
            }

            return new Blob(ebml, {
                type: 'video/webm'
            });
        }

        function toBinStrOld(bits) {
            var data = '';
            var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
            }
            return data;
        }

        function makeSimpleBlock(data) {
            var flags = 0;

            if (data.keyframe) {
                flags |= 128;
            }

            if (data.invisible) {
                flags |= 8;
            }

            if (data.lacing) {
                flags |= (data.lacing << 1);
            }

            if (data.discardable) {
                flags |= 1;
            }

            if (data.trackNum > 127) {
                throw 'TrackNumber > 127 not supported';
            }

            var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function(e) {
                return String.fromCharCode(e);
            }).join('') + data.frame;

            return out;
        }

        function parseWebP(riff) {
            var VP8 = riff.RIFF[0].WEBP[0];

            var frameStart = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
            for (var i = 0, c = []; i < 4; i++) {
                c[i] = VP8.charCodeAt(frameStart + 3 + i);
            }

            var width, height, tmp;

            //the code below is literally copied verbatim from the bitstream spec
            tmp = (c[1] << 8) | c[0];
            width = tmp & 0x3FFF;
            tmp = (c[3] << 8) | c[2];
            height = tmp & 0x3FFF;
            return {
                width: width,
                height: height,
                data: VP8,
                riff: riff
            };
        }

        function getStrLength(string, offset) {
            return parseInt(string.substr(offset + 4, 4).split('').map(function(i) {
                var unpadded = i.charCodeAt(0).toString(2);
                return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
            }).join(''), 2);
        }

        function parseRIFF(string) {
            var offset = 0;
            var chunks = {};

            while (offset < string.length) {
                var id = string.substr(offset, 4);
                var len = getStrLength(string, offset);
                var data = string.substr(offset + 4 + 4, len);
                offset += 4 + 4 + len;
                chunks[id] = chunks[id] || [];

                if (id === 'RIFF' || id === 'LIST') {
                    chunks[id].push(parseRIFF(data));
                } else {
                    chunks[id].push(data);
                }
            }
            return chunks;
        }

        function doubleToString(num) {
            return [].slice.call(
                new Uint8Array((new Float64Array([num])).buffer), 0).map(function(e) {
                return String.fromCharCode(e);
            }).reverse().join('');
        }

        var webm = new ArrayToWebM(frames.map(function(frame) {
            var webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
            webp.duration = frame.duration;
            return webp;
        }));

        postMessage(webm);
    }

    /**
     * Encodes frames in WebM container. It uses WebWorkinvoke to invoke 'ArrayToWebM' method.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.compile(function(blob) {
     *    // blob.size - blob.type
     * });
     */
    WhammyVideo.prototype.compile = function(callback) {
        var webWorker = processInWebWorker(whammyInWebWorker);

        webWorker.onmessage = function(event) {
            if (event.data.error) {
                console.error(event.data.error);
                return;
            }
            callback(event.data);
        };

        webWorker.postMessage(this.frames);
    };

    return {
        /**
         * A more abstract-ish API.
         * @method
         * @memberof Whammy
         * @example
         * recorder = new Whammy().Video(0.8, 100);
         * @param {?number} speed - 0.8
         * @param {?number} quality - 100
         */
        Video: WhammyVideo
    };
})();

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.Whammy = Whammy;
}

// Last time updated at Nov 18, 2014, 08:32:23

// Latest file can be found here: https://cdn.webrtc-experiment.com/ConcatenateBlobs.js

// Muaz Khan    - www.MuazKhan.com
// MIT License  - www.WebRTC-Experiment.com/licence
// Source Code  - https://github.com/muaz-khan/ConcatenateBlobs
// Demo         - https://www.WebRTC-Experiment.com/ConcatenateBlobs/

// ___________________
// ConcatenateBlobs.js

// Simply pass array of blobs.
// This javascript library will concatenate all blobs in single "Blob" object.

(function() {
    window.ConcatenateBlobs = function(blobs, type, callback) {
        var buffers = [];

        var index = 0;

        function readAsArrayBuffer() {
            if (!blobs[index]) {
                return concatenateBuffers();
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                buffers.push(event.target.result);
                index++;
                readAsArrayBuffer();
            };
            reader.readAsArrayBuffer(blobs[index]);
        }

        readAsArrayBuffer();

        function concatenateBuffers() {
            var byteLength = 0;
            buffers.forEach(function(buffer) {
                byteLength += buffer.byteLength;
            });

            var tmp = new Uint16Array(byteLength);
            var lastOffset = 0;
            buffers.forEach(function(buffer) {
                // BYTES_PER_ELEMENT == 2 for Uint16Array
                var reusableByteLength = buffer.byteLength;
                if (reusableByteLength % 2 != 0) {
                    buffer = buffer.slice(0, reusableByteLength - 1)
                }
                tmp.set(new Uint16Array(buffer), lastOffset);
                lastOffset += reusableByteLength;
            });

            var blob = new Blob([tmp.buffer], {
                type: type
            });

            callback(blob);
        }
    };
})();

// https://github.com/streamproc/MediaStreamRecorder/issues/42
if (typeof module !== 'undefined' /* && !!module.exports*/ ) {
    module.exports = MediaStreamRecorder;
}

if (typeof define === 'function' && define.amd) {
    define('MediaStreamRecorder', [], function() {
        return MediaStreamRecorder;
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],193:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],194:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = require('./logger')('Message');
var utils = require('./utils');

var Message = function () {
	function Message() {
		_classCallCheck(this, Message);
	}

	_createClass(Message, null, [{
		key: 'parse',
		value: function parse(raw) {
			var object = void 0;
			var message = {};

			try {
				object = JSON.parse(raw);
			} catch (error) {
				logger.error('parse() | invalid JSON: %s', error);

				return;
			}

			if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object' || Array.isArray(object)) {
				logger.error('parse() | not an object');

				return;
			}

			if (typeof object.id !== 'number') {
				logger.error('parse() | missing/invalid id field');

				return;
			}

			message.id = object.id;

			// Request.
			if (object.request) {
				message.request = true;

				if (typeof object.method !== 'string') {
					logger.error('parse() | missing/invalid method field');

					return;
				}

				message.method = object.method;
				message.data = object.data || {};
			}
			// Response.
			else if (object.response) {
					message.response = true;

					// Success.
					if (object.ok) {
						message.ok = true;
						message.data = object.data || {};
					}
					// Error.
					else {
							message.errorCode = object.errorCode;
							message.errorReason = object.errorReason;
						}
				}
				// Invalid.
				else {
						logger.error('parse() | missing request/response field');

						return;
					}

			return message;
		}
	}, {
		key: 'requestFactory',
		value: function requestFactory(method, data) {
			var request = {
				request: true,
				id: utils.randomNumber(),
				method: method,
				data: data || {}
			};

			return request;
		}
	}, {
		key: 'successResponseFactory',
		value: function successResponseFactory(request, data) {
			var response = {
				response: true,
				id: request.id,
				ok: true,
				data: data || {}
			};

			return response;
		}
	}, {
		key: 'errorResponseFactory',
		value: function errorResponseFactory(request, errorCode, errorReason) {
			var response = {
				response: true,
				id: request.id,
				errorCode: errorCode,
				errorReason: errorReason
			};

			return response;
		}
	}]);

	return Message;
}();

module.exports = Message;
},{"./logger":197,"./utils":200}],195:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var logger = require('./logger')('Peer');
var Message = require('./Message');

// Max time waiting for a response.
var REQUEST_TIMEOUT = 20000;

var Peer = function (_EventEmitter) {
	_inherits(Peer, _EventEmitter);

	function Peer(transport) {
		_classCallCheck(this, Peer);

		logger.debug('constructor()');

		var _this = _possibleConstructorReturn(this, (Peer.__proto__ || Object.getPrototypeOf(Peer)).call(this));

		_this.setMaxListeners(Infinity);

		// Transport.
		_this._transport = transport;

		// Closed flag.
		_this._closed = false;

		// Custom data object.
		_this._data = {};

		// Map of sent requests' handlers indexed by request.id.
		_this._requestHandlers = new Map();

		// Handle transport.
		_this._handleTransport();
		return _this;
	}

	_createClass(Peer, [{
		key: 'send',
		value: function send(method, data) {
			var _this2 = this;

			var request = Message.requestFactory(method, data);

			return this._transport.send(request).then(function () {
				return new Promise(function (pResolve, pReject) {
					var handler = {
						resolve: function resolve(data2) {
							if (!_this2._requestHandlers.delete(request.id)) return;

							clearTimeout(handler.timer);
							pResolve(data2);
						},

						reject: function reject(error) {
							if (!_this2._requestHandlers.delete(request.id)) return;

							clearTimeout(handler.timer);
							pReject(error);
						},

						timer: setTimeout(function () {
							if (!_this2._requestHandlers.delete(request.id)) return;

							pReject(new Error('request timeout'));
						}, REQUEST_TIMEOUT),

						close: function close() {
							clearTimeout(handler.timer);
							pReject(new Error('peer closed'));
						}
					};

					// Add handler stuff to the Map.
					_this2._requestHandlers.set(request.id, handler);
				});
			});
		}
	}, {
		key: 'close',
		value: function close() {
			logger.debug('close()');

			if (this._closed) return;

			this._closed = true;

			// Close transport.
			this._transport.close();

			// Close every pending request handler.
			this._requestHandlers.forEach(function (handler) {
				return handler.close();
			});

			// Emit 'close' event.
			this.emit('close');
		}
	}, {
		key: '_handleTransport',
		value: function _handleTransport() {
			var _this3 = this;

			if (this._transport.closed) {
				this._closed = true;
				setTimeout(function () {
					return _this3.emit('close');
				});

				return;
			}

			this._transport.on('connecting', function (currentAttempt) {
				_this3.emit('connecting', currentAttempt);
			});

			this._transport.on('open', function () {
				if (_this3._closed) return;

				// Emit 'open' event.
				_this3.emit('open');
			});

			this._transport.on('disconnected', function () {
				_this3.emit('disconnected');
			});

			this._transport.on('failed', function (currentAttempt) {
				_this3.emit('failed', currentAttempt);
			});

			this._transport.on('close', function () {
				if (_this3._closed) return;

				_this3._closed = true;

				// Emit 'close' event.
				_this3.emit('close');
			});

			this._transport.on('message', function (message) {
				if (message.response) {
					_this3._handleResponse(message);
				} else if (message.request) {
					_this3._handleRequest(message);
				}
			});
		}
	}, {
		key: '_handleResponse',
		value: function _handleResponse(response) {
			var handler = this._requestHandlers.get(response.id);

			if (!handler) {
				logger.error('received response does not match any sent request');

				return;
			}

			if (response.ok) {
				handler.resolve(response.data);
			} else {
				var error = new Error(response.errorReason);

				error.code = response.errorCode;
				handler.reject(error);
			}
		}
	}, {
		key: '_handleRequest',
		value: function _handleRequest(request) {
			var _this4 = this;

			this.emit('request',
			// Request.
			request,
			// accept() function.
			function (data) {
				var response = Message.successResponseFactory(request, data);

				_this4._transport.send(response).catch(function (error) {
					logger.warn('accept() failed, response could not be sent: %o', error);
				});
			},
			// reject() function.
			function (errorCode, errorReason) {
				if (errorCode instanceof Error) {
					errorReason = errorCode.toString();
					errorCode = 500;
				} else if (typeof errorCode === 'number' && errorReason instanceof Error) {
					errorReason = errorReason.toString();
				}

				var response = Message.errorResponseFactory(request, errorCode, errorReason);

				_this4._transport.send(response).catch(function (error) {
					logger.warn('reject() failed, response could not be sent: %o', error);
				});
			});
		}
	}, {
		key: 'data',
		get: function get() {
			return this._data;
		},
		set: function set(obj) {
			this._data = obj || {};
		}
	}, {
		key: 'closed',
		get: function get() {
			return this._closed;
		}
	}]);

	return Peer;
}(EventEmitter);

module.exports = Peer;
},{"./Message":194,"./logger":197,"events":153}],196:[function(require,module,exports){
'use strict';

var Peer = require('./Peer');
var transports = require('./transports');

module.exports = {
	/**
  * Expose Peer.
  */
	Peer: Peer,

	/**
  * Expose the built-in WebSocketTransport.
  */
	WebSocketTransport: transports.WebSocketTransport
};
},{"./Peer":195,"./transports":199}],197:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug');

var APP_NAME = 'protoo-client';

var Logger = function () {
	function Logger(prefix) {
		_classCallCheck(this, Logger);

		if (prefix) {
			this._debug = debug(APP_NAME + ':' + prefix);
			this._warn = debug(APP_NAME + ':WARN:' + prefix);
			this._error = debug(APP_NAME + ':ERROR:' + prefix);
		} else {
			this._debug = debug(APP_NAME);
			this._warn = debug(APP_NAME + ':WARN');
			this._error = debug(APP_NAME + ':ERROR');
		}

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}

	_createClass(Logger, [{
		key: 'debug',
		get: function get() {
			return this._debug;
		}
	}, {
		key: 'warn',
		get: function get() {
			return this._warn;
		}
	}, {
		key: 'error',
		get: function get() {
			return this._error;
		}
	}]);

	return Logger;
}();

module.exports = function (prefix) {
	return new Logger(prefix);
};
},{"debug":151}],198:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var W3CWebSocket = require('websocket').w3cwebsocket;
var retry = require('retry');
var logger = require('../logger')('WebSocketTransport');
var Message = require('../Message');

var WS_SUBPROTOCOL = 'protoo';
var DEFAULT_RETRY_OPTIONS = {
	retries: 10,
	factor: 2,
	minTimeout: 1 * 1000,
	maxTimeout: 8 * 1000
};

var WebSocketTransport = function (_EventEmitter) {
	_inherits(WebSocketTransport, _EventEmitter);

	function WebSocketTransport(url, options) {
		_classCallCheck(this, WebSocketTransport);

		logger.debug('constructor() [url:"%s", options:%o]', url, options);

		var _this = _possibleConstructorReturn(this, (WebSocketTransport.__proto__ || Object.getPrototypeOf(WebSocketTransport)).call(this));

		_this.setMaxListeners(Infinity);

		// Save URL and options.
		_this._url = url;
		_this._options = options || {};

		// WebSocket instance.
		_this._ws = null;

		// Closed flag.
		_this._closed = false;

		// Set WebSocket
		_this._setWebSocket();
		return _this;
	}

	_createClass(WebSocketTransport, [{
		key: 'send',
		value: function send(message) {
			if (this._closed) return Promise.reject(new Error('transport closed'));

			try {
				this._ws.send(JSON.stringify(message));

				return Promise.resolve();
			} catch (error) {
				logger.error('send() | error sending message: %o', error);

				return Promise.reject(error);
			}
		}
	}, {
		key: 'close',
		value: function close() {
			logger.debug('close()');

			if (this._closed) return;

			// Don't wait for the WebSocket 'close' event, do it now.
			this._closed = true;
			this.emit('close');

			try {
				this._ws.onopen = null;
				this._ws.onclose = null;
				this._ws.onerror = null;
				this._ws.onmessage = null;
				this._ws.close();
			} catch (error) {
				logger.error('close() | error closing the WebSocket: %o', error);
			}
		}
	}, {
		key: '_setWebSocket',
		value: function _setWebSocket() {
			var _this2 = this;

			var options = this._options;
			var operation = retry.operation(this._options.retry || DEFAULT_RETRY_OPTIONS);
			var wasConnected = false;

			operation.attempt(function (currentAttempt) {
				if (_this2._closed) {
					operation.stop();

					return;
				}

				logger.debug('_setWebSocket() [currentAttempt:%s]', currentAttempt);

				_this2._ws = new W3CWebSocket(_this2._url, WS_SUBPROTOCOL, options.origin, options.headers, options.requestOptions, options.clientConfig);

				_this2.emit('connecting', currentAttempt);

				_this2._ws.onopen = function () {
					if (_this2._closed) return;

					wasConnected = true;

					// Emit 'open' event.
					_this2.emit('open');
				};

				_this2._ws.onclose = function (event) {
					if (_this2._closed) return;

					logger.warn('WebSocket "close" event [wasClean:%s, code:%s, reason:"%s"]', event.wasClean, event.code, event.reason);

					// Don't retry if code is 4000 (closed by the server).
					if (event.code !== 4000) {
						// If it was not connected, try again.
						if (!wasConnected) {
							_this2.emit('failed', currentAttempt);

							if (operation.retry(true)) return;
						}
						// If it was connected, start from scratch.
						else {
								operation.stop();

								_this2.emit('disconnected');
								_this2._setWebSocket();

								return;
							}
					}

					_this2._closed = true;

					// Emit 'close' event.
					_this2.emit('close');
				};

				_this2._ws.onerror = function () {
					if (_this2._closed) return;

					logger.error('WebSocket "error" event');
				};

				_this2._ws.onmessage = function (event) {
					if (_this2._closed) return;

					var message = Message.parse(event.data);

					if (!message) return;

					if (_this2.listenerCount('message') === 0) {
						logger.error('no listeners for WebSocket "message" event, ignoring received message');

						return;
					}

					// Emit 'message' event.
					_this2.emit('message', message);
				};
			});
		}
	}, {
		key: 'closed',
		get: function get() {
			return this._closed;
		}
	}]);

	return WebSocketTransport;
}(EventEmitter);

module.exports = WebSocketTransport;
},{"../Message":194,"../logger":197,"events":153,"retry":212,"websocket":222}],199:[function(require,module,exports){
'use strict';

var WebSocketTransport = require('./WebSocketTransport');

module.exports = {
	WebSocketTransport: WebSocketTransport
};
},{"./WebSocketTransport":198}],200:[function(require,module,exports){
'use strict';

var randomNumber = require('random-number');

var randomNumberGenerator = randomNumber.generator({
	min: 1000000,
	max: 9999999,
	integer: true
});

module.exports = {
	randomNumber: randomNumberGenerator
};
},{"random-number":201}],201:[function(require,module,exports){
void function(root){

  function defaults(options){
    var options = options || {}
    var min = options.min
    var max = options.max
    var integer = options.integer || false
    if ( min == null && max == null ) {
      min = 0
      max = 1
    } else if ( min == null ) {
      min = max - 1
    } else if ( max == null ) {
      max = min + 1
    }
    if ( max < min ) throw new Error('invalid options, max must be >= min')
    return {
      min:     min
    , max:     max
    , integer: integer
    }
  }

  function random(options){
    options = defaults(options)
    if ( options.max === options.min ) return options.min
    var r = Math.random() * (options.max - options.min + Number(!!options.integer)) + options.min
    return options.integer ? Math.floor(r) : r
  }

  function generator(options){
    options = defaults(options)
    return function(min, max, integer){
      options.min     = min != null ? min : options.min
      options.max     = max != null ? max : options.max
      options.integer = integer != null ? integer : options.integer
      return random(options)
    }
  }

  module.exports =  random
  module.exports.generator = generator
  module.exports.defaults = defaults
}(this)

},{}],202:[function(require,module,exports){
/*
 * random-string
 * https://github.com/valiton/node-random-string
 *
 * Copyright (c) 2013 Valiton GmbH, Bastian 'hereandnow' Behrens
 * Licensed under the MIT license.
 */

'use strict';

var numbers = '0123456789',
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    specials = '!$%^&*()_+|~-=`{}[]:;<>?,./';


function _defaults (opts) {
  opts || (opts = {});
  return {
    length: opts.length || 8,
    numeric: typeof opts.numeric === 'boolean' ? opts.numeric : true,
    letters: typeof opts.letters === 'boolean' ? opts.letters : true,
    special: typeof opts.special === 'boolean' ? opts.special : false,
    exclude: Array.isArray(opts.exclude)       ? opts.exclude : []
  };
}

function _buildChars (opts) {
  var chars = '';
  if (opts.numeric) { chars += numbers; }
  if (opts.letters) { chars += letters; }
  if (opts.special) { chars += specials; }
  for (var i = 0; i <= opts.exclude.length; i++){
    chars = chars.replace(opts.exclude[i], "");
  }
  return chars;
}

module.exports = function randomString(opts) {
  opts = _defaults(opts);
  var i, rn,
      rnd = '',
      len = opts.length,
      exclude = opts.exclude,
      randomChars = _buildChars(opts);
  for (i = 1; i <= len; i++) {
    rnd += randomChars.substring(rn = Math.floor(Math.random() * randomChars.length), rn + 1);
  }
  return rnd;
};


},{}],203:[function(require,module,exports){
(function (global){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],204:[function(require,module,exports){
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],205:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":208}],206:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],207:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2['default'])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if ("production" !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if ("production" !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if ("production" !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2['default'])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
},{"./createStore":209,"./utils/warning":211,"lodash/isPlainObject":164}],208:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}
},{}],209:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}
},{"lodash/isPlainObject":164,"symbol-observable":219}],210:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if ("production" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
},{"./applyMiddleware":205,"./bindActionCreators":206,"./combineReducers":207,"./compose":208,"./createStore":209,"./utils/warning":211}],211:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],212:[function(require,module,exports){
module.exports = require('./lib/retry');
},{"./lib/retry":213}],213:[function(require,module,exports){
var RetryOperation = require('./retry_operation');

exports.operation = function(options) {
  var timeouts = exports.timeouts(options);
  return new RetryOperation(timeouts, {
      forever: options && options.forever,
      unref: options && options.unref
  });
};

exports.timeouts = function(options) {
  if (options instanceof Array) {
    return [].concat(options);
  }

  var opts = {
    retries: 10,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: Infinity,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  var timeouts = [];
  for (var i = 0; i < opts.retries; i++) {
    timeouts.push(this.createTimeout(i, opts));
  }

  if (options && options.forever && !timeouts.length) {
    timeouts.push(this.createTimeout(i, opts));
  }

  // sort the array numerically ascending
  timeouts.sort(function(a,b) {
    return a - b;
  });

  return timeouts;
};

exports.createTimeout = function(attempt, opts) {
  var random = (opts.randomize)
    ? (Math.random() + 1)
    : 1;

  var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
};

exports.wrap = function(obj, options, methods) {
  if (options instanceof Array) {
    methods = options;
    options = null;
  }

  if (!methods) {
    methods = [];
    for (var key in obj) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }
  }

  for (var i = 0; i < methods.length; i++) {
    var method   = methods[i];
    var original = obj[method];

    obj[method] = function retryWrapper() {
      var op       = exports.operation(options);
      var args     = Array.prototype.slice.call(arguments);
      var callback = args.pop();

      args.push(function(err) {
        if (op.retry(err)) {
          return;
        }
        if (err) {
          arguments[0] = op.mainError();
        }
        callback.apply(this, arguments);
      });

      op.attempt(function() {
        original.apply(obj, args);
      });
    };
    obj[method].options = options;
  }
};

},{"./retry_operation":214}],214:[function(require,module,exports){
function RetryOperation(timeouts, options) {
  // Compatibility for the old (timeouts, retryForever) signature
  if (typeof options === 'boolean') {
    options = { forever: options };
  }

  this._timeouts = timeouts;
  this._options = options || {};
  this._fn = null;
  this._errors = [];
  this._attempts = 1;
  this._operationTimeout = null;
  this._operationTimeoutCb = null;
  this._timeout = null;

  if (this._options.forever) {
    this._cachedTimeouts = this._timeouts.slice(0);
  }
}
module.exports = RetryOperation;

RetryOperation.prototype.stop = function() {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  this._timeouts       = [];
  this._cachedTimeouts = null;
};

RetryOperation.prototype.retry = function(err) {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  if (!err) {
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    if (this._cachedTimeouts) {
      // retry forever, only keep last error
      this._errors.splice(this._errors.length - 1, this._errors.length);
      this._timeouts = this._cachedTimeouts.slice(0);
      timeout = this._timeouts.shift();
    } else {
      return false;
    }
  }

  var self = this;
  var timer = setTimeout(function() {
    self._attempts++;

    if (self._operationTimeoutCb) {
      self._timeout = setTimeout(function() {
        self._operationTimeoutCb(self._attempts);
      }, self._operationTimeout);

      if (this._options.unref) {
          self._timeout.unref();
      }
    }

    self._fn(self._attempts);
  }, timeout);

  if (this._options.unref) {
      timer.unref();
  }

  return true;
};

RetryOperation.prototype.attempt = function(fn, timeoutOps) {
  this._fn = fn;

  if (timeoutOps) {
    if (timeoutOps.timeout) {
      this._operationTimeout = timeoutOps.timeout;
    }
    if (timeoutOps.cb) {
      this._operationTimeoutCb = timeoutOps.cb;
    }
  }

  var self = this;
  if (this._operationTimeoutCb) {
    this._timeout = setTimeout(function() {
      self._operationTimeoutCb();
    }, self._operationTimeout);
  }

  this._fn(this._attempts);
};

RetryOperation.prototype.try = function(fn) {
  console.log('Using RetryOperation.try() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = function(fn) {
  console.log('Using RetryOperation.start() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = RetryOperation.prototype.try;

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.attempts = function() {
  return this._attempts;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};

},{}],215:[function(require,module,exports){
var grammar = module.exports = {
  v: [{
    name: 'version',
    reg: /^(\d*)$/
  }],
  o: [{ //o=- 20518 0 IN IP4 203.0.113.1
    // NB: sessionId will be a String in most cases because it is huge
    name: 'origin',
    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
    format: '%s %s %d %s IP%d %s'
  }],
  // default parsing of these only (though some of these feel outdated)
  s: [{ name: 'name' }],
  i: [{ name: 'description' }],
  u: [{ name: 'uri' }],
  e: [{ name: 'email' }],
  p: [{ name: 'phone' }],
  z: [{ name: 'timezones' }], // TODO: this one can actually be parsed properly..
  r: [{ name: 'repeats' }],   // TODO: this one can also be parsed properly
  //k: [{}], // outdated thing ignored
  t: [{ //t=0 0
    name: 'timing',
    reg: /^(\d*) (\d*)/,
    names: ['start', 'stop'],
    format: '%d %d'
  }],
  c: [{ //c=IN IP4 10.47.197.26
    name: 'connection',
    reg: /^IN IP(\d) (\S*)/,
    names: ['version', 'ip'],
    format: 'IN IP%d %s'
  }],
  b: [{ //b=AS:4000
    push: 'bandwidth',
    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
    names: ['type', 'limit'],
    format: '%s:%s'
  }],
  m: [{ //m=video 51744 RTP/AVP 126 97 98 34 31
    // NB: special - pushes to session
    // TODO: rtp/fmtp should be filtered by the payloads found here?
    reg: /^(\w*) (\d*) ([\w\/]*)(?: (.*))?/,
    names: ['type', 'port', 'protocol', 'payloads'],
    format: '%s %d %s %s'
  }],
  a: [
    { //a=rtpmap:110 opus/48000/2
      push: 'rtp',
      reg: /^rtpmap:(\d*) ([\w\-\.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
      names: ['payload', 'codec', 'rate', 'encoding'],
      format: function (o) {
        return (o.encoding) ?
          'rtpmap:%d %s/%s/%s':
          o.rate ?
          'rtpmap:%d %s/%s':
          'rtpmap:%d %s';
      }
    },
    { //a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
      //a=fmtp:111 minptime=10; useinbandfec=1
      push: 'fmtp',
      reg: /^fmtp:(\d*) ([\S| ]*)/,
      names: ['payload', 'config'],
      format: 'fmtp:%d %s'
    },
    { //a=control:streamid=0
      name: 'control',
      reg: /^control:(.*)/,
      format: 'control:%s'
    },
    { //a=rtcp:65179 IN IP4 193.84.77.194
      name: 'rtcp',
      reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
      names: ['port', 'netType', 'ipVer', 'address'],
      format: function (o) {
        return (o.address != null) ?
          'rtcp:%d %s IP%d %s':
          'rtcp:%d';
      }
    },
    { //a=rtcp-fb:98 trr-int 100
      push: 'rtcpFbTrrInt',
      reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
      names: ['payload', 'value'],
      format: 'rtcp-fb:%d trr-int %d'
    },
    { //a=rtcp-fb:98 nack rpsi
      push: 'rtcpFb',
      reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
      names: ['payload', 'type', 'subtype'],
      format: function (o) {
        return (o.subtype != null) ?
          'rtcp-fb:%s %s %s':
          'rtcp-fb:%s %s';
      }
    },
    { //a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
      //a=extmap:1/recvonly URI-gps-string
      push: 'ext',
      reg: /^extmap:(\d+)(?:\/(\w+))? (\S*)(?: (\S*))?/,
      names: ['value', 'direction', 'uri', 'config'],
      format: function (o) {
        return 'extmap:%d' + (o.direction ? '/%s' : '%v') + ' %s' + (o.config ? ' %s' : '');
      }
    },
    { //a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
      push: 'crypto',
      reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
      names: ['id', 'suite', 'config', 'sessionConfig'],
      format: function (o) {
        return (o.sessionConfig != null) ?
          'crypto:%d %s %s %s':
          'crypto:%d %s %s';
      }
    },
    { //a=setup:actpass
      name: 'setup',
      reg: /^setup:(\w*)/,
      format: 'setup:%s'
    },
    { //a=mid:1
      name: 'mid',
      reg: /^mid:([^\s]*)/,
      format: 'mid:%s'
    },
    { //a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
      name: 'msid',
      reg: /^msid:(.*)/,
      format: 'msid:%s'
    },
    { //a=ptime:20
      name: 'ptime',
      reg: /^ptime:(\d*)/,
      format: 'ptime:%d'
    },
    { //a=maxptime:60
      name: 'maxptime',
      reg: /^maxptime:(\d*)/,
      format: 'maxptime:%d'
    },
    { //a=sendrecv
      name: 'direction',
      reg: /^(sendrecv|recvonly|sendonly|inactive)/
    },
    { //a=ice-lite
      name: 'icelite',
      reg: /^(ice-lite)/
    },
    { //a=ice-ufrag:F7gI
      name: 'iceUfrag',
      reg: /^ice-ufrag:(\S*)/,
      format: 'ice-ufrag:%s'
    },
    { //a=ice-pwd:x9cml/YzichV2+XlhiMu8g
      name: 'icePwd',
      reg: /^ice-pwd:(\S*)/,
      format: 'ice-pwd:%s'
    },
    { //a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
      name: 'fingerprint',
      reg: /^fingerprint:(\S*) (\S*)/,
      names: ['type', 'hash'],
      format: 'fingerprint:%s %s'
    },
    { //a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
      //a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
      //a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
      //a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
      //a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
      push:'candidates',
      reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
      names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
      format: function (o) {
        var str = 'candidate:%s %d %s %d %s %d typ %s';

        str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';

        // NB: candidate has three optional chunks, so %void middles one if it's missing
        str += (o.tcptype != null) ? ' tcptype %s' : '%v';

        if (o.generation != null) {
          str += ' generation %d';
        }

        str += (o['network-id'] != null) ? ' network-id %d' : '%v';
        str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
        return str;
      }
    },
    { //a=end-of-candidates (keep after the candidates line for readability)
      name: 'endOfCandidates',
      reg: /^(end-of-candidates)/
    },
    { //a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
      name: 'remoteCandidates',
      reg: /^remote-candidates:(.*)/,
      format: 'remote-candidates:%s'
    },
    { //a=ice-options:google-ice
      name: 'iceOptions',
      reg: /^ice-options:(\S*)/,
      format: 'ice-options:%s'
    },
    { //a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
      push: 'ssrcs',
      reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
      names: ['id', 'attribute', 'value'],
      format: function (o) {
        var str = 'ssrc:%d';
        if (o.attribute != null) {
          str += ' %s';
          if (o.value != null) {
            str += ':%s';
          }
        }
        return str;
      }
    },
    { //a=ssrc-group:FEC 1 2
      //a=ssrc-group:FEC-FR 3004364195 1080772241
      push: 'ssrcGroups',
      // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
      reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
      names: ['semantics', 'ssrcs'],
      format: 'ssrc-group:%s %s'
    },
    { //a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
      name: 'msidSemantic',
      reg: /^msid-semantic:\s?(\w*) (\S*)/,
      names: ['semantic', 'token'],
      format: 'msid-semantic: %s %s' // space after ':' is not accidental
    },
    { //a=group:BUNDLE audio video
      push: 'groups',
      reg: /^group:(\w*) (.*)/,
      names: ['type', 'mids'],
      format: 'group:%s %s'
    },
    { //a=rtcp-mux
      name: 'rtcpMux',
      reg: /^(rtcp-mux)/
    },
    { //a=rtcp-rsize
      name: 'rtcpRsize',
      reg: /^(rtcp-rsize)/
    },
    { //a=sctpmap:5000 webrtc-datachannel 1024
      name: 'sctpmap',
      reg: /^sctpmap:([\w_\/]*) (\S*)(?: (\S*))?/,
      names: ['sctpmapNumber', 'app', 'maxMessageSize'],
      format: function (o) {
        return (o.maxMessageSize != null) ?
          'sctpmap:%s %s %s' :
          'sctpmap:%s %s';
      }
    },
    { //a=x-google-flag:conference
      name: 'xGoogleFlag',
      reg: /^x-google-flag:([^\s]*)/,
      format: 'x-google-flag:%s'
    },
    { //a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
      push: 'rids',
      reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
      names: ['id', 'direction', 'params'],
      format: function (o) {
        return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
      }
    },
    { //a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
      //a=imageattr:* send [x=800,y=640] recv *
      //a=imageattr:100 recv [x=320,y=240]
      push: 'imageattrs',
      reg: new RegExp(
        //a=imageattr:97
        '^imageattr:(\\d+|\\*)' +
        //send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
        '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' +
        //recv [x=330,y=250]
        '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'
      ),
      names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
      format: function (o) {
        return 'imageattr:%s %s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    { //a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
      //a=simulcast:recv 1;4,5 send 6;7
      name: 'simulcast',
      reg: new RegExp(
        //a=simulcast:
        '^simulcast:' +
        //send 1,2,3;~4,~5
        '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' +
        //space + recv 6;~7,~8
        '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' +
        //end
        '$'
      ),
      names: ['dir1', 'list1', 'dir2', 'list2'],
      format: function (o) {
        return 'simulcast:%s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    { //Old simulcast draft 03 (implemented by Firefox)
      //  https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
      //a=simulcast: recv pt=97;98 send pt=97
      //a=simulcast: send rid=5;6;7 paused=6,7
      name: 'simulcast_03',
      reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
      names: ['value'],
      format: 'simulcast: %s'
    },
    {
      //a=framerate:25
      //a=framerate:29.97
      name: 'framerate',
      reg: /^framerate:(\d+(?:$|\.\d+))/,
      format: 'framerate:%s'
    },
    { // RFC4570
      //a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
      name: 'sourceFilter',
      reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
      names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
      format: 'source-filter: %s %s %s %s %s'
    },
    { // any a= that we don't understand is kepts verbatim on media.invalid
      push: 'invalid',
      names: ['value']
    }
  ]
};

// set sensible defaults to avoid polluting the grammar with boring details
Object.keys(grammar).forEach(function (key) {
  var objs = grammar[key];
  objs.forEach(function (obj) {
    if (!obj.reg) {
      obj.reg = /(.*)/;
    }
    if (!obj.format) {
      obj.format = '%s';
    }
  });
});

},{}],216:[function(require,module,exports){
var parser = require('./parser');
var writer = require('./writer');

exports.write = writer;
exports.parse = parser.parse;
exports.parseFmtpConfig = parser.parseFmtpConfig;
exports.parseParams = parser.parseParams;
exports.parsePayloads = parser.parsePayloads;
exports.parseRemoteCandidates = parser.parseRemoteCandidates;
exports.parseImageAttributes = parser.parseImageAttributes;
exports.parseSimulcastStreamList = parser.parseSimulcastStreamList;

},{"./parser":217,"./writer":218}],217:[function(require,module,exports){
var toIntIfInt = function (v) {
  return String(Number(v)) === v ? Number(v) : v;
};

var attachProperties = function (match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  }
  else {
    for (var i = 0; i < names.length; i += 1) {
      if (match[i+1] != null) {
        location[names[i]] = toIntIfInt(match[i+1]);
      }
    }
  }
};

var parseReg = function (obj, location, content) {
  var needsBlank = obj.name && obj.names;
  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  }
  else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }
  var keyLocation = obj.push ?
    {} :  // blank object that will be pushed
    needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
};

var grammar = require('./grammar');
var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

exports.parse = function (sdp) {
  var session = {}
    , media = []
    , location = session; // points at where properties go under (one of the above)

  // parse lines we understand
  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
    var type = l[0];
    var content = l.slice(2);
    if (type === 'm') {
      media.push({rtp: [], fmtp: []});
      location = media[media.length-1]; // point at latest media line
    }

    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
      var obj = grammar[type][j];
      if (obj.reg.test(content)) {
        return parseReg(obj, location, content);
      }
    }
  });

  session.media = media; // link it up
  return session;
};

var paramReducer = function (acc, expr) {
  var s = expr.split(/=(.+)/, 2);
  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  }
  return acc;
};

exports.parseParams = function (str) {
  return str.split(/\;\s?/).reduce(paramReducer, {});
};

// For backward compatibility - alias will be removed in 3.0.0
exports.parseFmtpConfig = exports.parseParams;

exports.parsePayloads = function (str) {
  return str.split(' ').map(Number);
};

exports.parseRemoteCandidates = function (str) {
  var candidates = [];
  var parts = str.split(' ').map(toIntIfInt);
  for (var i = 0; i < parts.length; i += 3) {
    candidates.push({
      component: parts[i],
      ip: parts[i + 1],
      port: parts[i + 2]
    });
  }
  return candidates;
};

exports.parseImageAttributes = function (str) {
  return str.split(' ').map(function (item) {
    return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
  });
};

exports.parseSimulcastStreamList = function (str) {
  return str.split(';').map(function (stream) {
    return stream.split(',').map(function (format) {
      var scid, paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
        scid = toIntIfInt(format.substring(1, format.length));
        paused = true;
      }

      return {
        scid: scid,
        paused: paused
      };
    });
  });
};

},{"./grammar":215}],218:[function(require,module,exports){
var grammar = require('./grammar');

// customized util.format - discards excess arguments and can void middle ones
var formatRegExp = /%[sdv%]/g;
var format = function (formatStr) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  return formatStr.replace(formatRegExp, function (x) {
    if (i >= len) {
      return x; // missing argument
    }
    var arg = args[i];
    i += 1;
    switch (x) {
    case '%%':
      return '%';
    case '%s':
      return String(arg);
    case '%d':
      return Number(arg);
    case '%v':
      return '';
    }
  });
  // NB: we discard excess arguments - they are typically undefined from makeLine
};

var makeLine = function (type, obj, location) {
  var str = obj.format instanceof Function ?
    (obj.format(obj.push ? location : location[obj.name])) :
    obj.format;

  var args = [type + '=' + str];
  if (obj.names) {
    for (var i = 0; i < obj.names.length; i += 1) {
      var n = obj.names[i];
      if (obj.name) {
        args.push(location[obj.name][n]);
      }
      else { // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  }
  else {
    args.push(location[obj.name]);
  }
  return format.apply(null, args);
};

// RFC specified order
// TODO: extend this with all the rest
var defaultOuterOrder = [
  'v', 'o', 's', 'i',
  'u', 'e', 'p', 'c',
  'b', 't', 'r', 'z', 'a'
];
var defaultInnerOrder = ['i', 'c', 'b', 'a'];


module.exports = function (session, opts) {
  opts = opts || {};
  // ensure certain properties exist
  if (session.version == null) {
    session.version = 0; // 'v=0' must be there (only defined version atm)
  }
  if (session.name == null) {
    session.name = ' '; // 's= ' must be there if no meaningful name set
  }
  session.media.forEach(function (mLine) {
    if (mLine.payloads == null) {
      mLine.payloads = '';
    }
  });

  var outerOrder = opts.outerOrder || defaultOuterOrder;
  var innerOrder = opts.innerOrder || defaultInnerOrder;
  var sdp = [];

  // loop through outerOrder for matching properties on session
  outerOrder.forEach(function (type) {
    grammar[type].forEach(function (obj) {
      if (obj.name in session && session[obj.name] != null) {
        sdp.push(makeLine(type, obj, session));
      }
      else if (obj.push in session && session[obj.push] != null) {
        session[obj.push].forEach(function (el) {
          sdp.push(makeLine(type, obj, el));
        });
      }
    });
  });

  // then for each media line, follow the innerOrder
  session.media.forEach(function (mLine) {
    sdp.push(makeLine('m', grammar.m[0], mLine));

    innerOrder.forEach(function (type) {
      grammar[type].forEach(function (obj) {
        if (obj.name in mLine && mLine[obj.name] != null) {
          sdp.push(makeLine(type, obj, mLine));
        }
        else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach(function (el) {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });

  return sdp.join('\r\n') + '\r\n';
};

},{"./grammar":215}],219:[function(require,module,exports){
module.exports = require('./lib/index');

},{"./lib/index":220}],220:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill.js":221}],221:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],222:[function(require,module,exports){
var _global = (function() { return this; })();
var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
var websocket_version = require('./version');


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new NativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new NativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}
if (NativeWebSocket) {
	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
		Object.defineProperty(W3CWebSocket, prop, {
			get: function() { return NativeWebSocket[prop]; }
		});
	});
}

/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};

},{"./version":223}],223:[function(require,module,exports){
module.exports = require('../package.json').version;

},{"../package.json":224}],224:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "websocket@1.0.25",
      "/Users/sergeytomashevsky/Desktop/code/tmp/easy-mediasoup"
    ]
  ],
  "_from": "websocket@1.0.25",
  "_id": "websocket@1.0.25",
  "_inBundle": false,
  "_integrity": "sha512-M58njvi6ZxVb5k7kpnHh2BvNKuBWiwIYvsToErBzWhvBZYwlEiLcyLrG41T1jRcrY9ettqPYEqduLI7ul54CVQ==",
  "_location": "/websocket",
  "_optional": true,
  "_phantomChildren": {
    "ms": "2.0.0"
  },
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "websocket@1.0.25",
    "name": "websocket",
    "escapedName": "websocket",
    "rawSpec": "1.0.25",
    "saveSpec": null,
    "fetchSpec": "1.0.25"
  },
  "_requiredBy": [
    "/protoo-client"
  ],
  "_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.25.tgz",
  "_spec": "1.0.25",
  "_where": "/Users/sergeytomashevsky/Desktop/code/tmp/easy-mediasoup",
  "author": {
    "name": "Brian McKelvey",
    "email": "brian@worlize.com",
    "url": "https://www.worlize.com/"
  },
  "browser": "lib/browser.js",
  "bugs": {
    "url": "https://github.com/theturtle32/WebSocket-Node/issues"
  },
  "config": {
    "verbose": false
  },
  "contributors": [
    {
      "name": "Iñaki Baz Castillo",
      "email": "ibc@aliax.net",
      "url": "http://dev.sipdoc.net"
    }
  ],
  "dependencies": {
    "debug": "^2.2.0",
    "nan": "^2.3.3",
    "typedarray-to-buffer": "^3.1.2",
    "yaeti": "^0.0.6"
  },
  "description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
  "devDependencies": {
    "buffer-equal": "^1.0.0",
    "faucet": "^0.0.1",
    "gulp": "git+https://github.com/gulpjs/gulp.git#4.0",
    "gulp-jshint": "^2.0.4",
    "jshint": "^2.0.0",
    "jshint-stylish": "^2.2.1",
    "tape": "^4.0.1"
  },
  "directories": {
    "lib": "./lib"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "homepage": "https://github.com/theturtle32/WebSocket-Node",
  "keywords": [
    "websocket",
    "websockets",
    "socket",
    "networking",
    "comet",
    "push",
    "RFC-6455",
    "realtime",
    "server",
    "client"
  ],
  "license": "Apache-2.0",
  "main": "index",
  "name": "websocket",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theturtle32/WebSocket-Node.git"
  },
  "scripts": {
    "gulp": "gulp",
    "install": "(node-gyp rebuild 2> builderror.log) || (exit 0)",
    "test": "faucet test/unit"
  },
  "version": "1.0.25"
}

},{}],225:[function(require,module,exports){
/*
WildEmitter.js is a slim little event emitter by @henrikjoreteg largely based
on @visionmedia's Emitter from UI Kit.

Why? I wanted it standalone.

I also wanted support for wildcard emitters like this:

emitter.on('*', function (eventName, other, event, payloads) {

});

emitter.on('somenamespace*', function (eventName, payloads) {

});

Please note that callbacks triggered by wildcard registered events also get
the event name as the first argument.
*/

module.exports = WildEmitter;

function WildEmitter() { }

WildEmitter.mixin = function (constructor) {
    var prototype = constructor.prototype || constructor;

    prototype.isWildEmitter= true;

    // Listen on the given `event` with `fn`. Store a group name if present.
    prototype.on = function (event, groupName, fn) {
        this.callbacks = this.callbacks || {};
        var hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        func._groupName = group;
        (this.callbacks[event] = this.callbacks[event] || []).push(func);
        return this;
    };

    // Adds an `event` listener that will be invoked a single
    // time then automatically removed.
    prototype.once = function (event, groupName, fn) {
        var self = this,
            hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        function on() {
            self.off(event, on);
            func.apply(this, arguments);
        }
        this.on(event, group, on);
        return this;
    };

    // Unbinds an entire group
    prototype.releaseGroup = function (groupName) {
        this.callbacks = this.callbacks || {};
        var item, i, len, handlers;
        for (item in this.callbacks) {
            handlers = this.callbacks[item];
            for (i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i]._groupName === groupName) {
                    //console.log('removing');
                    // remove it and shorten the array we're looping through
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        return this;
    };

    // Remove the given callback for `event` or all
    // registered callbacks.
    prototype.off = function (event, fn) {
        this.callbacks = this.callbacks || {};
        var callbacks = this.callbacks[event],
            i;

        if (!callbacks) return this;

        // remove all handlers
        if (arguments.length === 1) {
            delete this.callbacks[event];
            return this;
        }

        // remove specific handler
        i = callbacks.indexOf(fn);
        callbacks.splice(i, 1);
        if (callbacks.length === 0) {
            delete this.callbacks[event];
        }
        return this;
    };

    /// Emit `event` with the given args.
    // also calls any `*` handlers
    prototype.emit = function (event) {
        this.callbacks = this.callbacks || {};
        var args = [].slice.call(arguments, 1),
            callbacks = this.callbacks[event],
            specialCallbacks = this.getWildcardCallbacks(event),
            i,
            len,
            item,
            listeners;

        if (callbacks) {
            listeners = callbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, args);
            }
        }

        if (specialCallbacks) {
            len = specialCallbacks.length;
            listeners = specialCallbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, [event].concat(args));
            }
        }

        return this;
    };

    // Helper for for finding special wildcard event handlers that match the event
    prototype.getWildcardCallbacks = function (eventName) {
        this.callbacks = this.callbacks || {};
        var item,
            split,
            result = [];

        for (item in this.callbacks) {
            split = item.split('*');
            if (item === '*' || (split.length === 2 && eventName.slice(0, split[0].length) === split[0])) {
                result = result.concat(this.callbacks[item]);
            }
        }
        return result;
    };

};

WildEmitter.mixin(WildEmitter);

},{}]},{},[3])(3)
});