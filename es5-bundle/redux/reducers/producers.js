'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var producers = function producers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_PRODUCER':
			{
				var _producer = action.payload.producer;

				global.emitter.emit("ADD_PRODUCER", _producer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producer.id, _producer));
			}

		case 'REMOVE_PRODUCER':
			{
				var producerId = action.payload.producerId;

				var newState = (0, _extends7.default)({}, state);

				delete newState[producerId];
				global.emitter.emit("REMOVE_PRODUCER", producer);
				return newState;
			}

		case 'SET_PRODUCER_PAUSED':
			{
				var _action$payload = action.payload,
				    _producerId = _action$payload.producerId,
				    originator = _action$payload.originator;

				var _producer2 = state[_producerId];
				var newProducer = void 0;

				if (originator === 'local') newProducer = (0, _extends7.default)({}, _producer2, { locallyPaused: true });else newProducer = (0, _extends7.default)({}, _producer2, { remotelyPaused: true });

				global.emitter.emit("SET_PRODUCER_PAUSED", newProducer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producerId, newProducer));
			}

		case 'SET_PRODUCER_RESUMED':
			{
				var _action$payload2 = action.payload,
				    _producerId2 = _action$payload2.producerId,
				    _originator = _action$payload2.originator;

				var _producer3 = state[_producerId2];
				var _newProducer = void 0;

				if (_originator === 'local') _newProducer = (0, _extends7.default)({}, _producer3, { locallyPaused: false });else _newProducer = (0, _extends7.default)({}, _producer3, { remotelyPaused: false });

				global.emitter.emit("SET_PRODUCER_RESUMED", _newProducer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producerId2, _newProducer));
			}

		case 'SET_PRODUCER_TRACK':
			{
				var _action$payload3 = action.payload,
				    _producerId3 = _action$payload3.producerId,
				    track = _action$payload3.track;

				var _producer4 = state[_producerId3];
				var _newProducer2 = (0, _extends7.default)({}, _producer4, { track: track });

				global.emitter.emit("SET_PRODUCER_TRACK", _newProducer2);

				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _producerId3, _newProducer2));
			}

		default:
			return state;
	}
};

exports.default = producers;