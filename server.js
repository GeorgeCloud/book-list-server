'use strict'

const pg = require('pg');
const cors = require('cors');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const conString = 'postgres://localhost:5432';

const client = new pg.Client(process.env.DATABASE_URL);
client.connect(conString);

client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// function getBookCount(){
//   client.query(`
//     SELECT COUNT(*) FROM books;
//   `)
// }

// function loadDatabase(){
//   client.query(`
//     CREATE TABLE IF NOT EXIST
//     books (
//     author VARCHAR(25),
//     isbn PRIMARY KEY,
//     image_url VARCHAR(200),
//     description VARCHAR(500)
//     );`
//   )
}
