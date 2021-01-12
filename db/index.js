const { Pool } = require('pg');

// Connection settings will be changed once server is setup
const pool = new Pool({
  user: 'cher',
  host: 'localhost',
  database: 'fotd',
  password: 'horowitz',
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};

// ===================================================================
// Docs @ https://node-postgres.com/
// ===================================================================
