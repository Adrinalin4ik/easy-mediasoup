const initialState = {};

const consumers = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'ADD_CONSUMER':
		{
			const { consumer } = action.payload;
			global.emitter.emit("ADD_CONSUMER", action.payload)
			return { ...state, [consumer.id]: consumer };
		}

		case 'REMOVE_CONSUMER':
		{
			const { consumerId } = action.payload;
			const newState = { ...state };

			delete newState[consumerId];
			global.emitter.emit("REMOVE_CONSUMER", action.payload)
			return newState;
		}

		case 'SET_CONSUMER_PAUSED':
		{
			const { consumerId, originator } = action.payload;
			const consumer = state[consumerId];
			let newConsumer;

			if (originator === 'local')
				newConsumer = { ...consumer, locallyPaused: true };
			else
				newConsumer = { ...consumer, remotelyPaused: true };

			global.emitter.emit("SET_CONSUMER_PAUSED", action.payload)
			return { ...state, [consumerId]: newConsumer };
		}

		case 'SET_CONSUMER_RESUMED':
		{
			const { consumerId, originator } = action.payload;
			const consumer = state[consumerId];
			let newConsumer;

			if (originator === 'local')
				newConsumer = { ...consumer, locallyPaused: false };
			else
				newConsumer = { ...consumer, remotelyPaused: false };

			global.emitter.emit("SET_CONSUMER_RESUMED", action.payload)
			return { ...state, [consumerId]: newConsumer };
		}

		case 'SET_CONSUMER_EFFECTIVE_PROFILE':
		{
			const { consumerId, profile } = action.payload;
			const consumer = state[consumerId];
			const newConsumer = { ...consumer, profile };


			global.emitter.emit("SET_CONSUMER_EFFECTIVE_PROFILE", newConsumer)
			return { ...state, [consumerId]: newConsumer };
		}

		case 'SET_CONSUMER_TRACK':
		{
			const { consumerId, track } = action.payload;
			const consumer = state[consumerId];
			const newConsumer = { ...consumer, track };

			global.emitter.emit("SET_CONSUMER_TRACK", newConsumer)
			return { ...state, [consumerId]: newConsumer };
		}

		default:
			return state;
	}
};

export default consumers;
