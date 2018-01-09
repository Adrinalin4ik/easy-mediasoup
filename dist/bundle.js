/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_debug__);


const APP_NAME = 'mediasoup-client';

class Logger
{
	constructor(prefix)
	{
		if (prefix)
		{
			this._debug = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:${prefix}`);
			this._warn = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:WARN:${prefix}`);
			this._error = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:ERROR:${prefix}`);
		}
		else
		{
			this._debug = __WEBPACK_IMPORTED_MODULE_0_debug___default()(APP_NAME);
			this._warn = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:WARN`);
			this._error = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:ERROR`);
		}

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}

	get debug()
	{
		return this._debug;
	}

	get warn()
	{
		return this._warn;
	}

	get error()
	{
		return this._error;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Logger;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_events__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);



class EnhancedEventEmitter extends __WEBPACK_IMPORTED_MODULE_0_events__["EventEmitter"]
{
	constructor(logger)
	{
		super();
		this.setMaxListeners(Infinity);

		this._logger = logger || new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('EnhancedEventEmitter');
	}

	safeEmit(event, ...args)
	{
		try
		{
			this.emit(event, ...args);
		}
		catch (error)
		{
			this._logger.error(
				'safeEmit() | event listener threw an error [event:%s]:%o',
				event, error);
		}
	}

	safeEmitAsPromise(event, ...args)
	{
		return new Promise((resolve, reject) =>
		{
			const callback = (result) =>
			{
				resolve(result);
			};

			const errback = (error) =>
			{
				this._logger.error(
					'safeEmitAsPromise() | errback called [event:%s]:%o',
					event, error);

				reject(error);
			};

			this.safeEmit(event, ...args, callback, errback);
		});
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EnhancedEventEmitter;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = randomNumber;
/* harmony export (immutable) */ __webpack_exports__["a"] = clone;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_random_number__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_random_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_random_number__);


const randomNumberGenerator = __WEBPACK_IMPORTED_MODULE_0_random_number___default.a.generator(
	{
		min     : 10000000,
		max     : 99999999,
		integer : true
	});

/**
 * Generates a random positive number between 10000000 and 99999999.
 *
 * @return {Number}
 */
function randomNumber()
{
	return randomNumberGenerator();
}

/**
 * Clones the given Object/Array.
 *
 * @param {Object|Array} obj
 *
 * @return {Object|Array}
 */
function clone(obj)
{
	return JSON.parse(JSON.stringify(obj));
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var parser = __webpack_require__(46);
var writer = __webpack_require__(47);

exports.write = writer;
exports.parse = parser.parse;
exports.parseFmtpConfig = parser.parseFmtpConfig;
exports.parseParams = parser.parseParams;
exports.parsePayloads = parser.parsePayloads;
exports.parseRemoteCandidates = parser.parseRemoteCandidates;
exports.parseImageAttributes = parser.parseImageAttributes;
exports.parseSimulcastStreamList = parser.parseSimulcastStreamList;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = getExtendedRtpCapabilities;
/* harmony export (immutable) */ __webpack_exports__["e"] = getRtpCapabilities;
/* harmony export (immutable) */ __webpack_exports__["g"] = getUnsupportedCodecs;
/* harmony export (immutable) */ __webpack_exports__["b"] = canSend;
/* harmony export (immutable) */ __webpack_exports__["a"] = canReceive;
/* harmony export (immutable) */ __webpack_exports__["f"] = getSendingRtpParameters;
/* harmony export (immutable) */ __webpack_exports__["d"] = getReceivingFullRtpParameters;
/**
 * Generate extended RTP capabilities for sending and receiving.
 *
 * @param {RTCRtpCapabilities} localCaps - Local capabilities.
 * @param {RTCRtpCapabilities} remoteCaps - Remote capabilities.
 *
 * @return {RTCExtendedRtpCapabilities}
 */
function getExtendedRtpCapabilities(localCaps, remoteCaps)
{
	const extendedCaps =
	{
		codecs           : [],
		headerExtensions : [],
		fecMechanisms    : []
	};

	// Match media codecs and keep the order preferred by remoteCaps.
	for (const remoteCodec of remoteCaps.codecs || [])
	{
		// TODO: Ignore pseudo-codecs and feature codecs.
		if (remoteCodec.name === 'rtx')
			continue;

		const matchingLocalCodec = (localCaps.codecs || [])
			.find((localCodec) => matchCapCodecs(localCodec, remoteCodec));

		if (matchingLocalCodec)
		{
			const extendedCodec =
			{
				name               : remoteCodec.name,
				mimeType           : remoteCodec.mimeType,
				kind               : remoteCodec.kind,
				clockRate          : remoteCodec.clockRate,
				sendPayloadType    : matchingLocalCodec.preferredPayloadType,
				sendRtxPayloadType : null,
				recvPayloadType    : remoteCodec.preferredPayloadType,
				recvRtxPayloadType : null,
				channels           : remoteCodec.channels,
				rtcpFeedback       : reduceRtcpFeedback(matchingLocalCodec, remoteCodec),
				parameters         : remoteCodec.parameters
			};

			if (!extendedCodec.channels)
				delete extendedCodec.channels;

			extendedCaps.codecs.push(extendedCodec);
		}
	}

	// Match RTX codecs.
	for (const extendedCodec of extendedCaps.codecs || [])
	{
		const matchingLocalRtxCodec = (localCaps.codecs || [])
			.find((localCodec) =>
			{
				return (
					localCodec.name === 'rtx' &&
					localCodec.parameters.apt === extendedCodec.sendPayloadType
				);
			});

		const matchingRemoteRtxCodec = (remoteCaps.codecs || [])
			.find((remoteCodec) =>
			{
				return (
					remoteCodec.name === 'rtx' &&
					remoteCodec.parameters.apt === extendedCodec.recvPayloadType
				);
			});

		if (matchingLocalRtxCodec && matchingRemoteRtxCodec)
		{
			extendedCodec.sendRtxPayloadType = matchingLocalRtxCodec.preferredPayloadType;
			extendedCodec.recvRtxPayloadType = matchingRemoteRtxCodec.preferredPayloadType;
		}
	}

	// Match header extensions.
	for (const remoteExt of remoteCaps.headerExtensions || [])
	{
		const matchingLocalExt = (localCaps.headerExtensions || [])
			.find((localExt) => matchCapHeaderExtensions(localExt, remoteExt));

		if (matchingLocalExt)
		{
			const extendedExt =
			{
				kind   : remoteExt.kind,
				uri    : remoteExt.uri,
				sendId : matchingLocalExt.preferredId,
				recvId : remoteExt.preferredId
			};

			extendedCaps.headerExtensions.push(extendedExt);
		}
	}

	return extendedCaps;
}

/**
 * Generate RTP capabilities for receiving media based on the given extended
 * RTP capabilities.
 *
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {RTCRtpCapabilities}
 */
function getRtpCapabilities(extendedRtpCapabilities)
{
	const caps =
	{
		codecs           : [],
		headerExtensions : [],
		fecMechanisms    : []
	};

	for (const capCodec of extendedRtpCapabilities.codecs)
	{
		const codec =
		{
			name                 : capCodec.name,
			mimeType             : capCodec.mimeType,
			kind                 : capCodec.kind,
			clockRate            : capCodec.clockRate,
			preferredPayloadType : capCodec.recvPayloadType,
			channels             : capCodec.channels,
			rtcpFeedback         : capCodec.rtcpFeedback,
			parameters           : capCodec.parameters
		};

		if (!codec.channels)
			delete codec.channels;

		caps.codecs.push(codec);

		// Add RTX codec.
		if (capCodec.recvRtxPayloadType)
		{
			const rtxCapCodec =
			{
				name                 : 'rtx',
				mimeType             : `${capCodec.kind}/rtx`,
				kind                 : capCodec.kind,
				clockRate            : capCodec.clockRate,
				preferredPayloadType : capCodec.recvRtxPayloadType,
				parameters           :
				{
					apt : capCodec.recvPayloadType
				}
			};

			caps.codecs.push(rtxCapCodec);
		}

		// TODO: In the future, we need to add FEC, CN, etc, codecs.
	}

	for (const capExt of extendedRtpCapabilities.headerExtensions)
	{
		const ext =
		{
			kind        : capExt.kind,
			uri         : capExt.uri,
			preferredId : capExt.recvId
		};

		caps.headerExtensions.push(ext);
	}

	caps.fecMechanisms = extendedRtpCapabilities.fecMechanisms;

	return caps;
}

/**
 * Get unsupported remote codecs.
 *
 * @param {RTCRtpCapabilities} remoteCaps - Remote capabilities.
 * @param {Array<Number>} mandatoryCodecPayloadTypes - List of codec PT values.
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {Boolean}
 */
function getUnsupportedCodecs(
	remoteCaps, mandatoryCodecPayloadTypes, extendedRtpCapabilities)
{
	// If not given just ignore.
	if (!Array.isArray(mandatoryCodecPayloadTypes))
		return [];

	const unsupportedCodecs = [];
	const remoteCodecs = remoteCaps.codecs;
	const supportedCodecs = extendedRtpCapabilities.codecs;

	for (const pt of mandatoryCodecPayloadTypes)
	{
		if (!supportedCodecs.some((codec) => codec.recvPayloadType === pt))
		{
			const unsupportedCodec = remoteCodecs
				.find((codec) => codec.preferredPayloadType === pt);

			if (!unsupportedCodec)
				throw new Error(`mandatory codec PT ${pt} not found in remote codecs`);

			unsupportedCodecs.push(unsupportedCodec);
		}
	}

	return unsupportedCodecs;
}

/**
 * Whether media can be sent based on the given RTP capabilities.
 *
 * @param {String} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {Boolean}
 */
function canSend(kind, extendedRtpCapabilities)
{
	return extendedRtpCapabilities.codecs.
		some((codec) => codec.kind === kind);
}

/**
 * Whether the given RTP parameters can be received with the given RTP
 * capabilities.
 *
 * @param {RTCRtpParameters} rtpParameters
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {Boolean}
 */
function canReceive(rtpParameters, extendedRtpCapabilities)
{
	if (rtpParameters.codecs.length === 0)
		return false;

	const firstMediaCodec = rtpParameters.codecs[0];

	return extendedRtpCapabilities.codecs
		.some((codec) => codec.recvPayloadType === firstMediaCodec.payloadType);
}

/**
 * Generate RTP parameters of the given kind for sending media.
 * Just the first media codec per kind is considered.
 * NOTE: muxId, encodings and rtcp fields are left empty.
 *
 * @param {kind} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {RTCRtpParameters}
 */
function getSendingRtpParameters(kind, extendedRtpCapabilities)
{
	const params =
	{
		muxId            : null,
		codecs           : [],
		headerExtensions : [],
		encodings        : [],
		rtcp             : {}
	};

	for (const capCodec of extendedRtpCapabilities.codecs)
	{
		if (capCodec.kind !== kind)
			continue;

		const codec =
		{
			name         : capCodec.name,
			mimeType     : capCodec.mimeType,
			clockRate    : capCodec.clockRate,
			payloadType  : capCodec.sendPayloadType,
			channels     : capCodec.channels,
			rtcpFeedback : capCodec.rtcpFeedback,
			parameters   : capCodec.parameters
		};

		if (!codec.channels)
			delete codec.channels;

		params.codecs.push(codec);

		// Add RTX codec.
		if (capCodec.sendRtxPayloadType)
		{
			const rtxCodec =
			{
				name        : 'rtx',
				mimeType    : `${capCodec.kind}/rtx`,
				clockRate   : capCodec.clockRate,
				payloadType : capCodec.sendRtxPayloadType,
				parameters  :
				{
					apt : capCodec.sendPayloadType
				}
			};

			params.codecs.push(rtxCodec);
		}

		// NOTE: We assume a single media codec plus an optional RTX codec for now.
		// TODO: In the future, we need to add FEC, CN, etc, codecs.
		break;
	}

	for (const capExt of extendedRtpCapabilities.headerExtensions)
	{
		if (capExt.kind && capExt.kind !== kind)
			continue;

		const ext =
		{
			uri : capExt.uri,
			id  : capExt.sendId
		};

		params.headerExtensions.push(ext);
	}

	return params;
}

/**
 * Generate RTP parameters of the given kind for receiving media.
 * All the media codecs per kind are considered. This is useful for generating
 * a SDP remote offer.
 * NOTE: muxId, encodings and rtcp fields are left empty.
 *
 * @param {String} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @return {RTCRtpParameters}
 */
function getReceivingFullRtpParameters(kind, extendedRtpCapabilities)
{
	const params =
	{
		muxId            : null,
		codecs           : [],
		headerExtensions : [],
		encodings        : [],
		rtcp             : {}
	};

	for (const capCodec of extendedRtpCapabilities.codecs)
	{
		if (capCodec.kind !== kind)
			continue;

		const codec =
		{
			name         : capCodec.name,
			mimeType     : capCodec.mimeType,
			clockRate    : capCodec.clockRate,
			payloadType  : capCodec.recvPayloadType,
			channels     : capCodec.channels,
			rtcpFeedback : capCodec.rtcpFeedback,
			parameters   : capCodec.parameters
		};

		if (!codec.channels)
			delete codec.channels;

		params.codecs.push(codec);

		// Add RTX codec.
		if (capCodec.recvRtxPayloadType)
		{
			const rtxCodec =
			{
				name        : 'rtx',
				mimeType    : `${capCodec.kind}/rtx`,
				clockRate   : capCodec.clockRate,
				payloadType : capCodec.recvRtxPayloadType,
				parameters  :
				{
					apt : capCodec.recvPayloadType
				}
			};

			params.codecs.push(rtxCodec);
		}

		// TODO: In the future, we need to add FEC, CN, etc, codecs.
	}

	for (const capExt of extendedRtpCapabilities.headerExtensions)
	{
		if (capExt.kind && capExt.kind !== kind)
			continue;

		const ext =
		{
			uri : capExt.uri,
			id  : capExt.recvId
		};

		params.headerExtensions.push(ext);
	}

	return params;
}

function matchCapCodecs(aCodec, bCodec)
{
	const aMimeType = aCodec.mimeType.toLowerCase();
	const bMimeType = bCodec.mimeType.toLowerCase();

	if (aMimeType !== bMimeType)
		return false;

	if (aCodec.clockRate !== bCodec.clockRate)
		return false;

	if (aCodec.channels !== bCodec.channels)
		return false;

	// Match H264 parameters.
	if (aMimeType === 'video/h264')
	{
		const aPacketizationMode = (aCodec.parameters || {})['packetization-mode'] || 0;
		const bPacketizationMode = (bCodec.parameters || {})['packetization-mode'] || 0;

		if (aPacketizationMode !== bPacketizationMode)
			return false;
	}

	return true;
}

function matchCapHeaderExtensions(aExt, bExt)
{
	if (aExt.kind && bExt.kind && aExt.kind !== bExt.kind)
		return false;

	if (aExt.uri !== bExt.uri)
		return false;

	return true;
}

function reduceRtcpFeedback(codecA, codecB)
{
	const reducedRtcpFeedback = [];

	for (const aFb of codecA.rtcpFeedback || [])
	{
		const matchingBFb = (codecB.rtcpFeedback || [])
			.find((bFb) =>
			{
				return (
					bFb.type === aFb.type &&
					bFb.parameter === aFb.parameter
				);
			});

		if (matchingBFb)
			reducedRtcpFeedback.push(matchingBFb);
	}

	return reducedRtcpFeedback;
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Error produced when calling a method in an invalid state.
 */
class InvalidStateError extends Error
{
	constructor(message)
	{
		super(message);

		Object.defineProperty(this, 'name',
			{
				enumerable : false,
				writable   : false,
				value      : 'InvalidStateError'
			});

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
		{
			Error.captureStackTrace(this, InvalidStateError);
		}
		else
		{
			Object.defineProperty(this, 'stack',
				{
					enumerable : false,
					writable   : false,
					value      : (new Error(message)).stack
				});
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = InvalidStateError;


/**
 * Error produced when a Promise is rejected due to a timeout.
 */
class TimeoutError extends Error
{
	constructor(message)
	{
		super(message);

		Object.defineProperty(this, 'name',
			{
				enumerable : false,
				writable   : false,
				value      : 'TimeoutError'
			});

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
		{
			Error.captureStackTrace(this, TimeoutError);
		}
		else
		{
			Object.defineProperty(this, 'stack',
				{
					enumerable : false,
					writable   : false,
					value      : (new Error(message)).stack
				});
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["b"] = TimeoutError;


/**
 * Error indicating not support for something.
 */
class UnsupportedError extends Error
{
	constructor(message, data)
	{
		super(message);

		Object.defineProperty(this, 'name',
			{
				enumerable : false,
				writable   : false,
				value      : 'UnsupportedError'
			});

		Object.defineProperty(this, 'data',
			{
				enumerable : true,
				writable   : false,
				value      : data
			});

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
		{
			Error.captureStackTrace(this, UnsupportedError);
		}
		else
		{
			Object.defineProperty(this, 'stack',
				{
					enumerable : false,
					writable   : false,
					value      : (new Error(message)).stack
				});
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["c"] = UnsupportedError;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bowser__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bowser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bowser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__handlers_Chrome55__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__handlers_Safari11__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__handlers_Firefox50__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__handlers_Edge11__ = __webpack_require__(53);







const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('Device');

/**
 * Class with static members representing the underlying device or browser.
 */
class Device
{
	/**
	 * Get the device flag.
	 *
	 * @return {String}
	 */
	static get flag()
	{
		if (!Device._detected)
			Device._detect();

		return Device._flag;
	}

	/**
	 * Get the device name.
	 *
	 * @return {String}
	 */
	static get name()
	{
		if (!Device._detected)
			Device._detect();

		return Device._name;
	}

	/**
	 * Get the device version.
	 *
	 * @return {String}
	 */
	static get version()
	{
		if (!Device._detected)
			Device._detect();

		return Device._version;
	}

	/**
	 * Get the bowser module Object.
	 *
	 * @return {Object}
	 */
	static get bowser()
	{
		if (!Device._detected)
			Device._detect();

		return Device._bowser;
	}

	/**
	 * Whether this device is supported.
	 *
	 * @return {Boolean}
	 */
	static isSupported()
	{
		if (!Device._detected)
			Device._detect();

		return Boolean(Device._handlerClass);
	}

	/**
	 * Returns a suitable WebRTC handler class.
	 *
	 * @type {Class}
	 */
	static get Handler()
	{
		if (!Device._detected)
			Device._detect();

		return Device._handlerClass;
	}

	/**
	 * Detects the current device/browser.
	 *
	 * @private
	 */
	static _detect()
	{
		const ua = global.navigator.userAgent;
		const browser = __WEBPACK_IMPORTED_MODULE_0_bowser___default.a._detect(ua);

		Device._detected = true;
		Device._flag = undefined;
		Device._name = browser.name || 'unknown device';
		Device._version = browser.version || 'unknown vesion';
		Device._bowser = browser;
		Device._handlerClass = null;

		// Chrome, Chromium (desktop and mobile).
		if (__WEBPACK_IMPORTED_MODULE_0_bowser___default.a.check({ chrome: '55', chromium: '55' }, true, ua))
		{
			Device._flag = 'chrome';
			Device._handlerClass = __WEBPACK_IMPORTED_MODULE_2__handlers_Chrome55__["a" /* default */];
		}
		// Firefox (desktop and mobile).
		else if (__WEBPACK_IMPORTED_MODULE_0_bowser___default.a.check({ firefox: '50' }, true, ua))
		{
			Device._flag = 'firefox';
			Device._handlerClass = __WEBPACK_IMPORTED_MODULE_4__handlers_Firefox50__["a" /* default */];
		}
		// Safari (desktop and mobile).
		else if (__WEBPACK_IMPORTED_MODULE_0_bowser___default.a.check({ safari: '11' }, true, ua))
		{
			Device._flag = 'safari';
			Device._handlerClass = __WEBPACK_IMPORTED_MODULE_3__handlers_Safari11__["a" /* default */];
		}
		// Edge (desktop).
		else if (__WEBPACK_IMPORTED_MODULE_0_bowser___default.a.check({ msedge: '11' }, true, ua))
		{
			Device._flag = 'msedge';
			Device._handlerClass = __WEBPACK_IMPORTED_MODULE_5__handlers_Edge11__["a" /* default */];
		}
		// Opera (desktop and mobile).
		if (__WEBPACK_IMPORTED_MODULE_0_bowser___default.a.check({ opera: '44' }, true, ua))
		{
			Device._flag = 'opera';
			Device._handlerClass = __WEBPACK_IMPORTED_MODULE_2__handlers_Chrome55__["a" /* default */];
		}

		if (Device.isSupported())
		{
			logger.debug(
				'device supported [flag:%s, name:"%s", version:%s, handler:%s]',
				Device._flag, Device._name, Device._version, Device._handlerClass.name);
		}
		else
		{
			logger.warn(
				'device not supported [name:%s, version:%s]',
				Device._name, Device._version);
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Device;


// Initialized flag.
// @type {Boolean}
Device._detected = false;

// Device flag.
// @type {String}
Device._flag = undefined;

// Device name.
// @type {String}
Device._name = undefined;

// Device version.
// @type {String}
Device._version = undefined;

// bowser module Object.
// @type {Object}
Device._bowser = undefined;

// WebRTC hander for this device.
// @type {Class}
Device._handlerClass = null;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = extractRtpCapabilities;
/* harmony export (immutable) */ __webpack_exports__["a"] = extractDtlsParameters;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sdp_transform__);


/**
 * Extract RTP capabilities from a SDP.
 *
 * @param {Object} sdpObj - SDP Object generated by sdp-transform.
 * @return {RTCRtpCapabilities}
 */
function extractRtpCapabilities(sdpObj)
{
	// Map of RtpCodecParameters indexed by payload type.
	const codecsMap = new Map();

	// Array of RtpHeaderExtensions.
	const headerExtensions = [];

	// Whether a m=audio/video section has been already found.
	let gotAudio = false;
	let gotVideo = false;

	for (const m of sdpObj.media)
	{
		const kind = m.type;

		switch (kind)
		{
			case 'audio':
			{
				if (gotAudio)
					continue;

				gotAudio = true;
				break;
			}
			case 'video':
			{
				if (gotVideo)
					continue;

				gotVideo = true;
				break;
			}
			default:
			{
				continue;
			}
		}

		// Get codecs.
		for (const rtp of m.rtp)
		{
			const codec =
			{
				name                 : rtp.codec,
				mimeType             : `${kind}/${rtp.codec}`,
				kind                 : kind,
				clockRate            : rtp.rate,
				preferredPayloadType : rtp.payload,
				channels             : rtp.encoding,
				rtcpFeedback         : [],
				parameters           : {}
			};

			if (codec.kind !== 'audio')
				delete codec.channels;
			else if (!codec.channels)
				codec.channels = 1;

			codecsMap.set(codec.preferredPayloadType, codec);
		}

		// Get codec parameters.
		for (const fmtp of m.fmtp || [])
		{
			const parameters = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parseFmtpConfig(fmtp.config);
			const codec = codecsMap.get(fmtp.payload);

			if (!codec)
				continue;

			codec.parameters = parameters;
		}

		// Get RTCP feedback for each codec.
		for (const fb of m.rtcpFb || [])
		{
			const codec = codecsMap.get(fb.payload);

			if (!codec)
				continue;

			const feedback =
			{
				type      : fb.type,
				parameter : fb.subtype
			};

			if (!feedback.parameter)
				delete feedback.parameter;

			codec.rtcpFeedback.push(feedback);
		}

		// Get RTP header extensions.
		for (const ext of m.ext || [])
		{
			const headerExtension =
			{
				kind        : kind,
				uri         : ext.uri,
				preferredId : ext.value
			};

			headerExtensions.push(headerExtension);
		}
	}

	const rtpCapabilities =
	{
		codecs           : Array.from(codecsMap.values()),
		headerExtensions : headerExtensions,
		fecMechanisms    : [] // TODO
	};

	return rtpCapabilities;
}

/**
 * Extract DTLS parameters from a SDP.
 *
 * @param {Object} sdpObj - SDP Object generated by sdp-transform.
 * @return {RTCDtlsParameters}
 */
function extractDtlsParameters(sdpObj)
{
	const media = getFirstActiveMediaSection(sdpObj);
	const fingerprint = media.fingerprint || sdpObj.fingerprint;
	let role;

	switch (media.setup)
	{
		case 'active':
			role = 'client';
			break;
		case 'passive':
			role = 'server';
			break;
		case 'actpass':
			role = 'auto';
			break;
	}

	const dtlsParameters =
	{
		role         : role,
		fingerprints :
		[
			{
				algorithm : fingerprint.type,
				value     : fingerprint.hash
			}
		]
	};

	return dtlsParameters;
}

/**
 * Get the first acive media section.
 *
 * @private
 * @param {Object} sdpObj - SDP Object generated by sdp-transform.
 * @return {Object} SDP media section as parsed by sdp-transform.
 */
function getFirstActiveMediaSection(sdpObj)
{
	return (sdpObj.media || [])
		.find((m) => m.iceUfrag && m.port !== 0);
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* unused harmony reexport bindActionCreators */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__["a"]; });
/* unused harmony reexport compose */







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  Object(__WEBPACK_IMPORTED_MODULE_5__utils_warning__["a" /* default */])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["b"] = createStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_symbol_observable__);



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = observable, _ref2;
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(30);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || Object(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = Object(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(24);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var grammar = module.exports = {
  v: [{
    name: 'version',
    reg: /^(\d*)$/
  }],
  o: [{ //o=- 20518 0 IN IP4 203.0.113.1
    // NB: sessionId will be a String in most cases because it is huge
    name: 'origin',
    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
    format: '%s %s %d %s IP%d %s'
  }],
  // default parsing of these only (though some of these feel outdated)
  s: [{ name: 'name' }],
  i: [{ name: 'description' }],
  u: [{ name: 'uri' }],
  e: [{ name: 'email' }],
  p: [{ name: 'phone' }],
  z: [{ name: 'timezones' }], // TODO: this one can actually be parsed properly..
  r: [{ name: 'repeats' }],   // TODO: this one can also be parsed properly
  //k: [{}], // outdated thing ignored
  t: [{ //t=0 0
    name: 'timing',
    reg: /^(\d*) (\d*)/,
    names: ['start', 'stop'],
    format: '%d %d'
  }],
  c: [{ //c=IN IP4 10.47.197.26
    name: 'connection',
    reg: /^IN IP(\d) (\S*)/,
    names: ['version', 'ip'],
    format: 'IN IP%d %s'
  }],
  b: [{ //b=AS:4000
    push: 'bandwidth',
    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
    names: ['type', 'limit'],
    format: '%s:%s'
  }],
  m: [{ //m=video 51744 RTP/AVP 126 97 98 34 31
    // NB: special - pushes to session
    // TODO: rtp/fmtp should be filtered by the payloads found here?
    reg: /^(\w*) (\d*) ([\w\/]*)(?: (.*))?/,
    names: ['type', 'port', 'protocol', 'payloads'],
    format: '%s %d %s %s'
  }],
  a: [
    { //a=rtpmap:110 opus/48000/2
      push: 'rtp',
      reg: /^rtpmap:(\d*) ([\w\-\.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
      names: ['payload', 'codec', 'rate', 'encoding'],
      format: function (o) {
        return (o.encoding) ?
          'rtpmap:%d %s/%s/%s':
          o.rate ?
          'rtpmap:%d %s/%s':
          'rtpmap:%d %s';
      }
    },
    { //a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
      //a=fmtp:111 minptime=10; useinbandfec=1
      push: 'fmtp',
      reg: /^fmtp:(\d*) ([\S| ]*)/,
      names: ['payload', 'config'],
      format: 'fmtp:%d %s'
    },
    { //a=control:streamid=0
      name: 'control',
      reg: /^control:(.*)/,
      format: 'control:%s'
    },
    { //a=rtcp:65179 IN IP4 193.84.77.194
      name: 'rtcp',
      reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
      names: ['port', 'netType', 'ipVer', 'address'],
      format: function (o) {
        return (o.address != null) ?
          'rtcp:%d %s IP%d %s':
          'rtcp:%d';
      }
    },
    { //a=rtcp-fb:98 trr-int 100
      push: 'rtcpFbTrrInt',
      reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
      names: ['payload', 'value'],
      format: 'rtcp-fb:%d trr-int %d'
    },
    { //a=rtcp-fb:98 nack rpsi
      push: 'rtcpFb',
      reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
      names: ['payload', 'type', 'subtype'],
      format: function (o) {
        return (o.subtype != null) ?
          'rtcp-fb:%s %s %s':
          'rtcp-fb:%s %s';
      }
    },
    { //a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
      //a=extmap:1/recvonly URI-gps-string
      push: 'ext',
      reg: /^extmap:(\d+)(?:\/(\w+))? (\S*)(?: (\S*))?/,
      names: ['value', 'direction', 'uri', 'config'],
      format: function (o) {
        return 'extmap:%d' + (o.direction ? '/%s' : '%v') + ' %s' + (o.config ? ' %s' : '');
      }
    },
    { //a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
      push: 'crypto',
      reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
      names: ['id', 'suite', 'config', 'sessionConfig'],
      format: function (o) {
        return (o.sessionConfig != null) ?
          'crypto:%d %s %s %s':
          'crypto:%d %s %s';
      }
    },
    { //a=setup:actpass
      name: 'setup',
      reg: /^setup:(\w*)/,
      format: 'setup:%s'
    },
    { //a=mid:1
      name: 'mid',
      reg: /^mid:([^\s]*)/,
      format: 'mid:%s'
    },
    { //a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
      name: 'msid',
      reg: /^msid:(.*)/,
      format: 'msid:%s'
    },
    { //a=ptime:20
      name: 'ptime',
      reg: /^ptime:(\d*)/,
      format: 'ptime:%d'
    },
    { //a=maxptime:60
      name: 'maxptime',
      reg: /^maxptime:(\d*)/,
      format: 'maxptime:%d'
    },
    { //a=sendrecv
      name: 'direction',
      reg: /^(sendrecv|recvonly|sendonly|inactive)/
    },
    { //a=ice-lite
      name: 'icelite',
      reg: /^(ice-lite)/
    },
    { //a=ice-ufrag:F7gI
      name: 'iceUfrag',
      reg: /^ice-ufrag:(\S*)/,
      format: 'ice-ufrag:%s'
    },
    { //a=ice-pwd:x9cml/YzichV2+XlhiMu8g
      name: 'icePwd',
      reg: /^ice-pwd:(\S*)/,
      format: 'ice-pwd:%s'
    },
    { //a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
      name: 'fingerprint',
      reg: /^fingerprint:(\S*) (\S*)/,
      names: ['type', 'hash'],
      format: 'fingerprint:%s %s'
    },
    { //a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
      //a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
      //a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
      //a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
      //a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
      push:'candidates',
      reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
      names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
      format: function (o) {
        var str = 'candidate:%s %d %s %d %s %d typ %s';

        str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';

        // NB: candidate has three optional chunks, so %void middles one if it's missing
        str += (o.tcptype != null) ? ' tcptype %s' : '%v';

        if (o.generation != null) {
          str += ' generation %d';
        }

        str += (o['network-id'] != null) ? ' network-id %d' : '%v';
        str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
        return str;
      }
    },
    { //a=end-of-candidates (keep after the candidates line for readability)
      name: 'endOfCandidates',
      reg: /^(end-of-candidates)/
    },
    { //a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
      name: 'remoteCandidates',
      reg: /^remote-candidates:(.*)/,
      format: 'remote-candidates:%s'
    },
    { //a=ice-options:google-ice
      name: 'iceOptions',
      reg: /^ice-options:(\S*)/,
      format: 'ice-options:%s'
    },
    { //a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
      push: 'ssrcs',
      reg: /^ssrc:(\d*) ([\w_]*)(?::(.*))?/,
      names: ['id', 'attribute', 'value'],
      format: function (o) {
        var str = 'ssrc:%d';
        if (o.attribute != null) {
          str += ' %s';
          if (o.value != null) {
            str += ':%s';
          }
        }
        return str;
      }
    },
    { //a=ssrc-group:FEC 1 2
      //a=ssrc-group:FEC-FR 3004364195 1080772241
      push: 'ssrcGroups',
      // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
      reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
      names: ['semantics', 'ssrcs'],
      format: 'ssrc-group:%s %s'
    },
    { //a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
      name: 'msidSemantic',
      reg: /^msid-semantic:\s?(\w*) (\S*)/,
      names: ['semantic', 'token'],
      format: 'msid-semantic: %s %s' // space after ':' is not accidental
    },
    { //a=group:BUNDLE audio video
      push: 'groups',
      reg: /^group:(\w*) (.*)/,
      names: ['type', 'mids'],
      format: 'group:%s %s'
    },
    { //a=rtcp-mux
      name: 'rtcpMux',
      reg: /^(rtcp-mux)/
    },
    { //a=rtcp-rsize
      name: 'rtcpRsize',
      reg: /^(rtcp-rsize)/
    },
    { //a=sctpmap:5000 webrtc-datachannel 1024
      name: 'sctpmap',
      reg: /^sctpmap:([\w_\/]*) (\S*)(?: (\S*))?/,
      names: ['sctpmapNumber', 'app', 'maxMessageSize'],
      format: function (o) {
        return (o.maxMessageSize != null) ?
          'sctpmap:%s %s %s' :
          'sctpmap:%s %s';
      }
    },
    { //a=x-google-flag:conference
      name: 'xGoogleFlag',
      reg: /^x-google-flag:([^\s]*)/,
      format: 'x-google-flag:%s'
    },
    { //a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
      push: 'rids',
      reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
      names: ['id', 'direction', 'params'],
      format: function (o) {
        return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
      }
    },
    { //a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
      //a=imageattr:* send [x=800,y=640] recv *
      //a=imageattr:100 recv [x=320,y=240]
      push: 'imageattrs',
      reg: new RegExp(
        //a=imageattr:97
        '^imageattr:(\\d+|\\*)' +
        //send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
        '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' +
        //recv [x=330,y=250]
        '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'
      ),
      names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
      format: function (o) {
        return 'imageattr:%s %s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    { //a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
      //a=simulcast:recv 1;4,5 send 6;7
      name: 'simulcast',
      reg: new RegExp(
        //a=simulcast:
        '^simulcast:' +
        //send 1,2,3;~4,~5
        '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' +
        //space + recv 6;~7,~8
        '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' +
        //end
        '$'
      ),
      names: ['dir1', 'list1', 'dir2', 'list2'],
      format: function (o) {
        return 'simulcast:%s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    { //Old simulcast draft 03 (implemented by Firefox)
      //  https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
      //a=simulcast: recv pt=97;98 send pt=97
      //a=simulcast: send rid=5;6;7 paused=6,7
      name: 'simulcast_03',
      reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
      names: ['value'],
      format: 'simulcast: %s'
    },
    {
      //a=framerate:25
      //a=framerate:29.97
      name: 'framerate',
      reg: /^framerate:(\d+(?:$|\.\d+))/,
      format: 'framerate:%s'
    },
    { // any a= that we don't understand is kepts verbatim on media.invalid
      push: 'invalid',
      names: ['value']
    }
  ]
};

// set sensible defaults to avoid polluting the grammar with boring details
Object.keys(grammar).forEach(function (key) {
  var objs = grammar[key];
  objs.forEach(function (obj) {
    if (!obj.reg) {
      obj.reg = /(.*)/;
    }
    if (!obj.format) {
      obj.format = '%s';
    }
  });
});


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = fillRtpParametersForTrack;
/* harmony export (immutable) */ __webpack_exports__["a"] = addSimulcastForTrack;
/**
 * Fill the given RTP parameters for the given track.
 *
 * @param {RTCRtpParameters} rtpParameters -  RTP parameters to be filled.
 * @param {Object} sdpObj - Local SDP Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 */
function fillRtpParametersForTrack(rtpParameters, sdpObj, track)
{
	const kind = track.kind;
	const rtcp =
	{
		cname       : null,
		reducedSize : true,
		mux         : true
	};

	const mSection = (sdpObj.media || [])
		.find((m) => m.type === kind);

	if (!mSection)
		throw new Error(`m=${kind} section not found`);

	// First media SSRC (or the only one).
	let firstSsrc;

	// Get all the SSRCs.

	const ssrcs = new Set();

	for (const line of mSection.ssrcs || [])
	{
		if (line.attribute !== 'msid')
			continue;

		const trackId = line.value.split(' ')[1];

		if (trackId === track.id)
		{
			const ssrc = line.id;

			ssrcs.add(ssrc);

			if (!firstSsrc)
				firstSsrc = ssrc;
		}
	}

	if (ssrcs.size === 0)
		throw new Error(`a=ssrc line not found for local track [track.id:${track.id}]`);

	// Get media and RTX SSRCs.

	const ssrcToRtxSsrc = new Map();

	// First assume RTX is used.
	for (const line of mSection.ssrcGroups || [])
	{
		if (line.semantics !== 'FID')
			continue;

		let [ ssrc, rtxSsrc ] = line.ssrcs.split(/\s+/);

		ssrc = Number(ssrc);
		rtxSsrc = Number(rtxSsrc);

		if (ssrcs.has(ssrc))
		{
			// Remove both the SSRC and RTX SSRC from the Set so later we know that they
			// are already handled.
			ssrcs.delete(ssrc);
			ssrcs.delete(rtxSsrc);

			// Add to the map.
			ssrcToRtxSsrc.set(ssrc, rtxSsrc);
		}
	}

	// If the Set of SSRCs is not empty it means that RTX is not being used, so take
	// media SSRCs from there.
	for (const ssrc of ssrcs)
	{
		// Add to the map.
		ssrcToRtxSsrc.set(ssrc, null);
	}

	// Get RTCP info.

	const ssrcCnameLine = mSection.ssrcs
		.find((line) =>
		{
			return (line.attribute === 'cname' && line.id === firstSsrc);
		});

	if (ssrcCnameLine)
		rtcp.cname = ssrcCnameLine.value;

	// Fill RTP parameters.

	rtpParameters.rtcp = rtcp;
	rtpParameters.encodings = [];

	const simulcast = ssrcToRtxSsrc.size > 1;
	const simulcastProfiles = [ 'low', 'medium', 'high' ];

	for (const [ ssrc, rtxSsrc ] of ssrcToRtxSsrc)
	{
		const encoding = { ssrc };

		if (rtxSsrc)
			encoding.rtx = { ssrc: rtxSsrc };

		if (simulcast)
			encoding.profile = simulcastProfiles.shift();

		rtpParameters.encodings.push(encoding);
	}
}

/**
 * Adds simulcast into the given SDP for the given track.
 *
 * @param {Object} sdpObj - Local SDP Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 */
function addSimulcastForTrack(sdpObj, track)
{
	const kind = track.kind;

	const mSection = (sdpObj.media || [])
		.find((m) => m.type === kind);

	if (!mSection)
		throw new Error(`m=${kind} section not found`);

	let ssrc;
	let rtxSsrc;
	let msid;

	// Get the SSRC.

	const ssrcMsidLine = (mSection.ssrcs || [])
		.find((line) =>
		{
			if (line.attribute !== 'msid')
				return false;

			const trackId = line.value.split(' ')[1];

			if (trackId === track.id)
			{
				ssrc = line.id;
				msid = line.value.split(' ')[0];

				return true;
			}
		});

	if (!ssrcMsidLine)
		throw new Error(`a=ssrc line not found for local track [track.id:${track.id}]`);

	// Get the SSRC for RTX.

	(mSection.ssrcGroups || [])
		.some((line) =>
		{
			if (line.semantics !== 'FID')
				return;

			const ssrcs = line.ssrcs.split(/\s+/);

			if (Number(ssrcs[0]) === ssrc)
			{
				rtxSsrc = Number(ssrcs[1]);

				return true;
			}
		});

	const ssrcCnameLine = mSection.ssrcs
		.find((line) =>
		{
			return (line.attribute === 'cname' && line.id === ssrc);
		});

	if (!ssrcCnameLine)
		throw new Error(`CNAME line not found for local track [track.id:${track.id}]`);

	const cname = ssrcCnameLine.value;
	const ssrc2 = ssrc + 1;
	const ssrc3 = ssrc + 2;

	mSection.ssrcGroups = mSection.ssrcGroups || [];

	mSection.ssrcGroups.push(
		{
			semantics : 'SIM',
			ssrcs     : `${ssrc} ${ssrc2} ${ssrc3}`
		});

	mSection.ssrcs.push(
		{
			id        : ssrc2,
			attribute : 'cname',
			value     : cname
		});

	mSection.ssrcs.push(
		{
			id        : ssrc2,
			attribute : 'msid',
			value     : `${msid} ${track.id}`
		});

	mSection.ssrcs.push(
		{
			id        : ssrc3,
			attribute : 'cname',
			value     : cname
		});

	mSection.ssrcs.push(
		{
			id        : ssrc3,
			attribute : 'msid',
			value     : `${msid} ${track.id}`
		});

	if (rtxSsrc)
	{
		const rtxSsrc2 = rtxSsrc + 1;
		const rtxSsrc3 = rtxSsrc + 2;

		mSection.ssrcGroups.push(
			{
				semantics : 'FID',
				ssrcs     : `${ssrc2} ${rtxSsrc2}`
			});

		mSection.ssrcs.push(
			{
				id        : rtxSsrc2,
				attribute : 'cname',
				value     : cname
			});

		mSection.ssrcs.push(
			{
				id        : rtxSsrc2,
				attribute : 'msid',
				value     : `${msid} ${track.id}`
			});

		mSection.ssrcGroups.push(
			{
				semantics : 'FID',
				ssrcs     : `${ssrc3} ${rtxSsrc3}`
			});

		mSection.ssrcs.push(
			{
				id        : rtxSsrc3,
				attribute : 'cname',
				value     : cname
			});

		mSection.ssrcs.push(
			{
				id        : rtxSsrc3,
				attribute : 'msid',
				value     : `${msid} ${track.id}`
			});
	}
}


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sdp_transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(2);




const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('RemotePlanBSdp');

class RemoteSdp
{
	constructor(rtpParametersByKind)
	{
		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Transport local parameters, including DTLS parameteres.
		// @type {Object}
		this._transportLocalParameters = null;

		// Transport remote parameters, including ICE parameters, ICE candidates
		// and DTLS parameteres.
		// @type {Object}
		this._transportRemoteParameters = null;

		// SDP global fields.
		// @type {Object}
		this._sdpGlobalFields =
		{
			id      : __WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */](),
			version : 0
		};
	}

	setTransportLocalParameters(transportLocalParameters)
	{
		logger.debug(
			'setTransportLocalParameters() [transportLocalParameters:%o]',
			transportLocalParameters);

		this._transportLocalParameters = transportLocalParameters;
	}

	setTransportRemoteParameters(transportRemoteParameters)
	{
		logger.debug(
			'setTransportRemoteParameters() [transportRemoteParameters:%o]',
			transportRemoteParameters);

		this._transportRemoteParameters = transportRemoteParameters;
	}

	updateTransportRemoteIceParameters(remoteIceParameters)
	{
		logger.debug(
			'updateTransportRemoteIceParameters() [remoteIceParameters:%o]',
			remoteIceParameters);

		this._transportRemoteParameters.iceParameters = remoteIceParameters;
	}
}

class SendRemoteSdp extends RemoteSdp
{
	constructor(rtpParametersByKind)
	{
		super(rtpParametersByKind);
	}

	createAnswerSdp(localSdpObj)
	{
		logger.debug('createAnswerSdp()');

		if (!this._transportLocalParameters)
			throw new Error('no transport local parameters');
		else if (!this._transportRemoteParameters)
			throw new Error('no transport remote parameters');

		const remoteIceParameters = this._transportRemoteParameters.iceParameters;
		const remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
		const remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
		const sdpObj = {};
		const mids = (localSdpObj.media || [])
			.map((m) => m.mid);

		// Increase our SDP version.
		this._sdpGlobalFields.version++;

		sdpObj.version = 0;
		sdpObj.origin =
		{
			address        : '0.0.0.0',
			ipVer          : 4,
			netType        : 'IN',
			sessionId      : this._sdpGlobalFields.id,
			sessionVersion : this._sdpGlobalFields.version,
			username       : 'mediasoup-client'
		};
		sdpObj.name = '-';
		sdpObj.timing = { start: 0, stop: 0 };
		sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
		sdpObj.msidSemantic =
		{
			semantic : 'WMS',
			token    : '*'
		};
		sdpObj.groups =
		[
			{
				type : 'BUNDLE',
				mids : mids.join(' ')
			}
		];
		sdpObj.media = [];

		// NOTE: We take the latest fingerprint.
		const numFingerprints = remoteDtlsParameters.fingerprints.length;

		sdpObj.fingerprint =
		{
			type : remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
			hash : remoteDtlsParameters.fingerprints[numFingerprints - 1].value
		};

		for (const localMediaObj of localSdpObj.media || [])
		{
			const kind = localMediaObj.type;
			const codecs = this._rtpParametersByKind[kind].codecs;
			const headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
			const remoteMediaObj = {};

			remoteMediaObj.type = localMediaObj.type;
			remoteMediaObj.port = 7;
			remoteMediaObj.protocol = 'RTP/SAVPF';
			remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
			remoteMediaObj.mid = localMediaObj.mid;

			remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
			remoteMediaObj.icePwd = remoteIceParameters.password;
			remoteMediaObj.candidates = [];

			for (const candidate of remoteIceCandidates)
			{
				const candidateObj = {};

				// mediasoup does not support non rtcp-mux so candidates component is
				// always RTP (1).
				candidateObj.component = 1;
				candidateObj.foundation = candidate.foundation;
				candidateObj.ip = candidate.ip;
				candidateObj.port = candidate.port;
				candidateObj.priority = candidate.priority;
				candidateObj.transport = candidate.protocol;
				candidateObj.type = candidate.type;
				if (candidate.tcpType)
					candidateObj.tcptype = candidate.tcpType;

				remoteMediaObj.candidates.push(candidateObj);
			}

			remoteMediaObj.endOfCandidates = 'end-of-candidates';

			// Announce support for ICE renomination.
			// https://tools.ietf.org/html/draft-thatcher-ice-renomination
			remoteMediaObj.iceOptions = 'renomination';

			switch (remoteDtlsParameters.role)
			{
				case 'client':
					remoteMediaObj.setup = 'active';
					break;
				case 'server':
					remoteMediaObj.setup = 'passive';
					break;
			}

			switch (localMediaObj.direction)
			{
				case 'sendrecv':
				case 'sendonly':
					remoteMediaObj.direction = 'recvonly';
					break;
				case 'recvonly':
				case 'inactive':
					remoteMediaObj.direction = 'inactive';
					break;
			}

			// If video, be ready for simulcast.
			if (kind === 'video')
				remoteMediaObj.xGoogleFlag = 'conference';

			remoteMediaObj.rtp = [];
			remoteMediaObj.rtcpFb = [];
			remoteMediaObj.fmtp = [];

			for (const codec of codecs)
			{
				const rtp =
				{
					payload : codec.payloadType,
					codec   : codec.name,
					rate    : codec.clockRate
				};

				if (codec.channels > 1)
					rtp.encoding = codec.channels;

				remoteMediaObj.rtp.push(rtp);

				if (codec.parameters)
				{
					const paramFmtp =
					{
						payload : codec.payloadType,
						config  : ''
					};

					for (const key of Object.keys(codec.parameters))
					{
						if (paramFmtp.config)
							paramFmtp.config += ';';

						paramFmtp.config += `${key}=${codec.parameters[key]}`;
					}

					if (paramFmtp.config)
						remoteMediaObj.fmtp.push(paramFmtp);
				}

				if (codec.rtcpFeedback)
				{
					for (const fb of codec.rtcpFeedback)
					{
						remoteMediaObj.rtcpFb.push(
							{
								payload : codec.payloadType,
								type    : fb.type,
								subtype : fb.parameter || ''
							});
					}
				}
			}

			remoteMediaObj.payloads = codecs
				.map((codec) => codec.payloadType)
				.join(' ');

			remoteMediaObj.ext = [];

			for (const ext of headerExtensions)
			{
				// Don't add a header extension if not present in the offer.
				const matchedLocalExt = (localMediaObj.ext || [])
					.find((localExt) => localExt.uri === ext.uri);

				if (!matchedLocalExt)
					continue;

				remoteMediaObj.ext.push(
					{
						uri   : ext.uri,
						value : ext.id
					});
			}

			remoteMediaObj.rtcpMux = 'rtcp-mux';
			remoteMediaObj.rtcpRsize = 'rtcp-rsize';

			// Push it.
			sdpObj.media.push(remoteMediaObj);
		}

		const sdp = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.write(sdpObj);

		return sdp;
	}
}

class RecvRemoteSdp extends RemoteSdp
{
	constructor(rtpParametersByKind)
	{
		super(rtpParametersByKind);

		// Id of the unique MediaStream for all the remote tracks.
		this._streamId = `recv-stream-${__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */]()}`;
	}

	/**
	 * @param {Array<String>} kinds - Media kinds.
	 * @param {Array<Object>} consumerInfos - Consumer informations.
	 * @return {String}
	 */
	createOfferSdp(kinds, consumerInfos)
	{
		logger.debug('createOfferSdp()');

		if (!this._transportRemoteParameters)
			throw new Error('no transport remote parameters');

		const remoteIceParameters = this._transportRemoteParameters.iceParameters;
		const remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
		const remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
		const sdpObj = {};
		const mids = kinds;

		// Increase our SDP version.
		this._sdpGlobalFields.version++;

		sdpObj.version = 0;
		sdpObj.origin =
		{
			address        : '0.0.0.0',
			ipVer          : 4,
			netType        : 'IN',
			sessionId      : this._sdpGlobalFields.id,
			sessionVersion : this._sdpGlobalFields.version,
			username       : 'mediasoup-client'
		};
		sdpObj.name = '-';
		sdpObj.timing = { start: 0, stop: 0 };
		sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
		sdpObj.msidSemantic =
		{
			semantic : 'WMS',
			token    : '*'
		};
		sdpObj.groups =
		[
			{
				type : 'BUNDLE',
				mids : mids.join(' ')
			}
		];
		sdpObj.media = [];

		// NOTE: We take the latest fingerprint.
		const numFingerprints = remoteDtlsParameters.fingerprints.length;

		sdpObj.fingerprint =
		{
			type : remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
			hash : remoteDtlsParameters.fingerprints[numFingerprints - 1].value
		};

		for (const kind of kinds)
		{
			const codecs = this._rtpParametersByKind[kind].codecs;
			const headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
			const remoteMediaObj = {};

			remoteMediaObj.type = kind;
			remoteMediaObj.port = 7;
			remoteMediaObj.protocol = 'RTP/SAVPF';
			remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
			remoteMediaObj.mid = kind;

			remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
			remoteMediaObj.icePwd = remoteIceParameters.password;
			remoteMediaObj.candidates = [];

			for (const candidate of remoteIceCandidates)
			{
				const candidateObj = {};

				// mediasoup does not support non rtcp-mux so candidates component is
				// always RTP (1).
				candidateObj.component = 1;
				candidateObj.foundation = candidate.foundation;
				candidateObj.ip = candidate.ip;
				candidateObj.port = candidate.port;
				candidateObj.priority = candidate.priority;
				candidateObj.transport = candidate.protocol;
				candidateObj.type = candidate.type;
				if (candidate.tcpType)
					candidateObj.tcptype = candidate.tcpType;

				remoteMediaObj.candidates.push(candidateObj);
			}

			remoteMediaObj.endOfCandidates = 'end-of-candidates';

			// Announce support for ICE renomination.
			// https://tools.ietf.org/html/draft-thatcher-ice-renomination
			remoteMediaObj.iceOptions = 'renomination';

			remoteMediaObj.setup = 'actpass';

			if (consumerInfos.some((info) => info.kind === kind))
				remoteMediaObj.direction = 'sendonly';
			else
				remoteMediaObj.direction = 'inactive';

			remoteMediaObj.rtp = [];
			remoteMediaObj.rtcpFb = [];
			remoteMediaObj.fmtp = [];

			for (const codec of codecs)
			{
				const rtp =
				{
					payload : codec.payloadType,
					codec   : codec.name,
					rate    : codec.clockRate
				};

				if (codec.channels > 1)
					rtp.encoding = codec.channels;

				remoteMediaObj.rtp.push(rtp);

				if (codec.parameters)
				{
					const paramFmtp =
					{
						payload : codec.payloadType,
						config  : ''
					};

					for (const key of Object.keys(codec.parameters))
					{
						if (paramFmtp.config)
							paramFmtp.config += ';';

						paramFmtp.config += `${key}=${codec.parameters[key]}`;
					}

					if (paramFmtp.config)
						remoteMediaObj.fmtp.push(paramFmtp);
				}

				if (codec.rtcpFeedback)
				{
					for (const fb of codec.rtcpFeedback)
					{
						remoteMediaObj.rtcpFb.push(
							{
								payload : codec.payloadType,
								type    : fb.type,
								subtype : fb.parameter || ''
							});
					}
				}
			}

			remoteMediaObj.payloads = codecs
				.map((codec) => codec.payloadType)
				.join(' ');

			remoteMediaObj.ext = [];

			for (const ext of headerExtensions)
			{
				remoteMediaObj.ext.push(
					{
						uri   : ext.uri,
						value : ext.id
					});
			}

			remoteMediaObj.rtcpMux = 'rtcp-mux';
			remoteMediaObj.rtcpRsize = 'rtcp-rsize';

			remoteMediaObj.ssrcs = [];
			remoteMediaObj.ssrcGroups = [];

			for (const info of consumerInfos)
			{
				if (info.kind !== kind)
					continue;

				remoteMediaObj.ssrcs.push(
					{
						id        : info.ssrc,
						attribute : 'msid',
						value     : `${this._streamId} ${info.trackId}`
					});

				remoteMediaObj.ssrcs.push(
					{
						id        : info.ssrc,
						attribute : 'mslabel',
						value     : this._streamId
					});

				remoteMediaObj.ssrcs.push(
					{
						id        : info.ssrc,
						attribute : 'label',
						value     : info.trackId
					});

				remoteMediaObj.ssrcs.push(
					{
						id        : info.ssrc,
						attribute : 'cname',
						value     : info.cname
					});

				if (info.rtxSsrc)
				{
					remoteMediaObj.ssrcs.push(
						{
							id        : info.rtxSsrc,
							attribute : 'msid',
							value     : `${this._streamId} ${info.trackId}`
						});

					remoteMediaObj.ssrcs.push(
						{
							id        : info.rtxSsrc,
							attribute : 'mslabel',
							value     : this._streamId
						});

					remoteMediaObj.ssrcs.push(
						{
							id        : info.rtxSsrc,
							attribute : 'label',
							value     : info.trackId
						});

					remoteMediaObj.ssrcs.push(
						{
							id        : info.rtxSsrc,
							attribute : 'cname',
							value     : info.cname
						});

					// Associate original and retransmission SSRC.
					remoteMediaObj.ssrcGroups.push(
						{
							semantics : 'FID',
							ssrcs     : `${info.ssrc} ${info.rtxSsrc}`
						});
				}
			}

			// Push it.
			sdpObj.media.push(remoteMediaObj);
		}

		const sdp = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.write(sdpObj);

		return sdp;
	}
}

class RemotePlanBSdp
{
	constructor(direction, rtpParametersByKind)
	{
		logger.debug(
			'constructor() [direction:%s, rtpParametersByKind:%o]',
			direction, rtpParametersByKind);

		switch (direction)
		{
			case 'send':
				return new SendRemoteSdp(rtpParametersByKind);
			case 'recv':
				return new RecvRemoteSdp(rtpParametersByKind);
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RemotePlanBSdp;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const setRoomUrl = (url) =>
{
	return {
		type    : 'SET_ROOM_URL',
		payload : { url }
	};
};
/* unused harmony export setRoomUrl */


const setRoomState = (state) =>
{
	return {
		type    : 'SET_ROOM_STATE',
		payload : { state }
	};
};
/* unused harmony export setRoomState */


const setRoomActiveSpeaker = (peerName) =>
{
	return {
		type    : 'SET_ROOM_ACTIVE_SPEAKER',
		payload : { peerName }
	};
};
/* unused harmony export setRoomActiveSpeaker */


const setMe = ({ peerName, displayName, displayNameSet, device }) =>
{
	return {
		type    : 'SET_ME',
		payload : { peerName, displayName, displayNameSet, device }
	};
};
/* harmony export (immutable) */ __webpack_exports__["c"] = setMe;


const setMediaCapabilities = ({ canSendMic, canSendWebcam }) =>
{
	return {
		type    : 'SET_MEDIA_CAPABILITIES',
		payload : { canSendMic, canSendWebcam }
	};
};
/* unused harmony export setMediaCapabilities */


const setCanChangeWebcam = (flag) =>
{
	return {
		type    : 'SET_CAN_CHANGE_WEBCAM',
		payload : flag
	};
};
/* unused harmony export setCanChangeWebcam */


const setDisplayName = (displayName) =>
{
	return {
		type    : 'SET_DISPLAY_NAME',
		payload : { displayName }
	};
};
/* unused harmony export setDisplayName */


const setAudioOnlyState = (enabled) =>
{
	return {
		type    : 'SET_AUDIO_ONLY_STATE',
		payload : { enabled }
	};
};
/* unused harmony export setAudioOnlyState */


const setAudioOnlyInProgress = (flag) =>
{
	return {
		type    : 'SET_AUDIO_ONLY_IN_PROGRESS',
		payload : { flag }
	};
};
/* unused harmony export setAudioOnlyInProgress */


const setRestartIceInProgress = (flag) =>
{
	return {
		type    : 'SET_RESTART_ICE_IN_PROGRESS',
		payload : { flag }
	};
};
/* unused harmony export setRestartIceInProgress */


const addProducer = (producer) =>
{
	return {
		type    : 'ADD_PRODUCER',
		payload : { producer }
	};
};
/* unused harmony export addProducer */


const removeProducer = (producerId) =>
{
	return {
		type    : 'REMOVE_PRODUCER',
		payload : { producerId }
	};
};
/* unused harmony export removeProducer */


const setProducerPaused = (producerId, originator) =>
{
	return {
		type    : 'SET_PRODUCER_PAUSED',
		payload : { producerId, originator }
	};
};
/* unused harmony export setProducerPaused */


const setProducerResumed = (producerId, originator) =>
{
	return {
		type    : 'SET_PRODUCER_RESUMED',
		payload : { producerId, originator }
	};
};
/* unused harmony export setProducerResumed */


const setProducerTrack = (producerId, track) =>
{
	return {
		type    : 'SET_PRODUCER_TRACK',
		payload : { producerId, track }
	};
};
/* unused harmony export setProducerTrack */


const setWebcamInProgress = (flag) =>
{
	return {
		type    : 'SET_WEBCAM_IN_PROGRESS',
		payload : { flag }
	};
};
/* unused harmony export setWebcamInProgress */


const addPeer = (peer) =>
{
	return {
		type    : 'ADD_PEER',
		payload : { peer }
	};
};
/* unused harmony export addPeer */


const removePeer = (peerName) =>
{
	return {
		type    : 'REMOVE_PEER',
		payload : { peerName }
	};
};
/* unused harmony export removePeer */


const setPeerDisplayName = (displayName, peerName) =>
{
	return {
		type    : 'SET_PEER_DISPLAY_NAME',
		payload : { displayName, peerName }
	};
};
/* unused harmony export setPeerDisplayName */


const addConsumer = (consumer, peerName) =>
{
	return {
		type    : 'ADD_CONSUMER',
		payload : { consumer, peerName }
	};
};
/* unused harmony export addConsumer */


const removeConsumer = (consumerId, peerName) =>
{
	return {
		type    : 'REMOVE_CONSUMER',
		payload : { consumerId, peerName }
	};
};
/* unused harmony export removeConsumer */


const setConsumerPaused = (consumerId, originator) =>
{
	return {
		type    : 'SET_CONSUMER_PAUSED',
		payload : { consumerId, originator }
	};
};
/* unused harmony export setConsumerPaused */


const setConsumerResumed = (consumerId, originator) =>
{
	return {
		type    : 'SET_CONSUMER_RESUMED',
		payload : { consumerId, originator }
	};
};
/* unused harmony export setConsumerResumed */


const setConsumerEffectiveProfile = (consumerId, profile) =>
{
	return {
		type    : 'SET_CONSUMER_EFFECTIVE_PROFILE',
		payload : { consumerId, profile }
	};
};
/* unused harmony export setConsumerEffectiveProfile */


const setConsumerTrack = (consumerId, track) =>
{
	return {
		type    : 'SET_CONSUMER_TRACK',
		payload : { consumerId, track }
	};
};
/* unused harmony export setConsumerTrack */


const addNotification = (notification) =>
{
	return {
		type    : 'ADD_NOTIFICATION',
		payload : { notification }
	};
};
/* harmony export (immutable) */ __webpack_exports__["a"] = addNotification;


const removeNotification = (notificationId) =>
{
	return {
		type    : 'REMOVE_NOTIFICATION',
		payload : { notificationId }
	};
};
/* harmony export (immutable) */ __webpack_exports__["b"] = removeNotification;


const removeAllNotifications = () =>
{
	return {
		type : 'REMOVE_ALL_NOTIFICATIONS'
	};
};
/* unused harmony export removeAllNotifications */



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global, process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_logger__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_logger___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_redux_logger__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mediasoup_client__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Logger__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__redux_requestActions__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__redux_stateActions__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__redux_reducers__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__redux_roomClientMiddleware__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_wildemitter__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_wildemitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_wildemitter__);
// import domready from 'domready';
// import UrlParse from 'url-parse';
// import React from 'react';
// import { render } from 'react-dom';
// import { Provider } from 'react-redux';




// import randomString from 'random-string';
// import randomName from 'node-random-name';


// import * as cookiesManager from './cookiesManager';





// import Room from './components/Room';

class Init{
	constructor(config){
		global.emitter = this.emitter = new __WEBPACK_IMPORTED_MODULE_10_wildemitter__["default"]()
		this.roomClientMiddleware = __WEBPACK_IMPORTED_MODULE_9__redux_roomClientMiddleware__["a" /* default */]
		const logger = new __WEBPACK_IMPORTED_MODULE_4__Logger__["a" /* default */]();

		this.emitter.on("joinRoom",(client)=>{
	        this.client = client
	    })

	    //settingup redux
		const reduxMiddlewares =
		[
			__WEBPACK_IMPORTED_MODULE_1_redux_thunk___default.a,
			__WEBPACK_IMPORTED_MODULE_9__redux_roomClientMiddleware__["a" /* default */]
		];

		

		if (process.env.NODE_ENV === 'development')
		{
			const reduxLogger = Object(__WEBPACK_IMPORTED_MODULE_2_redux_logger__["createLogger"])(
				{
					duration  : true,
					timestamp : false,
					level     : 'log',
					logErrors : true
				});

			reduxMiddlewares.push(reduxLogger);
		}


		const store = this.store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["c" /* createStore */])(
			__WEBPACK_IMPORTED_MODULE_8__redux_reducers__["a" /* default */],
			undefined,
			Object(__WEBPACK_IMPORTED_MODULE_0_redux__["a" /* applyMiddleware */])(...reduxMiddlewares)
		);
		//room settings
		const peerName = config.peerName
		// const urlParser = new UrlParse(window.location.href, true);
		let roomId = config.roomId;
		const produce = config.produce || true;
		let displayName = config.displayName;
		const isSipEndpoint = config.sipEndpoint || false;
		const useSimulcast = config.useSimulcast || false;
		const media_server_wss = config.media_server_wss
		const turnservers = config.turnservers || []


		// if (!roomId)
		// {
		// 	roomId = randomString({ length: 8 }).toLowerCase();

		// 	urlParser.query.roomId = roomId;
		// 	window.history.pushState('', '', urlParser.toString());
		// }

		// Get the effective/shareable Room URL.
		// const roomUrlParser = new UrlParse(window.location.href, true);

		// for (const key of Object.keys(roomUrlParser.query))
		// {
		// 	// Don't keep some custom params.
		// 	switch (key)
		// 	{
		// 		case 'roomId':
		// 		case 'simulcast':
		// 			break;
		// 		default:
		// 			delete roomUrlParser.query[key];
		// 	}
		// }
		// delete roomUrlParser.hash;

		// const roomUrl = roomUrlParser.toString();

		// Get displayName from cookie (if not already given as param).
		// const userCookie = cookiesManager.getUser() || {};
		let displayNameSet;

		// if (!displayName)
		// 	displayName = userCookie.displayName;

		if (displayName)
		{
			displayNameSet = true;
		}
		else
		{
			displayName = ""
			displayNameSet = false;
		}

		// Get current device.
		const device = Object(__WEBPACK_IMPORTED_MODULE_3_mediasoup_client__["a" /* getDeviceInfo */])();

		// If a SIP endpoint mangle device info.
		if (isSipEndpoint)
		{
			device.flag = 'sipendpoint';
			device.name = 'SIP Endpoint';
			device.version = undefined;
		}

		// // NOTE: I don't like this.
		// store.dispatch(
		// 	stateActions.setRoomUrl(roomUrl));

		// NOTE: I don't like this.
		store.dispatch(
			__WEBPACK_IMPORTED_MODULE_7__redux_stateActions__["c" /* setMe */]({ peerName, displayName, displayNameSet, device }));

		// NOTE: I don't like this.
		store.dispatch(
			__WEBPACK_IMPORTED_MODULE_6__redux_requestActions__["a" /* joinRoom */](
				{ media_server_wss, roomId, peerName, displayName, device, useSimulcast, produce, turnservers }));

		// TODO: Debugging stuff.

		// setInterval(() =>
		// {
		// 	if (!global.CLIENT._room.peers[0])
		// 	{
		// 		delete global.CONSUMER;

		// 		return;
		// 	}

		// 	const peer = global.CLIENT._room.peers[0];

		// 	global.CONSUMER = peer.consumers[peer.consumers.length - 1];
		// }, 2000);

		// global.sendSdp = function()
		// {
		// 	logger.debug('---------- SEND_TRANSPORT LOCAL SDP OFFER:');
		// 	logger.debug(
		// 		global.CLIENT._sendTransport._handler._pc.localDescription.sdp);

		// 	logger.debug('---------- SEND_TRANSPORT REMOTE SDP ANSWER:');
		// 	logger.debug(
		// 		global.CLIENT._sendTransport._handler._pc.remoteDescription.sdp);
		// };

		// global.recvSdp = function()
		// {
		// 	logger.debug('---------- RECV_TRANSPORT REMOTE SDP OFFER:');
		// 	logger.debug(
		// 		global.CLIENT._recvTransport._handler._pc.remoteDescription.sdp);

		// 	logger.debug('---------- RECV_TRANSPORT LOCAL SDP ANSWER:');
		// 	logger.debug(
		// 		global.CLIENT._recvTransport._handler._pc.localDescription.sdp);
		// };
	}

}
/* harmony export (immutable) */ __webpack_exports__["Init"] = Init;


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3), __webpack_require__(5)))

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(27);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? Object(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : Object(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(25);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(13);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(29);


/** Built-in value references. */
var getPrototype = Object(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(32);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(34);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(33)(module)))

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(14);




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!Object(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyMiddleware;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(15);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {!function(e,t){ true?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isDeviceSupported */
/* harmony export (immutable) */ __webpack_exports__["a"] = getDeviceInfo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Device__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Room__ = __webpack_require__(55);
/* unused harmony reexport Room */



/**
 * Whether the current browser or device is supported.
 *
 * @return {Boolean}
 *
 * @example
 * isDeviceSupported()
 * // => true
 */
function isDeviceSupported()
{
	return __WEBPACK_IMPORTED_MODULE_0__Device__["a" /* default */].isSupported();
}

/**
 * Get information regarding the current browser or device.
 *
 * @return {Object} - Object with `name` (String) and version {String}.
 *
 * @example
 * getDeviceInfo()
 * // => { flag: 'chrome', name: 'Chrome', version: '59.0', bowser: {} }
 */
function getDeviceInfo()
{
	return {
		flag    : __WEBPACK_IMPORTED_MODULE_0__Device__["a" /* default */].flag,
		name    : __WEBPACK_IMPORTED_MODULE_0__Device__["a" /* default */].name,
		version : __WEBPACK_IMPORTED_MODULE_0__Device__["a" /* default */].version,
		bowser  : __WEBPACK_IMPORTED_MODULE_0__Device__["a" /* default */].bowser
	};
}

/**
 * Expose the Room class.
 *
 * @example
 * const room = new Room();`
 */



/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */

!function (root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (true) __webpack_require__(42)(name, definition)
  else root[name] = definition()
}(this, 'bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
      , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
      , chromeos = /CrOS/.test(ua)
      , silk = /silk/i.test(ua)
      , sailfish = /sailfish/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webos = /(web|hpw)os/i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , samsungBrowser = /SamsungBrowser/i.test(ua)
      , windows = !windowsphone && /windows/i.test(ua)
      , mac = !iosdevice && !silk && /macintosh/i.test(ua)
      , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
      , edgeVersion = getSecondMatch(/edg([ea]|ios)\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua) && !/tablet pc/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , xbox = /xbox/i.test(ua)
      , result

    if (/opera/i.test(ua)) {
      //  an old Opera
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/opr\/|opios/i.test(ua)) {
      // a new Opera
      result = {
        name: 'Opera'
        , opera: t
        , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/SamsungBrowser/i.test(ua)) {
      result = {
        name: 'Samsung Internet for Android'
        , samsungBrowser: t
        , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/coast/i.test(ua)) {
      result = {
        name: 'Opera Coast'
        , coast: t
        , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/ucbrowser/i.test(ua)) {
      result = {
          name: 'UC Browser'
        , ucbrowser: t
        , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/mxios/i.test(ua)) {
      result = {
        name: 'Maxthon'
        , maxthon: t
        , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/epiphany/i.test(ua)) {
      result = {
        name: 'Epiphany'
        , epiphany: t
        , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/puffin/i.test(ua)) {
      result = {
        name: 'Puffin'
        , puffin: t
        , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
      }
    }
    else if (/sleipnir/i.test(ua)) {
      result = {
        name: 'Sleipnir'
        , sleipnir: t
        , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/k-meleon/i.test(ua)) {
      result = {
        name: 'K-Meleon'
        , kMeleon: t
        , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (windowsphone) {
      result = {
        name: 'Windows Phone'
      , osname: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeos) {
      result = {
        name: 'Chrome'
      , osname: 'Chrome OS'
      , chromeos: t
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/edg([ea]|ios)/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/vivaldi/i.test(ua)) {
      result = {
        name: 'Vivaldi'
        , vivaldi: t
        , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (sailfish) {
      result = {
        name: 'Sailfish'
      , osname: 'Sailfish OS'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel|fxios/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
        result.osname = 'Firefox OS'
      }
    }
    else if (silk) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/slimerjs/i.test(ua)) {
      result = {
        name: 'SlimerJS'
        , slimer: t
        , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , osname: 'BlackBerry OS'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (webos) {
      result = {
        name: 'WebOS'
      , osname: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , osname: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (tizen) {
      result = {
        name: 'Tizen'
      , osname: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/qupzilla/i.test(ua)) {
      result = {
        name: 'QupZilla'
        , qupzilla: t
        , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
      }
    }
    else if (/chromium/i.test(ua)) {
      result = {
        name: 'Chromium'
        , chromium: t
        , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
        , chrome: t
        , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
        , version: versionIdentifier
      }
    }
    else if (/safari|applewebkit/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      }
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if(/googlebot/i.test(ua)) {
      result = {
        name: 'Googlebot'
      , googlebot: t
      , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      if (/(apple)?webkit\/537\.36/i.test(ua)) {
        result.name = result.name || "Blink"
        result.blink = t
      } else {
        result.name = result.name || "Webkit"
        result.webkit = t
      }
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.windowsphone && (android || result.silk)) {
      result.android = t
      result.osname = 'Android'
    } else if (!result.windowsphone && iosdevice) {
      result[iosdevice] = t
      result.ios = t
      result.osname = 'iOS'
    } else if (mac) {
      result.mac = t
      result.osname = 'macOS'
    } else if (xbox) {
      result.xbox = t
      result.osname = 'Xbox'
    } else if (windows) {
      result.windows = t
      result.osname = 'Windows'
    } else if (linux) {
      result.linux = t
      result.osname = 'Linux'
    }

    function getWindowsVersion (s) {
      switch (s) {
        case 'NT': return 'NT'
        case 'XP': return 'XP'
        case 'NT 5.0': return '2000'
        case 'NT 5.1': return 'XP'
        case 'NT 5.2': return '2003'
        case 'NT 6.0': return 'Vista'
        case 'NT 6.1': return '7'
        case 'NT 6.2': return '8'
        case 'NT 6.3': return '8.1'
        case 'NT 10.0': return '10'
        default: return undefined
      }
    }

    // OS version extraction
    var osVersion = '';
    if (result.windows) {
      osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i))
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.mac) {
      osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = !result.windows && osVersion.split('.')[0];
    if (
         tablet
      || nexusTablet
      || iosdevice == 'ipad'
      || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
      || result.silk
    ) {
      result.tablet = t
    } else if (
         mobile
      || iosdevice == 'iphone'
      || iosdevice == 'ipod'
      || android
      || nexusMobile
      || result.blackberry
      || result.webos
      || result.bada
    ) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
		    (result.vivaldi && result.version >= 1.0) ||
        (result.chrome && result.version >= 20) ||
        (result.samsungBrowser && result.version >= 4) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        || (result.chromium && result.version >= 20)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        || (result.chromium && result.version < 20)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  function getVersionPrecision(version) {
    return version.split(".").length;
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  function map(arr, iterator) {
    var result = [], i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i++) {
      result.push(iterator(arr[i]));
    }
    return result;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param  {Array<String>} versions versions to compare
   * @return {Number} comparison result
   */
  function compareVersions(versions) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    var precision = Math.max(getVersionPrecision(versions[0]), getVersionPrecision(versions[1]));
    var chunks = map(versions, function (version) {
      var delta = precision - getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      version = version + new Array(delta + 1).join(".0");

      // 3) "9.0" -> ["000000000"", "000000009"]
      return map(version.split("."), function (chunk) {
        return new Array(20 - chunk.length).join("0") + chunk;
      }).reverse();
    });

    // iterate in reverse order by reversed chunks array
    while (--precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      }
      else {
        return -1;
      }
    }
  }

  /**
   * Check if browser is unsupported
   *
   * @example
   *   bowser.isUnsupportedBrowser({
   *     msie: "10",
   *     firefox: "23",
   *     chrome: "29",
   *     safari: "5.1",
   *     opera: "16",
   *     phantom: "534"
   *   });
   *
   * @param  {Object}  minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function isUnsupportedBrowser(minVersions, strictMode, ua) {
    var _bowser = bowser;

    // make strictMode param optional with ua param usage
    if (typeof strictMode === 'string') {
      ua = strictMode;
      strictMode = void(0);
    }

    if (strictMode === void(0)) {
      strictMode = false;
    }
    if (ua) {
      _bowser = detect(ua);
    }

    var version = "" + _bowser.version;
    for (var browser in minVersions) {
      if (minVersions.hasOwnProperty(browser)) {
        if (_bowser[browser]) {
          if (typeof minVersions[browser] !== 'string') {
            throw new Error('Browser version in the minVersion map should be a string: ' + browser + ': ' + String(minVersions));
          }

          // browser version and min supported version.
          return compareVersions([version, minVersions[browser]]) < 0;
        }
      }
    }

    return strictMode; // not found
  }

  /**
   * Check if browser is supported
   *
   * @param  {Object} minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function check(minVersions, strictMode, ua) {
    return !isUnsupportedBrowser(minVersions, strictMode, ua);
  }

  bowser.isUnsupportedBrowser = isUnsupportedBrowser;
  bowser.compareVersions = compareVersions;
  bowser.check = check;

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(44);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(16);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sdp_transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ortc__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sdp_RemotePlanBSdp__ = __webpack_require__(20);









const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('Chrome55');

class Handler extends __WEBPACK_IMPORTED_MODULE_2__EnhancedEventEmitter__["a" /* default */]
{
	constructor(direction, rtpParametersByKind, settings)
	{
		super(logger);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : settings.turnServers || [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemotePlanBSdp}
		this._remoteSdp = new __WEBPACK_IMPORTED_MODULE_7__sdp_RemotePlanBSdp__["a" /* default */](direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}
}

class SendHandler extends Handler
{
	constructor(rtpParametersByKind, settings)
	{
		super('send', rtpParametersByKind, settings);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();
	}

	addProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'addProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		if (this._stream.getTrackById(track.id))
			return Promise.reject('track already added');

		let localSdpObj;

		return Promise.resolve()
			.then(() =>
			{
				// Add the track to the local stream.
				this._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				this._pc.addStream(this._stream);

				return this._pc.createOffer();
			})
			.then((offer) =>
			{
				// If simulcast is set, mangle the offer.
				if (producer.simulcast)
				{
					logger.debug('addProducer() | enabling simulcast');

					const sdpObject = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(offer.sdp);

					__WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__["a" /* addSimulcastForTrack */](sdpObject, track);

					const offerSdp = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug(
					'addProducer() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				if (!this._transportReady)
					return this._setupTransport();
			})
			.then(() =>
			{
				localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);

				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'addProducer() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			})
			.then(() =>
			{
				const rtpParameters = __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clone */](this._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				__WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__["b" /* fillRtpParametersForTrack */](
					rtpParameters, localSdpObj, track);

				return rtpParameters;
			})
			.catch((error) =>
			{
				// Panic here. Try to undo things.

				this._stream.removeTrack(track);
				this._pc.addStream(this._stream);

				throw error;
			});
	}

	removeProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'removeProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		return Promise.resolve()
			.then(() =>
			{
				// Remove the track from the local stream.
				this._stream.removeTrack(track);

				// Add the stream to the PeerConnection.
				this._pc.addStream(this._stream);

				return this._pc.createOffer();
			})
			.then((offer) =>
			{
				logger.debug(
					'removeProducer() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.catch((error) =>
			{
				// NOTE: If there are no sending tracks, setLocalDescription() will fail with
				// "Failed to create channels". If so, ignore it.
				if (this._stream.getTracks().length === 0)
				{
					logger.warn(
						'removeProducer() | ignoring expected error due no sending tracks: %s',
						error.toString());

					return;
				}

				throw error;
			})
			.then(() =>
			{
				if (this._pc.signalingState === 'stable')
					return;

				const localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);
				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'removeProducer() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			});
	}

	replaceProducerTrack(producer, track)
	{
		logger.debug(
			'replaceProducerTrack() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		const oldTrack = producer.track;
		let localSdpObj;

		return Promise.resolve()
			.then(() =>
			{
				// Remove the old track from the local stream.
				this._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				this._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				this._pc.addStream(this._stream);

				return this._pc.createOffer();
			})
			.then((offer) =>
			{
				// If simulcast is set, mangle the offer.
				if (producer.simulcast)
				{
					logger.debug('addProducer() | enabling simulcast');

					const sdpObject = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(offer.sdp);

					__WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__["a" /* addSimulcastForTrack */](sdpObject, track);

					const offerSdp = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.write(sdpObject);

					offer = { type: 'offer', sdp: offerSdp };
				}

				logger.debug(
					'replaceProducerTrack() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);

				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'replaceProducerTrack() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			})
			.then(() =>
			{
				const rtpParameters = __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clone */](this._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for the new track.
				__WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__["b" /* fillRtpParametersForTrack */](
					rtpParameters, localSdpObj, track);

				// We need to provide new RTP parameters.
				this.safeEmit('@needupdateproducer', producer, rtpParameters);
			})
			.catch((error) =>
			{
				// Panic here. Try to undo things.

				this._stream.removeTrack(track);
				this._stream.addTrack(oldTrack);
				this._pc.addStream(this._stream);

				throw error;
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

		return Promise.resolve()
			.then(() =>
			{
				return this._pc.createOffer({ iceRestart: true });
			})
			.then((offer) =>
			{
				logger.debug(
					'restartIce() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				const localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);
				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'restartIce() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			});
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// Get our local DTLS parameters.
				const transportLocalParameters = {};
				const sdp = this._pc.localDescription.sdp;
				const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(sdp);
				const dtlsParameters = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["a" /* extractDtlsParameters */](sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				this._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return this.safeEmitAsPromise(
					'@needcreatetransport', transportLocalParameters);
			})
			.then((transportRemoteParameters) =>
			{
				// Provide the remote SDP handler with transport remote parameters.
				this._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				this._transportReady = true;
			});
	}
}

class RecvHandler extends Handler
{
	constructor(rtpParametersByKind, settings)
	{
		super('recv', rtpParametersByKind, settings);

		// Got transport remote parameters.
		// @type {Boolean}
		this._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		this._transportUpdated = false;

		// Seen media kinds.
		// @type {Set<String>}
		this._kinds = new Set();

		// Map of Consumers information indexed by consumer.id.
		// - kind {String}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		this._consumerInfos = new Map();
	}

	addConsumer(consumer)
	{
		logger.debug(
			'addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		if (this._consumerInfos.has(consumer.id))
			return Promise.reject('Consumer already added');

		const encoding = consumer.rtpParameters.encodings[0];
		const cname = consumer.rtpParameters.rtcp.cname;
		const consumerInfo =
		{
			kind    : consumer.kind,
			trackId : `consumer-${consumer.kind}-${consumer.id}`,
			ssrc    : encoding.ssrc,
			cname   : cname
		};

		if (encoding.rtx && encoding.rtx.ssrc)
			consumerInfo.rtxSsrc = encoding.rtx.ssrc;

		this._consumerInfos.set(consumer.id, consumerInfo);
		this._kinds.add(consumer.kind);

		return Promise.resolve()
			.then(() =>
			{
				if (!this._transportCreated)
					return this._setupTransport();
			})
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._kinds), Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'addConsumer() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'addConsumer() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			})
			.then(() =>
			{
				if (!this._transportUpdated)
					return this._updateTransport();
			})
			.then(() =>
			{
				const stream = this._pc.getRemoteStreams()[0];
				const track = stream.getTrackById(consumerInfo.trackId);

				if (!track)
					throw new Error('remote track not found');

				return track;
			});
	}

	removeConsumer(consumer)
	{
		logger.debug(
			'removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		if (!this._consumerInfos.has(consumer.id))
			return Promise.reject('Consumer not found');

		this._consumerInfos.delete(consumer.id);

		return Promise.resolve()
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._kinds), Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'removeConsumer() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'removeConsumer() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

		return Promise.resolve()
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._kinds), Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'restartIce() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'restartIce() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			});
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// We need transport remote parameters.
				return this.safeEmitAsPromise('@needcreatetransport', null);
			})
			.then((transportRemoteParameters) =>
			{
				// Provide the remote SDP handler with transport remote parameters.
				this._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				this._transportCreated = true;
			});
	}

	_updateTransport()
	{
		logger.debug('_updateTransport()');

		// Get our local DTLS parameters.
		// const transportLocalParameters = {};
		const sdp = this._pc.localDescription.sdp;
		const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(sdp);
		const dtlsParameters = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["a" /* extractDtlsParameters */](sdpObj);
		const transportLocalParameters = { dtlsParameters };

		// We need to provide transport local parameters.
		this.safeEmit('@needupdatetransport', transportLocalParameters);

		this._transportUpdated = true;
	}
}

class Chrome55
{
	static get name()
	{
		return 'Chrome55';
	}

	static getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		return pc.createOffer(
			{
				offerToReceiveAudio : true,
				offerToReceiveVideo : true
			})
			.then((offer) =>
			{
				try { pc.close(); }
				catch (error) {}

				const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(offer.sdp);
				const nativeRtpCapabilities = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["b" /* extractRtpCapabilities */](sdpObj);

				return nativeRtpCapabilities;
			})
			.catch((error) =>
			{
				try { pc.close(); }
				catch (error2) {}

				throw error;
			});
	}

	constructor(direction, extendedRtpCapabilities, settings)
	{
		logger.debug(
			'constructor() [direction:%s, extendedRtpCapabilities:%o]',
			direction, extendedRtpCapabilities);

		let rtpParametersByKind;

		switch (direction)
		{
			case 'send':
			{
				rtpParametersByKind =
				{
					audio : __WEBPACK_IMPORTED_MODULE_4__ortc__["f" /* getSendingRtpParameters */]('audio', extendedRtpCapabilities),
					video : __WEBPACK_IMPORTED_MODULE_4__ortc__["f" /* getSendingRtpParameters */]('video', extendedRtpCapabilities)
				};

				return new SendHandler(rtpParametersByKind, settings);
			}
			case 'recv':
			{
				rtpParametersByKind =
				{
					audio : __WEBPACK_IMPORTED_MODULE_4__ortc__["d" /* getReceivingFullRtpParameters */]('audio', extendedRtpCapabilities),
					video : __WEBPACK_IMPORTED_MODULE_4__ortc__["d" /* getReceivingFullRtpParameters */]('video', extendedRtpCapabilities)
				};

				return new RecvHandler(rtpParametersByKind, settings);
			}
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Chrome55;



/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var toIntIfInt = function (v) {
  return String(Number(v)) === v ? Number(v) : v;
};

var attachProperties = function (match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  }
  else {
    for (var i = 0; i < names.length; i += 1) {
      if (match[i+1] != null) {
        location[names[i]] = toIntIfInt(match[i+1]);
      }
    }
  }
};

var parseReg = function (obj, location, content) {
  var needsBlank = obj.name && obj.names;
  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  }
  else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }
  var keyLocation = obj.push ?
    {} :  // blank object that will be pushed
    needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
};

var grammar = __webpack_require__(17);
var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

exports.parse = function (sdp) {
  var session = {}
    , media = []
    , location = session; // points at where properties go under (one of the above)

  // parse lines we understand
  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
    var type = l[0];
    var content = l.slice(2);
    if (type === 'm') {
      media.push({rtp: [], fmtp: []});
      location = media[media.length-1]; // point at latest media line
    }

    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
      var obj = grammar[type][j];
      if (obj.reg.test(content)) {
        return parseReg(obj, location, content);
      }
    }
  });

  session.media = media; // link it up
  return session;
};

var paramReducer = function (acc, expr) {
  var s = expr.split(/=(.+)/, 2);
  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  }
  return acc;
};

exports.parseParams = function (str) {
  return str.split(/\;\s?/).reduce(paramReducer, {});
};

// For backward compatibility - alias will be removed in 3.0.0
exports.parseFmtpConfig = exports.parseParams;

exports.parsePayloads = function (str) {
  return str.split(' ').map(Number);
};

exports.parseRemoteCandidates = function (str) {
  var candidates = [];
  var parts = str.split(' ').map(toIntIfInt);
  for (var i = 0; i < parts.length; i += 3) {
    candidates.push({
      component: parts[i],
      ip: parts[i + 1],
      port: parts[i + 2]
    });
  }
  return candidates;
};

exports.parseImageAttributes = function (str) {
  return str.split(' ').map(function (item) {
    return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
  });
};

exports.parseSimulcastStreamList = function (str) {
  return str.split(';').map(function (stream) {
    return stream.split(',').map(function (format) {
      var scid, paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
        scid = toIntIfInt(format.substring(1, format.length));
        paused = true;
      }

      return {
        scid: scid,
        paused: paused
      };
    });
  });
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var grammar = __webpack_require__(17);

// customized util.format - discards excess arguments and can void middle ones
var formatRegExp = /%[sdv%]/g;
var format = function (formatStr) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  return formatStr.replace(formatRegExp, function (x) {
    if (i >= len) {
      return x; // missing argument
    }
    var arg = args[i];
    i += 1;
    switch (x) {
    case '%%':
      return '%';
    case '%s':
      return String(arg);
    case '%d':
      return Number(arg);
    case '%v':
      return '';
    }
  });
  // NB: we discard excess arguments - they are typically undefined from makeLine
};

var makeLine = function (type, obj, location) {
  var str = obj.format instanceof Function ?
    (obj.format(obj.push ? location : location[obj.name])) :
    obj.format;

  var args = [type + '=' + str];
  if (obj.names) {
    for (var i = 0; i < obj.names.length; i += 1) {
      var n = obj.names[i];
      if (obj.name) {
        args.push(location[obj.name][n]);
      }
      else { // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  }
  else {
    args.push(location[obj.name]);
  }
  return format.apply(null, args);
};

// RFC specified order
// TODO: extend this with all the rest
var defaultOuterOrder = [
  'v', 'o', 's', 'i',
  'u', 'e', 'p', 'c',
  'b', 't', 'r', 'z', 'a'
];
var defaultInnerOrder = ['i', 'c', 'b', 'a'];


module.exports = function (session, opts) {
  opts = opts || {};
  // ensure certain properties exist
  if (session.version == null) {
    session.version = 0; // 'v=0' must be there (only defined version atm)
  }
  if (session.name == null) {
    session.name = ' '; // 's= ' must be there if no meaningful name set
  }
  session.media.forEach(function (mLine) {
    if (mLine.payloads == null) {
      mLine.payloads = '';
    }
  });

  var outerOrder = opts.outerOrder || defaultOuterOrder;
  var innerOrder = opts.innerOrder || defaultInnerOrder;
  var sdp = [];

  // loop through outerOrder for matching properties on session
  outerOrder.forEach(function (type) {
    grammar[type].forEach(function (obj) {
      if (obj.name in session && session[obj.name] != null) {
        sdp.push(makeLine(type, obj, session));
      }
      else if (obj.push in session && session[obj.push] != null) {
        session[obj.push].forEach(function (el) {
          sdp.push(makeLine(type, obj, el));
        });
      }
    });
  });

  // then for each media line, follow the innerOrder
  session.media.forEach(function (mLine) {
    sdp.push(makeLine('m', grammar.m[0], mLine));

    innerOrder.forEach(function (type) {
      grammar[type].forEach(function (obj) {
        if (obj.name in mLine && mLine[obj.name] != null) {
          sdp.push(makeLine(type, obj, mLine));
        }
        else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach(function (el) {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });

  return sdp.join('\r\n') + '\r\n';
};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

void function(root){

  function defaults(options){
    var options = options || {}
    var min = options.min
    var max = options.max
    var integer = options.integer || false
    if ( min == null && max == null ) {
      min = 0
      max = 1
    } else if ( min == null ) {
      min = max - 1
    } else if ( max == null ) {
      max = min + 1
    }
    if ( max < min ) throw new Error('invalid options, max must be >= min')
    return {
      min:     min
    , max:     max
    , integer: integer
    }
  }

  function random(options){
    options = defaults(options)
    if ( options.max === options.min ) return options.min
    var r = Math.random() * (options.max - options.min + Number(!!options.integer)) + options.min
    return options.integer ? Math.floor(r) : r
  }

  function generator(options){
    options = defaults(options)
    return function(min, max, integer){
      options.min     = min != null ? min : options.min
      options.max     = max != null ? max : options.max
      options.integer = integer != null ? integer : options.integer
      return random(options)
    }
  }

  module.exports =  random
  module.exports.generator = generator
  module.exports.defaults = defaults
}(this)


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sdp_transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ortc__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sdp_RemotePlanBSdp__ = __webpack_require__(20);









const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('Safari11');

class Handler extends __WEBPACK_IMPORTED_MODULE_2__EnhancedEventEmitter__["a" /* default */]
{
	constructor(direction, rtpParametersByKind, settings)
	{
		super(logger);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : settings.turnServers || [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemotePlanBSdp}
		this._remoteSdp = new __WEBPACK_IMPORTED_MODULE_7__sdp_RemotePlanBSdp__["a" /* default */](direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}
}

class SendHandler extends Handler
{
	constructor(rtpParametersByKind, settings)
	{
		super('send', rtpParametersByKind, settings);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();
	}

	addProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'addProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		if (this._stream.getTrackById(track.id))
			return Promise.reject('track already added');

		let rtpSender;
		let localSdpObj;

		return Promise.resolve()
			.then(() =>
			{
				this._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				rtpSender = this._pc.addTrack(track, this._stream);

				return this._pc.createOffer();
			})
			.then((offer) =>
			{
				logger.debug(
					'addProducer() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				if (!this._transportReady)
					return this._setupTransport();
			})
			.then(() =>
			{
				localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);

				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'addProducer() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			})
			.then(() =>
			{
				const rtpParameters = __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clone */](this._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				__WEBPACK_IMPORTED_MODULE_6__sdp_planBUtils__["b" /* fillRtpParametersForTrack */](
					rtpParameters, localSdpObj, track);

				return rtpParameters;
			})
			.catch((error) =>
			{
				// Panic here. Try to undo things.

				try { this._pc.removeTrack(rtpSender); }
				catch (error2) {}

				this._stream.removeTrack(track);

				throw error;
			});
	}

	removeProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'removeProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		return Promise.resolve()
			.then(() =>
			{
				// Get the associated RTCRtpSender.
				const rtpSender = this._pc.getSenders()
					.find((s) => s.track === track);

				if (!rtpSender)
					throw new Error('RTCRtpSender found');

				// Remove the associated RtpSender.
				this._pc.removeTrack(rtpSender);

				// Remove the track from the local stream.
				this._stream.removeTrack(track);

				return this._pc.createOffer();
			})
			.then((offer) =>
			{
				logger.debug(
					'removeProducer() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.catch((error) =>
			{
				// NOTE: If there are no sending tracks, setLocalDescription() will fail with
				// "Failed to create channels". If so, ignore it.
				if (this._stream.getTracks().length === 0)
				{
					logger.warn(
						'removeLocalTrack() | ignoring expected error due no sending tracks: %s',
						error.toString());

					return;
				}

				throw error;
			})
			.then(() =>
			{
				if (this._pc.signalingState === 'stable')
					return;

				const localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);
				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'removeProducer() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			});
	}

	replaceProducerTrack(producer, track)
	{
		logger.debug(
			'replaceProducerTrack() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		const oldTrack = producer.track;

		return Promise.resolve()
			.then(() =>
			{
				// Get the associated RTCRtpSender.
				const rtpSender = this._pc.getSenders()
					.find((s) => s.track === oldTrack);

				if (!rtpSender)
					throw new Error('local track not found');

				return rtpSender.replaceTrack(track);
			})
			.then(() =>
			{
				// Remove the old track from the local stream.
				this._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				this._stream.addTrack(track);
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

		return Promise.resolve()
			.then(() =>
			{
				return this._pc.createOffer({ iceRestart: true });
			})
			.then((offer) =>
			{
				logger.debug(
					'restartIce() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				const localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);
				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'restartIce() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			});
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// Get our local DTLS parameters.
				const transportLocalParameters = {};
				const sdp = this._pc.localDescription.sdp;
				const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(sdp);
				const dtlsParameters = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["a" /* extractDtlsParameters */](sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				this._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return this.safeEmitAsPromise(
					'@needcreatetransport', transportLocalParameters);
			})
			.then((transportRemoteParameters) =>
			{
				// Provide the remote SDP handler with transport remote parameters.
				this._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				this._transportReady = true;
			});
	}
}

class RecvHandler extends Handler
{
	constructor(rtpParametersByKind, settings)
	{
		super('recv', rtpParametersByKind, settings);

		// Got transport remote parameters.
		// @type {Boolean}
		this._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		this._transportUpdated = false;

		// Seen media kinds.
		// @type {Set<String>}
		this._kinds = new Set();

		// Map of Consumers information indexed by consumer.id.
		// - kind {String}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		this._consumerInfos = new Map();
	}

	addConsumer(consumer)
	{
		logger.debug(
			'addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		if (this._consumerInfos.has(consumer.id))
			return Promise.reject('Consumer already added');

		const encoding = consumer.rtpParameters.encodings[0];
		const cname = consumer.rtpParameters.rtcp.cname;
		const consumerInfo =
		{
			kind    : consumer.kind,
			trackId : `consumer-${consumer.kind}-${consumer.id}`,
			ssrc    : encoding.ssrc,
			cname   : cname
		};

		if (encoding.rtx && encoding.rtx.ssrc)
			consumerInfo.rtxSsrc = encoding.rtx.ssrc;

		this._consumerInfos.set(consumer.id, consumerInfo);
		this._kinds.add(consumer.kind);

		return Promise.resolve()
			.then(() =>
			{
				if (!this._transportCreated)
					return this._setupTransport();
			})
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._kinds), Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'addConsumer() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'addConsumer() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			})
			.then(() =>
			{
				if (!this._transportUpdated)
					return this._updateTransport();
			})
			.then(() =>
			{
				const newRtpReceiver = this._pc.getReceivers()
					.find((rtpReceiver) =>
					{
						const { track } = rtpReceiver;

						if (!track)
							return false;

						return track.id === consumerInfo.trackId;
					});

				if (!newRtpReceiver)
					throw new Error('remote track not found');

				return newRtpReceiver.track;
			});
	}

	removeConsumer(consumer)
	{
		logger.debug(
			'removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		if (!this._consumerInfos.has(consumer.id))
			return Promise.reject('Consumer not found');

		this._consumerInfos.delete(consumer.id);

		return Promise.resolve()
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._kinds), Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'removeConsumer() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'removeConsumer() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

		return Promise.resolve()
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._kinds), Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'restartIce() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'restartIce() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			});
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// We need transport remote parameters.
				return this.safeEmitAsPromise('@needcreatetransport', null);
			})
			.then((transportRemoteParameters) =>
			{
				// Provide the remote SDP handler with transport remote parameters.
				this._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				this._transportCreated = true;
			});
	}

	_updateTransport()
	{
		logger.debug('_updateTransport()');

		// Get our local DTLS parameters.
		// const transportLocalParameters = {};
		const sdp = this._pc.localDescription.sdp;
		const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(sdp);
		const dtlsParameters = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["a" /* extractDtlsParameters */](sdpObj);
		const transportLocalParameters = { dtlsParameters };

		// We need to provide transport local parameters.
		this.safeEmit('@needupdatetransport', transportLocalParameters);

		this._transportUpdated = true;
	}
}

class Safari11
{
	static get name()
	{
		return 'Safari11';
	}

	static getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		pc.addTransceiver('audio');
		pc.addTransceiver('video');

		return pc.createOffer()
			.then((offer) =>
			{
				try { pc.close(); }
				catch (error) {}

				const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(offer.sdp);
				const nativeRtpCapabilities = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["b" /* extractRtpCapabilities */](sdpObj);

				return nativeRtpCapabilities;
			})
			.catch((error) =>
			{
				try { pc.close(); }
				catch (error2) {}

				throw error;
			});
	}

	constructor(direction, extendedRtpCapabilities, settings)
	{
		logger.debug(
			'constructor() [direction:%s, extendedRtpCapabilities:%o]',
			direction, extendedRtpCapabilities);

		let rtpParametersByKind;

		switch (direction)
		{
			case 'send':
			{
				rtpParametersByKind =
				{
					audio : __WEBPACK_IMPORTED_MODULE_4__ortc__["f" /* getSendingRtpParameters */]('audio', extendedRtpCapabilities),
					video : __WEBPACK_IMPORTED_MODULE_4__ortc__["f" /* getSendingRtpParameters */]('video', extendedRtpCapabilities)
				};

				return new SendHandler(rtpParametersByKind, settings);
			}
			case 'recv':
			{
				rtpParametersByKind =
				{
					audio : __WEBPACK_IMPORTED_MODULE_4__ortc__["d" /* getReceivingFullRtpParameters */]('audio', extendedRtpCapabilities),
					video : __WEBPACK_IMPORTED_MODULE_4__ortc__["d" /* getReceivingFullRtpParameters */]('video', extendedRtpCapabilities)
				};

				return new RecvHandler(rtpParametersByKind, settings);
			}
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Safari11;



/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sdp_transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ortc__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sdp_unifiedPlanUtils__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sdp_RemoteUnifiedPlanSdp__ = __webpack_require__(52);









const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('Firefox50');

class Handler extends __WEBPACK_IMPORTED_MODULE_2__EnhancedEventEmitter__["a" /* default */]
{
	constructor(direction, rtpParametersByKind, settings)
	{
		super(logger);

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : settings.turnServers || [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Remote SDP handler.
		// @type {RemoteUnifiedPlanSdp}
		this._remoteSdp = new __WEBPACK_IMPORTED_MODULE_7__sdp_RemoteUnifiedPlanSdp__["a" /* default */](direction, rtpParametersByKind);

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}
}

class SendHandler extends Handler
{
	constructor(rtpParametersByKind, settings)
	{
		super('send', rtpParametersByKind, settings);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();

		// RID value counter for simulcast (so they never match).
		// @type {Number}
		this._nextRid = 1;
	}

	addProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'addProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		if (this._stream.getTrackById(track.id))
			return Promise.reject('track already added');

		let rtpSender;
		let localSdpObj;

		return Promise.resolve()
			.then(() =>
			{
				this._stream.addTrack(track);

				// Add the stream to the PeerConnection.
				rtpSender = this._pc.addTrack(track, this._stream);
			})
			.then(() =>
			{
				// If simulcast is not enabled, do nothing.
				if (!producer.simulcast)
					return;

				logger.debug('addProducer() | enabling simulcast');

				const encodings = [];

				if (producer.simulcast.high)
				{
					encodings.push(
						{
							rid        : `high${this._nextRid}`,
							active     : true,
							priority   : 'high',
							maxBitrate : producer.simulcast.high
						});
				}

				if (producer.simulcast.medium)
				{
					encodings.push(
						{
							rid        : `medium${this._nextRid}`,
							active     : true,
							priority   : 'medium',
							maxBitrate : producer.simulcast.medium
						});
				}

				if (producer.simulcast.low)
				{
					encodings.push(
						{
							rid        : `low${this._nextRid}`,
							active     : true,
							priority   : 'low',
							maxBitrate : producer.simulcast.low
						});
				}

				// Update RID counter for future ones.
				this._nextRid++;

				return rtpSender.setParameters({ encodings });
			})
			.then(() =>
			{
				return this._pc.createOffer();
			})
			.then((offer) =>
			{
				logger.debug(
					'addProducer() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				if (!this._transportReady)
					return this._setupTransport();
			})
			.then(() =>
			{
				localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);

				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'addProducer() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			})
			.then(() =>
			{
				const rtpParameters = __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clone */](this._rtpParametersByKind[producer.kind]);

				// Fill the RTP parameters for this track.
				__WEBPACK_IMPORTED_MODULE_6__sdp_unifiedPlanUtils__["a" /* fillRtpParametersForTrack */](
					rtpParameters, localSdpObj, track);

				return rtpParameters;
			})
			.catch((error) =>
			{
				// Panic here. Try to undo things.

				try { this._pc.removeTrack(rtpSender); }
				catch (error2) {}

				this._stream.removeTrack(track);

				throw error;
			});
	}

	removeProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'removeProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		return Promise.resolve()
			.then(() =>
			{
				// Get the associated RTCRtpSender.
				const rtpSender = this._pc.getSenders()
					.find((s) => s.track === track);

				if (!rtpSender)
					throw new Error('RTCRtpSender found');

				// Remove the associated RtpSender.
				this._pc.removeTrack(rtpSender);

				// Remove the track from the local stream.
				this._stream.removeTrack(track);

				// NOTE: If there are no sending tracks, setLocalDescription() will cause
				// Firefox to close DTLS. This is fixed for the receiving PeerConnection
				// (by adding a fake DataChannel) but not for the sending one.
				//
				// ISSUE: https://github.com/versatica/mediasoup-client/issues/2
				return Promise.resolve()
					.then(() =>
					{
						return this._pc.createOffer();
					})
					.then((offer) =>
					{
						logger.debug(
							'removeProducer() | calling pc.setLocalDescription() [offer:%o]',
							offer);

						return this._pc.setLocalDescription(offer);
					});
			})
			.then(() =>
			{
				const localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);
				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'removeProducer() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			});
	}

	replaceProducerTrack(producer, track)
	{
		logger.debug(
			'replaceProducerTrack() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		const oldTrack = producer.track;

		return Promise.resolve()
			.then(() =>
			{
				// Get the associated RTCRtpSender.
				const rtpSender = this._pc.getSenders()
					.find((s) => s.track === oldTrack);

				if (!rtpSender)
					throw new Error('local track not found');

				return rtpSender.replaceTrack(track);
			})
			.then(() =>
			{
				// Remove the old track from the local stream.
				this._stream.removeTrack(oldTrack);

				// Add the new track to the local stream.
				this._stream.addTrack(track);
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

		return Promise.resolve()
			.then(() =>
			{
				return this._pc.createOffer({ iceRestart: true });
			})
			.then((offer) =>
			{
				logger.debug(
					'restartIce() | calling pc.setLocalDescription() [offer:%o]',
					offer);

				return this._pc.setLocalDescription(offer);
			})
			.then(() =>
			{
				const localSdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(this._pc.localDescription.sdp);
				const remoteSdp = this._remoteSdp.createAnswerSdp(localSdpObj);
				const answer = { type: 'answer', sdp: remoteSdp };

				logger.debug(
					'restartIce() | calling pc.setRemoteDescription() [answer:%o]',
					answer);

				return this._pc.setRemoteDescription(answer);
			});
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// Get our local DTLS parameters.
				const transportLocalParameters = {};
				const sdp = this._pc.localDescription.sdp;
				const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(sdp);
				const dtlsParameters = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["a" /* extractDtlsParameters */](sdpObj);

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// Provide the remote SDP handler with transport local parameters.
				this._remoteSdp.setTransportLocalParameters(transportLocalParameters);

				// We need transport remote parameters.
				return this.safeEmitAsPromise(
					'@needcreatetransport', transportLocalParameters);
			})
			.then((transportRemoteParameters) =>
			{
				// Provide the remote SDP handler with transport remote parameters.
				this._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				this._transportReady = true;
			});
	}
}

class RecvHandler extends Handler
{
	constructor(rtpParametersByKind, settings)
	{
		super('recv', rtpParametersByKind, settings);

		// Got transport remote parameters.
		// @type {Boolean}
		this._transportCreated = false;

		// Got transport local parameters.
		// @type {Boolean}
		this._transportUpdated = false;

		// Map of Consumers information indexed by consumer.id.
		// - mid {String}
		// - kind {String}
		// - closed {Boolean}
		// - trackId {String}
		// - ssrc {Number}
		// - rtxSsrc {Number}
		// - cname {String}
		// @type {Map<Number, Object>}
		this._consumerInfos = new Map();

		// Add an entry into consumers info to hold a fake DataChannel, so
		// the first m= section of the remote SDP is always "active" and Firefox
		// does not close the transport when there is no remote audio/video Consumers.
		//
		// ISSUE: https://github.com/versatica/mediasoup-client/issues/2
		const fakeDataChannelConsumerInfo =
		{
			mid    : 'fake-datachannel-consumer',
			kind   : 'application',
			closed : false,
			cname  : null
		};

		this._consumerInfos.set(555, fakeDataChannelConsumerInfo);
	}

	addConsumer(consumer)
	{
		logger.debug(
			'addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		if (this._consumerInfos.has(consumer.id))
			return Promise.reject('Consumer already added');

		const encoding = consumer.rtpParameters.encodings[0];
		const cname = consumer.rtpParameters.rtcp.cname;
		const consumerInfo =
		{
			mid     : `consumer-${consumer.kind}-${consumer.id}`,
			kind    : consumer.kind,
			closed  : consumer.closed,
			trackId : `consumer-${consumer.kind}-${consumer.id}`,
			ssrc    : encoding.ssrc,
			cname   : cname
		};

		if (encoding.rtx && encoding.rtx.ssrc)
			consumerInfo.rtxSsrc = encoding.rtx.ssrc;

		this._consumerInfos.set(consumer.id, consumerInfo);

		return Promise.resolve()
			.then(() =>
			{
				if (!this._transportCreated)
					return this._setupTransport();
			})
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'addConsumer() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'addConsumer() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			})
			.then(() =>
			{
				if (!this._transportUpdated)
					return this._updateTransport();
			})
			.then(() =>
			{
				const newRtpReceiver = this._pc.getReceivers()
					.find((rtpReceiver) =>
					{
						const { track } = rtpReceiver;

						if (!track)
							return false;

						return track.id === consumerInfo.trackId;
					});

				if (!newRtpReceiver)
					throw new Error('remote track not found');

				return newRtpReceiver.track;
			});
	}

	removeConsumer(consumer)
	{
		logger.debug(
			'removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		const consumerInfo = this._consumerInfos.get(consumer.id);

		if (!consumerInfo)
			return Promise.reject('Consumer not found');

		consumerInfo.closed = true;

		return Promise.resolve()
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'removeConsumer() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'removeConsumer() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateTransportRemoteIceParameters(remoteIceParameters);

		return Promise.resolve()
			.then(() =>
			{
				const remoteSdp = this._remoteSdp.createOfferSdp(
					Array.from(this._consumerInfos.values()));
				const offer = { type: 'offer', sdp: remoteSdp };

				logger.debug(
					'restartIce() | calling pc.setRemoteDescription() [offer:%o]',
					offer);

				return this._pc.setRemoteDescription(offer);
			})
			.then(() =>
			{
				return this._pc.createAnswer();
			})
			.then((answer) =>
			{
				logger.debug(
					'restartIce() | calling pc.setLocalDescription() [answer:%o]',
					answer);

				return this._pc.setLocalDescription(answer);
			});
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// We need transport remote parameters.
				return this.safeEmitAsPromise('@needcreatetransport', null);
			})
			.then((transportRemoteParameters) =>
			{
				// Provide the remote SDP handler with transport remote parameters.
				this._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

				this._transportCreated = true;
			});
	}

	_updateTransport()
	{
		logger.debug('_updateTransport()');

		// Get our local DTLS parameters.
		// const transportLocalParameters = {};
		const sdp = this._pc.localDescription.sdp;
		const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(sdp);
		const dtlsParameters = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["a" /* extractDtlsParameters */](sdpObj);
		const transportLocalParameters = { dtlsParameters };

		// We need to provide transport local parameters.
		this.safeEmit('@needupdatetransport', transportLocalParameters);

		this._transportUpdated = true;
	}
}

class Firefox50
{
	static get name()
	{
		return 'Firefox50';
	}

	static getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		// NOTE: We need to add a real video track to get the RID extension mapping.
		const canvas = document.createElement('canvas');

		// NOTE: Otherwise Firefox fails in next line.
		canvas.getContext('2d');

		const fakeStream = canvas.captureStream();
		const fakeVideoTrack = fakeStream.getVideoTracks()[0];
		const rtpSender = pc.addTrack(fakeVideoTrack, fakeStream);

		rtpSender.setParameters(
			{
				encodings :
				[
					{ rid: 'RID1', maxBitrate: 40000 },
					{ rid: 'RID2', maxBitrate: 10000 }
				]
			});

		return pc.createOffer(
			{
				offerToReceiveAudio : true,
				offerToReceiveVideo : true
			})
			.then((offer) =>
			{
				try { canvas.remove(); }
				catch (error) {}

				try { pc.close(); }
				catch (error) {}

				const sdpObj = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.parse(offer.sdp);
				const nativeRtpCapabilities = __WEBPACK_IMPORTED_MODULE_5__sdp_commonUtils__["b" /* extractRtpCapabilities */](sdpObj);

				return nativeRtpCapabilities;
			})
			.catch((error) =>
			{
				try { canvas.remove(); }
				catch (error2) {}

				try { pc.close(); }
				catch (error2) {}

				throw error;
			});
	}

	constructor(direction, extendedRtpCapabilities, settings)
	{
		logger.debug(
			'constructor() [direction:%s, extendedRtpCapabilities:%o]',
			direction, extendedRtpCapabilities);

		let rtpParametersByKind;

		switch (direction)
		{
			case 'send':
			{
				rtpParametersByKind =
				{
					audio : __WEBPACK_IMPORTED_MODULE_4__ortc__["f" /* getSendingRtpParameters */]('audio', extendedRtpCapabilities),
					video : __WEBPACK_IMPORTED_MODULE_4__ortc__["f" /* getSendingRtpParameters */]('video', extendedRtpCapabilities)
				};

				return new SendHandler(rtpParametersByKind, settings);
			}
			case 'recv':
			{
				rtpParametersByKind =
				{
					audio : __WEBPACK_IMPORTED_MODULE_4__ortc__["d" /* getReceivingFullRtpParameters */]('audio', extendedRtpCapabilities),
					video : __WEBPACK_IMPORTED_MODULE_4__ortc__["d" /* getReceivingFullRtpParameters */]('video', extendedRtpCapabilities)
				};

				return new RecvHandler(rtpParametersByKind, settings);
			}
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Firefox50;



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fillRtpParametersForTrack;
/**
 * Fill the given RTP parameters for the given track.
 *
 * @param {RTCRtpParameters} rtpParameters -  RTP parameters to be filled.
 * @param {Object} sdpObj - Local SDP Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 */
function fillRtpParametersForTrack(rtpParameters, sdpObj, track)
{
	const kind = track.kind;
	const rtcp =
	{
		cname       : null,
		reducedSize : true,
		mux         : true
	};

	const mSection = (sdpObj.media || [])
		.find((m) =>
		{
			if (m.type !== kind)
				return;

			const msidLine = m.msid;

			if (!msidLine)
				return;

			const trackId = msidLine.split(' ')[1];

			if (trackId === track.id)
				return true;
		});

	if (!mSection)
		throw new Error(`m=${kind} section not found`);

	// Get the SSRC and CNAME.

	const ssrcCnameLine = (mSection.ssrcs || [])
		.find((line) => line.attribute === 'cname');

	let ssrc;

	if (ssrcCnameLine)
	{
		ssrc = ssrcCnameLine.id;
		rtcp.cname = ssrcCnameLine.value;
	}

	// Get a=rid lines.

	// Array of Objects with rid and profile keys.
	const simulcastStreams = [];

	for (const rid of mSection.rids || [])
	{
		if (rid.direction !== 'send')
			continue;

		if (/^low/.test(rid.id))
			simulcastStreams.push({ rid: rid.id, profile: 'low' });
		else if (/^medium/.test(rid.id))
			simulcastStreams.push({ rid: rid.id, profile: 'medium' });
		if (/^high/.test(rid.id))
			simulcastStreams.push({ rid: rid.id, profile: 'high' });
	}

	// Fill RTP parameters.

	rtpParameters.rtcp = rtcp;
	rtpParameters.encodings = [];

	if (simulcastStreams.length === 0)
	{
		const encoding = { ssrc };

		rtpParameters.encodings.push(encoding);
	}
	else
	{
		for (const simulcastStream of simulcastStreams)
		{
			const encoding =
			{
				encodingId : simulcastStream.rid,
				profile    : simulcastStream.profile
			};

			rtpParameters.encodings.push(encoding);
		}
	}
}


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sdp_transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(2);




const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('RemoteUnifiedPlanSdp');

class RemoteSdp
{
	constructor(rtpParametersByKind)
	{
		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind = rtpParametersByKind;

		// Transport local parameters, including DTLS parameteres.
		// @type {Object}
		this._transportLocalParameters = null;

		// Transport remote parameters, including ICE parameters, ICE candidates
		// and DTLS parameteres.
		// @type {Object}
		this._transportRemoteParameters = null;

		// SDP global fields.
		// @type {Object}
		this._sdpGlobalFields =
		{
			id      : __WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */](),
			version : 0
		};
	}

	setTransportLocalParameters(transportLocalParameters)
	{
		logger.debug(
			'setTransportLocalParameters() [transportLocalParameters:%o]',
			transportLocalParameters);

		this._transportLocalParameters = transportLocalParameters;
	}

	setTransportRemoteParameters(transportRemoteParameters)
	{
		logger.debug(
			'setTransportRemoteParameters() [transportRemoteParameters:%o]',
			transportRemoteParameters);

		this._transportRemoteParameters = transportRemoteParameters;
	}

	updateTransportRemoteIceParameters(remoteIceParameters)
	{
		logger.debug(
			'updateTransportRemoteIceParameters() [remoteIceParameters:%o]',
			remoteIceParameters);

		this._transportRemoteParameters.iceParameters = remoteIceParameters;
	}
}

class SendRemoteSdp extends RemoteSdp
{
	constructor(rtpParametersByKind)
	{
		super(rtpParametersByKind);
	}

	createAnswerSdp(localSdpObj)
	{
		logger.debug('createAnswerSdp()');

		if (!this._transportLocalParameters)
			throw new Error('no transport local parameters');
		else if (!this._transportRemoteParameters)
			throw new Error('no transport remote parameters');

		const remoteIceParameters = this._transportRemoteParameters.iceParameters;
		const remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
		const remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
		const sdpObj = {};
		const mids = (localSdpObj.media || [])
			.filter((m) => m.mid)
			.map((m) => m.mid);

		// Increase our SDP version.
		this._sdpGlobalFields.version++;

		sdpObj.version = 0;
		sdpObj.origin =
		{
			address        : '0.0.0.0',
			ipVer          : 4,
			netType        : 'IN',
			sessionId      : this._sdpGlobalFields.id,
			sessionVersion : this._sdpGlobalFields.version,
			username       : 'mediasoup-client'
		};
		sdpObj.name = '-';
		sdpObj.timing = { start: 0, stop: 0 };
		sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
		sdpObj.msidSemantic =
		{
			semantic : 'WMS',
			token    : '*'
		};

		if (mids.length > 0)
		{
			sdpObj.groups =
			[
				{
					type : 'BUNDLE',
					mids : mids.join(' ')
				}
			];
		}

		sdpObj.media = [];

		// NOTE: We take the latest fingerprint.
		const numFingerprints = remoteDtlsParameters.fingerprints.length;

		sdpObj.fingerprint =
		{
			type : remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
			hash : remoteDtlsParameters.fingerprints[numFingerprints - 1].value
		};

		for (const localMediaObj of localSdpObj.media || [])
		{
			const closed = localMediaObj.direction === 'inactive';
			const kind = localMediaObj.type;
			const codecs = this._rtpParametersByKind[kind].codecs;
			const headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
			const remoteMediaObj = {};

			remoteMediaObj.type = localMediaObj.type;
			remoteMediaObj.port = 7;
			remoteMediaObj.protocol = 'RTP/SAVPF';
			remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
			remoteMediaObj.mid = localMediaObj.mid;

			remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
			remoteMediaObj.icePwd = remoteIceParameters.password;
			remoteMediaObj.candidates = [];

			for (const candidate of remoteIceCandidates)
			{
				const candidateObj = {};

				// mediasoup does not support non rtcp-mux so candidates component is
				// always RTP (1).
				candidateObj.component = 1;
				candidateObj.foundation = candidate.foundation;
				candidateObj.ip = candidate.ip;
				candidateObj.port = candidate.port;
				candidateObj.priority = candidate.priority;
				candidateObj.transport = candidate.protocol;
				candidateObj.type = candidate.type;
				if (candidate.tcpType)
					candidateObj.tcptype = candidate.tcpType;

				remoteMediaObj.candidates.push(candidateObj);
			}

			remoteMediaObj.endOfCandidates = 'end-of-candidates';

			// Announce support for ICE renomination.
			// https://tools.ietf.org/html/draft-thatcher-ice-renomination
			remoteMediaObj.iceOptions = 'renomination';

			switch (remoteDtlsParameters.role)
			{
				case 'client':
					remoteMediaObj.setup = 'active';
					break;
				case 'server':
					remoteMediaObj.setup = 'passive';
					break;
			}

			switch (localMediaObj.direction)
			{
				case 'sendrecv':
				case 'sendonly':
					remoteMediaObj.direction = 'recvonly';
					break;
				case 'recvonly':
				case 'inactive':
					remoteMediaObj.direction = 'inactive';
					break;
			}

			remoteMediaObj.rtp = [];
			remoteMediaObj.rtcpFb = [];
			remoteMediaObj.fmtp = [];

			for (const codec of codecs)
			{
				const rtp =
				{
					payload : codec.payloadType,
					codec   : codec.name,
					rate    : codec.clockRate
				};

				if (codec.channels > 1)
					rtp.encoding = codec.channels;

				remoteMediaObj.rtp.push(rtp);

				if (codec.parameters)
				{
					const paramFmtp =
					{
						payload : codec.payloadType,
						config  : ''
					};

					for (const key of Object.keys(codec.parameters))
					{
						if (paramFmtp.config)
							paramFmtp.config += ';';

						paramFmtp.config += `${key}=${codec.parameters[key]}`;
					}

					if (paramFmtp.config)
						remoteMediaObj.fmtp.push(paramFmtp);
				}

				if (codec.rtcpFeedback)
				{
					for (const fb of codec.rtcpFeedback)
					{
						remoteMediaObj.rtcpFb.push(
							{
								payload : codec.payloadType,
								type    : fb.type,
								subtype : fb.parameter || ''
							});
					}
				}
			}

			remoteMediaObj.payloads = codecs
				.map((codec) => codec.payloadType)
				.join(' ');

			// NOTE: Firefox does not like a=extmap lines if a=inactive.
			if (!closed)
			{
				remoteMediaObj.ext = [];

				for (const ext of headerExtensions)
				{
					// Don't add a header extension if not present in the offer.
					const matchedLocalExt = (localMediaObj.ext || [])
						.find((localExt) => localExt.uri === ext.uri);

					if (!matchedLocalExt)
						continue;

					remoteMediaObj.ext.push(
						{
							uri   : ext.uri,
							value : ext.id
						});
				}
			}

			// Simulcast.
			if (localMediaObj.simulcast_03)
			{
				// eslint-disable-next-line camelcase
				remoteMediaObj.simulcast_03 =
				{
					value : localMediaObj.simulcast_03.value.replace(/send/g, 'recv')
				};

				remoteMediaObj.rids = [];

				for (const rid of localMediaObj.rids || [])
				{
					if (rid.direction !== 'send')
						continue;

					remoteMediaObj.rids.push(
						{
							id        : rid.id,
							direction : 'recv'
						});
				}
			}

			remoteMediaObj.rtcpMux = 'rtcp-mux';
			remoteMediaObj.rtcpRsize = 'rtcp-rsize';

			// Push it.
			sdpObj.media.push(remoteMediaObj);
		}

		const sdp = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.write(sdpObj);

		return sdp;
	}
}

class RecvRemoteSdp extends RemoteSdp
{
	constructor(rtpParametersByKind)
	{
		super(rtpParametersByKind);

		// Id of the unique MediaStream for all the remote tracks.
		this._streamId = `recv-stream-${__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */]()}`;
	}

	/**
	 * @param {Array<Object>} consumerInfos - Consumer informations.
	 * @return {String}
	 */
	createOfferSdp(consumerInfos)
	{
		logger.debug('createOfferSdp()');

		if (!this._transportRemoteParameters)
			throw new Error('no transport remote parameters');

		const remoteIceParameters = this._transportRemoteParameters.iceParameters;
		const remoteIceCandidates = this._transportRemoteParameters.iceCandidates;
		const remoteDtlsParameters = this._transportRemoteParameters.dtlsParameters;
		const sdpObj = {};
		const mids = consumerInfos
			.filter((info) => !info.closed)
			.map((info) => info.mid);

		// Increase our SDP version.
		this._sdpGlobalFields.version++;

		sdpObj.version = 0;
		sdpObj.origin =
		{
			address        : '0.0.0.0',
			ipVer          : 4,
			netType        : 'IN',
			sessionId      : this._sdpGlobalFields.id,
			sessionVersion : this._sdpGlobalFields.version,
			username       : 'mediasoup-client'
		};
		sdpObj.name = '-';
		sdpObj.timing = { start: 0, stop: 0 };
		sdpObj.icelite = remoteIceParameters.iceLite ? 'ice-lite' : null;
		sdpObj.msidSemantic =
		{
			semantic : 'WMS',
			token    : '*'
		};

		if (mids.length > 0)
		{
			sdpObj.groups =
			[
				{
					type : 'BUNDLE',
					mids : mids.join(' ')
				}
			];
		}

		sdpObj.media = [];

		// NOTE: We take the latest fingerprint.
		const numFingerprints = remoteDtlsParameters.fingerprints.length;

		sdpObj.fingerprint =
		{
			type : remoteDtlsParameters.fingerprints[numFingerprints - 1].algorithm,
			hash : remoteDtlsParameters.fingerprints[numFingerprints - 1].value
		};

		for (const info of consumerInfos)
		{
			const closed = info.closed;
			const kind = info.kind;
			let codecs;
			let headerExtensions;

			if (info.kind !== 'application')
			{
				codecs = this._rtpParametersByKind[kind].codecs;
				headerExtensions = this._rtpParametersByKind[kind].headerExtensions;
			}

			const remoteMediaObj = {};

			if (info.kind !== 'application')
			{
				remoteMediaObj.type = kind;
				remoteMediaObj.port = 7;
				remoteMediaObj.protocol = 'RTP/SAVPF';
				remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
				remoteMediaObj.mid = info.mid;
				remoteMediaObj.msid = `${this._streamId} ${info.trackId}`;
			}
			else
			{
				remoteMediaObj.type = kind;
				remoteMediaObj.port = 9;
				remoteMediaObj.protocol = 'DTLS/SCTP';
				remoteMediaObj.connection = { ip: '127.0.0.1', version: 4 };
				remoteMediaObj.mid = info.mid;
			}

			remoteMediaObj.iceUfrag = remoteIceParameters.usernameFragment;
			remoteMediaObj.icePwd = remoteIceParameters.password;
			remoteMediaObj.candidates = [];

			for (const candidate of remoteIceCandidates)
			{
				const candidateObj = {};

				// mediasoup does not support non rtcp-mux so candidates component is
				// always RTP (1).
				candidateObj.component = 1;
				candidateObj.foundation = candidate.foundation;
				candidateObj.ip = candidate.ip;
				candidateObj.port = candidate.port;
				candidateObj.priority = candidate.priority;
				candidateObj.transport = candidate.protocol;
				candidateObj.type = candidate.type;
				if (candidate.tcpType)
					candidateObj.tcptype = candidate.tcpType;

				remoteMediaObj.candidates.push(candidateObj);
			}

			remoteMediaObj.endOfCandidates = 'end-of-candidates';

			// Announce support for ICE renomination.
			// https://tools.ietf.org/html/draft-thatcher-ice-renomination
			remoteMediaObj.iceOptions = 'renomination';

			remoteMediaObj.setup = 'actpass';

			if (info.kind !== 'application')
			{
				if (!closed)
					remoteMediaObj.direction = 'sendonly';
				else
					remoteMediaObj.direction = 'inactive';

				remoteMediaObj.rtp = [];
				remoteMediaObj.rtcpFb = [];
				remoteMediaObj.fmtp = [];

				for (const codec of codecs)
				{
					const rtp =
					{
						payload : codec.payloadType,
						codec   : codec.name,
						rate    : codec.clockRate
					};

					if (codec.channels > 1)
						rtp.encoding = codec.channels;

					remoteMediaObj.rtp.push(rtp);

					if (codec.parameters)
					{
						const paramFmtp =
						{
							payload : codec.payloadType,
							config  : ''
						};

						for (const key of Object.keys(codec.parameters))
						{
							if (paramFmtp.config)
								paramFmtp.config += ';';

							paramFmtp.config += `${key}=${codec.parameters[key]}`;
						}

						if (paramFmtp.config)
							remoteMediaObj.fmtp.push(paramFmtp);
					}

					if (codec.rtcpFeedback)
					{
						for (const fb of codec.rtcpFeedback)
						{
							remoteMediaObj.rtcpFb.push(
								{
									payload : codec.payloadType,
									type    : fb.type,
									subtype : fb.parameter || ''
								});
						}
					}
				}

				remoteMediaObj.payloads = codecs
					.map((codec) => codec.payloadType)
					.join(' ');

				// NOTE: Firefox does not like a=extmap lines if a=inactive.
				if (!closed)
				{
					remoteMediaObj.ext = [];

					for (const ext of headerExtensions)
					{
						remoteMediaObj.ext.push(
							{
								uri   : ext.uri,
								value : ext.id
							});
					}
				}

				remoteMediaObj.rtcpMux = 'rtcp-mux';
				remoteMediaObj.rtcpRsize = 'rtcp-rsize';

				if (!closed)
				{
					remoteMediaObj.ssrcs = [];
					remoteMediaObj.ssrcGroups = [];

					remoteMediaObj.ssrcs.push(
						{
							id        : info.ssrc,
							attribute : 'cname',
							value     : info.cname
						});

					if (info.rtxSsrc)
					{
						remoteMediaObj.ssrcs.push(
							{
								id        : info.rtxSsrc,
								attribute : 'cname',
								value     : info.cname
							});

						// Associate original and retransmission SSRC.
						remoteMediaObj.ssrcGroups.push(
							{
								semantics : 'FID',
								ssrcs     : `${info.ssrc} ${info.rtxSsrc}`
							});
					}
				}
			}
			else
			{
				remoteMediaObj.payloads = 5000;
				remoteMediaObj.sctpmap =
				{
					app            : 'webrtc-datachannel',
					maxMessageSize : 256,
					sctpmapNumber  : 5000
				};
			}

			// Push it.
			sdpObj.media.push(remoteMediaObj);
		}

		const sdp = __WEBPACK_IMPORTED_MODULE_0_sdp_transform___default.a.write(sdpObj);

		return sdp;
	}
}

class RemoteUnifiedPlanSdp
{
	constructor(direction, rtpParametersByKind)
	{
		logger.debug(
			'constructor() [direction:%s, rtpParametersByKind:%o]',
			direction, rtpParametersByKind);

		switch (direction)
		{
			case 'send':
				return new SendRemoteSdp(rtpParametersByKind);
			case 'recv':
				return new RecvRemoteSdp(rtpParametersByKind);
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RemoteUnifiedPlanSdp;



/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ortc__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ortc_edgeUtils__ = __webpack_require__(54);
/* global RTCIceGatherer, RTCIceTransport, RTCDtlsTransport, RTCRtpReceiver, RTCRtpSender */







const CNAME = `CNAME-EDGE-${__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */]()}`;

const logger = new __WEBPACK_IMPORTED_MODULE_0__Logger__["a" /* default */]('Edge11');

class Edge11 extends __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__["a" /* default */]
{
	static get name()
	{
		return 'Edge11';
	}

	static getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		return __WEBPACK_IMPORTED_MODULE_4__ortc_edgeUtils__["a" /* getCapabilities */]();
	}

	constructor(direction, extendedRtpCapabilities, settings)
	{
		super(logger);

		logger.debug(
			'constructor() [direction:%s, extendedRtpCapabilities:%o]',
			direction, extendedRtpCapabilities);

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._rtpParametersByKind =
		{
			audio : __WEBPACK_IMPORTED_MODULE_3__ortc__["f" /* getSendingRtpParameters */]('audio', extendedRtpCapabilities),
			video : __WEBPACK_IMPORTED_MODULE_3__ortc__["f" /* getSendingRtpParameters */]('video', extendedRtpCapabilities)
		};

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// ICE gatherer.
		this._iceGatherer = null;

		// ICE transport.
		this._iceTransport = null;

		// DTLS transport.
		// @type {RTCDtlsTransport}
		this._dtlsTransport = null;

		// Map of RTCRtpSenders indexed by Producer.id.
		// @type {Map<Number, RTCRtpSender}
		this._rtpSenders = new Map();

		// Map of RTCRtpReceivers indexed by Consumer.id.
		// @type {Map<Number, RTCRtpReceiver}
		this._rtpReceivers = new Map();

		// Remote Transport parameters.
		// @type {Object}
		this._transportRemoteParameters = null;

		this._setIceGatherer(settings);
		this._setIceTransport();
		this._setDtlsTransport();
	}

	close()
	{
		logger.debug('close()');

		// Close the ICE gatherer.
		// NOTE: Not yet implemented by Edge.
		try { this._iceGatherer.close(); }
		catch (error) {}

		// Close the ICE transport.
		try { this._iceTransport.stop(); }
		catch (error) {}

		// Close the DTLS transport.
		try { this._dtlsTransport.stop(); }
		catch (error) {}

		// Close RTCRtpSenders.
		for (const rtpSender of this._rtpSenders.values())
		{
			try { rtpSender.stop(); }
			catch (error) {}
		}

		// Close RTCRtpReceivers.
		for (const rtpReceiver of this._rtpReceivers.values())
		{
			try { rtpReceiver.stop(); }
			catch (error) {}
		}
	}

	addProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'addProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		if (this._rtpSenders.has(producer.id))
			return Promise.reject('Producer already added');

		return Promise.resolve()
			.then(() =>
			{
				if (!this._transportReady)
					return this._setupTransport();
			})
			.then(() =>
			{
				logger.debug('addProducer() | calling new RTCRtpSender()');

				const rtpSender = new RTCRtpSender(track, this._dtlsTransport);
				const rtpParameters =
					__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* clone */](this._rtpParametersByKind[producer.kind]);

				// Fill RTCRtpParameters.encodings.
				const encoding =
				{
					ssrc : __WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */]()
				};

				if (rtpParameters.codecs.some((codec) => codec.name === 'rtx'))
				{
					encoding.rtx =
					{
						ssrc : __WEBPACK_IMPORTED_MODULE_2__utils__["b" /* randomNumber */]()
					};
				}

				rtpParameters.encodings.push(encoding);

				// Fill RTCRtpParameters.rtcp.
				rtpParameters.rtcp =
				{
					cname       : CNAME,
					reducedSize : true,
					mux         : true
				};

				// NOTE: Convert our standard RTCRtpParameters into those that Edge
				// expects.
				const edgeRtpParameters =
					__WEBPACK_IMPORTED_MODULE_4__ortc_edgeUtils__["b" /* mangleRtpParameters */](rtpParameters);

				logger.debug(
					'addProducer() | calling rtpSender.send() [params:%o]',
					edgeRtpParameters);

				rtpSender.send(edgeRtpParameters);

				// Store it.
				this._rtpSenders.set(producer.id, rtpSender);

				return rtpParameters;
			});
	}

	removeProducer(producer)
	{
		const { track } = producer;

		logger.debug(
			'removeProducer() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		return Promise.resolve()
			.then(() =>
			{
				const rtpSender = this._rtpSenders.get(producer.id);

				if (!rtpSender)
					throw new Error('RTCRtpSender not found');

				this._rtpSenders.delete(producer.id);

				try
				{
					logger.debug('removeProducer() | calling rtpSender.stop()');

					rtpSender.stop();
				}
				catch (error)
				{
					logger.warn('rtpSender.stop() failed:%o', error);
				}
			});
	}

	replaceProducerTrack(producer, track)
	{
		logger.debug(
			'replaceProducerTrack() [id:%s, kind:%s, trackId:%s]',
			producer.id, producer.kind, track.id);

		return Promise.resolve()
			.then(() =>
			{
				const rtpSender = this._rtpSenders.get(producer.id);

				if (!rtpSender)
					throw new Error('RTCRtpSender not found');

				rtpSender.setTrack(track);
			});
	}

	addConsumer(consumer)
	{
		logger.debug(
			'addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		if (this._rtpReceivers.has(consumer.id))
			return Promise.reject('Consumer already added');

		return Promise.resolve()
			.then(() =>
			{
				logger.debug('addProducer() | calling new RTCRtpReceiver()');

				const rtpReceiver =
					new RTCRtpReceiver(this._dtlsTransport, consumer.kind);

				rtpReceiver.addEventListener('error', (event) =>
				{
					logger.error('iceGatherer "error" event [event:%o]', event);
				});

				// NOTE: Convert our standard RTCRtpParameters into those that Edge
				// expects.
				const edgeRtpParameters =
					__WEBPACK_IMPORTED_MODULE_4__ortc_edgeUtils__["b" /* mangleRtpParameters */](consumer.rtpParameters);

				logger.debug(
					'addProducer() | calling rtpReceiver.receive() [params:%o]',
					edgeRtpParameters);

				rtpReceiver.receive(edgeRtpParameters);

				// Store it.
				this._rtpReceivers.set(consumer.id, rtpReceiver);
			});
	}

	removeConsumer(consumer)
	{
		logger.debug(
			'removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

		return Promise.resolve()
			.then(() =>
			{
				const rtpReceiver = this._rtpReceivers.get(consumer.id);

				if (!rtpReceiver)
					throw new Error('RTCRtpReceiver not found');

				this._rtpReceivers.delete(consumer.id);

				try
				{
					logger.debug('removeConsumer() | calling rtpReceiver.stop()');

					rtpReceiver.stop();
				}
				catch (error)
				{
					logger.warn('rtpReceiver.stop() failed:%o', error);
				}
			});
	}

	restartIce(remoteIceParameters)
	{
		logger.debug('restartIce()');

		Promise.resolve()
			.then(() =>
			{
				this._transportRemoteParameters.iceParameters = remoteIceParameters;

				const remoteIceCandidates = this._transportRemoteParameters.iceCandidates;

				logger.debug('restartIce() | calling iceTransport.start()');

				this._iceTransport.start(
					this._iceGatherer, remoteIceParameters, 'controlling');

				for (const candidate of remoteIceCandidates)
				{
					this._iceTransport.addRemoteCandidate(candidate);
				}

				this._iceTransport.addRemoteCandidate({});
			});
	}

	_setIceGatherer(settings)
	{
		const iceGatherer = new RTCIceGatherer(
			{
				iceServers   : settings.turnServers || [],
				gatherPolicy : 'all'
			});

		iceGatherer.addEventListener('error', (event) =>
		{
			logger.error('iceGatherer "error" event [event:%o]', event);
		});

		// NOTE: Not yet implemented by Edge, which starts gathering automatically.
		try
		{
			iceGatherer.gather();
		}
		catch (error)
		{
			logger.debug('iceGatherer.gather() failed: %s', error.toString());
		}

		this._iceGatherer = iceGatherer;
	}

	_setIceTransport()
	{
		const iceTransport = new RTCIceTransport(this._iceGatherer);

		// NOTE: Not yet implemented by Edge.
		iceTransport.addEventListener('statechange', () =>
		{
			switch (iceTransport.state)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});

		// NOTE: Not standard, but implemented by Edge.
		iceTransport.addEventListener('icestatechange', () =>
		{
			switch (iceTransport.state)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});

		iceTransport.addEventListener('candidatepairchange', (event) =>
		{
			logger.debug(
				'iceTransport "candidatepairchange" event [pair:%o]', event.pair);
		});

		this._iceTransport = iceTransport;
	}

	_setDtlsTransport()
	{
		const dtlsTransport = new RTCDtlsTransport(this._iceTransport);

		// NOTE: Not yet implemented by Edge.
		dtlsTransport.addEventListener('statechange', () =>
		{
			logger.debug(
				'dtlsTransport "statechange" event [state:%s]', dtlsTransport.state);
		});

		// NOTE: Not standard, but implemented by Edge.
		dtlsTransport.addEventListener('dtlsstatechange', () =>
		{
			logger.debug(
				'dtlsTransport "dtlsstatechange" event [state:%s]', dtlsTransport.state);
		});

		dtlsTransport.addEventListener('error', (event) =>
		{
			logger.error('dtlsTransport "error" event [event:%o]', event);
		});

		this._dtlsTransport = dtlsTransport;
	}

	_setupTransport()
	{
		logger.debug('_setupTransport()');

		return Promise.resolve()
			.then(() =>
			{
				// Get our local DTLS parameters.
				const transportLocalParameters = {};
				const dtlsParameters = this._dtlsTransport.getLocalParameters();

				// Let's decide that we'll be DTLS server (because we can).
				dtlsParameters.role = 'server';

				transportLocalParameters.dtlsParameters = dtlsParameters;

				// We need transport remote parameters.
				return this.safeEmitAsPromise(
					'@needcreatetransport', transportLocalParameters);
			})
			.then((transportRemoteParameters) =>
			{
				this._transportRemoteParameters = transportRemoteParameters;

				const remoteIceParameters = transportRemoteParameters.iceParameters;
				const remoteIceCandidates = transportRemoteParameters.iceCandidates;
				const remoteDtlsParameters = transportRemoteParameters.dtlsParameters;

				// Start the RTCIceTransport.
				this._iceTransport.start(
					this._iceGatherer, remoteIceParameters, 'controlling');

				// Add remote ICE candidates.
				for (const candidate of remoteIceCandidates)
				{
					this._iceTransport.addRemoteCandidate(candidate);
				}

				// Also signal a 'complete' candidate as per spec.
				// NOTE: It should be {complete: true} but Edge prefers {}.
				// NOTE: If we don't signal end of candidates, the Edge RTCIceTransport
				// won't enter the 'completed' state.
				this._iceTransport.addRemoteCandidate({});

				// NOTE: Edge does not like SHA less than 256.
				remoteDtlsParameters.fingerprints = remoteDtlsParameters.fingerprints.
					filter((fingerprint) =>
					{
						return (
							fingerprint.algorithm === 'sha-256' ||
							fingerprint.algorithm === 'sha-384' ||
							fingerprint.algorithm === 'sha-512'
						);
					});

				// Start the RTCDtlsTransport.
				this._dtlsTransport.start(remoteDtlsParameters);

				this._transportReady = true;
			});
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Edge11;



/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getCapabilities;
/* harmony export (immutable) */ __webpack_exports__["b"] = mangleRtpParameters;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);
/* global RTCRtpReceiver */



/**
 * Normalize Edge's RTCRtpReceiver.getCapabilities() to produce a full
 * compliant ORTC RTCRtpCapabilities.
 *
 * @return {RTCRtpCapabilities}
 */
function getCapabilities()
{
	const nativeCaps = RTCRtpReceiver.getCapabilities();
	const caps = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* clone */](nativeCaps);

	for (const codec of caps.codecs)
	{
		// Rename numChannels to channels.
		codec.channels = codec.numChannels;
		delete codec.numChannels;

		// Normalize channels.
		if (codec.kind !== 'audio')
			delete codec.channels;
		else if (!codec.channels)
			codec.channels = 1;

		// Add mimeType.
		codec.mimeType = `${codec.kind}/${codec.name}`;

		// NOTE: Edge sets parameters.apt as String rather than Number. Fix it.
		if (codec.name === 'rtx')
			codec.parameters.apt = Number(codec.parameters.apt);

		// Delete emty parameter String in rtcpFeedback.
		for (const feedback of codec.rtcpFeedback || [])
		{
			if (!feedback.parameter)
				delete feedback.parameter;
		}
	}

	return caps;
}

/**
 * Generate RTCRtpParameters as Edge like them.
 *
 * @param  {RTCRtpParameters} rtpParameters
 * @return {RTCRtpParameters}
 */
function mangleRtpParameters(rtpParameters)
{
	const params = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* clone */](rtpParameters);

	for (const codec of params.codecs)
	{
		// Rename channels to numChannels.
		if (codec.channels)
		{
			codec.numChannels = codec.channels;
			delete codec.channels;
		}

		// Remove mimeType.
		delete codec.mimeType;
	}

	return params;
}


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errors__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ortc__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Device__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Transport__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Producer__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Peer__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Consumer__ = __webpack_require__(60);










const logger = new __WEBPACK_IMPORTED_MODULE_0__Logger__["a" /* default */]('Room');

const RoomState =
{
	new     : 'new',
	joining : 'joining',
	joined  : 'joined',
	closed  : 'closed'
};

/**
 * An instance of Room represents a remote multi conference and a local
 * peer that joins it.
 */
class Room extends __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__["a" /* default */]
{
	/**
	 * Room class.
	 *
	 * @param {Object} [options]
	 * @param {Object} [roomSettings] Remote room settings, including its RTP
	 * capabilities, mandatory codecs, etc. If given, no 'queryRoom' request is sent
	 * to the server to discover them.
	 * @param {Number} [options.requestTimeout=10000] - Timeout for sent requests
	 * (in milliseconds). Defaults to 10000 (10 seconds).
	 * @param {Object} [options.transportOptions] - Options for Transport created in mediasoup.
	 * @param {Array<RTCIceServer>} [options.turnServers] - Array of TURN servers.
	 *
	 * @throws {Error} if device is not supported.
	 *
	 * @emits {request: Object, callback: Function, errback: Function} request
	 * @emits {notification: Object} notify
	 * @emits {peer: Peer} newpeer
	 * @emits {originator: String, [appData]: Any} close
	 */
	constructor(options)
	{
		super(logger);

		logger.debug('constructor() [options:%o]', options);

		if (!__WEBPACK_IMPORTED_MODULE_4__Device__["a" /* default */].isSupported())
			throw new Error('current browser/device not supported');

		options = options || {};

		// Computed settings.
		// @type {Object}
		this._settings =
		{
			roomSettings     : options.roomSettings,
			requestTimeout   : options.requestTimeout || 10000,
			transportOptions : options.transportOptions || {},
			turnServers      : options.turnServers || []
		};

		// Room state.
		// @type {Boolean}
		this._state = RoomState.new;

		// My mediasoup Peer name.
		// @type {String}
		this._peerName = null;

		// Map of Transports indexed by id.
		// @type {map<Number, Transport>}
		this._transports = new Map();

		// Map of Producers indexed by id.
		// @type {map<Number, Producer>}
		this._producers = new Map();

		// Map of Peers indexed by name.
		// @type {map<String, Peer>}
		this._peers = new Map();

		// Extended RTP capabilities.
		// @type {Object}
		this._extendedRtpCapabilities = null;

		// Whether we can send audio/video based on computed extended RTP
		// capabilities.
		// @type {Object}
		this._canSendByKind =
		{
			audio : false,
			video : false
		};
	}

	/**
	 * Whether the Room is joined.
	 *
	 * @return {Boolean}
	 */
	get joined()
	{
		return this._state === RoomState.joined;
	}

	/**
	 * Whether the Room is closed.
	 *
	 * @return {Boolean}
	 */
	get closed()
	{
		return this._state === RoomState.closed;
	}

	/**
	 * My mediasoup Peer name.
	 *
	 * @return {String}
	 */
	get peerName()
	{
		return this._peerName;
	}

	/**
	 * The list of Transports.
	 *
	 * @return {Array<Transport>}
	 */
	get transports()
	{
		return Array.from(this._transports.values());
	}

	/**
	 * The list of Producers.
	 *
	 * @return {Array<Producer>}
	 */
	get producers()
	{
		return Array.from(this._producers.values());
	}

	/**
	 * The list of Peers.
	 *
	 * @return {Array<Peer>}
	 */
	get peers()
	{
		return Array.from(this._peers.values());
	}

	/**
	 * Get the Transport with the given id.
	 *
	 * @param {Number} id
	 *
	 * @return {Transport}
	 */
	getTransportById(id)
	{
		return this._transports.get(id);
	}

	/**
	 * Get the Producer with the given id.
	 *
	 * @param {Number} id
	 *
	 * @return {Producer}
	 */
	getProducerById(id)
	{
		return this._producers.get(id);
	}

	/**
	 * Get the Peer with the given name.
	 *
	 * @param {String} name
	 *
	 * @return {Peer}
	 */
	getPeerByName(name)
	{
		return this._peers.get(name);
	}

	/**
	 * Start the procedures to join a remote room.
	 * @param {String} peerName - My mediasoup Peer name.
	 * @param {Any} [appData] - App custom data.
	 * @return {Promise}
	 */
	join(peerName, appData)
	{
		logger.debug('join() [peerName:"%s"]', peerName);

		if (typeof peerName !== 'string')
			return Promise.reject(new TypeError('invalid peerName'));

		if (this._state !== RoomState.new && this._state !== RoomState.closed)
		{
			return Promise.reject(
				new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */](`invalid state "${this._state}"`));
		}

		this._peerName = peerName;
		this._state = RoomState.joining;

		let roomSettings;

		return Promise.resolve()
			.then(() =>
			{
				// If Room settings are provided don't query them.
				if (this._settings.roomSettings)
				{
					roomSettings = this._settings.roomSettings;

					return;
				}
				else
				{
					return this._sendRequest('queryRoom', { target: 'room' })
						.then((response) =>
						{
							roomSettings = response;

							logger.debug(
								'join() | got Room settings:%o', roomSettings);
						});
				}
			})
			.then(() =>
			{
				return __WEBPACK_IMPORTED_MODULE_4__Device__["a" /* default */].Handler.getNativeRtpCapabilities();
			})
			.then((nativeRtpCapabilities) =>
			{
				logger.debug(
					'join() | native RTP capabilities:%o', nativeRtpCapabilities);

				// Get extended RTP capabilities.
				this._extendedRtpCapabilities = __WEBPACK_IMPORTED_MODULE_3__ortc__["c" /* getExtendedRtpCapabilities */](
					nativeRtpCapabilities, roomSettings.rtpCapabilities);

				logger.debug(
					'join() | extended RTP capabilities:%o', this._extendedRtpCapabilities);

				// Check unsupported codecs.
				const unsupportedRoomCodecs = __WEBPACK_IMPORTED_MODULE_3__ortc__["g" /* getUnsupportedCodecs */](
					roomSettings.rtpCapabilities,
					roomSettings.mandatoryCodecPayloadTypes,
					this._extendedRtpCapabilities);

				if (unsupportedRoomCodecs.length > 0)
				{
					logger.error(
						'%s mandatory room codecs not supported:%o',
						unsupportedRoomCodecs.length,
						unsupportedRoomCodecs);

					throw new __WEBPACK_IMPORTED_MODULE_2__errors__["c" /* UnsupportedError */](
						'mandatory room codecs not supported', unsupportedRoomCodecs);
				}

				// Check whether we can send audio/video.
				this._canSendByKind.audio =
					__WEBPACK_IMPORTED_MODULE_3__ortc__["b" /* canSend */]('audio', this._extendedRtpCapabilities);
				this._canSendByKind.video =
					__WEBPACK_IMPORTED_MODULE_3__ortc__["b" /* canSend */]('video', this._extendedRtpCapabilities);

				// Generate our effective RTP capabilities for receiving media.
				const effectiveLocalRtpCapabilities =
					__WEBPACK_IMPORTED_MODULE_3__ortc__["e" /* getRtpCapabilities */](this._extendedRtpCapabilities);

				logger.debug(
					'join() | effective local RTP capabilities for receiving:%o',
					effectiveLocalRtpCapabilities);

				const data =
				{
					target          : 'room',
					peerName        : this._peerName,
					rtpCapabilities : effectiveLocalRtpCapabilities,
					appData         : appData
				};

				return this._sendRequest('join', data)
					.then((response) => response.peers);
			})
			.then((peers) =>
			{
				// Handle Peers already existing in the room.
				for (const peerData of peers || [])
				{
					try
					{
						this._handlePeerData(peerData);
					}
					catch (error)
					{
						logger.error('join() | error handling Peer:%o', error);
					}
				}

				this._state = RoomState.joined;

				logger.debug('join() | joined the Room');

				// Return the list of already existing Peers.
				return this.peers;
			})
			.catch((error) =>
			{
				this._state = RoomState.new;

				throw error;
			});
	}

	/**
	 * Leave the Room.
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	leave(appData)
	{
		logger.debug('leave()');

		if (this.closed)
			return;

		// Send a notification.
		this._sendNotification('leave', { appData });

		// Set closed state after sending the notification (otherwise the
		// notification won't be sent).
		this._state = RoomState.closed;

		this.safeEmit('close', 'local', appData);

		// Close all the Transports.
		for (const transport of this._transports.values())
		{
			transport.close();
		}

		// Close all the Producers.
		for (const producer of this._producers.values())
		{
			producer.close();
		}

		// Close all the Peers.
		for (const peer of this._peers.values())
		{
			peer.close();
		}
	}

	/**
	 * The remote Room was closed or our remote Peer has been closed.
	 * Invoked via remote notification or via API.
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remoteClose(appData)
	{
		logger.debug('remoteClose()');

		if (this.closed)
			return;

		this._state = RoomState.closed;

		this.safeEmit('close', 'remote', appData);

		// Close all the Transports.
		for (const transport of this._transports.values())
		{
			transport.remoteClose();
		}

		// Close all the Producers.
		for (const producer of this._producers.values())
		{
			producer.remoteClose();
		}

		// Close all the Peers.
		for (const peer of this._peers.values())
		{
			peer.remoteClose();
		}
	}

	/**
	 * Whether we can send audio/video.
	 *
	 * @param {String} kind - 'audio' or 'video'.
	 *
	 * @return {Boolean}
	 */
	canSend(kind)
	{
		if (!this.joined)
			throw new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */](`invalid state "${this._state}"`);
		else if (kind !== 'audio' && kind !== 'video')
			throw new TypeError(`invalid kind "${kind}"`);

		return this._canSendByKind[kind];
	}

	/**
	 * Creates a Transport.
	 *
	 * @param {String} direction - Must be 'send' or 'recv'.
	 * @param {Any} [appData] - App custom data.
	 *
	 * @return {Transport}
	 *
	 * @throws {InvalidStateError} if not joined.
	 * @throws {TypeError} if wrong arguments.
	 */
	createTransport(direction, appData)
	{
		logger.debug('createTransport() [direction:%s]', direction);

		if (!this.joined)
			throw new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */](`invalid state "${this._state}"`);
		else if (direction !== 'send' && direction !== 'recv')
			throw new TypeError(`invalid direction "${direction}"`);

		// Create a new Transport.
		const transport = new __WEBPACK_IMPORTED_MODULE_5__Transport__["a" /* default */](
			direction, this._extendedRtpCapabilities, this._settings, appData);

		// Store it.
		this._transports.set(transport.id, transport);

		transport.on('@request', (method, data, callback, errback) =>
		{
			this._sendRequest(method, data)
				.then(callback)
				.catch(errback);
		});

		transport.on('@notify', (method, data) =>
		{
			this._sendNotification(method, data);
		});

		transport.on('@close', () =>
		{
			this._transports.delete(transport.id);
		});

		return transport;
	}

	/**
	 * Creates a Producer.
	 *
	 * @param {MediaStreamTrack} track
	 * @param {Object} [options]
	 * @param {Object} [options.simulcast]
	 * @param {Any} [appData] - App custom data.
	 *
	 * @return {Producer}
	 *
	 * @throws {InvalidStateError} if not joined.
	 * @throws {TypeError} if wrong arguments.
	 * @throws {Error} if cannot send the given kind.
	 */
	createProducer(track, options, appData)
	{
		logger.debug('createProducer() [track:%o, options:%o]', track, options);

		if (!this.joined)
			throw new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */](`invalid state "${this._state}"`);
		else if (!(track instanceof MediaStreamTrack))
			throw new TypeError('track is not a MediaStreamTrack');
		else if (!this._canSendByKind[track.kind])
			throw new Error(`cannot send ${track.kind}`);
		else if (track.readyState === 'ended')
			throw new Error('track.readyState is "ended"');

		options = options || {};

		// Create a new Producer.
		const producer = new __WEBPACK_IMPORTED_MODULE_6__Producer__["a" /* default */](track, options, appData);

		// Store it.
		this._producers.set(producer.id, producer);

		producer.on('@close', () =>
		{
			this._producers.delete(producer.id);
		});

		return producer;
	}

	/**
	 * Produce a ICE restart in all the Transports.
	 */
	restartIce()
	{
		if (!this.joined)
			throw new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */](`invalid state "${this._state}"`);

		for (const transport of this._transports.values())
		{
			transport.restartIce();
		}
	}

	/**
	 * Provide the local Room with a notification generated by mediasoup server.
	 *
	 * @param {Object} notification
	 */
	receiveNotification(notification)
	{
		if (this.closed)
			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Room closed'));
		else if (typeof notification !== 'object')
			return Promise.reject(new TypeError('wrong notification Object'));
		else if (notification.notification !== true)
			return Promise.reject(new TypeError('not a notification'));
		else if (typeof notification.method !== 'string')
			return Promise.reject(new TypeError('wrong/missing notification method'));

		const { method } = notification;

		logger.debug(
			'receiveNotification() [method:%s, notification:%o]',
			method, notification);

		return Promise.resolve()
			.then(() =>
			{
				switch (method)
				{
					case 'closed':
					{
						const { appData } = notification;

						this.remoteClose(appData);

						break;
					}

					case 'transportClosed':
					{
						const { id, appData } = notification;
						const transport = this._transports.get(id);

						if (!transport)
							throw new Error(`Transport not found [id:"${id}"]`);

						transport.remoteClose(appData);

						break;
					}

					case 'transportStats':
					{
						const { id, stats } = notification;
						const transport = this._transports.get(id);

						if (!transport)
							throw new Error(`transport not found [id:${id}]`);

						transport.remoteStats(stats);

						break;
					}

					case 'newPeer':
					{
						const { name } = notification;

						if (this._peers.has(name))
							throw new Error(`Peer already exists [name:"${name}"]`);

						const peerData = notification;

						this._handlePeerData(peerData);

						break;
					}

					case 'peerClosed':
					{
						const peerName = notification.name;
						const { appData } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						peer.remoteClose(appData);

						break;
					}

					case 'producerPaused':
					{
						const { id, appData } = notification;
						const producer = this._producers.get(id);

						if (!producer)
							throw new Error(`Producer not found [id:${id}]`);

						producer.remotePause(appData);

						break;
					}

					case 'producerResumed':
					{
						const { id, appData } = notification;
						const producer = this._producers.get(id);

						if (!producer)
							throw new Error(`Producer not found [id:${id}]`);

						producer.remoteResume(appData);

						break;
					}

					case 'producerClosed':
					{
						const { id, appData } = notification;
						const producer = this._producers.get(id);

						if (!producer)
							throw new Error(`Producer not found [id:${id}]`);

						producer.remoteClose(appData);

						break;
					}

					case 'producerStats':
					{
						const { id, stats } = notification;
						const producer = this._producers.get(id);

						if (!producer)
							throw new Error(`Producer not found [id:${id}]`);

						producer.remoteStats(stats);

						break;
					}

					case 'newConsumer':
					{
						const { peerName } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumerData = notification;

						this._handleConsumerData(consumerData, peer);

						break;
					}

					case 'consumerClosed':
					{
						const { id, peerName, appData } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumer = peer.getConsumerById(id);

						if (!consumer)
							throw new Error(`Consumer not found [id:${id}]`);

						consumer.remoteClose(appData);

						break;
					}

					case 'consumerPaused':
					{
						const { id, peerName, appData } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumer = peer.getConsumerById(id);

						if (!consumer)
							throw new Error(`Consumer not found [id:${id}]`);

						consumer.remotePause(appData);

						break;
					}

					case 'consumerResumed':
					{
						const { id, peerName, appData } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumer = peer.getConsumerById(id);

						if (!consumer)
							throw new Error(`Consumer not found [id:${id}]`);

						consumer.remoteResume(appData);

						break;
					}

					case 'consumerPreferredProfileSet':
					{
						const { id, peerName, profile } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumer = peer.getConsumerById(id);

						if (!consumer)
							throw new Error(`Consumer not found [id:${id}]`);

						consumer.remoteSetPreferredProfile(profile);

						break;
					}

					case 'consumerEffectiveProfileChanged':
					{
						const { id, peerName, profile } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumer = peer.getConsumerById(id);

						if (!consumer)
							throw new Error(`Consumer not found [id:${id}]`);

						consumer.remoteEffectiveProfileChanged(profile);

						break;
					}

					case 'consumerStats':
					{
						const { id, peerName, stats } = notification;
						const peer = this._peers.get(peerName);

						if (!peer)
							throw new Error(`no Peer found [name:"${peerName}"]`);

						const consumer = peer.getConsumerById(id);

						if (!consumer)
							throw new Error(`Consumer not found [id:${id}]`);

						consumer.remoteStats(stats);

						break;
					}

					default:
						throw new Error(`unknown notification method "${method}"`);
				}
			})
			.catch((error) =>
			{
				logger.error(
					'receiveNotification() failed [notification:%o]: %s', notification, error);
			});
	}

	_sendRequest(method, data)
	{
		const request = Object.assign({ method, target: 'peer' }, data);

		// Should never happen.
		// Ignore if closed.
		if (this.closed)
		{
			logger.error(
				'_sendRequest() | Room closed [method:%s, request:%o]',
				method, request);

			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Room closed'));
		}

		logger.debug('_sendRequest() [method:%s, request:%o]', method, request);

		return new Promise((resolve, reject) =>
		{
			let done = false;

			const timer = setTimeout(() =>
			{
				logger.error(
					'request failed [method:%s]: timeout', method);

				done = true;
				reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["b" /* TimeoutError */]('timeout'));
			}, this._settings.requestTimeout);

			const callback = (response) =>
			{
				if (done)
					return;

				done = true;
				clearTimeout(timer);

				if (this.closed)
				{
					logger.error(
						'request failed [method:%s]: Room closed', method);

					reject(new Error('Room closed'));

					return;
				}

				logger.debug(
					'request succeeded [method:%s, response:%o]', method, response);

				resolve(response);
			};

			const errback = (error) =>
			{
				if (done)
					return;

				done = true;
				clearTimeout(timer);

				if (this.closed)
				{
					logger.error(
						'request failed [method:%s]: Room closed', method);

					reject(new Error('Room closed'));

					return;
				}

				// Make sure message is an Error.
				if (!(error instanceof Error))
					error = new Error(String(error));

				logger.error('request failed [method:%s]:%o', method, error);

				reject(error);
			};

			this.safeEmit('request', request, callback, errback);
		});
	}

	_sendNotification(method, data)
	{
		// Ignore if closed.
		if (this.closed)
			return;

		const notification =
			Object.assign({ method, target: 'peer', notification: true }, data);

		logger.debug(
			'_sendNotification() [method:%s, notification:%o]', method, notification);

		this.safeEmit('notify', notification);
	}

	_handlePeerData(peerData)
	{
		const { name, consumers, appData } = peerData;
		const peer = new __WEBPACK_IMPORTED_MODULE_7__Peer__["a" /* default */](name, appData);

		// Store it.
		this._peers.set(peer.name, peer);

		peer.on('@close', () =>
		{
			this._peers.delete(peer.name);
		});

		// Add consumers.
		for (const consumerData of consumers)
		{
			try
			{
				this._handleConsumerData(consumerData, peer);
			}
			catch (error)
			{
				logger.error('error handling existing Consumer in Peer:%o', error);
			}
		}

		// If already joined emit event.
		if (this.joined)
			this.safeEmit('newpeer', peer);
	}

	_handleConsumerData(producerData, peer)
	{
		const { id, kind, rtpParameters, paused, appData } = producerData;
		const consumer = new __WEBPACK_IMPORTED_MODULE_8__Consumer__["a" /* default */](id, kind, rtpParameters, peer, appData);
		const supported =
			__WEBPACK_IMPORTED_MODULE_3__ortc__["a" /* canReceive */](consumer.rtpParameters, this._extendedRtpCapabilities);

		if (supported)
			consumer.setSupported(true);

		if (paused)
			consumer.remotePause();

		peer.addConsumer(consumer);
	}
}
/* unused harmony export default */



/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errors__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Device__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CommandQueue__ = __webpack_require__(57);







const DEFAULT_STATS_INTERVAL = 1000;

const logger = new __WEBPACK_IMPORTED_MODULE_0__Logger__["a" /* default */]('Transport');

class Transport extends __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__["a" /* default */]
{
	/**
	 * @private
	 *
	 * @emits {state: String} connectionstatechange
	 * @emits {stats: Object} stats
	 * @emits {originator: String, [appData]: Any} close
	 *
	 * @emits {method: String, [data]: Object, callback: Function, errback: Function} @request
	 * @emits {method: String, [data]: Object} @notify
	 * @emits @close
	 */
	constructor(direction, extendedRtpCapabilities, settings, appData)
	{
		super(logger);

		logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]',
			direction, extendedRtpCapabilities);

		// Id.
		// @type {Number}
		this._id = __WEBPACK_IMPORTED_MODULE_3__utils__["b" /* randomNumber */]();

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Direction.
		// @type {String}
		this._direction = direction;

		// Room settings.
		// @type {Object}
		this._settings = settings;

		// App custom data.
		// @type {Any}
		this._appData = appData;

		// Periodic stats flag.
		// @type {Boolean}
		this._statsEnabled = false;

		// Commands handler.
		// @type {CommandQueue}
		this._commandQueue = new __WEBPACK_IMPORTED_MODULE_5__CommandQueue__["a" /* default */]();

		// Device specific handler.
		this._handler = new __WEBPACK_IMPORTED_MODULE_4__Device__["a" /* default */].Handler(direction, extendedRtpCapabilities, settings);

		// Transport state. Values can be:
		// 'new'/'connecting'/'connected'/'failed'/'disconnected'/'closed'
		// @type {String}
		this._connectionState = 'new';

		this._commandQueue.on('exec', this._execCommand.bind(this));

		this._handleHandler();
	}

	/**
	 * Transport id.
	 *
	 * @return {Number}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Whether the Transport is closed.
	 *
	 * @return {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Transport direction.
	 *
	 * @return {String}
	 */
	get direction()
	{
		return this._direction;
	}

	/**
	 * App custom data.
	 *
	 * @return {Any}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Connection state.
	 *
	 * @return {String}
	 */
	get connectionState()
	{
		return this._connectionState;
	}

	/**
	 * Close the Transport.
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	close(appData)
	{
		logger.debug('close()');

		if (this._closed)
			return;

		this._closed = true;

		if (this._statsEnabled)
		{
			this._statsEnabled = false;
			this.disableStats();
		}

		this.safeEmit(
			'@notify', 'closeTransport', { id: this._id, appData });

		this.emit('@close');
		this.safeEmit('close', 'local', appData);

		this._destroy();
	}

	/**
	 * My remote Transport was closed.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remoteClose(appData)
	{
		logger.debug('remoteClose()');

		if (this._closed)
			return;

		this._closed = true;

		this.emit('@close');
		this.safeEmit('close', 'remote', appData);

		this._destroy();
	}

	_destroy()
	{
		// Close the CommandQueue.
		this._commandQueue.close();

		// Close the handler.
		this._handler.close();
	}

	restartIce()
	{
		logger.debug('restartIce()');

		if (this._closed)
			return;
		else if (this._connectionState === 'new')
			return;

		Promise.resolve()
			.then(() =>
			{
				const data =
				{
					id : this._id
				};

				return this.safeEmitAsPromise('@request', 'restartTransport', data);
			})
			.then((response) =>
			{
				const remoteIceParameters = response.iceParameters;

				// Enqueue command.
				return this._commandQueue.push('restartIce', { remoteIceParameters });
			})
			.catch((error) =>
			{
				logger.error('restartIce() | failed: %o', error);
			});
	}

	enableStats(interval = DEFAULT_STATS_INTERVAL)
	{
		logger.debug('enableStats() [interval:%s]', interval);

		if (typeof interval !== 'number' || interval < 1000)
			interval = DEFAULT_STATS_INTERVAL;

		this._statsEnabled = true;

		const data =
		{
			id       : this._id,
			interval : interval
		};

		this.safeEmit('@notify', 'enableTransportStats', data);
	}

	disableStats()
	{
		logger.debug('disableStats()');

		this._statsEnabled = false;

		const data =
		{
			id : this._id
		};

		this.safeEmit('@notify', 'disableTransportStats', data);
	}

	_handleHandler()
	{
		const handler = this._handler;

		handler.on('@connectionstatechange', (state) =>
		{
			if (this._connectionState === state)
				return;

			logger.debug('Transport connection state changed to %s', state);

			this._connectionState = state;

			if (!this._closed)
				this.safeEmit('connectionstatechange', state);
		});

		handler.on(
			'@needcreatetransport',
			(transportLocalParameters, callback, errback) =>
			{
				const data =
				{
					id        : this._id,
					direction : this._direction,
					options   : this._settings.transportOptions,
					appData   : this._appData
				};

				if (transportLocalParameters)
					data.dtlsParameters = transportLocalParameters.dtlsParameters;

				this.safeEmit('@request', 'createTransport', data, callback, errback);
			});

		handler.on('@needupdatetransport', (transportLocalParameters) =>
		{
			const data =
			{
				id             : this._id,
				dtlsParameters : transportLocalParameters.dtlsParameters
			};

			this.safeEmit('@notify', 'updateTransport', data);
		});

		handler.on('@needupdateproducer', (producer, rtpParameters) =>
		{
			const data =
			{
				id            : producer.id,
				rtpParameters : rtpParameters
			};

			// Update Producer RTP parameters.
			producer.setRtpParameters(rtpParameters);

			// Notify the server.
			this.safeEmit('@notify', 'updateProducer', data);
		});
	}

	/**
	 * Send the given Producer over this Transport.
	 *
	 * @private
	 *
	 * @param {Producer} producer
	 *
	 * @return {Promise}
	 */
	addProducer(producer)
	{
		logger.debug('addProducer() [producer:%o]', producer);

		if (this._closed)
			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Transport closed'));
		if (this._direction !== 'send')
			return Promise.reject(new Error('not a sending Transport'));

		// Enqueue command.
		return this._commandQueue.push('addProducer', { producer });
	}

	/**
	 * @private
	 */
	removeProducer(producer, originator, appData)
	{
		logger.debug('removeProducer() [producer:%o]', producer);

		// Enqueue command.
		if (!this._closed)
		{
			this._commandQueue.push('removeProducer', { producer })
				.catch(() => {});
		}

		if (originator === 'local')
			this.safeEmit('@notify', 'closeProducer', { id: producer.id, appData });
	}

	/**
	 * @private
	 */
	pauseProducer(producer, appData)
	{
		logger.debug('pauseProducer() [producer:%o]', producer);

		const data =
		{
			id      : producer.id,
			appData : appData
		};

		this.safeEmit('@notify', 'pauseProducer', data);
	}

	/**
	 * @private
	 */
	resumeProducer(producer, appData)
	{
		logger.debug('resumeProducer() [producer:%o]', producer);

		const data =
		{
			id      : producer.id,
			appData : appData
		};

		this.safeEmit('@notify', 'resumeProducer', data);
	}

	/**
	 * @private
	 *
	 * @return {Promise}
	 */
	replaceProducerTrack(producer, track)
	{
		logger.debug('replaceProducerTrack() [producer:%o]', producer);

		return this._commandQueue.push(
			'replaceProducerTrack', { producer, track });
	}

	/**
	 * @private
	 */
	enableProducerStats(producer, interval)
	{
		logger.debug('enableProducerStats() [producer:%o]', producer);

		const data =
		{
			id       : producer.id,
			interval : interval
		};

		this.safeEmit('@notify', 'enableProducerStats', data);
	}

	/**
	 * @private
	 */
	disableProducerStats(producer)
	{
		logger.debug('disableProducerStats() [producer:%o]', producer);

		const data =
		{
			id : producer.id
		};

		this.safeEmit('@notify', 'disableProducerStats', data);
	}

	/**
	 * Receive the given Consumer over this Transport.
	 *
	 * @private
	 *
	 * @param {Consumer} consumer
	 *
	 * @return {Promise} Resolves to a remote MediaStreamTrack.
	 */
	addConsumer(consumer)
	{
		logger.debug('addConsumer() [consumer:%o]', consumer);

		if (this._closed)
			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Transport closed'));
		if (this._direction !== 'recv')
			return Promise.reject(new Error('not a receiving Transport'));

		// Enqueue command.
		return this._commandQueue.push('addConsumer', { consumer });
	}

	/**
	 * @private
	 */
	removeConsumer(consumer)
	{
		logger.debug('removeConsumer() [consumer:%o]', consumer);

		// Enqueue command.
		this._commandQueue.push('removeConsumer', { consumer })
			.catch(() => {});
	}

	/**
	 * @private
	 */
	pauseConsumer(consumer, appData)
	{
		logger.debug('pauseConsumer() [consumer:%o]', consumer);

		const data =
		{
			id      : consumer.id,
			appData : appData
		};

		this.safeEmit('@notify', 'pauseConsumer', data);
	}

	/**
	 * @private
	 */
	resumeConsumer(consumer, appData)
	{
		logger.debug('resumeConsumer() [consumer:%o]', consumer);

		const data =
		{
			id      : consumer.id,
			appData : appData
		};

		this.safeEmit('@notify', 'resumeConsumer', data);
	}

	/**
	 * @private
	 */
	setConsumerPreferredProfile(consumer, profile)
	{
		logger.debug('setConsumerPreferredProfile() [consumer:%o]', consumer);

		const data =
		{
			id      : consumer.id,
			profile : profile
		};

		this.safeEmit('@notify', 'setConsumerPreferredProfile', data);
	}

	/**
	 * @private
	 */
	enableConsumerStats(consumer, interval)
	{
		logger.debug('enableConsumerStats() [consumer:%o]', consumer);

		const data =
		{
			id       : consumer.id,
			interval : interval
		};

		this.safeEmit('@notify', 'enableConsumerStats', data);
	}

	/**
	 * @private
	 */
	disableConsumerStats(consumer)
	{
		logger.debug('disableConsumerStats() [consumer:%o]', consumer);

		const data =
		{
			id : consumer.id
		};

		this.safeEmit('@notify', 'disableConsumerStats', data);
	}

	/**
	 * Receive remote stats.
	 *
	 * @private
	 *
	 * @param {Object} stats
	 */
	remoteStats(stats)
	{
		this.safeEmit('stats', stats);
	}

	_execCommand(command, promiseHolder)
	{
		let promise;

		try
		{
			switch (command.method)
			{
				case 'addProducer':
				{
					const { producer } = command;

					promise = this._execAddProducer(producer);
					break;
				}

				case 'removeProducer':
				{
					const { producer } = command;

					promise = this._execRemoveProducer(producer);
					break;
				}

				case 'replaceProducerTrack':
				{
					const { producer, track } = command;

					promise = this._execReplaceProducerTrack(producer, track);
					break;
				}

				case 'addConsumer':
				{
					const { consumer } = command;

					promise = this._execAddConsumer(consumer);
					break;
				}

				case 'removeConsumer':
				{
					const { consumer } = command;

					promise = this._execRemoveConsumer(consumer);
					break;
				}

				case 'restartIce':
				{
					const { remoteIceParameters } = command;

					promise = this._execRestartIce(remoteIceParameters);
					break;
				}

				default:
				{
					promise = Promise.reject(
						new Error(`unknown command method "${command.method}"`));
				}
			}
		}
		catch (error)
		{
			promise = Promise.reject(error);
		}

		// Fill the given Promise holder.
		promiseHolder.promise = promise;
	}

	_execAddProducer(producer)
	{
		logger.debug('_execAddProducer()');

		let producerRtpParameters;

		// Call the handler.
		return Promise.resolve()
			.then(() =>
			{
				return this._handler.addProducer(producer);
			})
			.then((rtpParameters) =>
			{
				producerRtpParameters = rtpParameters;

				const data =
				{
					id            : producer.id,
					kind          : producer.kind,
					transportId   : this._id,
					rtpParameters : rtpParameters,
					paused        : producer.locallyPaused,
					appData       : producer.appData
				};

				return this.safeEmitAsPromise('@request', 'createProducer', data);
			})
			.then(() =>
			{
				producer.setRtpParameters(producerRtpParameters);
			});
	}

	_execRemoveProducer(producer)
	{
		logger.debug('_execRemoveProducer()');

		// Call the handler.
		return this._handler.removeProducer(producer);
	}

	_execReplaceProducerTrack(producer, track)
	{
		logger.debug('_execReplaceProducerTrack()');

		// Call the handler.
		return this._handler.replaceProducerTrack(producer, track);
	}

	_execAddConsumer(consumer)
	{
		logger.debug('_execAddConsumer()');

		let consumerTrack;

		// Call the handler.
		return Promise.resolve()
			.then(() =>
			{
				return this._handler.addConsumer(consumer);
			})
			.then((track) =>
			{
				consumerTrack = track;

				const data =
				{
					id               : consumer.id,
					transportId      : this.id,
					paused           : consumer.locallyPaused,
					preferredProfile : consumer.preferredProfile
				};

				return this.safeEmitAsPromise('@request', 'enableConsumer', data);
			})
			.then((response) =>
			{
				const { paused, preferredProfile, effectiveProfile } = response;

				if (paused)
					consumer.remotePause();

				if (preferredProfile)
					consumer.remoteSetPreferredProfile(preferredProfile);

				if (effectiveProfile)
					consumer.remoteEffectiveProfileChanged(effectiveProfile);

				return consumerTrack;
			});
	}

	_execRemoveConsumer(consumer)
	{
		logger.debug('_execRemoveConsumer()');

		// Call the handler.
		return this._handler.removeConsumer(consumer);
	}

	_execRestartIce(remoteIceParameters)
	{
		logger.debug('_execRestartIce()');

		// Call the handler.
		return this._handler.restartIce(remoteIceParameters);
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Transport;



/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_events__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errors__ = __webpack_require__(7);




const logger = new __WEBPACK_IMPORTED_MODULE_1__Logger__["a" /* default */]('CommandQueue');

class CommandQueue extends __WEBPACK_IMPORTED_MODULE_0_events__["EventEmitter"]
{
	constructor()
	{
		super();
		this.setMaxListeners(Infinity);

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Busy running a command.
		// @type {Boolean}
		this._busy = false;

		// Queue for pending commands. Each command is an Object with method,
		// resolve, reject, and other members (depending the case).
		// @type {Array<Object>}
		this._queue = [];
	}

	close()
	{
		this._closed = true;
	}

	push(method, data)
	{
		const command = Object.assign({ method }, data);

		logger.debug('push() [method:%s]', method);

		return new Promise((resolve, reject) =>
		{
			const queue = this._queue;

			command.resolve = resolve;
			command.reject = reject;

			// Append command to the queue.
			queue.push(command);
			this._handlePendingCommands();
		});
	}

	_handlePendingCommands()
	{
		if (this._busy)
			return;

		const queue = this._queue;

		// Take the first command.
		const command = queue[0];

		if (!command)
			return;

		this._busy = true;

		// Execute it.
		this._handleCommand(command)
			.then(() =>
			{
				this._busy = false;

				// Remove the first command (the completed one) from the queue.
				queue.shift();

				// And continue.
				this._handlePendingCommands();
			});
	}

	_handleCommand(command)
	{
		logger.debug('_handleCommand() [method:%s]', command.method);

		if (this._closed)
		{
			command.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('closed'));

			return Promise.resolve();
		}

		const promiseHolder = { promise: null };

		this.emit('exec', command, promiseHolder);

		return Promise.resolve()
			.then(() =>
			{
				return promiseHolder.promise;
			})
			.then((result) =>
			{
				logger.debug('_handleCommand() | command succeeded [method:%s]', command.method);

				if (this._closed)
				{
					command.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('closed'));

					return;
				}

				// Resolve the command with the given result (if any).
				command.resolve(result);
			})
			.catch((error) =>
			{
				logger.error(
					'_handleCommand() | command failed [method:%s]: %o', command.method, error);

				// Reject the command with the error.
				command.reject(error);
			});
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CommandQueue;



/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errors__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(2);





const DEFAULT_STATS_INTERVAL = 1000;
const SIMULCAST_DEFAULT =
{
	low    : 100000,
	medium : 300000,
	high   : 1500000
};

const logger = new __WEBPACK_IMPORTED_MODULE_0__Logger__["a" /* default */]('Producer');

class Producer extends __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__["a" /* default */]
{
	/**
	 * @private
	 *
	 * @emits {originator: String, [appData]: Any} pause
	 * @emits {originator: String, [appData]: Any} resume
	 * @emits {stats: Object} stats
	 * @emits unhandled
	 * @emits trackended
	 * @emits {originator: String, [appData]: Any} close
	 *
	 * @emits {originator: String, [appData]: Any} @close
	 */
	constructor(track, options, appData)
	{
		super(logger);

		// Id.
		// @type {Number}
		this._id = __WEBPACK_IMPORTED_MODULE_3__utils__["b" /* randomNumber */]();

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Original track.
		// @type {MediaStreamTrack}
		this._originalTrack = track;

		// Track cloned from the original one.
		// @type {MediaStreamTrack}
		this._track = track.clone();

		// App custom data.
		// @type {Any}
		this._appData = appData;

		// Simulcast.
		// @type {Object|false}
		this._simulcast = false;

		if (options.simulcast)
			this._simulcast = Object.assign({}, SIMULCAST_DEFAULT, options.simulcast);

		// Associated Transport.
		// @type {Transport}
		this._transport = null;

		// RTP parameters.
		// @type {RTCRtpParameters}
		this._rtpParameters = null;

		// Locally paused flag.
		// @type {Boolean}
		this._locallyPaused = !this._track.enabled;

		// Remotely paused flag.
		// @type {Boolean}
		this._remotelyPaused = false;

		// Periodic stats flag.
		// @type {Boolean}
		this._statsEnabled = false;

		// Periodic stats gathering interval (milliseconds).
		// @type {Number}
		this._statsInterval = DEFAULT_STATS_INTERVAL;

		// Handle the effective track.
		this._handleTrack();
	}

	/**
	 * Producer id.
	 *
	 * @return {Number}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Whether the Producer is closed.
	 *
	 * @return {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Media kind.
	 *
	 * @return {String}
	 */
	get kind()
	{
		return this._track.kind;
	}

	/**
	 * The associated track.
	 *
	 * @return {MediaStreamTrack}
	 */
	get track()
	{
		return this._track;
	}

	/**
	 * The associated original track.
	 *
	 * @return {MediaStreamTrack}
	 */
	get originalTrack()
	{
		return this._originalTrack;
	}

	/**
	 * Simulcast settings.
	 *
	 * @return {Object|false}
	 */
	get simulcast()
	{
		return this._simulcast;
	}

	/**
	 * App custom data.
	 *
	 * @return {Any}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Associated Transport.
	 *
	 * @return {Transport}
	 */
	get transport()
	{
		return this._transport;
	}

	/**
	 * RTP parameters.
	 *
	 * @return {RTCRtpParameters}
	 */
	get rtpParameters()
	{
		return this._rtpParameters;
	}

	/**
	 * Whether the Producer is locally paused.
	 *
	 * @return {Boolean}
	 */
	get locallyPaused()
	{
		return this._locallyPaused;
	}

	/**
	 * Whether the Producer is remotely paused.
	 *
	 * @return {Boolean}
	 */
	get remotelyPaused()
	{
		return this._remotelyPaused;
	}

	/**
	 * Whether the Producer is paused.
	 *
	 * @return {Boolean}
	 */
	get paused()
	{
		return this._locallyPaused || this._remotelyPaused;
	}

	/**
	 * Closes the Producer.
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	close(appData)
	{
		logger.debug('close()');

		if (this._closed)
			return;

		this._closed = true;

		if (this._statsEnabled)
		{
			this._statsEnabled = false;

			if (this.transport)
			{
				this.transport.disableProducerStats(this);
			}
		}

		if (this._transport)
			this._transport.removeProducer(this, 'local', appData);

		this._destroy();

		this.emit('@close', 'local', appData);
		this.safeEmit('close', 'local', appData);
	}

	/**
	 * My remote Producer was closed.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remoteClose(appData)
	{
		logger.debug('remoteClose()');

		if (this._closed)
			return;

		this._closed = true;

		if (this._transport)
			this._transport.removeProducer(this, 'remote', appData);

		this._destroy();

		this.emit('@close', 'remote', appData);
		this.safeEmit('close', 'remote', appData);
	}

	_destroy()
	{
		this._transport = false;
		this._rtpParameters = null;

		try { this._track.stop(); }
		catch (error) {}
	}

	/**
	 * Sends RTP.
	 *
	 * @param {transport} Transport instance.
	 *
	 * @return {Promise}
	 */
	send(transport)
	{
		logger.debug('send() [transport:%o]', transport);

		if (this._closed)
			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Producer closed'));
		else if (this._transport)
			return Promise.reject(new Error('already handled by a Transport'));
		else if (typeof transport !== 'object')
			return Promise.reject(new TypeError('invalid Transport'));

		this._transport = transport;

		return transport.addProducer(this)
			.then(() =>
			{
				transport.once('@close', () =>
				{
					if (this._closed || this._transport !== transport)
						return;

					this._transport.removeProducer(this, 'local');

					this._transport = null;
					this._rtpParameters = null;

					this.safeEmit('unhandled');
				});

				this.safeEmit('handled');

				if (this._statsEnabled)
					transport.enableProducerStats(this, this._statsInterval);
			})
			.catch((error) =>
			{
				this._transport = null;

				throw error;
			});
	}

	/**
	 * Pauses sending media.
	 *
	 * @param {Any} [appData] - App custom data.
	 *
	 * @return {Boolean} true if paused.
	 */
	pause(appData)
	{
		logger.debug('pause()');

		if (this._closed)
		{
			logger.error('pause() | Producer closed');

			return false;
		}
		else if (this._locallyPaused)
		{
			return true;
		}

		this._locallyPaused = true;
		this._track.enabled = false;

		if (this._transport)
			this._transport.pauseProducer(this, appData);

		this.safeEmit('pause', 'local', appData);

		// Return true if really paused.
		return this.paused;
	}

	/**
	 * My remote Producer was paused.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remotePause(appData)
	{
		logger.debug('remotePause()');

		if (this._closed || this._remotelyPaused)
			return;

		this._remotelyPaused = true;
		this._track.enabled = false;

		this.safeEmit('pause', 'remote', appData);
	}

	/**
	 * Resumes sending media.
	 *
	 * @param {Any} [appData] - App custom data.
	 *
	 * @return {Boolean} true if not paused.
	 */
	resume(appData)
	{
		logger.debug('resume()');

		if (this._closed)
		{
			logger.error('resume() | Producer closed');

			return false;
		}
		else if (!this._locallyPaused)
		{
			return true;
		}

		this._locallyPaused = false;

		if (!this._remotelyPaused)
			this._track.enabled = true;

		if (this._transport)
			this._transport.resumeProducer(this, appData);

		this.safeEmit('resume', 'local', appData);

		// Return true if not paused.
		return !this.paused;
	}

	/**
	 * My remote Producer was resumed.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remoteResume(appData)
	{
		logger.debug('remoteResume()');

		if (this._closed || !this._remotelyPaused)
			return;

		this._remotelyPaused = false;

		if (!this._locallyPaused)
			this._track.enabled = true;

		this.safeEmit('resume', 'remote', appData);
	}

	/**
	 * Replaces the current track with a new one.
	 *
	 * @param {MediaStreamTrack} track - New track.
	 *
	 * @return {Promise} Resolves with the new track itself.
	 */
	replaceTrack(track)
	{
		logger.debug('replaceTrack() [track:%o]', track);

		if (this._closed)
			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Producer closed'));
		else if (!(track instanceof MediaStreamTrack))
			return Promise.reject(new TypeError('track is not a MediaStreamTrack'));
		else if (track.readyState === 'ended')
			return Promise.reject(new Error('track.readyState is "ended"'));

		const clonedTrack = track.clone();

		return Promise.resolve()
			.then(() =>
			{
				// If this Producer is handled by a Transport, we need to tell it about
				// the new track.
				if (this._transport)
					return this._transport.replaceProducerTrack(this, clonedTrack);
			})
			.then(() =>
			{
				// Stop the previous track.
				try { this._track.onended = null; this._track.stop(); }
				catch (error) {}

				// If this Producer was locally paused/resumed and the state of the new
				// track does not match, fix it.
				if (!this.paused)
					clonedTrack.enabled = true;
				else
					clonedTrack.enabled = false;

				// Set the new tracks.
				this._originalTrack = track;
				this._track = clonedTrack;

				// Handle the effective track.
				this._handleTrack();

				// Return the new track.
				return this._track;
			});
	}

	/**
	 * Set/update RTP parameters.
	 *
	 * @private
	 *
	 * @param {RTCRtpParameters} rtpParameters
	 */
	setRtpParameters(rtpParameters)
	{
		this._rtpParameters = rtpParameters;
	}

	/**
	 * Enables periodic stats retrieval.
	 */
	enableStats(interval = DEFAULT_STATS_INTERVAL)
	{
		logger.debug('enableStats() [interval:%s]', interval);

		if (this._closed)
		{
			logger.error('enableStats() | Producer closed');

			return;
		}

		if (this._statsEnabled)
			return;

		if (typeof interval !== 'number' || interval < 1000)
			this._statsInterval = DEFAULT_STATS_INTERVAL;
		else
			this._statsInterval = interval;

		this._statsEnabled = true;

		if (this._transport)
			this._transport.enableProducerStats(this, this._statsInterval);
	}

	/**
	 * Disables periodic stats retrieval.
	 */
	disableStats()
	{
		logger.debug('disableStats()');

		if (this._closed)
		{
			logger.error('disableStats() | Producer closed');

			return;
		}

		if (!this._statsEnabled)
			return;

		this._statsEnabled = false;

		if (this._transport)
			this._transport.disableProducerStats(this);
	}

	/**
	 * Receive remote stats.
	 *
	 * @private
	 *
	 * @param {Object} stats
	 */
	remoteStats(stats)
	{
		this.safeEmit('stats', stats);
	}

	/**
	 * @private
	 */
	_handleTrack()
	{
		// If the cloned track is closed (for example if the desktop sharing is closed
		// via chrome UI) close the Producer.
		this._track.onended = () =>
		{
			if (this._closed)
				return;

			logger.warn('track "ended" event, closing Producer');

			this.safeEmit('trackended');
			this.close();
		};
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Producer;



/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__ = __webpack_require__(1);



const logger = new __WEBPACK_IMPORTED_MODULE_0__Logger__["a" /* default */]('Peer');

class Peer extends __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__["a" /* default */]
{
	/**
	 * @private
	 *
	 * @emits {consumer: Consumer} newconsumer
	 * @emits {originator: String, [appData]: Any} close
	 *
	 * @emits @close
	 */
	constructor(name, appData)
	{
		super(logger);

		// Name.
		// @type {String}
		this._name = name;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// App custom data.
		// @type {Any}
		this._appData = appData;

		// Map of Consumers indexed by id.
		// @type {map<Number, Consumer>}
		this._consumers = new Map();
	}

	/**
	 * Peer name.
	 *
	 * @return {String}
	 */
	get name()
	{
		return this._name;
	}

	/**
	 * Whether the Peer is closed.
	 *
	 * @return {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * App custom data.
	 *
	 * @return {Any}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * The list of Consumers.
	 *
	 * @return {Array<Consumer>}
	 */
	get consumers()
	{
		return Array.from(this._consumers.values());
	}

	/**
	 * Closes the Peer.
	 * This is called when the local Room is closed.
	 *
	 * @private
	 */
	close()
	{
		logger.debug('close()');

		if (this._closed)
			return;

		this._closed = true;

		this.emit('@close');
		this.safeEmit('close', 'local');

		// Close all the Consumers.
		for (const consumer of this._consumers.values())
		{
			consumer.close();
		}
	}

	/**
	 * The remote Peer or Room was closed.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remoteClose(appData)
	{
		logger.debug('remoteClose()');

		if (this._closed)
			return;

		this._closed = true;

		this.emit('@close');
		this.safeEmit('close', 'remote', appData);

		// Close all the Consumers.
		for (const consumer of this._consumers.values())
		{
			consumer.remoteClose();
		}
	}

	/**
	 * Get the Consumer with the given id.
	 *
	 * @param {Number} id
	 *
	 * @return {Consumer}
	 */
	getConsumerById(id)
	{
		return this._consumers.get(id);
	}

	/**
	 * Add an associated Consumer.
	 *
	 * @private
	 *
	 * @param {Consumer} consumer
	 */
	addConsumer(consumer)
	{
		if (this._consumers.has(consumer.id))
			throw new Error(`Consumer already exists [id:${consumer.id}]`);

		// Store it.
		this._consumers.set(consumer.id, consumer);

		// Handle it.
		consumer.on('@close', () =>
		{
			this._consumers.delete(consumer.id);
		});

		// Emit event.
		this.safeEmit('newconsumer', consumer);
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Peer;



/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errors__ = __webpack_require__(7);




const PROFILES = new Set([ 'default', 'low', 'medium', 'high' ]);
const DEFAULT_STATS_INTERVAL = 1000;

const logger = new __WEBPACK_IMPORTED_MODULE_0__Logger__["a" /* default */]('Consumer');

class Consumer extends __WEBPACK_IMPORTED_MODULE_1__EnhancedEventEmitter__["a" /* default */]
{
	/**
	 * @private
	 *
	 * @emits {originator: String, [appData]: Any} pause
	 * @emits {originator: String, [appData]: Any} resume
	 * @emits {profile: String} effectiveprofilechange
	 * @emits {stats: Object} stats
	 * @emits unhandled
	 * @emits {originator: String} close
	 *
	 * @emits @close
	 */
	constructor(id, kind, rtpParameters, peer, appData)
	{
		super(logger);

		// Id.
		// @type {Number}
		this._id = id;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Media kind.
		// @type {String}
		this._kind = kind;

		// RTP parameters.
		// @type {RTCRtpParameters}
		this._rtpParameters = rtpParameters;

		// Associated Peer.
		// @type {Peer}
		this._peer = peer;

		// App custom data.
		// @type {Any}
		this._appData = appData;

		// Whether we can receive this Consumer (based on our RTP capabilities).
		// @type {Boolean}
		this._supported = false;

		// Associated Transport.
		// @type {Transport}
		this._transport = null;

		// Remote track.
		// @type {MediaStreamTrack}
		this._track = null;

		// Locally paused flag.
		// @type {Boolean}
		this._locallyPaused = false;

		// Remotely paused flag.
		// @type {Boolean}
		this._remotelyPaused = false;

		// Periodic stats flag.
		// @type {Boolean}
		this._statsEnabled = false;

		// Periodic stats gathering interval (milliseconds).
		// @type {Number}
		this._statsInterval = DEFAULT_STATS_INTERVAL;

		// Preferred profile.
		// @type {String}
		this._preferredProfile = 'default';

		// Effective profile.
		// @type {String}
		this._effectiveProfile = null;
	}

	/**
	 * Consumer id.
	 *
	 * @return {Number}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Whether the Consumer is closed.
	 *
	 * @return {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Media kind.
	 *
	 * @return {String}
	 */
	get kind()
	{
		return this._kind;
	}

	/**
	 * RTP parameters.
	 *
	 * @return {RTCRtpParameters}
	 */
	get rtpParameters()
	{
		return this._rtpParameters;
	}

	/**
	 * Associated Peer.
	 *
	 * @return {Peer}
	 */
	get peer()
	{
		return this._peer;
	}

	/**
	 * App custom data.
	 *
	 * @return {Any}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Whether we can receive this Consumer (based on our RTP capabilities).
	 *
	 * @return {Boolean}
	 */
	get supported()
	{
		return this._supported;
	}

	/**
	 * Associated Transport.
	 *
	 * @return {Transport}
	 */
	get transport()
	{
		return this._transport;
	}

	/**
	 * The associated track (if any yet).
	 *
	 * @return {MediaStreamTrack|Null}
	 */
	get track()
	{
		return this._track;
	}

	/**
	 * Whether the Consumer is locally paused.
	 *
	 * @return {Boolean}
	 */
	get locallyPaused()
	{
		return this._locallyPaused;
	}

	/**
	 * Whether the Consumer is remotely paused.
	 *
	 * @return {Boolean}
	 */
	get remotelyPaused()
	{
		return this._remotelyPaused;
	}

	/**
	 * Whether the Consumer is paused.
	 *
	 * @return {Boolean}
	 */
	get paused()
	{
		return this._locallyPaused || this._remotelyPaused;
	}

	/**
	 * The preferred profile.
	 *
	 * @type {String}
	 */
	get preferredProfile()
	{
		return this._preferredProfile;
	}

	/**
	 * The effective profile.
	 *
	 * @type {String}
	 */
	get effectiveProfile()
	{
		return this._effectiveProfile;
	}

	/**
	 * Closes the Consumer.
	 * This is called when the local Room is closed.
	 *
	 * @private
	 */
	close()
	{
		logger.debug('close()');

		if (this._closed)
			return;

		this._closed = true;

		if (this._statsEnabled)
		{
			this._statsEnabled = false;

			if (this.transport)
				this.transport.disableConsumerStats(this);
		}

		this.emit('@close');
		this.safeEmit('close', 'local');

		this._destroy();
	}

	/**
	 * My remote Consumer was closed.
	 * Invoked via remote notification.
	 *
	 * @private
	 */
	remoteClose()
	{
		logger.debug('remoteClose()');

		if (this._closed)
			return;

		this._closed = true;

		if (this._transport)
			this._transport.removeConsumer(this);

		this._destroy();

		this.emit('@close');
		this.safeEmit('close', 'remote');
	}

	_destroy()
	{
		this._transport = null;

		try { this._track.stop(); }
		catch (error) {}

		this._track = null;
	}

	/**
	 * Receives RTP.
	 *
	 * @param {transport} Transport instance.
	 *
	 * @return {Promise} Resolves with a remote MediaStreamTrack.
	 */
	receive(transport)
	{
		logger.debug('receive() [transport:%o]', transport);

		if (this._closed)
			return Promise.reject(new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* InvalidStateError */]('Consumer closed'));
		else if (!this._supported)
			return Promise.reject(new Error('unsupported codecs'));
		else if (this._transport)
			return Promise.reject(new Error('already handled by a Transport'));
		else if (typeof transport !== 'object')
			return Promise.reject(new TypeError('invalid Transport'));

		this._transport = transport;

		return transport.addConsumer(this)
			.then((track) =>
			{
				this._track = track;

				// If we were paused, disable the track.
				if (this.paused)
					track.enabled = false;

				transport.once('@close', () =>
				{
					if (this._closed || this._transport !== transport)
						return;

					this._transport = null;

					try { this._track.stop(); }
					catch (error) {}

					this._track = null;

					this.safeEmit('unhandled');
				});

				this.safeEmit('handled');

				if (this._statsEnabled)
					transport.enableConsumerStats(this, this._statsInterval);

				return track;
			})
			.catch((error) =>
			{
				this._transport = null;

				throw error;
			});
	}

	/**
	 * Pauses receiving media.
	 *
	 * @param {Any} [appData] - App custom data.
	 *
	 * @return {Boolean} true if paused.
	 */
	pause(appData)
	{
		logger.debug('pause()');

		if (this._closed)
		{
			logger.error('pause() | Consumer closed');

			return false;
		}
		else if (this._locallyPaused)
		{
			return true;
		}

		this._locallyPaused = true;

		if (this._track)
			this._track.enabled = false;

		if (this._transport)
			this._transport.pauseConsumer(this, appData);

		this.safeEmit('pause', 'local', appData);

		// Return true if really paused.
		return this.paused;
	}

	/**
	 * My remote Consumer was paused.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remotePause(appData)
	{
		logger.debug('remotePause()');

		if (this._closed || this._remotelyPaused)
			return;

		this._remotelyPaused = true;

		if (this._track)
			this._track.enabled = false;

		this.safeEmit('pause', 'remote', appData);
	}

	/**
	 * Resumes receiving media.
	 *
	 * @param {Any} [appData] - App custom data.
	 *
	 * @return {Boolean} true if not paused.
	 */
	resume(appData)
	{
		logger.debug('resume()');

		if (this._closed)
		{
			logger.error('resume() | Consumer closed');

			return false;
		}
		else if (!this._locallyPaused)
		{
			return true;
		}

		this._locallyPaused = false;

		if (this._track && !this._remotelyPaused)
			this._track.enabled = true;

		if (this._transport)
			this._transport.resumeConsumer(this, appData);

		this.safeEmit('resume', 'local', appData);

		// Return true if not paused.
		return !this.paused;
	}

	/**
	 * My remote Consumer was resumed.
	 * Invoked via remote notification.
	 *
	 * @private
	 *
	 * @param {Any} [appData] - App custom data.
	 */
	remoteResume(appData)
	{
		logger.debug('remoteResume()');

		if (this._closed || !this._remotelyPaused)
			return;

		this._remotelyPaused = false;

		if (this._track && !this._locallyPaused)
			this._track.enabled = true;

		this.safeEmit('resume', 'remote', appData);
	}

	/**
	 * Set preferred receiving profile.
	 *
	 * @param {String} profile
	 */
	setPreferredProfile(profile)
	{
		logger.debug('setPreferredProfile() [profile:%s]', profile);

		if (this._closed)
		{
			logger.error('setPreferredProfile() | Consumer closed');

			return;
		}
		else if (profile === this._preferredProfile)
		{
			return;
		}
		else if (!PROFILES.has(profile))
		{
			logger.error('setPreferredProfile() | invalid profile "%s"', profile);

			return;
		}

		this._preferredProfile = profile;

		if (this._transport)
			this._transport.setConsumerPreferredProfile(this, this._preferredProfile);
	}

	/**
	 * Preferred receiving profile was set on my remote Consumer.
	 *
	 * @param {String} profile
	 */
	remoteSetPreferredProfile(profile)
	{
		logger.debug('remoteSetPreferredProfile() [profile:%s]', profile);

		if (this._closed || profile === this._preferredProfile)
			return;

		this._preferredProfile = profile;
	}

	/**
	 * Effective receiving profile changed on my remote Consumer.
	 *
	 * @param {String} profile
	 */
	remoteEffectiveProfileChanged(profile)
	{
		logger.debug('remoteEffectiveProfileChanged() [profile:%s]', profile);

		if (this._closed || profile === this._effectiveProfile)
			return;

		this._effectiveProfile = profile;

		this.safeEmit('effectiveprofilechange', this._effectiveProfile);
	}

	/**
	 * Enables periodic stats retrieval.
	 */
	enableStats(interval = DEFAULT_STATS_INTERVAL)
	{
		logger.debug('enableStats() [interval:%s]', interval);

		if (this._closed)
		{
			logger.error('enableStats() | Consumer closed');

			return;
		}

		if (this._statsEnabled)
			return;

		if (typeof interval !== 'number' || interval < 1000)
			this._statsInterval = DEFAULT_STATS_INTERVAL;
		else
			this._statsInterval = interval;

		this._statsEnabled = true;

		if (this._transport)
			this._transport.enableConsumerStats(this, this._statsInterval);
	}

	/**
	 * Disables periodic stats retrieval.
	 */
	disableStats()
	{
		logger.debug('disableStats()');

		if (this._closed)
		{
			logger.error('disableStats() | Consumer closed');

			return;
		}

		if (!this._statsEnabled)
			return;

		this._statsEnabled = false;

		if (this._transport)
			this._transport.disableConsumerStats(this);
	}

	/**
	 * Mark this Consumer as suitable for reception or not.
	 *
	 * @private
	 *
	 * @param {Boolean} flag
	 */
	setSupported(flag)
	{
		this._supported = flag;
	}

	/**
	 * Receive remote stats.
	 *
	 * @private
	 *
	 * @param {Object} stats
	 */
	remoteStats(stats)
	{
		this.safeEmit('stats', stats);
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Consumer;



/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_debug__);


const APP_NAME = 'mediasoup';

class Logger
{
	constructor(prefix)
	{
		if (prefix)
		{
			this._debug = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:${prefix}`);
			this._warn = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:WARN:${prefix}`);
			this._error = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:ERROR:${prefix}`);
		}
		else
		{
			this._debug = __WEBPACK_IMPORTED_MODULE_0_debug___default()(APP_NAME);
			this._warn = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:WARN`);
			this._error = __WEBPACK_IMPORTED_MODULE_0_debug___default()(`${APP_NAME}:ERROR`);
		}
		this._debug.enabled = false
		// if (global.debug_mode){
		// 	this._debug.enabled = true
		// }else{
		// 	/* eslint-disable no-console */
		// 	this._debug.log = console.info.bind(console);
		// 	this._warn.log = console.warn.bind(console);
		// 	this._error.log = console.error.bind(console);
		// 	/* eslint-enable no-console */
		// }	
	}

	get debug()
	{
		return this._debug;
	}

	get warn()
	{
		return this._warn;
	}

	get error()
	{
		return this._error;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Logger;



/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(63);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(16);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export initialize */
/* unused harmony export isDesktop */
/* unused harmony export isMobile */
let mediaQueryDetectorElem;

function initialize()
{
	// Media query detector stuff.
	mediaQueryDetectorElem =
		document.getElementById('mediasoup-demo-app-media-query-detector');

	return Promise.resolve();
}

function isDesktop()
{
	return Boolean(mediaQueryDetectorElem.offsetParent);
}

function isMobile()
{
	return !mediaQueryDetectorElem.offsetParent;
}


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_random_string__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_random_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_random_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stateActions__ = __webpack_require__(21);



const joinRoom = (
	{ media_server_wss, roomId, peerName, displayName, device, useSimulcast, produce, turnservers }) =>
{
	return {
		type    : 'JOIN_ROOM',
		payload : { media_server_wss, roomId, peerName, displayName, device, useSimulcast, produce, turnservers }
	};
};
/* harmony export (immutable) */ __webpack_exports__["a"] = joinRoom;


const leaveRoom = () =>
{
	return {
		type : 'LEAVE_ROOM'
	};
};
/* unused harmony export leaveRoom */


const changeDisplayName = (displayName) =>
{
	return {
		type    : 'CHANGE_DISPLAY_NAME',
		payload : { displayName }
	};
};
/* unused harmony export changeDisplayName */


const muteMic = () =>
{
	return {
		type : 'MUTE_MIC'
	};
};
/* unused harmony export muteMic */


const unmuteMic = () =>
{
	return {
		type : 'UNMUTE_MIC'
	};
};
/* unused harmony export unmuteMic */


const enableWebcam = () =>
{
	return {
		type : 'ENABLE_WEBCAM'
	};
};
/* unused harmony export enableWebcam */


const disableWebcam = () =>
{
	return {
		type : 'DISABLE_WEBCAM'
	};
};
/* unused harmony export disableWebcam */


const changeWebcam = () =>
{
	return {
		type : 'CHANGE_WEBCAM'
	};
};
/* unused harmony export changeWebcam */


const enableAudioOnly = () =>
{
	return {
		type : 'ENABLE_AUDIO_ONLY'
	};
};
/* unused harmony export enableAudioOnly */


const disableAudioOnly = () =>
{
	return {
		type : 'DISABLE_AUDIO_ONLY'
	};
};
/* unused harmony export disableAudioOnly */


const restartIce = () =>
{
	return {
		type : 'RESTART_ICE'
	};
};
/* unused harmony export restartIce */


// This returns a redux-thunk action (a function).
const notify = ({ type = 'info', text, timeout }) =>
{
	if (!timeout)
	{
		switch (type)
		{
			case 'info':
				timeout = 3000;
				break;
			case 'error':
				timeout = 5000;
				break;
		}
	}

	const notification =
	{
		id      : __WEBPACK_IMPORTED_MODULE_0_random_string___default()({ length: 6 }).toLowerCase(),
		type    : type,
		text    : text,
		timeout : timeout
	};

	return (dispatch) =>
	{
		dispatch(__WEBPACK_IMPORTED_MODULE_1__stateActions__["a" /* addNotification */](notification));

		setTimeout(() =>
		{
			dispatch(__WEBPACK_IMPORTED_MODULE_1__stateActions__["b" /* removeNotification */](notification.id));
		}, timeout);
	};
};
/* unused harmony export notify */



/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * random-string
 * https://github.com/valiton/node-random-string
 *
 * Copyright (c) 2013 Valiton GmbH, Bastian 'hereandnow' Behrens
 * Licensed under the MIT license.
 */



var numbers = '0123456789',
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    specials = '!$%^&*()_+|~-=`{}[]:;<>?,./';


function _defaults (opts) {
  opts || (opts = {});
  return {
    length: opts.length || 8,
    numeric: typeof opts.numeric === 'boolean' ? opts.numeric : true,
    letters: typeof opts.letters === 'boolean' ? opts.letters : true,
    special: typeof opts.special === 'boolean' ? opts.special : false,
    exclude: Array.isArray(opts.exclude)       ? opts.exclude : []
  };
}

function _buildChars (opts) {
  var chars = '';
  if (opts.numeric) { chars += numbers; }
  if (opts.letters) { chars += letters; }
  if (opts.special) { chars += specials; }
  for (var i = 0; i <= opts.exclude.length; i++){
    chars = chars.replace(opts.exclude[i], "");
  }
  return chars;
}

module.exports = function randomString(opts) {
  opts = _defaults(opts);
  var i, rn,
      rnd = '',
      len = opts.length,
      exclude = opts.exclude,
      randomChars = _buildChars(opts);
  for (i = 1; i <= len; i++) {
    rnd += randomChars.substring(rn = Math.floor(Math.random() * randomChars.length), rn + 1);
  }
  return rnd;
};



/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__room__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__room___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__room__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__me__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__me___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__me__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__producers__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__producers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__producers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__peers__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__peers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__peers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__consumers__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__consumers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__consumers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__notifications__ = __webpack_require__(73);








const reducers = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["b" /* combineReducers */])(
	{
		room: __WEBPACK_IMPORTED_MODULE_1__room__["default"],
		me: __WEBPACK_IMPORTED_MODULE_2__me__["default"],
		producers: __WEBPACK_IMPORTED_MODULE_3__producers__["default"],
		peers: __WEBPACK_IMPORTED_MODULE_4__peers__["default"],
		consumers: __WEBPACK_IMPORTED_MODULE_5__consumers__["default"],
		notifications: __WEBPACK_IMPORTED_MODULE_6__notifications__["a" /* default */]
	});

/* harmony default export */ __webpack_exports__["a"] = (reducers);


/***/ }),
/* 68 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (16:12)\nYou may need an appropriate loader to handle this file type.\n| \t\t\tconst { url } = action.payload;\n| \n| \t\t\treturn { ...state, url };\n| \t\t}\n| ");

/***/ }),
/* 69 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (24:12)\nYou may need an appropriate loader to handle this file type.\n| \t\t\tconst { peerName, displayName, displayNameSet, device } = action.payload;\n| \t\t\tglobal.emitter.emit(\"SET_ME\", action.payload)\n| \t\t\treturn { ...state, name: peerName, displayName, displayNameSet, device };\n| \t\t}\n| ");

/***/ }),
/* 70 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (11:12)\nYou may need an appropriate loader to handle this file type.\n| \t\t\tconst { producer } = action.payload;\n| \t\t\tglobal.emitter.emit(\"ADD_PRODUCER\", producer)\n| \t\t\treturn { ...state, [producer.id]: producer };\n| \t\t}\n| ");

/***/ }),
/* 71 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (11:12)\nYou may need an appropriate loader to handle this file type.\n| \t\t\tconst { peer } = action.payload;\n| \t\t\tglobal.emitter.emit(\"peerAdded\", peer)\n| \t\t\treturn { ...state, [peer.name]: peer };\n| \t\t}\n| ");

/***/ }),
/* 72 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (11:12)\nYou may need an appropriate loader to handle this file type.\n| \t\t\tconst { consumer } = action.payload;\n| \t\t\tglobal.emitter.emit(\"ADD_CONSUMER\", action.payload)\n| \t\t\treturn { ...state, [consumer.id]: consumer };\n| \t\t}\n| ");

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const initialState = [];

const notifications = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'ADD_NOTIFICATION':
		{
			const { notification } = action.payload;

			return [ ...state, notification ];
		}

		case 'REMOVE_NOTIFICATION':
		{
			const { notificationId } = action.payload;

			return state.filter((notification) => notification.id !== notificationId);
		}

		case 'REMOVE_ALL_NOTIFICATIONS':
		{
			return [];
		}

		default:
			return state;
	}
};

/* harmony default export */ __webpack_exports__["a"] = (notifications);


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RoomClient__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RoomClient___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__RoomClient__);


/* harmony default export */ __webpack_exports__["a"] = (({ dispatch, getState }) => (next) =>
{
	let client;
	return (action) =>
	{
		switch (action.type)
		{
			case 'JOIN_ROOM':
			{	
				const {
					media_server_wss,
					roomId,
					peerName,
					displayName,
					device,
					useSimulcast,
					produce,
					turnservers
				} = action.payload;

				client = new __WEBPACK_IMPORTED_MODULE_0__RoomClient__["default"](
					{
						media_server_wss,
						roomId,
						peerName,
						displayName,
						device,
						useSimulcast,
						produce,
						dispatch,
						getState,
						turnservers
					});

				// TODO: TMP
				global.CLIENT = client;
				global.emitter.emit("joinRoom", client)
				break;
			}

			case 'LEAVE_ROOM':
			{
				client.close();
				global.emitter.emit("leaveRoom", client)
				break;
			}

			case 'CHANGE_DISPLAY_NAME':
			{
				const { displayName } = action.payload;

				client.changeDisplayName(displayName);
				global.emitter.emit("changeDisplayName", client)
				break;
			}

			case 'MUTE_MIC':
			{
				client.muteMic();
				global.emitter.emit("muteMic", client)
				break;
			}

			case 'UNMUTE_MIC':
			{
				client.unmuteMic();
				global.emitter.emit("unmuteMic", client)
				break;
			}

			case 'ENABLE_WEBCAM':
			{
				client.enableWebcam();
				global.emitter.emit("enableWebcam", client)
				break;
			}

			case 'DISABLE_WEBCAM':
			{
				client.disableWebcam();
				global.emitter.emit("disableWebcam", client)
				break;
			}

			case 'CHANGE_WEBCAM':
			{
				client.changeWebcam();
				global.emitter.emit("changeWebcam", client)
				break;
			}

			case 'ENABLE_AUDIO_ONLY':
			{
				client.enableAudioOnly();
				global.emitter.emit("enableAudioOnly", client)
				break;
			}

			case 'DISABLE_AUDIO_ONLY':
			{
				client.disableAudioOnly();
				global.emitter.emit("disableAudioOnly", client)
				break;
			}

			case 'RESTART_ICE':
			{
				client.restartIce();
				global.emitter.emit("restartIce", client)
				break;
			}
		}

		return next(action);
	};
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 75 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (266:7)\nYou may need an appropriate loader to handle this file type.\n| \t\t\t\t\t\t{\n| \t\t\t\t\t\t\tdeviceId : { exact: device.deviceId },\n| \t\t\t\t\t\t\t...VIDEO_CONSTRAINS[resolution]\n| \t\t\t\t\t\t}\n| \t\t\t\t\t});");

/***/ }),
/* 76 */
/***/ (function(module, exports) {

/*
WildEmitter.js is a slim little event emitter by @henrikjoreteg largely based
on @visionmedia's Emitter from UI Kit.

Why? I wanted it standalone.

I also wanted support for wildcard emitters like this:

emitter.on('*', function (eventName, other, event, payloads) {

});

emitter.on('somenamespace*', function (eventName, payloads) {

});

Please note that callbacks triggered by wildcard registered events also get
the event name as the first argument.
*/

module.exports = WildEmitter;

function WildEmitter() { }

WildEmitter.mixin = function (constructor) {
    var prototype = constructor.prototype || constructor;

    prototype.isWildEmitter= true;

    // Listen on the given `event` with `fn`. Store a group name if present.
    prototype.on = function (event, groupName, fn) {
        this.callbacks = this.callbacks || {};
        var hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        func._groupName = group;
        (this.callbacks[event] = this.callbacks[event] || []).push(func);
        return this;
    };

    // Adds an `event` listener that will be invoked a single
    // time then automatically removed.
    prototype.once = function (event, groupName, fn) {
        var self = this,
            hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        function on() {
            self.off(event, on);
            func.apply(this, arguments);
        }
        this.on(event, group, on);
        return this;
    };

    // Unbinds an entire group
    prototype.releaseGroup = function (groupName) {
        this.callbacks = this.callbacks || {};
        var item, i, len, handlers;
        for (item in this.callbacks) {
            handlers = this.callbacks[item];
            for (i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i]._groupName === groupName) {
                    //console.log('removing');
                    // remove it and shorten the array we're looping through
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        return this;
    };

    // Remove the given callback for `event` or all
    // registered callbacks.
    prototype.off = function (event, fn) {
        this.callbacks = this.callbacks || {};
        var callbacks = this.callbacks[event],
            i;

        if (!callbacks) return this;

        // remove all handlers
        if (arguments.length === 1) {
            delete this.callbacks[event];
            return this;
        }

        // remove specific handler
        i = callbacks.indexOf(fn);
        callbacks.splice(i, 1);
        if (callbacks.length === 0) {
            delete this.callbacks[event];
        }
        return this;
    };

    /// Emit `event` with the given args.
    // also calls any `*` handlers
    prototype.emit = function (event) {
        this.callbacks = this.callbacks || {};
        var args = [].slice.call(arguments, 1),
            callbacks = this.callbacks[event],
            specialCallbacks = this.getWildcardCallbacks(event),
            i,
            len,
            item,
            listeners;

        if (callbacks) {
            listeners = callbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, args);
            }
        }

        if (specialCallbacks) {
            len = specialCallbacks.length;
            listeners = specialCallbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, [event].concat(args));
            }
        }

        return this;
    };

    // Helper for for finding special wildcard event handlers that match the event
    prototype.getWildcardCallbacks = function (eventName) {
        this.callbacks = this.callbacks || {};
        var item,
            split,
            result = [];

        for (item in this.callbacks) {
            split = item.split('*');
            if (item === '*' || (split.length === 2 && eventName.slice(0, split[0].length) === split[0])) {
                result = result.concat(this.callbacks[item]);
            }
        }
        return result;
    };

};

WildEmitter.mixin(WildEmitter);


/***/ })
/******/ ]);