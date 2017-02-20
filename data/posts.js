const db = require('../models');

// TODO: Can this be done by overriding the serialize method on the tag class?
function postToJSON(post) {
  var strTags = [];

  if (post.related('tags')) {
    post.related('tags').map(function(tag) {
      strTags.push(tag.get('name'));
    });
  }
  post = post.toJSON({ omitPivot: true });
  post.tags = strTags;
  return post;
}

exports.getPostsInCategory = function(category, page) {
  var limit = 5;
  var offset = (page - 1) * limit;

  return new db.post({
    published: true
  }).query(function(qb) {
    qb.whereExists(function() {
      this.select('*')
          .from('posttag')
          .innerJoin('tag', 'tag.id', 'posttag.tag_id')
          .whereRaw('post.id = posttag.post_id and tag.name = ?', category);
    });
    qb.limit(limit).offset(offset).orderBy('updated_at', 'DESC');
  }).fetchAll({
    withRelated: ["user", "tags"]
  });
};

exports.getPostsInCategoryCount = function(category) {
  return new db.bookshelf.knex('post').where({
    published: true
  }).whereExists(function() {
    this.select('*')
        .from('posttag')
        .innerJoin('tag', 'tag.id', 'posttag.tag_id')
        .whereRaw('post.id = posttag.post_id and tag.name = ?', category);
  }).count();
};

exports.getTagsWithPosts = function() {
  return new db.bookshelf.knex('tag')
    .select('name')
    .count('name as tagcount')
    .innerJoin('posttag', 'tag.id', 'posttag.tag_id')
    .groupBy('name')
    .orderBy('tagcount', 'DESC');
};

exports.getPostsForCategoryPage = function(category, page) {
  var limit = 5;

  return Promise.all([this.getPostsInCategory(category, page),
    this.getPostsInCategoryCount(category),
    this.getTagsWithPosts()])
  .then(([posts, count, tags]) => {
    var pages = Math.ceil(count[0].count / limit);

    return {
      posts: posts.toArray(),
      tags: tags,
      pages: pages,
      postcount: 0
    };
  });
};

exports.getPostWithSidebarContent = function(path) {
  return Promise.all([this.getTagsWithPosts(),
    new db.post({
      published: true,
      path: path
    }).fetch({
      withRelated: ["user", "tags"]
    })]);
};

exports.getAllPosts = function() {
  return new db.post().query((qb) => {
    qb.orderBy('updated_at', 'DESC');
  }).fetchAll({
    withRelated: [{
      'user': (qb) => {
        qb.column('id', 'username');
      }
    }, {
      'tags': (qb) => {
        qb.column('name');
      }
    }]
  }).then(posts => posts.map( post => postToJSON(post)));
};

exports.getPostWithTagsAndUser = function(id) {
  return new db.post({
    id: id
  }).fetch({
    withRelated: [{
      'user': (qb) => {
        qb.column('id', 'username');
      }
    }, {
      'tags': (qb) => {
        qb.column('id', 'name');
      }
    }]
  }).then(post => postToJSON(post));
};

exports.saveOrUpdatePost = function(id, user, title, body, path, published, tags) {
  var newTags = db.bookshelf.Collection.extend({
    model: db.tag
  });

  return new db.tag().query((qb) => {
    qb.whereIn('name', tags);
  }).fetchAll().then((savedTags) => {
    var tagsToCreate = new newTags();
    var originalTags = new newTags();
    tags.forEach((formtag) => {
      var found = false;
      savedTags.models.forEach((dbtag) => {
        if (dbtag.get('name') == formtag) {
          originalTags.add(dbtag);
          found = true;
        }
      });
      if (!found) {
        tagsToCreate.add({
          name: formtag
        });
      }
    });
    return [tagsToCreate, originalTags];
  }).then((tags) => {
    tags[0].invokeMap('save');
    return tags;
  }).then((tags) => {
    if (id) {
      return new db.post({
        id: id
      })
      .fetch()
      .then((post) => {
        post.set('title', title);
        post.set('body', body);
        post.set('published', published);
        post.set('path', path);
        return post.save().then((post) => {
          post.tags().detach();
          post.tags().attach(tags[0].models);
          post.tags().attach(tags[1].models);
          return post;
        });
      });
    } else {
      return db.post.forge({
        title: title,
        body: body,
        user_id: user.id,
        path: path,
        published: published
      }).save().then((post) => {
        post.tags().attach(tags[0].models);
        post.tags().attach(tags[1].models);
        return post;
      });
    }
  })
  .then(post => this.getPostWithTagsAndUser(post.id));
};

exports.addComment = function(post_id, user_display_name, user_email, body) {
  return db.comment.forge({
    post_id: post_id,
    user_display_name: user_display_name,
    user_email: user_email,
    body: body,
    published: false
  }).save();
};
