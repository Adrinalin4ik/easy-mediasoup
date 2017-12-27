'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

var peers = function peers() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_PEER':
			{
				var peer = action.payload.peer;

				global.emitter.emit("peerAdded", peer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, peer.name, peer));
			}

		case 'REMOVE_PEER':
			{
				var peerName = action.payload.peerName;

				var newState = (0, _extends7.default)({}, state);

				delete newState[peerName];
				global.emitter.emit("peerRemoved", peerName);
				return newState;
			}

		case 'SET_PEER_DISPLAY_NAME':
			{
				var _action$payload = action.payload,
				    displayName = _action$payload.displayName,
				    _peerName = _action$payload.peerName;

				var _peer = state[_peerName];

				if (!_peer) throw new Error('no Peer found');

				var newPeer = (0, _extends7.default)({}, _peer, { displayName: displayName });

				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, newPeer.name, newPeer));
			}

		case 'ADD_CONSUMER':
			{
				var _action$payload2 = action.payload,
				    consumer = _action$payload2.consumer,
				    _peerName2 = _action$payload2.peerName;

				var _peer2 = state[_peerName2];

				if (!_peer2) throw new Error('no Peer found for new Consumer');

				var newConsumers = [].concat((0, _toConsumableArray3.default)(_peer2.consumers), [consumer.id]);
				var _newPeer = (0, _extends7.default)({}, _peer2, { consumers: newConsumers });
				global.emitter.emit("peerConsumerAdded", _newPeer);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _newPeer.name, _newPeer));
			}

		case 'REMOVE_CONSUMER':
			{
				var _action$payload3 = action.payload,
				    consumerId = _action$payload3.consumerId,
				    _peerName3 = _action$payload3.peerName;

				var _peer3 = state[_peerName3];

				// NOTE: This means that the Peer was closed before, so it's ok.
				if (!_peer3) return state;

				var idx = _peer3.consumers.indexOf(consumerId);

				if (idx === -1) throw new Error('Consumer not found');

				var _newConsumers = _peer3.consumers.slice();

				_newConsumers.splice(idx, 1);

				var _newPeer2 = (0, _extends7.default)({}, _peer3, { consumers: _newConsumers });
				global.emitter.emit("peerConsumerRemoved", _newPeer2);
				return (0, _extends7.default)({}, state, (0, _defineProperty3.default)({}, _newPeer2.name, _newPeer2));
			}

		default:
			return state;
	}
};

exports.default = peers;