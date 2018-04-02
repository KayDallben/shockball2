'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chance = new _chance2.default();
chance.mixin({
  'player': function player(teamUid, teamName, teamPicUrl) {
    return {
      shockballPlayerUid: chance.guid(),
      name: 'BOT ' + chance.first({ nationality: 'nl' }) + ' ' + chance.last({ nationality: 'nl' }),
      image: chance.avatar(),
      teamUid: teamUid,
      teamName: teamName,
      teamPicUrl: teamPicUrl,
      role: chance.pickone(['Guard', 'Center', 'Wing']),
      passing: chance.integer({ min: 0, max: 30 }),
      toughness: chance.integer({ min: 0, max: 30 }),
      throwing: chance.integer({ min: 0, max: 30 }),
      fatigue: chance.integer({ min: 0, max: 30 }),
      endurance: chance.integer({ min: 0, max: 100 }),
      vision: chance.integer({ min: 0, max: 30 }),
      blocking: chance.integer({ min: 0, max: 30 })
    };
  }
});

var BotGenerator = function () {
  function BotGenerator() {
    _classCallCheck(this, BotGenerator);

    this.bots = [];
  }

  _createClass(BotGenerator, [{
    key: 'create',
    value: function create(teamUid, teamName, teamPicUrl) {
      var bot = chance.player(teamUid, teamName, teamPicUrl);
      this.bots.push(bot);
      return bot;
    }
  }]);

  return BotGenerator;
}();

exports.default = BotGenerator;
//# sourceMappingURL=botGenerator.js.map