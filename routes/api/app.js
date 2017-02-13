const express = require('express');
const router = new express.Router();
const config = require('config');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const db = require('../../models');

router.get('/config', ensureLoggedIn(), (req, res) => {
  res.json({sitetitle: config.get('sitetitle'),
    sitesubtitle: config.get('sitesubtitle')
  });
});

router.get('/migrate', (req, res) => {
  db.bookshelf.knex.migrate.latest()
  .then(() => {
    return db.bookshelf.knex.seed.run();
  })
  .then(() => {
    res.json({"status": "OK"});
  });
});

module.exports = router;
