"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//
//  Utility functions
//
var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, [{
    key: "getType",
    value: function getType(elem) {
      // Object.prototype.toString.call([]); // [object Array]
      // Object.prototype.toString.call({}); // [object Object]
      // Object.prototype.toString.call(''); // [object String]
      // Object.prototype.toString.call(new Date()); // [object Date]
      // Object.prototype.toString.call(1); // [object Number]
      // Object.prototype.toString.call(function () {}); // [object Function]
      // Object.prototype.toString.call(/test/i); // [object RegExp]
      // Object.prototype.toString.call(true); // [object Boolean]
      // Object.prototype.toString.call(null); // [object Null]
      // Object.prototype.toString.call(); // [object Undefined]
      return Object.prototype.toString.call(elem);
    }
  }]);

  return Util;
}();

exports.default = Util;
//# sourceMappingURL=util.js.map