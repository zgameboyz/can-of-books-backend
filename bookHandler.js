const Books = require('./modules/Books.js');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://dev-qttzuf0f.us.auth0.com/.well-known/jwks.json'
})


function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

//-------------------CRUD Stuff Here----------------------
let getBooks = (req, res) => {
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
    };
  });
};

let addBook = (req, res) => {
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
    };
  });
};

let deleteBook = (req, res) => {
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
      });
    };
  });
};

let updateBook = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      res.status(500).send('invalid token');
    } else {
      Books.findOne({_id: req.params.id, email: user.email}).then(foundBook => {
        console.log(foundBook);
        foundBook.name = req.body.name;
        foundBook.description = req.body.description;
        foundBook.save()
        .then(savedBook => res.send(savedBook));
      });
    };
  });
};



module.exports = {
 getBooks, addBook, deleteBook, updateBook
};