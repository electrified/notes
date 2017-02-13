const db = require('../models');

exports.getAll = function() {
  return new db.content().fetchAll().then(content => {
    var contents = {};

    content.map(function(content) {
      contents[content.get('key')] = content.get('body');
    });
    return contents;
  });
};
