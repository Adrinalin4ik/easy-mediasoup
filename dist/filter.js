"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = filter;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function filter(_ref, fn) {
  var _ref2 = _toArray(_ref);

  var head = _ref2[0];

  var tail = _ref2.slice(1);

  var newHead = fn(head) ? [head] : [];
  return tail.length ? [].concat(newHead, _toConsumableArray(filter(tail, fn))) : newHead;
}