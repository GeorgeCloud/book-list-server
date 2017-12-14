'use strict';

/************** NEEDED TERMINAL ENV VARIABLES *****************/
////////////////////// MAC //////////////////////
//export PORT=3000
//export CLIENT_URL=http://localhost:8080
//export DATABASE_URL=postgres://localhost:5432/books_app

////////////////////// LINUX //////////////////////
// export PORT=3000
// export CLIENT_URL=http://localhost:8080
// export DATABASE_URL=postgres://postgres:password@localhost:5432/books_app

/************** IMPORT REQUIRED MODULES *****************/
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');
const bodyParser = require('body-parser');

/************** ASSIGN NECESSARY VARIABLES *****************/
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);

/************** CONNECT TO DATABASE *****************/
client.connect();
client.on('error', err => console.error(err)); //Console log the error in error format if there is an issue

/************** ASSIGN NECESSARY MODULES TO ALL ROUTE TYPES *****************/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/************** ASSIGN ROUTES TO INFORMATIONAL ROUTES TO PULL FROM DATABASE *****************/
app.get('/', (req, res) => res.send('Hello world!'));

app.get('/api/v1/books', (request, response) => {
  client.query(`SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(result => response.send(result.rows))
    .catch(console.error);
})

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url, isbn, description FROM books
    WHERE book_id=$1;`,
      [req.params.id])
      .then(result => res.send(result.rows))
      .catch(console.error);
})

/************** ASSIGN ROUTE FOR MAKING A NEW BOOK *****************/
app.get('/about', (req, res) => res.send('ABOUT THE APP!'));

/************** ASSIGN ROUTE FOR MAKING A NEW BOOK *****************/
app.post('/api/v1/books', (request, response) => {
  client.query(
    'INSERT INTO books (title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
    [request.body.title, request.body.author, request.body.isbn, request.body.image_url, request.body.description],
    function(err) {
      if (err) console.error(err)
      response.send('insert complete');
    }
  )
});



/**************  INSERT BOOKS INTO TABLE (ALL DATA) FROM FILE IF THERE IS NO BOOK COUNT ON THE TABLE *****************/
function loadBooks () {
  client.query('SELECT COUNT(*) FROM books')
    .then(result => {
      if(!parseInt(result.rows[0].count))
        fs.readFile('../book-list-client/data/books.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
              INSERT INTO
              books (title, author, isbn, image_url, description)
              VALUES ($1, $2, $3, $4, $5)
              `,
                [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
            )
            .catch(console.error);
          })
        })
      })
  }

  /************** CREATE THE BOOKS TABLE IF THERE ISN'T ONE AND THEN LOAD ALL THE BOOKS (ELSE LOG THE ERR) *****************/
  function loadDB() {
    console.log('loadDB triggered'); //Console log when loadDB function activates
    client.query(`
    CREATE TABLE IF NOT EXISTS books(
      book_id SERIAL PRIMARY KEY,
      author VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      isbn VARCHAR(255),
      image_url VARCHAR(255),
      description TEXT NOT NULL);
      `)
      .then(loadBooks)
      .catch(console.error);
  }

  loadDB(); //Trigger the loadDB function

  app.get('*', (req,res) => res.redirect(CLIENT_URL)); // REDIRECT TO http://localhost:8080 UPON BAD ROUTE (CATCH ALL ROUTES)

  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`)); // SHOW THAT THE SERVER IS LISTENING ON THE PORT UPON START
