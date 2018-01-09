const initialState =
{
	url               : null,
	state             : 'new', // new/connecting/connected/disconnected/closed,
	activeSpeakerName : null
};

const room = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'SET_ROOM_URL':
		{
			const { url } = action.payload;

			return { ...state, url };
		}

		case 'SET_ROOM_STATE':
		{
			const roomState = action.payload.state;
			global.emitter.emit("SET_ROOM_STATE", roomState)
			if (roomState == 'connected')
				return { ...state, state: roomState };
			else
				return { ...state, state: roomState, activeSpeakerName: null };
		}

		case 'SET_ROOM_ACTIVE_SPEAKER':
		{
			const { peerName } = action.payload;
			global.emitter.emit("SET_ROOM_ACTIVE_SPEAKER", peerName)
			return { ...state, activeSpeakerName: peerName };
		}

		default:
			return state;
	}
};

export default room;
