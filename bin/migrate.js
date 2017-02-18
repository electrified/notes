const db = require('../models');

function exit(text) {
  if (text instanceof Error) {
    console.error(text.stack);
  } else {
    console.error(text);
  }
  process.exit(1);
}

db.bookshelf.knex.migrate.latest().spread(function(batchNo, log) {
  if (log.length === 0) {
    console.log('Already up to date');
    process.exit(0);
  }
  console.log(`Batch ${batchNo} run: ${log.length} migrations \n`) +
  console.log(log.join('\n'))
  process.exit(0);
}).catch(exit);
