if (!global.hasOwnProperty('db')) {
  var config = require('config');

  var knex = require('knex')({
    client: 'postgresql',
    debug: config.get('verbose'),
    connection: config.get('connection'),
    seeds: {
      directory: './migrations/seeds'
    }
  });

  var bookshelf = require('bookshelf')(knex);

  var asset = bookshelf.Model.extend({
    tableName: 'asset',
    hasTimestamps: true
  });

  var content = bookshelf.Model.extend({
    tableName: 'content',
    hasTimestamps: true
  });

  var post = bookshelf.Model.extend({
    tableName: 'post',
    hasTimestamps: true,
    user: function() {
      return this.belongsTo(user);
    },
    tags: function() {
      return this.belongsToMany(tag, 'posttag');
    },
    comments: function() {
      return this.hasMany(comment);
    }
  });

  var tag = bookshelf.Model.extend({
    tableName: 'tag',
    hasTimestamps: true,
    posts: function() {
      return this.belongsToMany(post, 'posttag');
    }
  });

  var user = bookshelf.Model.extend({
    tableName: 'user',
    hasTimestamps: true,

    posts: function() {
      return this.hasMany(post);
    }
  });

  var comment = bookshelf.Model.extend({
    tableName: 'comment',
    hasTimestamps: true
  });

  global.db = {
    bookshelf,
    asset: asset,
    content: content,
    tag: tag,
    user: user,
    post: post,
    comment: comment
  };
}

module.exports = global.db;
