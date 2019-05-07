// import {
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


import UrlParse from 'url-parse';
import {
	applyMiddleware as applyReduxMiddleware,
	createStore as createReduxStore
} from 'redux';
import thunk from 'redux-thunk';
// import { createLogger as createReduxLogger } from 'redux-logger';
import randomString from 'random-string';
import * as faceapi from 'face-api.js';
import Logger from './Logger';
import deviceInfo from './deviceInfo';
import RoomClient from './RoomClient';
import * as stateActions from './redux/stateActions';
import reducers from './redux/reducers';
import * as emitter from  "wildemitter"

export class Init {
	constructor(config) {
		console.warn('Easy mediasoup v1.2.3')
		global.emitter = this.emitter = new emitter.default()
		const logger = new Logger();
		const reduxMiddlewares = [ thunk ];
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

		let roomClient;
		const store = createReduxStore(
			reducers,
			undefined,
			applyReduxMiddleware(...reduxMiddlewares)
		);

		this.store = window.STORE = store
		RoomClient.init({ store });

		

		const run = async () =>
		{
			logger.debug('run() [environment:%s]', process.env.NODE_ENV);

			const args = []

			args.video_constrains = config.video_constrains || []
			args.simulcast_options = config.simulcast_options || []
			args.initially_muted = config.initially_muted || false
			args.skip_consumer = config.skip_consumer
			args.user_uuid = config.user_uuid
			args.turnservers = config.turnservers || []
			args.media_server_wss = config.media_server_wss 

			const peerId = config.peerName;
			let roomId = config.roomId;
			let displayName = config.displayName;
			const useSimulcast = config.useSimulcast || false;
			const forceTcp = config.forceTcp || false;
			const produce = config.produce || true;
			const consume = config.consume || true;
			const forceH264 = config.forceH264 || false;
			const info = config.info || true;
			const faceDetection = config.faceDetection || true;
			const externalVideo = config.externalVideo || false;
			const throttleSecret = config.throttleSecret || false;

			// Enable face detection on demand.
			if (faceDetection)
				await faceapi.loadTinyFaceDetectorModel('/resources/face-detector-models');

			if (info)
				window.SHOW_INFO = true;

			if (throttleSecret)
				window.NETWORK_THROTTLE_SECRET = throttleSecret;

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
					case 'produce':
					case 'consume':
						break;
					default:
						delete roomUrlParser.query[key];
				}
			}
			delete roomUrlParser.hash;

			const roomUrl = roomUrlParser.toString();

			let displayNameSet;

			// If displayName was provided via URL or Cookie, we are done.
			if (displayName)
			{
				displayNameSet = true;
			}
			// Otherwise pick a random name and mark as "not set".
			else
			{
				displayNameSet = false;
				displayName = "test"
			}

			// Get current device info.
			const device = deviceInfo();

			store.dispatch(
				stateActions.setRoomUrl(roomUrl));

			store.dispatch(
				stateActions.setRoomFaceDetection(faceDetection));

			store.dispatch(
				stateActions.setMe({ peerId, displayName, displayNameSet, device }));

			roomClient = new RoomClient(
				{
					roomId,
					peerId,
					displayName,
					device,
					useSimulcast,
					forceTcp,
					produce,
					consume,
					forceH264,
					externalVideo,
					args
				});
			await roomClient.join()
			this.client = roomClient;
			// NOTE: For debugging.
			// window.CLIENT = roomClient;
			// window.CC = roomClient;
			
		}

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
	}
};