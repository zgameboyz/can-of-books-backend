'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

let bookHandler = require('./bookHandler.js');
const PORT = process.env.PORT || 3001;

//--------------mongo/mongoose connectioon setup-----------------


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongo');
});

//---------------------Route Handler--------------------------


app.get('/books', bookHandler.getBooks);
app.post('/books', bookHandler.addBook);
app.delete('/books/:id', bookHandler.deleteBook);
app.put('/books/:id', bookHandler.updateBook);


//-----------------------Old Book Routes--------------------------

// app.get('/books', (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, function (err, user) {
//     if (err) {
//       res.status(500).send('invalid token');
//     } else {
//       // find the books that belong to the user with that email address
//       let userEmail = user.email;
//       Books.find({ email: userEmail }, (err, books) => {
//         console.log(books);
//         res.send(books);
//       });
//     }
//   });
// })

// app.post('/books', (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, function (err, user) {
//     if (err) {
//       res.status(500).send('invalid token');
//     } else {
//       const newBook = new Books({
//         name: req.body.name,
//         description: req.body.description,
//         status: req.body.status,
//         email: user.email
//       });
//       newBook.save((err, saveBookData) => {
//         res.send(saveBookData);
//       });
//     }
//   });
// });

//   app.delete('/books/:id', (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//     jwt.verify(token, getKey, {}, function (err, user) {
//       if (err) {
//         res.status(500).send('invalid token');
//       } else {
//         let bookId = req.params.id;
//         Books.deleteOne({ _id: bookId, email: user.email })
//           .then(deleteBookData => {
//             console.log(deleteBookData);
//             res.send('burnt the book');
//           })
//       }
//     });
//   });


app.listen(PORT, () => console.log(`listening on ${PORT}`));
