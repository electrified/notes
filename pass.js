var bcrypt = require('bcryptjs');

exports.hash = function(pwd) {
  return bcrypt.hashSync(pwd, 10);
};

exports.compareSync = bcrypt.compareSync;

