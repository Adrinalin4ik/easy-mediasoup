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
						    turnservers = _action$payload.turnservers;


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
							turnservers: turnservers
						});

						// TODO: TMP
						global.CLIENT = client;
						console.log("HERE");
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