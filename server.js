const express = require('express');
const Knex = require('knex');
const connection = require('./lib/database/knexfile').development;

const app = express();

const { PORT } = require('./lib/constants/app');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('App is listening to', PORT);
});
