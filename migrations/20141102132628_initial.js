/*jshint globalstrict: true*/
/*jshint node:true */
'use strict';

exports.up = function(knex, Promise) {
  return knex.schema
  
  .createTable('user', function(table) {
    table.increments();
    table.string('username', 256).unique().notNullable();
    table.string('email', 256).unique().notNullable();
    table.string('password', 256).notNullable();
    table.timestamps();
  })
  
  .createTable('asset', function(table) {
    table.increments();
    table.string('title', 256);
    table.string('filename', 256).notNullable();
    table.string('mimetype', 64).notNullable();
    table.timestamps();
  })
  
  .createTable('content', function(table) {
    table.string('key', 256).primary();
    table.text('body');
    table.timestamps();
  })

  .createTable('post', function(table) {
    table.increments();
    table.string('title').notNullable();
    table.text('body').notNullable();
    table.boolean('published');
    table.string('path', 256).unique().notNullable();
    table.integer('user_id').references('id').inTable('user');
    table.timestamps();
  })

  .createTable('tag', function(table) {
    table.increments();
    table.string('name', 256).notNullable();
    table.timestamps();
  })

  .createTable('posttag', function(table) {
    table.integer('post_id').references('id').inTable('post');
    table.integer('tag_id').references('id').inTable('tag');
    table.primary(['post_id', 'tag_id']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posttag')
    .dropTableIfExists('tag')
    .dropTableIfExists('post')
    .dropTableIfExists('content')
    .dropTableIfExists('asset')
    .dropTableIfExists('user');
};
