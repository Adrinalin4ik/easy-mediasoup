"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduce = reduce;

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function reduce(_ref, fn, initial) {
  var _ref2 = _toArray(_ref);

  var head = _ref2[0];

  var tail = _ref2.slice(1);

  if (head === undefined && tail.length === 0) return initial;
  if (!initial) {
    var _tail = _toArray(tail);

    var newHead = _tail[0];

    var newTail = _tail.slice(1);

    return reduce(newTail, fn, fn(head, newHead));
  }
  return tail.length ? reduce(tail, fn, fn(initial, head)) : [fn(initial, head)];
}