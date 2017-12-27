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

var _cookiesManager = require('./cookiesManager');

var cookiesManager = _interopRequireWildcard(_cookiesManager);

var _requestActions = require('./redux/requestActions');

var requestActions = _interopRequireWildcard(_requestActions);

var _stateActions = require('./redux/stateActions');

var stateActions = _interopRequireWildcard(_stateActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _Logger2.default('RoomClient');

var ROOM_OPTIONS = {
	requestTimeout: 10000,
	transportOptions: {
		tcp: false
	}
};

var VIDEO_CONSTRAINS = {
	qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
	vga: { width: { ideal: 640 }, height: { ideal: 480 } },
	hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

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
		    getState = _ref.getState;
		(0, _classCallCheck3.default)(this, RoomClient);

		logger.debug('constructor() [roomId:"%s", peerName:"%s", displayName:"%s", device:%s]', roomId, peerName, displayName, device.flag);
		var protooUrl = (0, _urlFactory.getProtooUrl)(media_server_wss, peerName, roomId);
		var protooTransport = new _protooClient2.default.WebSocketTransport(protooUrl);

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

		// mediasoup-client Room instance.
		this._room = new mediasoupClient.Room(ROOM_OPTIONS);

		// Transport for sending.
		this._sendTransport = null;

		// Transport for receiving.
		this._recvTransport = null;

		// Local mic mediasoup Producer.
		this._micProducer = null;

		// Local webcam mediasoup Producer.
		this._webcamProducer = null;

		// Map of webcam MediaDeviceInfos indexed by deviceId.
		// @type {Map<String, MediaDeviceInfos>}
		this._webcams = new _map2.default();

		// Local Webcam. Object with:
		// - {MediaDeviceInfo} [device]
		// - {String} [resolution] - 'qvga' / 'vga' / 'hd'.
		this._webcam = {
			device: null,
			resolution: 'hd'
		};

		this._join({ displayName: displayName, device: device });
	}

	(0, _createClass3.default)(RoomClient, [{
		key: 'close',
		value: function close() {
			var _this = this;

			if (this._closed) return;

			this._closed = true;

			logger.debug('close()');

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
			cookiesManager.setUser({ displayName: displayName });

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

			this._micProducer.pause();
		}
	}, {
		key: 'unmuteMic',
		value: function unmuteMic() {
			logger.debug('unmuteMic()');

			this._micProducer.resume();
		}
	}, {
		key: 'enableWebcam',
		value: function enableWebcam() {
			var _this3 = this;

			logger.debug('enableWebcam()');

			// Store in cookie.
			cookiesManager.setDevices({ webcamEnabled: true });

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				return _this3._updateWebcams();
			}).then(function () {
				return _this3._setWebcamProducer();
			}).then(function () {
				_this3._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('enableWebcam() | failed: %o', error);

				_this3._dispatch(stateActions.setWebcamInProgress(false));
			});
		}
	}, {
		key: 'disableWebcam',
		value: function disableWebcam() {
			var _this4 = this;

			logger.debug('disableWebcam()');

			// Store in cookie.
			cookiesManager.setDevices({ webcamEnabled: false });

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				_this4._webcamProducer.close();

				_this4._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('disableWebcam() | failed: %o', error);

				_this4._dispatch(stateActions.setWebcamInProgress(false));
			});
		}
	}, {
		key: 'changeWebcam',
		value: function changeWebcam() {
			var _this5 = this;

			logger.debug('changeWebcam()');

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				return _this5._updateWebcams();
			}).then(function () {
				var array = (0, _from2.default)(_this5._webcams.keys());
				var len = array.length;
				var deviceId = _this5._webcam.device ? _this5._webcam.device.deviceId : undefined;
				var idx = array.indexOf(deviceId);

				if (idx < len - 1) idx++;else idx = 0;

				_this5._webcam.device = _this5._webcams.get(array[idx]);

				logger.debug('changeWebcam() | new selected webcam [device:%o]', _this5._webcam.device);

				// Reset video resolution to HD.
				_this5._webcam.resolution = 'hd';
			}).then(function () {
				var _webcam = _this5._webcam,
				    device = _webcam.device,
				    resolution = _webcam.resolution;


				if (!device) throw new Error('no webcam devices');

				logger.debug('changeWebcam() | calling getUserMedia()');

				return navigator.mediaDevices.getUserMedia({
					video: (0, _extends3.default)({
						deviceId: { exact: device.deviceId }
					}, VIDEO_CONSTRAINS[resolution])
				});
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				return _this5._webcamProducer.replaceTrack(track).then(function (newTrack) {
					track.stop();

					return newTrack;
				});
			}).then(function (newTrack) {
				_this5._dispatch(stateActions.setProducerTrack(_this5._webcamProducer.id, newTrack));

				_this5._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('changeWebcam() failed: %o', error);

				_this5._dispatch(stateActions.setWebcamInProgress(false));
			});
		}
	}, {
		key: 'changeWebcamResolution',
		value: function changeWebcamResolution() {
			var _this6 = this;

			logger.debug('changeWebcamResolution()');

			var oldResolution = void 0;
			var newResolution = void 0;

			this._dispatch(stateActions.setWebcamInProgress(true));

			return _promise2.default.resolve().then(function () {
				oldResolution = _this6._webcam.resolution;

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

				_this6._webcam.resolution = newResolution;
			}).then(function () {
				var _webcam2 = _this6._webcam,
				    device = _webcam2.device,
				    resolution = _webcam2.resolution;


				logger.debug('changeWebcamResolution() | calling getUserMedia()');

				return navigator.mediaDevices.getUserMedia({
					video: (0, _extends3.default)({
						deviceId: { exact: device.deviceId }
					}, VIDEO_CONSTRAINS[resolution])
				});
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				return _this6._webcamProducer.replaceTrack(track).then(function (newTrack) {
					track.stop();

					return newTrack;
				});
			}).then(function (newTrack) {
				_this6._dispatch(stateActions.setProducerTrack(_this6._webcamProducer.id, newTrack));

				_this6._dispatch(stateActions.setWebcamInProgress(false));
			}).catch(function (error) {
				logger.error('changeWebcamResolution() failed: %o', error);

				_this6._dispatch(stateActions.setWebcamInProgress(false));

				_this6._webcam.resolution = oldResolution;
			});
		}
	}, {
		key: 'enableAudioOnly',
		value: function enableAudioOnly() {
			var _this7 = this;

			logger.debug('enableAudioOnly()');

			this._dispatch(stateActions.setAudioOnlyInProgress(true));

			return _promise2.default.resolve().then(function () {
				if (_this7._webcamProducer) _this7._webcamProducer.close();

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = (0, _getIterator3.default)(_this7._room.peers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

				_this7._dispatch(stateActions.setAudioOnlyState(true));

				_this7._dispatch(stateActions.setAudioOnlyInProgress(false));
			}).catch(function (error) {
				logger.error('enableAudioOnly() failed: %o', error);

				_this7._dispatch(stateActions.setAudioOnlyInProgress(false));
			});
		}
	}, {
		key: 'disableAudioOnly',
		value: function disableAudioOnly() {
			var _this8 = this;

			logger.debug('disableAudioOnly()');

			this._dispatch(stateActions.setAudioOnlyInProgress(true));

			return _promise2.default.resolve().then(function () {
				if (!_this8._webcamProducer && _this8._room.canSend('video')) return _this8.enableWebcam();
			}).then(function () {
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = (0, _getIterator3.default)(_this8._room.peers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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

				_this8._dispatch(stateActions.setAudioOnlyState(false));

				_this8._dispatch(stateActions.setAudioOnlyInProgress(false));
			}).catch(function (error) {
				logger.error('disableAudioOnly() failed: %o', error);

				_this8._dispatch(stateActions.setAudioOnlyInProgress(false));
			});
		}
	}, {
		key: 'restartIce',
		value: function restartIce() {
			var _this9 = this;

			logger.debug('restartIce()');

			this._dispatch(stateActions.setRestartIceInProgress(true));

			return _promise2.default.resolve().then(function () {
				_this9._room.restartIce();

				// Make it artificially longer.
				setTimeout(function () {
					_this9._dispatch(stateActions.setRestartIceInProgress(false));
				}, 500);
			}).catch(function (error) {
				logger.error('restartIce() failed: %o', error);

				_this9._dispatch(stateActions.setRestartIceInProgress(false));
			});
		}
	}, {
		key: '_join',
		value: function _join(_ref2) {
			var _this10 = this;

			var displayName = _ref2.displayName,
			    device = _ref2.device;

			this._dispatch(stateActions.setRoomState('connecting'));

			this._protoo.on('open', function () {
				logger.debug('protoo Peer "open" event');

				_this10._joinRoom({ displayName: displayName, device: device });
			});

			this._protoo.on('disconnected', function () {
				logger.warn('protoo Peer "disconnected" event');

				_this10._dispatch(requestActions.notify({
					type: 'error',
					text: 'WebSocket disconnected'
				}));

				// Leave Room.
				try {
					_this10._room.remoteClose({ cause: 'protoo disconnected' });
				} catch (error) {}

				_this10._dispatch(stateActions.setRoomState('connecting'));
			});

			this._protoo.on('close', function () {
				if (_this10._closed) return;

				logger.warn('protoo Peer "close" event');

				_this10.close();
			});

			this._protoo.on('request', function (request, accept, reject) {
				logger.debug('_handleProtooRequest() [method:%s, data:%o]', request.method, request.data);

				switch (request.method) {
					case 'mediasoup-notification':
						{
							accept();

							var notification = request.data;

							_this10._room.receiveNotification(notification);

							break;
						}

					case 'active-speaker':
						{
							accept();

							var peerName = request.data.peerName;


							_this10._dispatch(stateActions.setRoomActiveSpeaker(peerName));

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

							var peer = _this10._room.getPeerByName(_peerName);

							if (!peer) {
								logger.error('peer not found');

								break;
							}

							peer.appData.displayName = _displayName;

							_this10._dispatch(stateActions.setPeerDisplayName(_displayName, _peerName));

							_this10._dispatch(requestActions.notify({
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
			var _this11 = this;

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

					_this11._dispatch(stateActions.setRoomState('closed'));

					return;
				}
			});

			this._room.on('request', function (request, callback, errback) {
				logger.debug('sending mediasoup request [method:%s]:%o', request.method, request);

				_this11._protoo.send('mediasoup-request', request).then(callback).catch(errback);
			});

			this._room.on('notify', function (notification) {
				logger.debug('sending mediasoup notification [method:%s]:%o', notification.method, notification);

				_this11._protoo.send('mediasoup-notification', notification).catch(function (error) {
					logger.warn('could not send mediasoup notification:%o', error);
				});
			});

			this._room.on('newpeer', function (peer) {
				logger.debug('room "newpeer" event [name:"%s", peer:%o]', peer.name, peer);

				_this11._handlePeer(peer);
			});

			this._room.join(this._peerName, { displayName: displayName, device: device }).then(function () {
				// Create Transport for sending.
				_this11._sendTransport = _this11._room.createTransport('send', { media: 'SEND_MIC_WEBCAM' });

				_this11._sendTransport.on('close', function (originator) {
					logger.debug('Transport "close" event [originator:%s]', originator);
				});

				// Create Transport for receiving.
				_this11._recvTransport = _this11._room.createTransport('recv', { media: 'RECV' });

				_this11._recvTransport.on('close', function (originator) {
					logger.debug('receiving Transport "close" event [originator:%s]', originator);
				});
			}).then(function () {
				// Set our media capabilities.
				_this11._dispatch(stateActions.setMediaCapabilities({
					canSendMic: _this11._room.canSend('audio'),
					canSendWebcam: _this11._room.canSend('video')
				}));
			}).then(function () {
				// Don't produce if explicitely requested to not to do it.
				if (!_this11._produce) return;

				// NOTE: Don't depend on this Promise to continue (so we don't do return).
				_promise2.default.resolve()
				// Add our mic.
				.then(function () {
					if (!_this11._room.canSend('audio')) return;

					_this11._setMicProducer().catch(function () {});
				})
				// Add our webcam (unless the cookie says no).
				.then(function () {
					if (!_this11._room.canSend('video')) return;

					var devicesCookie = cookiesManager.getDevices();

					if (!devicesCookie || devicesCookie.webcamEnabled) _this11.enableWebcam();
				});
			}).then(function () {
				_this11._dispatch(stateActions.setRoomState('connected'));

				// Clean all the existing notifcations.
				_this11._dispatch(stateActions.removeAllNotifications());

				_this11._dispatch(requestActions.notify({
					text: 'You are in the room',
					timeout: 5000
				}));

				var peers = _this11._room.peers;

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = (0, _getIterator3.default)(peers), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var peer = _step5.value;

						_this11._handlePeer(peer, { notify: false });
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

				_this11._dispatch(requestActions.notify({
					type: 'error',
					text: 'Could not join the room: ' + error.toString()
				}));

				_this11.close();
			});
		}
	}, {
		key: '_setMicProducer',
		value: function _setMicProducer() {
			var _this12 = this;

			if (!this._room.canSend('audio')) {
				return _promise2.default.reject(new Error('cannot send audio'));
			}

			if (this._micProducer) {
				return _promise2.default.reject(new Error('mic Producer already exists'));
			}

			var producer = void 0;

			return _promise2.default.resolve().then(function () {
				logger.debug('_setMicProducer() | calling getUserMedia()');

				return navigator.mediaDevices.getUserMedia({ audio: true });
			}).then(function (stream) {
				var track = stream.getAudioTracks()[0];

				producer = _this12._room.createProducer(track, null, { source: 'mic' });

				// No need to keep original track.
				track.stop();

				// Send it.
				return producer.send(_this12._sendTransport);
			}).then(function () {
				_this12._micProducer = producer;

				_this12._dispatch(stateActions.addProducer({
					id: producer.id,
					source: 'mic',
					locallyPaused: producer.locallyPaused,
					remotelyPaused: producer.remotelyPaused,
					track: producer.track,
					codec: producer.rtpParameters.codecs[0].name
				}));

				producer.on('close', function (originator) {
					logger.debug('mic Producer "close" event [originator:%s]', originator);

					_this12._micProducer = null;
					_this12._dispatch(stateActions.removeProducer(producer.id));
				});

				producer.on('pause', function (originator) {
					logger.debug('mic Producer "pause" event [originator:%s]', originator);

					_this12._dispatch(stateActions.setProducerPaused(producer.id, originator));
				});

				producer.on('resume', function (originator) {
					logger.debug('mic Producer "resume" event [originator:%s]', originator);

					_this12._dispatch(stateActions.setProducerResumed(producer.id, originator));
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

				_this12._dispatch(requestActions.notify({
					text: 'Mic producer failed: ' + error.name + ':' + error.message
				}));

				if (producer) producer.close();

				throw error;
			});
		}
	}, {
		key: '_setWebcamProducer',
		value: function _setWebcamProducer() {
			var _this13 = this;

			if (!this._room.canSend('video')) {
				return _promise2.default.reject(new Error('cannot send video'));
			}

			if (this._webcamProducer) {
				return _promise2.default.reject(new Error('webcam Producer already exists'));
			}

			var producer = void 0;

			return _promise2.default.resolve().then(function () {
				var _webcam3 = _this13._webcam,
				    device = _webcam3.device,
				    resolution = _webcam3.resolution;


				if (!device) throw new Error('no webcam devices');

				logger.debug('_setWebcamProducer() | calling getUserMedia()');

				return navigator.mediaDevices.getUserMedia({
					video: (0, _extends3.default)({
						deviceId: { exact: device.deviceId }
					}, VIDEO_CONSTRAINS[resolution])
				});
			}).then(function (stream) {
				var track = stream.getVideoTracks()[0];

				producer = _this13._room.createProducer(track, { simulcast: _this13._useSimulcast }, { source: 'webcam' });

				// No need to keep original track.
				track.stop();

				// Send it.
				return producer.send(_this13._sendTransport);
			}).then(function () {
				_this13._webcamProducer = producer;

				var device = _this13._webcam.device;


				_this13._dispatch(stateActions.addProducer({
					id: producer.id,
					source: 'webcam',
					deviceLabel: device.label,
					type: _this13._getWebcamType(device),
					locallyPaused: producer.locallyPaused,
					remotelyPaused: producer.remotelyPaused,
					track: producer.track,
					codec: producer.rtpParameters.codecs[0].name
				}));

				producer.on('close', function (originator) {
					logger.debug('webcam Producer "close" event [originator:%s]', originator);

					_this13._webcamProducer = null;
					_this13._dispatch(stateActions.removeProducer(producer.id));
				});

				producer.on('pause', function (originator) {
					logger.debug('webcam Producer "pause" event [originator:%s]', originator);

					_this13._dispatch(stateActions.setProducerPaused(producer.id, originator));
				});

				producer.on('resume', function (originator) {
					logger.debug('webcam Producer "resume" event [originator:%s]', originator);

					_this13._dispatch(stateActions.setProducerResumed(producer.id, originator));
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

				_this13._dispatch(requestActions.notify({
					text: 'Webcam producer failed: ' + error.name + ':' + error.message
				}));

				if (producer) producer.close();

				throw error;
			});
		}
	}, {
		key: '_updateWebcams',
		value: function _updateWebcams() {
			var _this14 = this;

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

						_this14._webcams.set(device.deviceId, device);
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
				var array = (0, _from2.default)(_this14._webcams.values());
				var len = array.length;
				var currentWebcamId = _this14._webcam.device ? _this14._webcam.device.deviceId : undefined;

				logger.debug('_updateWebcams() [webcams:%o]', array);

				if (len === 0) _this14._webcam.device = null;else if (!_this14._webcams.has(currentWebcamId)) _this14._webcam.device = array[0];

				_this14._dispatch(stateActions.setCanChangeWebcam(_this14._webcams.size >= 2));
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
			var _this15 = this;

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

			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = (0, _getIterator3.default)(peer.consumers), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var consumer = _step7.value;

					this._handleConsumer(consumer);
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

			peer.on('close', function (originator) {
				logger.debug('peer "close" event [name:"%s", originator:%s]', peer.name, originator);

				_this15._dispatch(stateActions.removePeer(peer.name));

				if (_this15._room.joined) {
					_this15._dispatch(requestActions.notify({
						text: peer.appData.displayName + ' left the room'
					}));
				}
			});

			peer.on('newconsumer', function (consumer) {
				logger.debug('peer "newconsumer" event [name:"%s", id:%s, consumer:%o]', peer.name, consumer.id, consumer);

				_this15._handleConsumer(consumer);
			});
		}
	}, {
		key: '_handleConsumer',
		value: function _handleConsumer(consumer) {
			var _this16 = this;

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

				_this16._dispatch(stateActions.removeConsumer(consumer.id, consumer.peer.name));
			});

			consumer.on('pause', function (originator) {
				logger.debug('consumer "pause" event [id:%s, originator:%s, consumer:%o]', consumer.id, originator, consumer);

				_this16._dispatch(stateActions.setConsumerPaused(consumer.id, originator));
			});

			consumer.on('resume', function (originator) {
				logger.debug('consumer "resume" event [id:%s, originator:%s, consumer:%o]', consumer.id, originator, consumer);

				_this16._dispatch(stateActions.setConsumerResumed(consumer.id, originator));
			});

			consumer.on('effectiveprofilechange', function (profile) {
				logger.debug('consumer "effectiveprofilechange" event [id:%s, consumer:%o, profile:%s]', consumer.id, consumer, profile);

				_this16._dispatch(stateActions.setConsumerEffectiveProfile(consumer.id, profile));
			});

			// Receive the consumer (if we can).
			if (consumer.supported) {
				// Pause it if video and we are in audio-only mode.
				if (consumer.kind === 'video' && this._getState().me.audioOnly) consumer.pause('audio-only-mode');

				consumer.receive(this._recvTransport).then(function (track) {
					_this16._dispatch(stateActions.setConsumerTrack(consumer.id, track));
				}).catch(function (error) {
					logger.error('unexpected error while receiving a new Consumer:%o', error);
				});
			}
		}
	}]);
	return RoomClient;
}();

exports.default = RoomClient;