'use strict'

const pg = require('pg');
const cors = require('cors');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/test', (req, res) => res.send('hello world'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


function loadDatabase(){
  client.query(`
    CREATE TABLE IF NOT EXIST
    books (
    author VARCHAR(25),
    isbn PRIMARY KEY,
    image_url VARCHAR(200),
    description VARCHAR(500)
    );`
  )
}
