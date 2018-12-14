// import domready from 'domready';
// import UrlParse from 'url-parse';
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
// import randomString from 'random-string';
// import randomName from 'node-random-name';
import Logger from './Logger';
import * as utils from './utils';
// import * as cookiesManager from './cookiesManager';
import * as requestActions from './redux/requestActions';
import * as stateActions from './redux/stateActions';
import reducers from './redux/reducers';
import roomClientMiddleware from './redux/roomClientMiddleware';
import * as emitter from  "wildemitter"
// import Room from './components/Room';

export class Init{
	constructor(config){
		console.warn('Easy mediasoup v1.1.10')
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
		const peerName = config.peerName

		let roomId = config.roomId;
		const produce = config.produce || true;
		let displayName = config.displayName;
		const isSipEndpoint = config.sipEndpoint || false;
		const useSimulcast = config.useSimulcast || false;
		const media_server_wss = config.media_server_wss
		const turnservers = config.turnservers || []
		const args = []

		args.video_constrains = config.video_constrains || []
		args.simulcast_options = config.simulcast_options || []
		args.initially_muted = config.initially_muted || false
    args.produce = config.produce
    args.skip_consumer = config.skip_consumer
		args.user_uuid = config.user_uuid


		let displayNameSet;

		if (displayName)
		{
			displayNameSet = true;
		}
		else
		{
			displayName = ""
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
			stateActions.setMe({ peerName, displayName, displayNameSet, device }));

		// NOTE: I don't like this.
		store.dispatch(
			requestActions.joinRoom(
				{ media_server_wss, roomId, peerName, displayName, device, useSimulcast, produce, turnservers, args }));

	}

}
