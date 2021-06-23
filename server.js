'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

app.use(express.json());



const client = jwksClient({

  jwksUri: 'https://dev-qttzuf0f.us.auth0.com/.well-known/jwks.json'


})

const app = express();
app.use(cors());

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const PORT = process.env.PORT || 3001;

//--------------


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongo');
});

//-----------------bringing in User model and seeding db-----------

const Books = require('./modules/Books.js');

// let newBook1 = new Books({
//   name: 'book1',
//   description: 'fancy book',
//   status: 'yep',
//   email: 'plaurion1989@gmail.com',
// });
// newBook1.save( (err, bookDataFromMongo) => {
//   console.log('saved book 1');
//   console.log(bookDataFromMongo);
// });


// let newBook2 = new Books({
//   name: 'book2',
//   description: 'regular book',
//   status: 'yep',
//   email: 'plaurion1989@gmail.com',
// });
// newBook2.save( (err, bookDataFromMongo) => {
//   console.log('saved book 2');
//   console.log(bookDataFromMongo);
// });


// let newBook3 = new Books({
//   name: 'book3',
//   description: 'bad book',
//   status: 'nope',
//   email: 'plaurion1989@gmail.com',
// });
// newBook3.save( (err, bookDataFromMongo) => {
//   console.log('saved book 3');
//   console.log(bookDataFromMongo);
// });


//---------------Books route?  i hope... ----------------------

app.get('/books', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      res.status(500).send('invalid token');
    } else {
      // find the books that belong to the user with that email address
      let userEmail = user.email;
      Books.find({ email: userEmail }, (err, books) => {
        console.log(books);
        res.send(books);
      });
    }
  });
})

app.post('/books', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      res.status(500).send('invalid token');
    } else {
      const newBook = new Books({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        email: user.email
      });
      newBook.save((err, saveBookData) => {
        res.send(saveBookData);
      });
    }
  });

  app.delete('/books/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) {
        res.status(500).send('invalid token');
      } else {
        let bookId = req.params.id;
        Books.deleteOne({ _id: bookId, email: user.email })
          .then(deleteBookData => {
            console.log(deleteBookData);
            res.send('burnt the book');
          })
      }
    });


// app.get('/test', (req, res) => {

//   // TODO: 
//   // STEP 1: get the jwt from the headers
//   const token = req.headers.authorization.split(' ')[1];
//   // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
//   jwt.verify(token, getKey, {}, function (err, user) {
//     if (err) {
//       res.status(500).send('invalid token');
//     } else {
//       res.send(user);
//     }
//   }
    // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
    // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
  );
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
