'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _redux = require('redux');

var _room = require('./room');

var _room2 = _interopRequireDefault(_room);

var _me = require('./me');

var _me2 = _interopRequireDefault(_me);

var _producers = require('./producers');

var _producers2 = _interopRequireDefault(_producers);

var _peers = require('./peers');

var _peers2 = _interopRequireDefault(_peers);

var _consumers = require('./consumers');

var _consumers2 = _interopRequireDefault(_consumers);

var _notifications = require('./notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = (0, _redux.combineReducers)({
	room: _room2.default,
	me: _me2.default,
	producers: _producers2.default,
	peers: _peers2.default,
	consumers: _consumers2.default,
	notifications: _notifications2.default
});

exports.default = reducers;