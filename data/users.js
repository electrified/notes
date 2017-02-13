const db = require('../models');

exports.getUser = function(username) {
  return new db.user({
    username: username
  }).fetch();
};
