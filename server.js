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


app.listen(PORT, () => console.log(`listening on ${PORT}`));
