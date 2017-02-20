const db = require('../models');

exports.getAll = () => {
  return new db.content().fetchAll().then(content => {
    var contents = {};

    content.map(item => {
      contents[item.get('key')] = item.get('body');
    });
    return contents;
  });
};
