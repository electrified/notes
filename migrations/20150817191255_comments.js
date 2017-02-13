
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comment', function(table) {
    table.increments();
    table.integer('post_id').references('id').inTable('post').notNullable();
    table.string('user_display_name', 256).notNullable();
    table.string('user_email', 256).notNullable();
    table.text('body').notNullable();
    table.boolean('published');
    table.integer('likes');
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comment');
};
