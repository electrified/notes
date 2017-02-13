const express = require('express');
const passport = require("passport");
const remarkable = require("remarkable");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const md = new remarkable();

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const data = require('../../data/posts');
const assets = require('../../data/assets');
const content = require('../../data/content');

const config = require('config');

function textCutter(n, text) {
  let short = text.substr(0, n);
  if (/^\S/.test(text.substr(n)))
    return short.replace(/\s+\S*$/, "") + "...";
  return short;
}


var LRU = require("lru-cache"),
  options = {
    max: 500,
    length: function() {
      return 1;
    },
    maxAge: 1000 * 60 * config.get('cacheLength')
  },
  contentCache = LRU(options);

router.use(/^\/(?!api).*$/, function(req, res, next) {
  console.log("adding stuff for front end routes")
  // var err = req.session.error,
  //     msg = req.session.success;
  res.locals.user = req.user;
  res.locals.sitetitle = config.get('sitetitle');
  res.locals.sitesubtitle = config.get('sitesubtitle');
  res.locals.title = config.get('sitetitle');

  var contentItems = contentCache.get("content");

  if (contentItems == null) {
    content.getAll().then(contentItems => {
      // log.info("Content cache expired, getting again");
      contentCache.set("content", contentItems);
      res.locals.content = contentItems;
      delete req.session.error;
      delete req.session.success;
      next();
    }).catch(next);
  } else {
    res.locals.content = contentItems;
    delete req.session.error;
    delete req.session.success;
    next();
  }
});

router.get(['/', '/category/:category'], function(req, res, next) {
  let category = req.params.category || 'frontpage';
  let page = req.query.page || 1;
  data.getPostsForCategoryPage(category, page).then(function(results) {
    results.posts.forEach(post => {
      if (post.get('body')) {
        post.set('summary', textCutter(500, post.get('body')));
      }
    });

    res.render('home', {
      posts: results.posts,
      tags: results.tags,
      pages: results.pages,
      page: page,
      markdown: md,
      moment: moment,
      postcount: results.postcount,
      title: category + " - " + config.get('sitetitle')
    });
  }).catch(next);
});

router.get('/login', function(req, res) {
  res.render('login', {
    message: req.flash('error')
  });
});

router.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', ensureLoggedIn(), function(req, res) {
  req.logOut();
  res.redirect('/');
});

router.get('/lostpassword', function(req, res) {
  res.render('lostpassword');
});

router.get('/newpassword', function(req, res) {
  res.render('newpassword');
});

router.get(['/admin', '/admin/*'], ensureLoggedIn(), function(req, res) {
  res.render('react-main');
});

router.get('/page/:path', function(req, res, next) {
  data.getPostWithSidebarContent(req.params.path)
  .then(([tags, post]) => {
    if (post) {
      res.render('page', {
        p: post,
        tags: tags,
        markdown: md,
        moment: moment,
        title: post.get('title') + " - " + config.get('sitetitle')
      });
    } else {
      next();
    }
  })
  .catch(next);
});

router.get('/asset/:id', function(req, res, next) {
  assets.getAssetById(req.params.id).then(asset => {
    if (asset) {
      var filename = path.join(config.get('assetsdir'), path.basename(req.params.id));

      fs.exists(filename, function(exists) {
        if (!exists) {
          next();
        }

        fs.readFile(filename, "binary", function(err, file) {
          if (err) {
            next();
          }

          res.writeHead(200, {
            "Content-Type": asset.mimetype,
            "Expires": new Date(Date.now() + 345600000).toUTCString(),
            "Cache-control": "public, max-age=345600" //4 days
          });

          res.write(file, "binary");
          res.end();
        });
      });
    } else {
      next();
    }
  }).catch(next);
});

module.exports = router;
