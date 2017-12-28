// import domready from 'domready';
import UrlParse from 'url-parse';
// import React from 'react';
// import { render } from 'react-dom';
// import { Provider } from 'react-redux';
import {
	applyMiddleware as applyReduxMiddleware,
	createStore as createReduxStore
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger as createReduxLogger } from 'redux-logger';
import { getDeviceInfo } from 'mediasoup-client';
import randomString from 'random-string';
import randomName from 'node-random-name';
import Logger from './Logger';
import * as utils from './utils';
import * as cookiesManager from './cookiesManager';
import * as requestActions from './redux/requestActions';
import * as stateActions from './redux/stateActions';
import reducers from './redux/reducers';
import roomClientMiddleware from './redux/roomClientMiddleware';
import * as _ from "lodash"
import * as emitter from  "wildemitter"
// import Room from './components/Room';

export class Init{
	constructor(config){
		global.emitter = this.emitter = new emitter.default()
		this.roomClientMiddleware = roomClientMiddleware
		const logger = new Logger();

		this.emitter.on("joinRoom",(client)=>{
	        this.client = client
	    })

	    //settingup redux
		const reduxMiddlewares =
		[
			thunk,
			roomClientMiddleware
		];

		

		if (process.env.NODE_ENV === 'development')
		{
			const reduxLogger = createReduxLogger(
				{
					duration  : true,
					timestamp : false,
					level     : 'log',
					logErrors : true
				});

			reduxMiddlewares.push(reduxLogger);
		}


		const store = this.store = createReduxStore(
			reducers,
			undefined,
			applyReduxMiddleware(...reduxMiddlewares)
		);
		//room settings
		const peerName = config.peerName || randomString({ length: 8 }).toLowerCase();
		const urlParser = new UrlParse(window.location.href, true);
		let roomId = config.roomId;
		const produce = config.produce !== 'false';
		let displayName = config.displayName;
		const isSipEndpoint = config.sipEndpoint === 'true';
		const useSimulcast = config.simulcast !== 'false';
		const media_server_wss = config.media_server_wss
		const turnservers = config.turnservers || []


		if (!roomId)
		{
			roomId = randomString({ length: 8 }).toLowerCase();

			urlParser.query.roomId = roomId;
			window.history.pushState('', '', urlParser.toString());
		}

		// Get the effective/shareable Room URL.
		const roomUrlParser = new UrlParse(window.location.href, true);

		for (const key of Object.keys(roomUrlParser.query))
		{
			// Don't keep some custom params.
			switch (key)
			{
				case 'roomId':
				case 'simulcast':
					break;
				default:
					delete roomUrlParser.query[key];
			}
		}
		delete roomUrlParser.hash;

		const roomUrl = roomUrlParser.toString();

		// Get displayName from cookie (if not already given as param).
		const userCookie = cookiesManager.getUser() || {};
		let displayNameSet;

		if (!displayName)
			displayName = userCookie.displayName;

		if (displayName)
		{
			displayNameSet = true;
		}
		else
		{
			displayName = randomName();
			displayNameSet = false;
		}

		// Get current device.
		const device = getDeviceInfo();

		// If a SIP endpoint mangle device info.
		if (isSipEndpoint)
		{
			device.flag = 'sipendpoint';
			device.name = 'SIP Endpoint';
			device.version = undefined;
		}

		// NOTE: I don't like this.
		store.dispatch(
			stateActions.setRoomUrl(roomUrl));

		// NOTE: I don't like this.
		store.dispatch(
			stateActions.setMe({ peerName, displayName, displayNameSet, device }));

		// NOTE: I don't like this.
		store.dispatch(
			requestActions.joinRoom(
				{ media_server_wss, roomId, peerName, displayName, device, useSimulcast, produce, turnservers }));

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
	}

}
