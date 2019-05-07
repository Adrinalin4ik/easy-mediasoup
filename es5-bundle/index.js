'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Init = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _randomString = require('random-string');

var _randomString2 = _interopRequireDefault(_randomString);

var _faceApi = require('face-api.js');

var faceapi = _interopRequireWildcard(_faceApi);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _deviceInfo = require('./deviceInfo');

var _deviceInfo2 = _interopRequireDefault(_deviceInfo);

var _RoomClient = require('./RoomClient');

var _RoomClient2 = _interopRequireDefault(_RoomClient);

var _stateActions = require('./redux/stateActions');

var stateActions = _interopRequireWildcard(_stateActions);

var _reducers = require('./redux/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _wildemitter = require('wildemitter');

var emitter = _interopRequireWildcard(_wildemitter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { createLogger as createReduxLogger } from 'redux-logger';
var Init = exports.Init = function Init(config) {
	var _this = this;

	(0, _classCallCheck3.default)(this, Init);

	console.warn('Easy mediasoup v1.2.3');
	global.emitter = this.emitter = new emitter.default();
	var logger = new _Logger2.default();
	var reduxMiddlewares = [_reduxThunk2.default];
	// if (process.env.NODE_ENV === 'development')
	// {
	// 	const reduxLogger = createReduxLogger(
	// 		{
	// 			duration  : true,
	// 			timestamp : false,
	// 			level     : 'log',
	// 			logErrors : true
	// 		});

	// 	reduxMiddlewares.push(reduxLogger);
	// }

	var roomClient = void 0;
	var store = (0, _redux.createStore)(_reducers2.default, undefined, _redux.applyMiddleware.apply(undefined, reduxMiddlewares));

	this.store = window.STORE = store;
	_RoomClient2.default.init({ store: store });

	var run = async function run() {
		logger.debug('run() [environment:%s]', process.env.NODE_ENV);

		var args = [];

		args.video_constrains = config.video_constrains || [];
		args.simulcast_options = config.simulcast_options || [];
		args.initially_muted = config.initially_muted || false;
		args.skip_consumer = config.skip_consumer;
		args.user_uuid = config.user_uuid;
		args.turnservers = config.turnservers || [];
		args.media_server_wss = config.media_server_wss;

		var peerId = config.peerName;
		var roomId = config.roomId;
		var displayName = config.displayName;
		var useSimulcast = config.useSimulcast || false;
		var forceTcp = config.forceTcp || false;
		var produce = config.produce || true;
		var consume = config.consume || true;
		var forceH264 = config.forceH264 || false;
		var info = config.info || true;
		var faceDetection = config.faceDetection || true;
		var externalVideo = config.externalVideo || false;
		var throttleSecret = config.throttleSecret || false;

		// Enable face detection on demand.
		if (faceDetection) await faceapi.loadTinyFaceDetectorModel('/resources/face-detector-models');

		if (info) window.SHOW_INFO = true;

		if (throttleSecret) window.NETWORK_THROTTLE_SECRET = throttleSecret;

		if (!roomId) {
			roomId = (0, _randomString2.default)({ length: 8 }).toLowerCase();

			urlParser.query.roomId = roomId;
			window.history.pushState('', '', urlParser.toString());
		}

		// Get the effective/shareable Room URL.
		var roomUrlParser = new _urlParse2.default(window.location.href, true);

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(roomUrlParser.query)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var key = _step.value;

				// Don't keep some custom params.
				switch (key) {
					case 'roomId':
					case 'simulcast':
					case 'produce':
					case 'consume':
						break;
					default:
						delete roomUrlParser.query[key];
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

		delete roomUrlParser.hash;

		var roomUrl = roomUrlParser.toString();

		var displayNameSet = void 0;

		// If displayName was provided via URL or Cookie, we are done.
		if (displayName) {
			displayNameSet = true;
		}
		// Otherwise pick a random name and mark as "not set".
		else {
				displayNameSet = false;
				displayName = "test";
			}

		// Get current device info.
		var device = (0, _deviceInfo2.default)();

		store.dispatch(stateActions.setRoomUrl(roomUrl));

		store.dispatch(stateActions.setRoomFaceDetection(faceDetection));

		store.dispatch(stateActions.setMe({ peerId: peerId, displayName: displayName, displayNameSet: displayNameSet, device: device }));

		roomClient = new _RoomClient2.default({
			roomId: roomId,
			peerId: peerId,
			displayName: displayName,
			device: device,
			useSimulcast: useSimulcast,
			forceTcp: forceTcp,
			produce: produce,
			consume: consume,
			forceH264: forceH264,
			externalVideo: externalVideo,
			args: args
		});
		await roomClient.join();
		_this.client = roomClient;
		// NOTE: For debugging.
		// window.CLIENT = roomClient;
		// window.CC = roomClient;
	};

	run();

	// NOTE: Debugging stuff.

	// window.__sendSdps = function()
	// {
	// 	logger.warn('>>> send transport local SDP offer:');
	// 	logger.warn(
	// 		roomClient._sendTransport._handler._pc.localDescription.sdp);

	// 	logger.warn('>>> send transport remote SDP answer:');
	// 	logger.warn(
	// 		roomClient._sendTransport._handler._pc.remoteDescription.sdp);
	// };

	// window.__recvSdps = function()
	// {
	// 	logger.warn('>>> recv transport remote SDP offer:');
	// 	logger.warn(
	// 		roomClient._recvTransport._handler._pc.remoteDescription.sdp);

	// 	logger.warn('>>> recv transport local SDP answer:');
	// 	logger.warn(
	// 		roomClient._recvTransport._handler._pc.localDescription.sdp);
	// };

	// setInterval(() =>
	// {
	// 	if (window.CLIENT._sendTransport)
	// 		window.PC1 = window.CLIENT._sendTransport._handler._pc;
	// 	else
	// 		delete window.PC1;

	// 	if (window.CLIENT._recvTransport)
	// 		window.PC2 = window.CLIENT._recvTransport._handler._pc;
	// 	else
	// 		delete window.PC2;
	// }, 2000);
}; // import {
// 	applyMiddleware as applyReduxMiddleware,
// 	createStore as createReduxStore
// } from 'redux';
// import thunk from 'redux-thunk';
// import { createLogger as createReduxLogger } from 'redux-logger';
// import { getDeviceInfo } from 'mediasoup-client';

// import Logger from './Logger';
// import * as requestActions from './redux/requestActions';
// import * as stateActions from './redux/stateActions';
// import reducers from './redux/reducers';
// import roomClientMiddleware from './redux/roomClientMiddleware';
// import * as emitter from  "wildemitter"


// export class Init{
// 	constructor(config){
// 		console.warn('Easy mediasoup v1.2.3')
// 		global.emitter = this.emitter = new emitter.default()
// 		this.roomClientMiddleware = roomClientMiddleware
// 		const logger = new Logger();

// 		this.emitter.on("joinRoom",(client)=>{
// 	        this.client = client
// 	    })

// 	    //settingup redux
// 		const reduxMiddlewares =
// 		[
// 			thunk,
// 			roomClientMiddleware
// 		];


// 		if (process.env.NODE_ENV === 'development')
// 		{
// 			const reduxLogger = createReduxLogger(
// 				{
// 					duration  : true,
// 					timestamp : false,
// 					level     : 'log',
// 					logErrors : true
// 				});

// 			reduxMiddlewares.push(reduxLogger);
// 		}


// 		const store = this.store = createReduxStore(
// 			reducers,
// 			undefined,
// 			applyReduxMiddleware(...reduxMiddlewares)
// 		);
// 		//room settings
// 		const peerName = config.peerName

// 		let roomId = config.roomId;
// 		const produce = config.produce || true;
// 		let displayName = config.displayName;
// 		const isSipEndpoint = config.sipEndpoint || false;
// 		const useSimulcast = config.useSimulcast || false;
// 		const media_server_wss = config.media_server_wss
// 		const turnservers = config.turnservers || []
// 		const args = []

// 		args.video_constrains = config.video_constrains || []
// 		args.simulcast_options = config.simulcast_options || []
// 		args.initially_muted = config.initially_muted || false
//     args.produce = config.produce
//     args.skip_consumer = config.skip_consumer
// 		args.user_uuid = config.user_uuid


// 		let displayNameSet;

// 		if (displayName)
// 		{
// 			displayNameSet = true;
// 		}
// 		else
// 		{
// 			displayName = ""
// 			displayNameSet = false;
// 		}

// 		// Get current device.
// 		const device = getDeviceInfo();

// 		// If a SIP endpoint mangle device info.
// 		if (isSipEndpoint)
// 		{
// 			device.flag = 'sipendpoint';
// 			device.name = 'SIP Endpoint';
// 			device.version = undefined;
// 		}


// 		// NOTE: I don't like this.
// 		store.dispatch(
// 			stateActions.setMe({ peerName, displayName, displayNameSet, device }));

// 		// NOTE: I don't like this.
// 		store.dispatch(
// 			requestActions.joinRoom(
// 				{ media_server_wss, roomId, peerName, displayName, device, useSimulcast, produce, turnservers, args }));

// 	}

// }


;