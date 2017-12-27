'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = [];

var notifications = function notifications() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_NOTIFICATION':
			{
				var notification = action.payload.notification;


				return [].concat((0, _toConsumableArray3.default)(state), [notification]);
			}

		case 'REMOVE_NOTIFICATION':
			{
				var notificationId = action.payload.notificationId;


				return state.filter(function (notification) {
					return notification.id !== notificationId;
				});
			}

		case 'REMOVE_ALL_NOTIFICATIONS':
			{
				return [];
			}

		default:
			return state;
	}
};

exports.default = notifications;