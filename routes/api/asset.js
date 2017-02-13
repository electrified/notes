const express = require('express');
const router = new express.Router();

const path = require('path');
const fs = require('fs');

const db = require('../../models');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const config = require('config');

router.all('*', ensureLoggedIn());

router.get('/', function(req, res) {
  new db.asset().query(function(qb) {
    qb.orderBy('created_at', 'DESC');
  }).fetchAll().then(function(assets) {
    res.json(assets);
  }).error(function(error) {
    res.send(500, {
      error: error
    });
  });
});

router.get('/:id', function(req, res) {
  new db.asset({
    id: req.params.id
  }).fetch().then(function(asset) {
    res.json(asset);
  }).error(function(error) {
    res.send(500, error.detail);
  });
});

router.post('/', function(req, res) {
  const [mimetype, data] = req.body.data_uri.split(",");
  db.asset.forge({
    title: req.body.title,
    filename: req.body.filename,
    mimetype: mimetype
  }).save().then(function(asset) {
    var saveTo = path.join(config.get('assetsdir'), String(asset.id));
    var buffer = new Buffer(data, 'base64');
    fs.writeFileSync(saveTo, buffer, "binary");
    res.json(asset);
  }).error(function(error) {
    res.send(500, error.detail);
  });
});

router.put('/:id', function(req, res) {
  new db.asset({
    id: req.params.id
  }).fetch().then(function(asset) {
    asset.set('title', req.body.title).save();
    res.json(asset);
  }).error(function(error) {
    res.send(500, {
      error: error
    });
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  new db.asset({
    id: id
  }).destroy().then(function() {
    var file = path.join(config.get('assetsdir'), path.basename(id));

    fs.unlink(file, function(err) {
      if (err) {
        console.log('failed deleting ' + file);
      } else {
        console.log('successfully deleted ' + file);
      }
      res.send(200);
    });

  }).error(function(error) {
    res.send(500, {
      error: error
    });
  });
});

module.exports = router;
