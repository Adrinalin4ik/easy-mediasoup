const initialState = {};

const producers = (state = initialState, action) =>
{
	switch (action.type)
	{
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
			
			delete newState[producerId];
			global.emitter.emit("REMOVE_PRODUCER", producer)
			return newState;
		}

		case 'SET_PRODUCER_PAUSED':
		{
			const { producerId, originator } = action.payload;
			const producer = state[producerId];
			let newProducer;

			if (originator === 'local')
				newProducer = { ...producer, locallyPaused: true };
			else
				newProducer = { ...producer, remotelyPaused: true };

			global.emitter.emit("SET_PRODUCER_PAUSED", newProducer)
			return { ...state, [producerId]: newProducer };
		}

		case 'SET_PRODUCER_RESUMED':
		{
			const { producerId, originator } = action.payload;
			const producer = state[producerId];
			let newProducer;

			if (originator === 'local')
				newProducer = { ...producer, locallyPaused: false };
			else
				newProducer = { ...producer, remotelyPaused: false };

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

		default:
			return state;
	}
};

export default producers;
