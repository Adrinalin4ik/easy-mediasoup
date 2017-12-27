'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
	name: null,
	displayName: null,
	displayNameSet: false,
	device: null,
	canSendMic: false,
	canSendWebcam: false,
	canChangeWebcam: false,
	webcamInProgress: false,
	audioOnly: false,
	audioOnlyInProgress: false,
	restartIceInProgress: false
};

var me = function me() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'SET_ME':
			{
				var _action$payload = action.payload,
				    peerName = _action$payload.peerName,
				    displayName = _action$payload.displayName,
				    displayNameSet = _action$payload.displayNameSet,
				    device = _action$payload.device;

				global.emitter.emit("SET_ME", action.payload);
				return (0, _extends3.default)({}, state, { name: peerName, displayName: displayName, displayNameSet: displayNameSet, device: device });
			}

		case 'SET_MEDIA_CAPABILITIES':
			{
				var _action$payload2 = action.payload,
				    canSendMic = _action$payload2.canSendMic,
				    canSendWebcam = _action$payload2.canSendWebcam;


				return (0, _extends3.default)({}, state, { canSendMic: canSendMic, canSendWebcam: canSendWebcam });
			}

		case 'SET_CAN_CHANGE_WEBCAM':
			{
				var canChangeWebcam = action.payload;
				global.emitter.emit("SET_CAN_CHANGE_WEBCAM", action.payload);
				return (0, _extends3.default)({}, state, { canChangeWebcam: canChangeWebcam });
			}

		case 'SET_WEBCAM_IN_PROGRESS':
			{
				var flag = action.payload.flag;

				global.emitter.emit("SET_WEBCAM_IN_PROGRESS", action.payload);
				return (0, _extends3.default)({}, state, { webcamInProgress: flag });
			}

		case 'SET_DISPLAY_NAME':
			{
				var _displayName = action.payload.displayName;

				// Be ready for undefined displayName (so keep previous one).

				if (!_displayName) _displayName = state.displayName;

				return (0, _extends3.default)({}, state, { displayName: _displayName, displayNameSet: true });
			}

		case 'SET_AUDIO_ONLY_STATE':
			{
				var enabled = action.payload.enabled;


				return (0, _extends3.default)({}, state, { audioOnly: enabled });
			}

		case 'SET_AUDIO_ONLY_IN_PROGRESS':
			{
				var _flag = action.payload.flag;


				return (0, _extends3.default)({}, state, { audioOnlyInProgress: _flag });
			}

		case 'SET_RESTART_ICE_IN_PROGRESS':
			{
				var _flag2 = action.payload.flag;


				return (0, _extends3.default)({}, state, { restartIceInProgress: _flag2 });
			}

		default:
			return state;
	}
};

exports.default = me;