#!/usr/bin/env node
"use strict";

const prompt = require('prompt');
const db = require('../models');
const pass = require('../pass');

const schema = {
  properties: {
    username: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },

    password: {
      hidden: true
    }
  }
};

prompt.start();

prompt.get(schema, function(err, result) {
  var hashedpw = pass.hash(result.password);

  db.user.forge({
    username: result.username,
    email: result.email,
    password: hashedpw
  })
  .save()
  .then(function(user) {
    console.log("User created succesfully!");
  })
  .catch(function(err) {
    console.error(err.detail);
  })
  .finally(function() {
    db.bookshelf.knex.destroy(function() {
      console.log("exiting");
    });
  });
});
