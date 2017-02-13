const db = require('../models');

exports.getAssetById = function(id) {
  return new db.asset({
    id: id
  }).fetch();
};
