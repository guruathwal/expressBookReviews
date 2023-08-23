const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let userName = req.body.username;
    let password = req.body.password;

    if (!userName || !password) {
      // Check for missing username or password fields
      return res.status(400).json({ message: "Username and password are required!" });
    }

    if (!isValid(userName)) {
      if (password.length > 5) {
        users.push({ "username": userName, "password": password });
        return res.send("User Registered Successfully!");
      } else {
        return res.status(400).json({ message: "Password should be at least 5 characters!" });
      }
    } else {
      return res.status(409).json({ message: "Username already exists!" });
    }
  });


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn; // read ISBN value
    let maxISBN = Object.keys(books).length; // max possible ISBN value
    if (isbn > 0 && isbn <= maxISBN){ // check if ISBN value is within limits
        return res.send(books[isbn]);
    } else{
        return res.status(404).json({message: `ISBN ${isbn} does not exist`});
    }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorName = req.params.author; // read author name string
     // filter book by author name
    let filteredBooks = Object.values(books).filter(book => book.author === authorName);

    // check if any book is found
    if (filteredBooks.length > 0){
        return res.send(filteredBooks);
    } else{
        return res.status(404).json({message: `Book with the Author name ${authorName} not found`});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let bookTitle = req.params.title; // read title string
     // filter book by title
    let filteredBooks = Object.values(books).filter(book => book.title === bookTitle);

    // check if any book is found
    if (filteredBooks.length > 0){
        return res.send(filteredBooks[0]);
    } else{
        return res.status(404).json({message: `Book with the Title ${bookTitle} not found`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let ISBN = req.params.isbn; // read ISBN value
    let maxISBN = Object.keys(books).length; // max possible ISBN value

    if (ISBN > 0 && ISBN <= maxISBN){ // check if ISBN value is within limits
        return res.send(books[ISBN].reviews);
    } else{
        return res.status(404).json({message: `Book with ISBN ${ISBN} not found.`});
    }
});

module.exports.general = public_users;
