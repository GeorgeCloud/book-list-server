'use strict'

const pg = require('pg');
const cors = require('cors');
const express = require('express');
const clientDirectory = '../book-list-client'

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
// const conString = 'postgres://localhost:5432';

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: clientDirectory});
});

app.get('/books', (req, res) => {
  client.query(`SELECT author, title, description FROM books;`)
  .then(result => res.send(result.rows))
  .catch(console.error);
});

app.get('/about', (req, res) => res.send('About Us'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, and image_url, isbn FROM books;`)
  .then(result => res.send(result.rows))
  .catch(console.error);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// app.get('GET BOOK COUNT', (req, res) => {
//   client.query(`SELECT COUNT(*) FROM books;`)
//   .then(result => res.send(result))
//   .catch(console.error);
// });

//Creates books if not found in Database
function loadDatabase(){
  client.query(`
    CREATE TABLE IF NOT EXIST
    books (
    book_id PRIMARY KEY,
    title VARCHAR(255)
    author VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT
    );`
  );
}
