'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends7 = require('babel-runtime/helpers/extends');

var _extends8 = _interopRequireDefault(_extends7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var consumers = function consumers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_CONSUMER':
			{
				var consumer = action.payload.consumer;

				global.emitter.emit("ADD_CONSUMER", action.payload);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, consumer.id, consumer));
			}

		case 'REMOVE_CONSUMER':
			{
				var consumerId = action.payload.consumerId;

				var newState = (0, _extends8.default)({}, state);

				delete newState[consumerId];
				global.emitter.emit("REMOVE_CONSUMER", action.payload);
				return newState;
			}

		case 'SET_CONSUMER_PAUSED':
			{
				var _action$payload = action.payload,
				    _consumerId = _action$payload.consumerId,
				    originator = _action$payload.originator;

				var _consumer = state[_consumerId];
				var newConsumer = void 0;

				if (originator === 'local') newConsumer = (0, _extends8.default)({}, _consumer, { locallyPaused: true });else newConsumer = (0, _extends8.default)({}, _consumer, { remotelyPaused: true });

				global.emitter.emit("SET_CONSUMER_PAUSED", action.payload);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId, newConsumer));
			}

		case 'SET_CONSUMER_RESUMED':
			{
				var _action$payload2 = action.payload,
				    _consumerId2 = _action$payload2.consumerId,
				    _originator = _action$payload2.originator;

				var _consumer2 = state[_consumerId2];
				var _newConsumer = void 0;

				if (_originator === 'local') _newConsumer = (0, _extends8.default)({}, _consumer2, { locallyPaused: false });else _newConsumer = (0, _extends8.default)({}, _consumer2, { remotelyPaused: false });

				global.emitter.emit("SET_CONSUMER_RESUMED", action.payload);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId2, _newConsumer));
			}

		case 'SET_CONSUMER_EFFECTIVE_PROFILE':
			{
				var _action$payload3 = action.payload,
				    _consumerId3 = _action$payload3.consumerId,
				    profile = _action$payload3.profile;

				var _consumer3 = state[_consumerId3];
				var _newConsumer2 = (0, _extends8.default)({}, _consumer3, { profile: profile });

				global.emitter.emit("SET_CONSUMER_EFFECTIVE_PROFILE", _newConsumer2);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId3, _newConsumer2));
			}

		case 'SET_CONSUMER_TRACK':
			{
				var _action$payload4 = action.payload,
				    _consumerId4 = _action$payload4.consumerId,
				    track = _action$payload4.track;

				var _consumer4 = state[_consumerId4];
				var _newConsumer3 = (0, _extends8.default)({}, _consumer4, { track: track });

				global.emitter.emit("SET_CONSUMER_TRACK", _newConsumer3);
				return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, _consumerId4, _newConsumer3));
			}

		default:
			return state;
	}
};

exports.default = consumers;