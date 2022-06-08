const express = require('express');
const pool = require('./postgresDB/index.js');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})

pool.connect();