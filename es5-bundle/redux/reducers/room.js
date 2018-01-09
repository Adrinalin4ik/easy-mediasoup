'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
	url: null,
	state: 'new', // new/connecting/connected/disconnected/closed,
	activeSpeakerName: null
};

var room = function room() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'SET_ROOM_URL':
			{
				var url = action.payload.url;


				return (0, _extends3.default)({}, state, { url: url });
			}

		case 'SET_ROOM_STATE':
			{
				var roomState = action.payload.state;
				global.emitter.emit("SET_ROOM_STATE", roomState);
				if (roomState == 'connected') return (0, _extends3.default)({}, state, { state: roomState });else return (0, _extends3.default)({}, state, { state: roomState, activeSpeakerName: null });
			}

		case 'SET_ROOM_ACTIVE_SPEAKER':
			{
				var peerName = action.payload.peerName;

				global.emitter.emit("SET_ROOM_ACTIVE_SPEAKER", peerName);
				return (0, _extends3.default)({}, state, { activeSpeakerName: peerName });
			}

		default:
			return state;
	}
};

exports.default = room;