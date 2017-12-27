'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.initialize = initialize;
exports.isDesktop = isDesktop;
exports.isMobile = isMobile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mediaQueryDetectorElem = void 0;

function initialize() {
	// Media query detector stuff.
	mediaQueryDetectorElem = document.getElementById('mediasoup-demo-app-media-query-detector');

	return _promise2.default.resolve();
}

function isDesktop() {
	return Boolean(mediaQueryDetectorElem.offsetParent);
}

function isMobile() {
	return !mediaQueryDetectorElem.offsetParent;
}