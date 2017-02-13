module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'notes',
      user: 'notes',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
