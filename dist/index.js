'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('./map');

Object.keys(_map).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _map[key];
    }
  });
});