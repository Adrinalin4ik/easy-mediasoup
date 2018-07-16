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

	console.warn('Easy mediasoup v1.1.9');
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
	args.produce = config.produce;
	args.skip_consumer = config.skip_consumer;
	args.user_uuid = config.user_uuid;

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