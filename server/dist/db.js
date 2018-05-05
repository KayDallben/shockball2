'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var serviceAccount = void 0;
if (!process.env.FIREBASE_DATABASE_URL) {
  serviceAccount = require('../../dev-firebase-security.json');
}

exports.default = function (app, callback) {

  if (app.get('env') === 'development') {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://swc-shockball.firebaseio.com/'
    });
  } else if (app.get('env') === 'production') {
    admin.initializeApp({
      credential: admin.credential.cert({
        'projectId': process.env.FIREBASE_PROJECT_ID,
        'clientEmail': process.env.FIREBASE_CLIENT_EMAIL,
        'privateKey': process.env.FIREBASE_PRIVATE_KEY
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }

  var db = admin.firestore();

  callback(db);
};
//# sourceMappingURL=db.js.map