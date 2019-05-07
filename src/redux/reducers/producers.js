const initialState = {};

const producers = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'SET_ROOM_STATE':
		{
			const roomState = action.payload.state;

			if (roomState === 'closed')
				return {};
			else
				return state;
		}

		case 'ADD_PRODUCER':
		{
			const { producer } = action.payload;
			global.emitter.emit("ADD_PRODUCER", producer)
			return { ...state, [producer.id]: producer };
		}

		case 'REMOVE_PRODUCER':
		{
			const { producerId } = action.payload;
			const newState = { ...state };
			global.emitter.emit("REMOVE_PRODUCER", producer)
			delete newState[producerId];

			return newState;
		}

		case 'SET_PRODUCER_PAUSED':
		{
			const { producerId } = action.payload;
			const producer = state[producerId];
			const newProducer = { ...producer, paused: true };
			global.emitter.emit("SET_PRODUCER_PAUSED", newProducer)
			return { ...state, [producerId]: newProducer };
		}

		case 'SET_PRODUCER_RESUMED':
		{
			const { producerId } = action.payload;
			const producer = state[producerId];
			const newProducer = { ...producer, paused: false };
			global.emitter.emit("SET_PRODUCER_RESUMED", newProducer)
			return { ...state, [producerId]: newProducer };
		}

		case 'SET_PRODUCER_TRACK':
		{
			const { producerId, track } = action.payload;
			const producer = state[producerId];
			const newProducer = { ...producer, track };
			global.emitter.emit("SET_PRODUCER_TRACK", newProducer)
			return { ...state, [producerId]: newProducer };
		}

		case 'SET_PRODUCER_SCORE':
		{
			const { producerId, score } = action.payload;
			const producer = state[producerId];

			if (!producer)
				return state;

			const newProducer = { ...producer, score };

			return { ...state, [producerId]: newProducer };
		}

		default:
		{
			return state;
		}
	}
};

export default producers;
