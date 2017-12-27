'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getUser = getUser;
exports.setUser = setUser;
exports.getDevices = getDevices;
exports.setDevices = setDevices;

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USER_COOKIE = 'mediasoup-demo.user';
var DEVICES_COOKIE = 'mediasoup-demo.devices';

function getUser() {
	return _jsCookie2.default.getJSON(USER_COOKIE);
}

function setUser(_ref) {
	var displayName = _ref.displayName;

	_jsCookie2.default.set(USER_COOKIE, { displayName: displayName });
}

function getDevices() {
	return _jsCookie2.default.getJSON(DEVICES_COOKIE);
}

function setDevices(_ref2) {
	var webcamEnabled = _ref2.webcamEnabled;

	_jsCookie2.default.set(DEVICES_COOKIE, { webcamEnabled: webcamEnabled });
}