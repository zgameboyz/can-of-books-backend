const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  email: String
})

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;