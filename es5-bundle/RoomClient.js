'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_VIDEO_CONSTRAINS = {
	qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
	vga: { width: { ideal: 640 }, height: { ideal: 480 } },
	hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

var DEFAULT_VIDEO_ENCODINGS = [{ maxBitrate: 100000, scaleResolutionDownBy: 4 }, { maxBitrate: 300000, scaleResolutionDownBy: 2 }, { maxBitrate: 1500000, scaleResolutionDownBy: 1 }];

var EXTERNAL_VIDEO_SRC = '/resources/videos/video-audio-stereo.mp4';

var logger = new _Logger2.default('RoomClient');

var store = void 0;

var RoomClient = function () {
	(0, _createClass3.default)(RoomClient, null, [{
		key: 'init',

		/**
   * @param  {Object} data
   * @param  {Object} data.store - The Redux store.
   */
		value: function init(data) {
			store = data.store;
		}
	}]);

	function RoomClient(_ref) {
		var roomId = _ref.roomId,
		    peerId = _ref.peerId,
		    displayName = _ref.displayName,
		    device = _ref.device,
		    useSimulcast = _ref.useSimulcast,
		    forceTcp = _ref.forceTcp,
		    produce = _ref.produce,
		    consume = _ref.consume,
		    forceH264 = _ref.forceH264,
		    externalVideo = _ref.externalVideo,
		    args = _ref.args;
		(0, _classCallCheck3.default)(this, RoomClient);

		logger.debug('constructor() [roomId:"%s", peerId:"%s", displayName:"%s", device:%s]', roomId, peerId, displayName, device.flag);

		this.video_contrains = args.video_constrains || DEFAULT_VIDEO_CONSTRAINS;

		this.video_encodings = args.video_encodings || DEFAULT_VIDEO_ENCODINGS;
		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Display name.
		// @type {String}
		this._displayName = displayName;

		// Device info.
		// @type {Object}
		this._device = device;

		// Whether we want to force RTC over TCP.
		// @type {Boolean}
		this._forceTcp = forceTcp;

		// Whether we want to produce audio/video.
		// @type {Boolean}
		this._produce = produce;

		// Whether we should consume.
		// @type {Boolean}
		this._consume = consume;

		// Whether we want to force H264 codec.
		// @type {Boolean}
		this._forceH264 = forceH264;

		// External video.
		// @type {HTMLVideoElement}
		this._externalVideo = null;

		// MediaStream of the external video.
		// @type {MediaStream}
		this._externalVideoStream = null;

		if (externalVideo) {
			this._externalVideo = document.createElement('video');

			this._externalVideo.controls = true;
			this._externalVideo.muted = true;
			this._externalVideo.loop = true;
			this._externalVideo.setAttribute('playsinline', '');
			this._externalVideo.src = EXTERNAL_VIDEO_SRC;

			this._externalVideo.play().catch(function (error) {
				return logger.warn('externalVideo.play() failed:%o', error);
			});
		}

		// Whether simulcast should be used.
		// @type {Boolean}
		this._useSimulcast = useSimulcast;

		// Protoo URL.
		// @type {String}
		this._protooUrl = (0, _urlFactory.getProtooUrl)({ media_server_wss: args.media_server_wss, roomId: roomId, peerId: peerId, forceH264: forceH264 });

		// protoo-client Peer instance.
		// @type {protooClient.Peer}
		this._protoo = null;

		// mediasoup-client Device instance.
		// @type {mediasoupClient.Device}
		this._mediasoupDevice = null;

		// mediasoup Transport for sending.
		// @type {mediasoupClient.Transport}
		this._sendTransport = null;

		// mediasoup Transport for receiving.
		// @type {mediasoupClient.Transport}
		this._recvTransport = null;

		// Local mic mediasoup Producer.
		// @type {mediasoupClient.Producer}
		this._micProducer = null;

		// Local webcam mediasoup Producer.
		// @type {mediasoupClient.Producer}
		this._webcamProducer = null;

		// mediasoup Consumers.
		// @type {Map<String, mediasoupClient.Consumer>}
		this._consumers = new _map2.default();

		// Map of webcam MediaDeviceInfos indexed by deviceId.
		// @type {Map<String, MediaDeviceInfos>}
		this._webcams = new _map2.default();

		// Local Webcam.
		// @type {Object} with:
		// - {MediaDeviceInfo} [device]
		// - {String} [resolution] - 'qvga' / 'vga' / 'hd'.
		this._webcam = {
			device: null,
			resolution: 'hd'
		};
	}

	(0, _createClass3.default)(RoomClient, [{
		key: 'close',
		value: function close() {
			if (this._closed) return;

			this._closed = true;

			logger.debug('close()');

			// Close protoo Peer
			this._protoo.close();

			// Close mediasoup Transports.
			if (this._sendTransport) this._sendTransport.close();

			if (this._recvTransport) this._recvTransport.close();

			store.dispatch(stateActions.setRoomState('closed'));
		}
	}, {
		key: 'join',
		value: async function join() {
			var _this = this;

			var protooTransport = new _protooClient2.default.WebSocketTransport(this._protooUrl);

			this._protoo = new _protooClient2.default.Peer(protooTransport);

			store.dispatch(stateActions.setRoomState('connecting'));

			this._protoo.on('open', function () {
				return _this._joinRoom();
			});

			this._protoo.on('failed', function () {
				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'WebSocket connection failed'
				}));
			});

			this._protoo.on('disconnected', function () {
				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'WebSocket disconnected'
				}));

				// Close mediasoup Transports.
				if (_this._sendTransport) {
					_this._sendTransport.close();
					_this._sendTransport = null;
				}

				if (_this._recvTransport) {
					_this._recvTransport.close();
					_this._recvTransport = null;
				}

				store.dispatch(stateActions.setRoomState('closed'));
			});

			this._protoo.on('close', function () {
				if (_this._closed) return;

				_this.close();
			});

			// eslint-disable-next-line no-unused-vars
			this._protoo.on('request', async function (request, accept, reject) {
				logger.debug('proto "request" event [method:%s, data:%o]', request.method, request.data);

				switch (request.method) {
					case 'newConsumer':
						{
							if (!_this._consume) {
								reject(403, 'I do not want to consume');

								return;
							}

							var _request$data = request.data,
							    peerId = _request$data.peerId,
							    producerId = _request$data.producerId,
							    id = _request$data.id,
							    kind = _request$data.kind,
							    rtpParameters = _request$data.rtpParameters,
							    type = _request$data.type,
							    appData = _request$data.appData,
							    producerPaused = _request$data.producerPaused;


							var codecOptions = void 0;

							if (kind === 'audio') {
								codecOptions = {
									opusStereo: 1
								};
							}

							var consumer = await _this._recvTransport.consume({
								id: id,
								producerId: producerId,
								kind: kind,
								rtpParameters: rtpParameters,
								codecOptions: codecOptions,
								appData: (0, _extends3.default)({}, appData, { peerId: peerId // Trick.
								}) });

							// Store in the map.
							_this._consumers.set(consumer.id, consumer);

							consumer.on('transportclose', function () {
								_this._consumers.delete(consumer.id);
							});

							var _mediasoupClient$pars = mediasoupClient.parseScalabilityMode(consumer.rtpParameters.encodings[0].scalabilityMode),
							    spatialLayers = _mediasoupClient$pars.spatialLayers,
							    temporalLayers = _mediasoupClient$pars.temporalLayers;

							store.dispatch(stateActions.addConsumer({
								id: consumer.id,
								type: type,
								locallyPaused: false,
								remotelyPaused: producerPaused,
								rtpParameters: consumer.rtpParameters,
								spatialLayers: spatialLayers,
								temporalLayers: temporalLayers,
								preferredSpatialLayer: spatialLayers - 1,
								preferredTemporalLayer: temporalLayers - 1,
								codec: consumer.rtpParameters.codecs[0].mimeType.split('/')[1],
								track: consumer.track
							}, peerId));

							// We are ready. Answer the protoo request so the server will
							// resume this Consumer (which was paused for now).
							accept();

							// If audio-only mode is enabled, pause it.
							if (consumer.kind === 'video' && store.getState().me.audioOnly) _this._pauseConsumer(consumer);

							break;
						}
				}
			});

			this._protoo.on('notification', function (notification) {
				logger.debug('proto "notification" event [method:%s, data:%o]', notification.method, notification.data);

				global.emitter.emit('notification');

				switch (notification.method) {
					case 'producerScore':
						{
							var _notification$data = notification.data,
							    producerId = _notification$data.producerId,
							    score = _notification$data.score;


							store.dispatch(stateActions.setProducerScore(producerId, score));

							break;
						}

					case 'newPeer':
						{
							var peer = notification.data;

							store.dispatch(stateActions.addPeer((0, _extends3.default)({}, peer, { consumers: [] })));

							store.dispatch(requestActions.notify({
								text: peer.displayName + ' has joined the room'
							}));

							break;
						}

					case 'peerClosed':
						{
							var peerId = notification.data.peerId;


							store.dispatch(stateActions.removePeer(peerId));

							break;
						}

					case 'peerDisplayNameChanged':
						{
							var _notification$data2 = notification.data,
							    _peerId = _notification$data2.peerId,
							    displayName = _notification$data2.displayName,
							    oldDisplayName = _notification$data2.oldDisplayName;


							store.dispatch(stateActions.setPeerDisplayName(displayName, _peerId));

							store.dispatch(requestActions.notify({
								text: oldDisplayName + ' is now ' + displayName
							}));

							break;
						}

					case 'consumerClosed':
						{
							var consumerId = notification.data.consumerId;

							var consumer = _this._consumers.get(consumerId);

							if (!consumer) break;

							consumer.close();
							_this._consumers.delete(consumerId);

							var _peerId2 = consumer.appData.peerId;


							store.dispatch(stateActions.removeConsumer(consumerId, _peerId2));

							break;
						}

					case 'consumerPaused':
						{
							var _consumerId = notification.data.consumerId;

							var _consumer = _this._consumers.get(_consumerId);

							if (!_consumer) break;

							store.dispatch(stateActions.setConsumerPaused(_consumerId, 'remote'));

							break;
						}

					case 'consumerResumed':
						{
							var _consumerId2 = notification.data.consumerId;

							var _consumer2 = _this._consumers.get(_consumerId2);

							if (!_consumer2) break;

							store.dispatch(stateActions.setConsumerResumed(_consumerId2, 'remote'));

							break;
						}

					case 'consumerLayersChanged':
						{
							var _notification$data3 = notification.data,
							    _consumerId3 = _notification$data3.consumerId,
							    spatialLayer = _notification$data3.spatialLayer,
							    temporalLayer = _notification$data3.temporalLayer;

							var _consumer3 = _this._consumers.get(_consumerId3);

							if (!_consumer3) break;

							store.dispatch(stateActions.setConsumerCurrentLayers(_consumerId3, spatialLayer, temporalLayer));

							break;
						}

					case 'consumerScore':
						{
							var _notification$data4 = notification.data,
							    _consumerId4 = _notification$data4.consumerId,
							    _score = _notification$data4.score;


							store.dispatch(stateActions.setConsumerScore(_consumerId4, _score));

							break;
						}

					case 'activeSpeaker':
						{
							var _peerId3 = notification.data.peerId;


							store.dispatch(stateActions.setRoomActiveSpeaker(_peerId3));

							global.emitter.emit('active-speakers', _peerId3);

							break;
						}

					default:
						{
							logger.error('unknown protoo notification.method "%s"', notification.method);
						}
				}
			});

			global.emitter.emit("joinRoom", this);
		}
	}, {
		key: 'enableMic',
		value: async function enableMic() {
			var _this2 = this;

			logger.debug('enableMic()');

			if (this._micProducer) return;

			if (!this._mediasoupDevice.canProduce('audio')) {
				logger.error('enableMic() | cannot produce audio');

				return;
			}

			var track = void 0;

			try {
				if (!this._externalVideo) {
					logger.debug('enableMic() | calling getUserMedia()');

					var stream = await navigator.mediaDevices.getUserMedia({ audio: true });

					track = stream.getAudioTracks()[0];
				} else {
					var _stream = await this._getExternalVideoStream();

					track = _stream.getAudioTracks()[0].clone();
				}

				this._micProducer = await this._sendTransport.produce({
					track: track,
					codecOptions: {
						opusStereo: 1,
						opusDtx: 1
					}
				});

				store.dispatch(stateActions.addProducer({
					id: this._micProducer.id,
					paused: this._micProducer.paused,
					track: this._micProducer.track,
					rtpParameters: this._micProducer.rtpParameters,
					codec: this._micProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
				}));

				this._micProducer.on('transportclose', function () {
					_this2._micProducer = null;
				});

				this._micProducer.on('trackended', function () {
					store.dispatch(requestActions.notify({
						type: 'error',
						text: 'Microphone disconnected!'
					}));

					_this2.disableMic().catch(function () {});
				});
			} catch (error) {
				logger.error('enableMic() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error enabling microphone: ' + error
				}));

				if (track) track.stop();
			}
		}
	}, {
		key: 'disableMic',
		value: async function disableMic() {
			logger.debug('disableMic()');

			if (!this._micProducer) return;

			this._micProducer.close();

			store.dispatch(stateActions.removeProducer(this._micProducer.id));

			try {
				await this._protoo.request('closeProducer', { producerId: this._micProducer.id });
			} catch (error) {
				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error closing server-side mic Producer: ' + error
				}));
			}

			this._micProducer = null;
		}
	}, {
		key: 'muteMic',
		value: async function muteMic() {
			logger.debug('muteMic()');

			this._micProducer.pause();

			try {
				await this._protoo.request('pauseProducer', { producerId: this._micProducer.id });

				store.dispatch(stateActions.setProducerPaused(this._micProducer.id));
			} catch (error) {
				logger.error('muteMic() | failed: %o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error pausing server-side mic Producer: ' + error
				}));
			}
		}
	}, {
		key: 'unmuteMic',
		value: async function unmuteMic() {
			logger.debug('unmuteMic()');

			this._micProducer.resume();

			try {
				await this._protoo.request('resumeProducer', { producerId: this._micProducer.id });

				store.dispatch(stateActions.setProducerResumed(this._micProducer.id));
			} catch (error) {
				logger.error('unmuteMic() | failed: %o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error resuming server-side mic Producer: ' + error
				}));
			}
		}
	}, {
		key: 'enableWebcam',
		value: async function enableWebcam() {
			var _this3 = this;

			logger.debug('enableWebcam()');

			if (this._webcamProducer) return;

			if (!this._mediasoupDevice.canProduce('video')) {
				logger.error('enableWebcam() | cannot produce video');

				return;
			}

			var track = void 0;
			var device = void 0;

			store.dispatch(stateActions.setWebcamInProgress(true));

			try {
				if (!this._externalVideo) {
					await this._updateWebcams();
					device = this._webcam.device;

					var resolution = this._webcam.resolution;


					if (!device) throw new Error('no webcam devices');

					logger.debug('enableWebcam() | calling getUserMedia()');

					var stream = await navigator.mediaDevices.getUserMedia({
						video: (0, _extends3.default)({
							deviceId: { exact: device.deviceId }
						}, this.video_contrains[resolution])
					});

					track = stream.getVideoTracks()[0];
				} else {
					device = { label: 'external video' };

					var _stream2 = await this._getExternalVideoStream();

					track = _stream2.getVideoTracks()[0].clone();
				}

				if (this._useSimulcast) {
					this._webcamProducer = await this._sendTransport.produce({
						track: track,
						encodings: this.video_encodings,
						codecOptions: {
							videoGoogleStartBitrate: 1000
						}
					});
				} else {
					this._webcamProducer = await this._sendTransport.produce({ track: track });
				}

				store.dispatch(stateActions.addProducer({
					id: this._webcamProducer.id,
					deviceLabel: device.label,
					type: this._getWebcamType(device),
					paused: this._webcamProducer.paused,
					track: this._webcamProducer.track,
					rtpParameters: this._webcamProducer.rtpParameters,
					codec: this._webcamProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
				}));

				this._webcamProducer.on('transportclose', function () {
					_this3._webcamProducer = null;
				});

				this._webcamProducer.on('trackended', function () {
					store.dispatch(requestActions.notify({
						type: 'error',
						text: 'Webcam disconnected!'
					}));

					_this3.disableWebcam().catch(function () {});
				});
			} catch (error) {
				logger.error('enableWebcam() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error enabling webcam: ' + error
				}));

				if (track) track.stop();
			}

			store.dispatch(stateActions.setWebcamInProgress(false));
		}
	}, {
		key: 'disableWebcam',
		value: async function disableWebcam() {
			logger.debug('disableWebcam()');

			if (!this._webcamProducer) return;

			this._webcamProducer.close();

			store.dispatch(stateActions.removeProducer(this._webcamProducer.id));

			try {
				await this._protoo.request('closeProducer', { producerId: this._webcamProducer.id });
			} catch (error) {
				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error closing server-side webcam Producer: ' + error
				}));
			}

			this._webcamProducer = null;
		}
	}, {
		key: 'changeWebcam',
		value: async function changeWebcam() {
			logger.debug('changeWebcam()');

			store.dispatch(stateActions.setWebcamInProgress(true));

			try {
				await this._updateWebcams();

				var array = (0, _from2.default)(this._webcams.keys());
				var len = array.length;
				var deviceId = this._webcam.device ? this._webcam.device.deviceId : undefined;
				var idx = array.indexOf(deviceId);

				if (idx < len - 1) idx++;else idx = 0;

				this._webcam.device = this._webcams.get(array[idx]);

				logger.debug('changeWebcam() | new selected webcam [device:%o]', this._webcam.device);

				// Reset video resolution to HD.
				this._webcam.resolution = 'hd';

				if (!this._webcam.device) throw new Error('no webcam devices');

				// Closing the current video track before asking for a new one (mobiles do not like
				// having both front/back cameras open at the same time).
				this._webcamProducer.track.stop();

				logger.debug('changeWebcam() | calling getUserMedia()');

				var stream = await navigator.mediaDevices.getUserMedia({
					video: (0, _extends3.default)({
						deviceId: { exact: this._webcam.device.deviceId }
					}, this.video_contrains[this._webcam.resolution])
				});

				var track = stream.getVideoTracks()[0];

				await this._webcamProducer.replaceTrack({ track: track });

				store.dispatch(stateActions.setProducerTrack(this._webcamProducer.id, track));
			} catch (error) {
				logger.error('changeWebcam() | failed: %o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Could not change webcam: ' + error
				}));
			}

			store.dispatch(stateActions.setWebcamInProgress(false));
		}
	}, {
		key: 'changeWebcamResolution',
		value: async function changeWebcamResolution() {
			logger.debug('changeWebcamResolution()');

			store.dispatch(stateActions.setWebcamInProgress(true));

			try {
				switch (this._webcam.resolution) {
					case 'qvga':
						this._webcam.resolution = 'vga';
						break;
					case 'vga':
						this._webcam.resolution = 'hd';
						break;
					case 'hd':
						this._webcam.resolution = 'qvga';
						break;
					default:
						this._webcam.resolution = 'hd';
				}

				logger.debug('changeWebcamResolution() | calling getUserMedia()');

				var stream = await navigator.mediaDevices.getUserMedia({
					video: (0, _extends3.default)({
						deviceId: { exact: this._webcam.device.deviceId }
					}, this.video_contrains[this._webcam.resolution])
				});

				var track = stream.getVideoTracks()[0];

				await this._webcamProducer.replaceTrack({ track: track });

				store.dispatch(stateActions.setProducerTrack(this._webcamProducer.id, track));
			} catch (error) {
				logger.error('changeWebcamResolution() | failed: %o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Could not change webcam resolution: ' + error
				}));
			}

			store.dispatch(stateActions.setWebcamInProgress(false));
		}
	}, {
		key: 'enableAudioOnly',
		value: async function enableAudioOnly() {
			logger.debug('enableAudioOnly()');

			store.dispatch(stateActions.setAudioOnlyInProgress(true));

			this.disableWebcam();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)(this._consumers.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var consumer = _step.value;

					if (consumer.kind !== 'video') continue;

					this._pauseConsumer(consumer);
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

			store.dispatch(stateActions.setAudioOnlyState(true));

			store.dispatch(stateActions.setAudioOnlyInProgress(false));
		}
	}, {
		key: 'disableAudioOnly',
		value: async function disableAudioOnly() {
			logger.debug('disableAudioOnly()');

			store.dispatch(stateActions.setAudioOnlyInProgress(true));

			if (!this._webcamProducer && this._produce) {
				this.enableWebcam();
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = (0, _getIterator3.default)(this._consumers.values()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var consumer = _step2.value;

					if (consumer.kind !== 'video') continue;

					this._resumeConsumer(consumer);
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

			store.dispatch(stateActions.setAudioOnlyState(false));

			store.dispatch(stateActions.setAudioOnlyInProgress(false));
		}
	}, {
		key: 'muteAudio',
		value: async function muteAudio() {
			logger.debug('muteAudio()');

			store.dispatch(stateActions.setAudioMutedState(true));
		}
	}, {
		key: 'unmuteAudio',
		value: async function unmuteAudio() {
			logger.debug('unmuteAudio()');

			store.dispatch(stateActions.setAudioMutedState(false));
		}
	}, {
		key: 'restartIce',
		value: async function restartIce() {
			logger.debug('restartIce()');

			store.dispatch(stateActions.setRestartIceInProgress(true));

			try {
				if (this._sendTransport) {
					var iceParameters = await this._protoo.request('restartIce', { transportId: this._sendTransport.id });

					await this._sendTransport.restartIce({ iceParameters: iceParameters });
				}

				if (this._recvTransport) {
					var _iceParameters = await this._protoo.request('restartIce', { transportId: this._recvTransport.id });

					await this._recvTransport.restartIce({ iceParameters: _iceParameters });
				}

				store.dispatch(requestActions.notify({
					text: 'ICE restarted'
				}));
			} catch (error) {
				logger.error('restartIce() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'ICE restart failed: ' + error
				}));
			}

			store.dispatch(stateActions.setRestartIceInProgress(false));
		}
	}, {
		key: 'setMaxSendingSpatialLayer',
		value: async function setMaxSendingSpatialLayer(spatialLayer) {
			logger.debug('setMaxSendingSpatialLayer() [spatialLayer:%s]', spatialLayer);

			try {
				await this._webcamProducer.setMaxSpatialLayer(spatialLayer);
			} catch (error) {
				logger.error('setMaxSendingSpatialLayer() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error setting max sending video spatial layer: ' + error
				}));
			}
		}
	}, {
		key: 'setConsumerPreferredLayers',
		value: async function setConsumerPreferredLayers(consumerId, spatialLayer, temporalLayer) {
			logger.debug('setConsumerPreferredLayers() [consumerId:%s, spatialLayer:%s, temporalLayer:%s]', consumerId, spatialLayer, temporalLayer);

			try {
				await this._protoo.request('setConsumerPreferedLayers', { consumerId: consumerId, spatialLayer: spatialLayer, temporalLayer: temporalLayer });

				store.dispatch(stateActions.setConsumerPreferredLayers(consumerId, spatialLayer, temporalLayer));
			} catch (error) {
				logger.error('setConsumerPreferredLayers() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error setting Consumer preferred layers: ' + error
				}));
			}
		}
	}, {
		key: 'requestConsumerKeyFrame',
		value: async function requestConsumerKeyFrame(consumerId) {
			logger.debug('requestConsumerKeyFrame() [consumerId:%s]', consumerId);

			try {
				await this._protoo.request('requestConsumerKeyFrame', { consumerId: consumerId });

				store.dispatch(requestActions.notify({
					text: 'Keyframe requested for video consumer'
				}));
			} catch (error) {
				logger.error('requestConsumerKeyFrame() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error requesting key frame for Consumer: ' + error
				}));
			}
		}
	}, {
		key: 'changeDisplayName',
		value: async function changeDisplayName(displayName) {
			logger.debug('changeDisplayName() [displayName:"%s"]', displayName);

			try {
				await this._protoo.request('changeDisplayName', { displayName: displayName });

				this._displayName = displayName;

				store.dispatch(stateActions.setDisplayName(displayName));

				store.dispatch(requestActions.notify({
					text: 'Display name changed'
				}));
			} catch (error) {
				logger.error('changeDisplayName() | failed: %o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Could not change display name: ' + error
				}));

				// We need to refresh the component for it to render the previous
				// displayName again.
				store.dispatch(stateActions.setDisplayName());
			}
		}
	}, {
		key: 'getSendTransportRemoteStats',
		value: async function getSendTransportRemoteStats() {
			logger.debug('getSendTransportRemoteStats()');

			if (!this._sendTransport) return;

			return this._protoo.request('getTransportStats', { transportId: this._sendTransport.id });
		}
	}, {
		key: 'getRecvTransportRemoteStats',
		value: async function getRecvTransportRemoteStats() {
			logger.debug('getRecvTransportRemoteStats()');

			if (!this._recvTransport) return;

			return this._protoo.request('getTransportStats', { transportId: this._recvTransport.id });
		}
	}, {
		key: 'getMicRemoteStats',
		value: async function getMicRemoteStats() {
			logger.debug('getMicRemoteStats()');

			if (!this._micProducer) return;

			return this._protoo.request('getProducerStats', { producerId: this._micProducer.id });
		}
	}, {
		key: 'getWebcamRemoteStats',
		value: async function getWebcamRemoteStats() {
			logger.debug('getWebcamRemoteStats()');

			if (!this._webcamProducer) return;

			return this._protoo.request('getProducerStats', { producerId: this._webcamProducer.id });
		}
	}, {
		key: 'getConsumerRemoteStats',
		value: async function getConsumerRemoteStats(consumerId) {
			logger.debug('getConsumerRemoteStats()');

			var consumer = this._consumers.get(consumerId);

			if (!consumer) return;

			return this._protoo.request('getConsumerStats', { consumerId: consumerId });
		}
	}, {
		key: 'getSendTransportLocalStats',
		value: async function getSendTransportLocalStats() {
			logger.debug('getSendTransportLocalStats()');

			if (!this._sendTransport) return;

			return this._sendTransport.getStats();
		}
	}, {
		key: 'getRecvTransportLocalStats',
		value: async function getRecvTransportLocalStats() {
			logger.debug('getRecvTransportLocalStats()');

			if (!this._recvTransport) return;

			return this._recvTransport.getStats();
		}
	}, {
		key: 'getMicLocalStats',
		value: async function getMicLocalStats() {
			logger.debug('getMicLocalStats()');

			if (!this._micProducer) return;

			return this._micProducer.getStats();
		}
	}, {
		key: 'getWebcamLocalStats',
		value: async function getWebcamLocalStats() {
			logger.debug('getWebcamLocalStats()');

			if (!this._webcamProducer) return;

			return this._webcamProducer.getStats();
		}
	}, {
		key: 'getConsumerLocalStats',
		value: async function getConsumerLocalStats(consumerId) {
			var consumer = this._consumers.get(consumerId);

			if (!consumer) return;

			return consumer.getStats();
		}
	}, {
		key: 'applyNetworkThrottle',
		value: async function applyNetworkThrottle(_ref2) {
			var uplink = _ref2.uplink,
			    downlink = _ref2.downlink,
			    rtt = _ref2.rtt,
			    secret = _ref2.secret;

			logger.debug('applyNetworkThrottle() [uplink:%s, downlink:%s, rtt:%s]', uplink, downlink, rtt);

			try {
				await this._protoo.request('applyNetworkThrottle', { uplink: uplink, downlink: downlink, rtt: rtt, secret: secret });
			} catch (error) {
				logger.error('applyNetworkThrottle() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error applying network throttle: ' + error
				}));
			}
		}
	}, {
		key: 'resetNetworkThrottle',
		value: async function resetNetworkThrottle(_ref3) {
			var _ref3$silent = _ref3.silent,
			    silent = _ref3$silent === undefined ? false : _ref3$silent,
			    secret = _ref3.secret;

			logger.debug('resetNetworkThrottle()');

			try {
				await this._protoo.request('resetNetworkThrottle', { secret: secret });
			} catch (error) {
				if (!silent) {
					logger.error('resetNetworkThrottle() | failed:%o', error);

					store.dispatch(requestActions.notify({
						type: 'error',
						text: 'Error resetting network throttle: ' + error
					}));
				}
			}
		}
	}, {
		key: '_joinRoom',
		value: async function _joinRoom() {
			var _this4 = this;

			logger.debug('_joinRoom()');

			// try
			// {
			this._mediasoupDevice = new mediasoupClient.Device();

			var routerRtpCapabilities = await this._protoo.request('getRouterRtpCapabilities');

			await this._mediasoupDevice.load({ routerRtpCapabilities: routerRtpCapabilities });

			// NOTE: Stuff to play remote audios due to browsers' new autoplay policy.
			//
			// Just get access to the mic and DO NOT close the mic track for a while.
			// Super hack!
			{
				var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				var audioTrack = stream.getAudioTracks()[0];

				audioTrack.enabled = false;

				setTimeout(function () {
					return audioTrack.stop();
				}, 120000);
			}

			// Create mediasoup Transport for sending (unless we don't want to produce).
			if (this._produce) {
				var transportInfo = await this._protoo.request('createWebRtcTransport', {
					forceTcp: this._forceTcp,
					producing: true,
					consuming: false
				});

				var id = transportInfo.id,
				    iceParameters = transportInfo.iceParameters,
				    iceCandidates = transportInfo.iceCandidates,
				    dtlsParameters = transportInfo.dtlsParameters;


				this._sendTransport = this._mediasoupDevice.createSendTransport({
					id: id,
					iceParameters: iceParameters,
					iceCandidates: iceCandidates,
					dtlsParameters: dtlsParameters
				});

				this._sendTransport.on('connect', function (_ref4, callback, errback) // eslint-disable-line no-shadow
				{
					var dtlsParameters = _ref4.dtlsParameters;

					_this4._protoo.request('connectWebRtcTransport', {
						transportId: _this4._sendTransport.id,
						dtlsParameters: dtlsParameters
					}).then(callback).catch(errback);
				});

				this._sendTransport.on('produce', async function (_ref5, callback, errback) {
					var kind = _ref5.kind,
					    rtpParameters = _ref5.rtpParameters,
					    appData = _ref5.appData;

					try {
						// eslint-disable-next-line no-shadow
						var _ref6 = await _this4._protoo.request('produce', {
							transportId: _this4._sendTransport.id,
							kind: kind,
							rtpParameters: rtpParameters,
							appData: appData
						}),
						    _id = _ref6.id;

						callback({ id: _id });
					} catch (error) {
						errback(error);
					}
				});
			}

			// Create mediasoup Transport for sending (unless we don't want to consume).
			if (this._consume) {
				var _transportInfo = await this._protoo.request('createWebRtcTransport', {
					forceTcp: this._forceTcp,
					producing: false,
					consuming: true
				});

				var _id2 = _transportInfo.id,
				    _iceParameters2 = _transportInfo.iceParameters,
				    _iceCandidates = _transportInfo.iceCandidates,
				    _dtlsParameters = _transportInfo.dtlsParameters;


				this._recvTransport = this._mediasoupDevice.createRecvTransport({
					id: _id2,
					iceParameters: _iceParameters2,
					iceCandidates: _iceCandidates,
					dtlsParameters: _dtlsParameters
				});

				this._recvTransport.on('connect', function (_ref7, callback, errback) // eslint-disable-line no-shadow
				{
					var dtlsParameters = _ref7.dtlsParameters;

					_this4._protoo.request('connectWebRtcTransport', {
						transportId: _this4._recvTransport.id,
						dtlsParameters: dtlsParameters
					}).then(callback).catch(errback);
				});
			}

			// Join now into the room.
			// NOTE: Don't send our RTP capabilities if we don't want to consume.

			var _ref8 = await this._protoo.request('join', {
				displayName: this._displayName,
				device: this._device,
				rtpCapabilities: this._consume ? this._mediasoupDevice.rtpCapabilities : undefined
			}),
			    peers = _ref8.peers;

			store.dispatch(stateActions.setRoomState('connected'));

			// Clean all the existing notifcations.
			store.dispatch(stateActions.removeAllNotifications());

			store.dispatch(requestActions.notify({
				text: 'You are in the room!',
				timeout: 3000
			}));

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = (0, _getIterator3.default)(peers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var peer = _step3.value;

					store.dispatch(stateActions.addPeer((0, _extends3.default)({}, peer, { consumers: [] })));
				}

				// Enable mic/webcam.
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

			if (this._produce) {
				// Set our media capabilities.
				store.dispatch(stateActions.setMediaCapabilities({
					canSendMic: this._mediasoupDevice.canProduce('audio'),
					canSendWebcam: this._mediasoupDevice.canProduce('video')
				}));

				this.enableMic();

				// if (this._externalVideo)
				this.enableWebcam();
			}
			// }
			// catch (error)
			// {
			// 	logger.error('_joinRoom() failed:%o', error);

			// 	store.dispatch(requestActions.notify(
			// 		{
			// 			type : 'error',
			// 			text : `Could not join the room: ${error}`
			// 		}));

			// 	// this.close();
			// }
		}
	}, {
		key: '_updateWebcams',
		value: async function _updateWebcams() {
			logger.debug('_updateWebcams()');

			// Reset the list.
			this._webcams = new _map2.default();

			logger.debug('_updateWebcams() | calling enumerateDevices()');

			var devices = await navigator.mediaDevices.enumerateDevices();

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = (0, _getIterator3.default)(devices), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var device = _step4.value;

					if (device.kind !== 'videoinput') continue;

					this._webcams.set(device.deviceId, device);
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

			var array = (0, _from2.default)(this._webcams.values());
			var len = array.length;
			var currentWebcamId = this._webcam.device ? this._webcam.device.deviceId : undefined;

			logger.debug('_updateWebcams() [webcams:%o]', array);

			if (len === 0) this._webcam.device = null;else if (!this._webcams.has(currentWebcamId)) this._webcam.device = array[0];

			store.dispatch(stateActions.setCanChangeWebcam(this._webcams.size > 1));
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
		key: '_pauseConsumer',
		value: async function _pauseConsumer(consumer) {
			if (consumer.paused) return;

			try {
				await this._protoo.request('pauseConsumer', { consumerId: consumer.id });

				consumer.pause();

				store.dispatch(stateActions.setConsumerPaused(consumer.id, 'local'));
			} catch (error) {
				logger.error('_pauseConsumer() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error pausing Consumer: ' + error
				}));
			}
		}
	}, {
		key: '_resumeConsumer',
		value: async function _resumeConsumer(consumer) {
			if (!consumer.paused) return;

			try {
				await this._protoo.request('resumeConsumer', { consumerId: consumer.id });

				consumer.resume();

				store.dispatch(stateActions.setConsumerResumed(consumer.id, 'local'));
			} catch (error) {
				logger.error('_resumeConsumer() | failed:%o', error);

				store.dispatch(requestActions.notify({
					type: 'error',
					text: 'Error resuming Consumer: ' + error
				}));
			}
		}
	}, {
		key: '_getExternalVideoStream',
		value: async function _getExternalVideoStream() {
			var _this5 = this;

			if (this._externalVideoStream) return this._externalVideoStream;

			if (this._externalVideo.readyState < 3) {
				await new _promise2.default(function (resolve) {
					return _this5._externalVideo.addEventListener('canplay', resolve);
				});
			}

			if (this._externalVideo.captureStream) this._externalVideoStream = this._externalVideo.captureStream();else if (this._externalVideo.mozCaptureStream) this._externalVideoStream = this._externalVideo.mozCaptureStream();else throw new Error('video.captureStream() not supported');

			return this._externalVideoStream;
		}
	}]);
	return RoomClient;
}();

exports.default = RoomClient;