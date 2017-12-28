import RoomClient from '../RoomClient';

export default ({ dispatch, getState }) => (next) =>
{
	let client;
	return (action) =>
	{
		switch (action.type)
		{
			case 'JOIN_ROOM':
			{	
				const {
					media_server_wss,
					roomId,
					peerName,
					displayName,
					device,
					useSimulcast,
					produce,
					turnservers
				} = action.payload;

				client = new RoomClient(
					{
						media_server_wss,
						roomId,
						peerName,
						displayName,
						device,
						useSimulcast,
						produce,
						dispatch,
						getState,
						turnservers
					});

				// TODO: TMP
				global.CLIENT = client;
				global.emitter.emit("joinRoom", client)
				break;
			}

			case 'LEAVE_ROOM':
			{
				client.close();
				global.emitter.emit("leaveRoom", client)
				break;
			}

			case 'CHANGE_DISPLAY_NAME':
			{
				const { displayName } = action.payload;

				client.changeDisplayName(displayName);
				global.emitter.emit("changeDisplayName", client)
				break;
			}

			case 'MUTE_MIC':
			{
				client.muteMic();
				global.emitter.emit("muteMic", client)
				break;
			}

			case 'UNMUTE_MIC':
			{
				client.unmuteMic();
				global.emitter.emit("unmuteMic", client)
				break;
			}

			case 'ENABLE_WEBCAM':
			{
				client.enableWebcam();
				global.emitter.emit("enableWebcam", client)
				break;
			}

			case 'DISABLE_WEBCAM':
			{
				client.disableWebcam();
				global.emitter.emit("disableWebcam", client)
				break;
			}

			case 'CHANGE_WEBCAM':
			{
				client.changeWebcam();
				global.emitter.emit("changeWebcam", client)
				break;
			}

			case 'ENABLE_AUDIO_ONLY':
			{
				client.enableAudioOnly();
				global.emitter.emit("enableAudioOnly", client)
				break;
			}

			case 'DISABLE_AUDIO_ONLY':
			{
				client.disableAudioOnly();
				global.emitter.emit("disableAudioOnly", client)
				break;
			}

			case 'RESTART_ICE':
			{
				client.restartIce();
				global.emitter.emit("restartIce", client)
				break;
			}
		}

		return next(action);
	};
};
