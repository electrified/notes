const uuid = require('uuid');
const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = new express.Router();

const db = require('../../models');
const pass = require('../../pass');
const mail = require('../../mail');

/*
 * GET users listing.
 */
router.get('/', ensureLoggedIn(), function(req, res) {
  new db.user().fetchAll({
    columns: ['id', 'username', 'email', 'created_at', 'updated_at'],
    withRelated: ["posts"]
  }).then(function(users) {
    res.json(users);
  }).error(function(error) {
    res.status(500).send({
      error: error
    });
  });
});

router.get('/:id', ensureLoggedIn(), function(req, res) {
  new db.user({
    id: req.params.id
  }).fetch({
    columns: ['id', 'username', 'email', 'created_at', 'updated_at']
  }).then(function(user) {
    res.json(user);
  }).error(function(error) {
    res.status(500).send({
      error: error
    });
  });
});

router.post('/', ensureLoggedIn(), function(req, res) {
  var hashedpw = pass.hash(req.body.password);
  db.user.forge({
    username: req.body.username,
    email: req.body.email,
    password: hashedpw
  }).save().then(function(user) {
    res.json({
      user: user
    });
  }).error(error => {
    res.status(500).send({
      error: error
    });
  });
});

router.put('/:id', ensureLoggedIn(), function(req, res) {
  new db.user({
    id: req.params.id
  }).fetch().then(function(user) {
    user.set('username', req.body.username);
    user.set('email', req.body.email);

    if (req.body.password !== null && req.body.password > 0) {
      user.set('password', pass.hash(req.body.password));
    }
    user.save();
    res.json(user);
  }).error(error => {
    res.status(500).send({
      error: error
    });
  });

});

router.get('/current', ensureLoggedIn(), function(req, res) {
  res.json(req.user);
});

router.post('/resetpassword', function(req, res) {
  new db.user({
    username: req.body.username
  }).fetch().then(user => {
    if (user) {
      var id = uuid.v4();
      user.set('token', id);
      user.save();
      mail.sendPasswordResetEmail(user.email, id, req.headers.host);
    }
    res.json({
      "status": "OK"
    });
  }).error(error => {
    res.status(500).send(error);
  });
});


router.post('/newpassword', function(req, res) {
  new db.user({
    username: req.body.username,
    token: req.body.token
  }).fetch().then(user => {
    if (user) {
      user.set('password', pass.hash(req.body.password));
      user.set('token', null);
      user.save();
    }
    res.json({
      "status": "OK"
    });

  }).error(error => {
    res.status(500).send(error);
  });
});

router.delete('/:id', ensureLoggedIn(), function(req, res) {
  new db.user({
    id: req.params.id
  }).destroy().then(() => {
    res.json({
      status: "OK"
    });
  }).error(error => {
    res.status(500).send({
      error: error
    });
  });
});

module.exports = router;
