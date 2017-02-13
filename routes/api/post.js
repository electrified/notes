const express = require('express');
const router = new express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const db = require('../../models');
const post = require('../../data/posts');

router.all('*', ensureLoggedIn());

router.get('/', function(req, res, next) {
  post.getAllPosts()
  .then(posts => {
    res.json(posts);
  })
  .catch(next);
});

router.get('/:id', function(req, res, next) {
  post.getPostWithTagsAndUser(req.params.id)
      .then(post => {
        res.json(post);
      })
  .catch(next);
});

router.get('/path/:path', function(req, res, next) {
  new db.post({
    path: req.params.path
  }).fetch().then(function(post) {
    res.json({
      isValid: post === null || post.id == req.query.id
    });
  })
  .catch(next);
});

router.post('/', function(req, res, next) {
  post.saveOrUpdatePost(null, req.user, req.body.title, req.body.body, req.body.path, req.body.published, req.body.tags)
  .then(post => {
    res.json(post);
  })
  .catch(next);
});

router.put('/:id', function(req, res, next) {
  post.saveOrUpdatePost(req.params.id, req.user, req.body.title, req.body.body, req.body.path, req.body.published, req.body.tags)
  .then(post => {
    res.json(post);
  })
  .catch(next);
});

router.delete('/:id', function(req, res, next) {
  var post = new db.post({
    id: req.params.id
  });
  post.tags().detach().then(() => {
    var relation = post.comments();
    var foreignKey = relation.relatedData.key('foreignKey');

    return relation.sync().query.where(foreignKey, post.id).del().then(numRows => {
      console.log(numRows + ' rows have been deleted');
    }).catch(err => {
      next();
    }).then(post.destroy());
  })
  .then(() => {
    res.json({"status": "OK", "id": req.params.id});
  })
  .catch(next);
});

module.exports = router;
