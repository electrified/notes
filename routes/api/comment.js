const express = require('express');
const router = new express.Router();

const db = require('../../models');
const post = require('../../data/posts');

router.get('/:post_id', function(req, res, next) {
  new db.comment().query({
    where: {
      "post_id": req.params.post_id,
      published: true
    }
  })
  .fetchAll()
  .then(comments => {
    res.json(comments.toJSON());
  })
  .catch(next);
});

router.post('/:post_id', function(req, res, next) {
  post.addComment(req.params.post_id, req.body.user_display_name, req.body.user_email, req.body.body)
  .then(comment => {
    res.json(comment);
  })
  .catch(next);
});

module.exports = router;
