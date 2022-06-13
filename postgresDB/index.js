require("dotenv").config();
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  database: process.env.DATABASE
});

module.exports = pool;

