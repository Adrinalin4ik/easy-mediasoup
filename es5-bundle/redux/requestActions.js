'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.notify = exports.restartIce = exports.disableAudioOnly = exports.enableAudioOnly = exports.changeWebcam = exports.disableWebcam = exports.enableWebcam = exports.unmuteMic = exports.muteMic = exports.changeDisplayName = exports.leaveRoom = exports.joinRoom = undefined;

var _randomString = require('random-string');

var _randomString2 = _interopRequireDefault(_randomString);

var _stateActions = require('./stateActions');

var stateActions = _interopRequireWildcard(_stateActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joinRoom = exports.joinRoom = function joinRoom(_ref) {
	var media_server_wss = _ref.media_server_wss,
	    roomId = _ref.roomId,
	    peerName = _ref.peerName,
	    displayName = _ref.displayName,
	    device = _ref.device,
	    useSimulcast = _ref.useSimulcast,
	    produce = _ref.produce,
	    turnservers = _ref.turnservers,
	    args = _ref.args;

	return {
		type: 'JOIN_ROOM',
		payload: { media_server_wss: media_server_wss, roomId: roomId, peerName: peerName, displayName: displayName, device: device, useSimulcast: useSimulcast, produce: produce, turnservers: turnservers, args: args }
	};
};

var leaveRoom = exports.leaveRoom = function leaveRoom() {
	return {
		type: 'LEAVE_ROOM'
	};
};

var changeDisplayName = exports.changeDisplayName = function changeDisplayName(displayName) {
	return {
		type: 'CHANGE_DISPLAY_NAME',
		payload: { displayName: displayName }
	};
};

var muteMic = exports.muteMic = function muteMic() {
	return {
		type: 'MUTE_MIC'
	};
};

var unmuteMic = exports.unmuteMic = function unmuteMic() {
	return {
		type: 'UNMUTE_MIC'
	};
};

var enableWebcam = exports.enableWebcam = function enableWebcam() {
	return {
		type: 'ENABLE_WEBCAM'
	};
};

var disableWebcam = exports.disableWebcam = function disableWebcam() {
	return {
		type: 'DISABLE_WEBCAM'
	};
};

var changeWebcam = exports.changeWebcam = function changeWebcam() {
	return {
		type: 'CHANGE_WEBCAM'
	};
};

var enableAudioOnly = exports.enableAudioOnly = function enableAudioOnly() {
	return {
		type: 'ENABLE_AUDIO_ONLY'
	};
};

var disableAudioOnly = exports.disableAudioOnly = function disableAudioOnly() {
	return {
		type: 'DISABLE_AUDIO_ONLY'
	};
};

var restartIce = exports.restartIce = function restartIce() {
	return {
		type: 'RESTART_ICE'
	};
};

// This returns a redux-thunk action (a function).
var notify = exports.notify = function notify(_ref2) {
	var _ref2$type = _ref2.type,
	    type = _ref2$type === undefined ? 'info' : _ref2$type,
	    text = _ref2.text,
	    timeout = _ref2.timeout;

	if (!timeout) {
		switch (type) {
			case 'info':
				timeout = 3000;
				break;
			case 'error':
				timeout = 5000;
				break;
		}
	}

	var notification = {
		id: (0, _randomString2.default)({ length: 6 }).toLowerCase(),
		type: type,
		text: text,
		timeout: timeout
	};

	return function (dispatch) {
		dispatch(stateActions.addNotification(notification));

		setTimeout(function () {
			dispatch(stateActions.removeNotification(notification.id));
		}, timeout);
	};
};