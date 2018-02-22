#!/usr/bin/env node
"use strict";

const db = require('../data/posts');
var fs = require('fs');

db.getAllPosts().then(posts => {
  posts.map(post => {
    console.log(post)
    const filename = "../maidavale_hugo/content/blog/" + post.path.replace(/\//g,"-") + ".md";
    try {
      fs.unlinkSync(filename);
    }
    catch(err) {

    }

    var stream = fs.createWriteStream(filename);
    stream.write("+++\n")
    stream.write("title = \"" + post.title + "\"\n");
    stream.write("date = \"" + new Date(post.created_at).toISOString() + "\"\n");
    stream.write("draft = " + !post.published + "\n");
    stream.write("tags = [\n")
    post.tags.map(tag => stream.write("\"" + tag +"\",\n"))
    stream.write("]\n")
    stream.write("+++\n")
    stream.write(post.body)
    stream.end();
  });
});
