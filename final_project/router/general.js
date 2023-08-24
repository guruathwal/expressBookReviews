const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let userName = req.body.username;
    let password = req.body.password;

    if (!userName || !password) {
        // Check if missing username or password fields
        return res.status(400).json({ message: "Username and password are required!" });
    }

    if (!isValid(userName)) {
        // check is password is of atleast 5 characters
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
public_users.get('/',async function (req, res) {

    return new Promise((resolve, reject) => {
        if (books) {
            return resolve( res.send(JSON.stringify({ books }, null, 4)));
        } else {
            return reject({ status: 404, message: `No books found.` });
        }
    })
    .catch(error => {
        console.error("Error:", error.message);
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn; // read isbn value

    return new Promise((resolve, reject) => {
        const maxISBN = Object.keys(books).length; // max possible ISBN value

        if (isbn > 0 && isbn <= maxISBN) { // check if ISBN value is within limits
            return resolve(res.send(books[isbn]));
        } else {
            return reject({ status: 404, message: `ISBN ${isbn} does not exist` });
        }
    })
    .catch(error => {
        console.error("Error:", error.message);
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    });
 });

// Get book details based on author
public_users.get('/author/:author',async  function (req, res) {
    const authorName = req.params.author; // read author name

    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === authorName);

        if (filteredBooks.length > 0) {
            return resolve(res.send(filteredBooks));
        } else {
            return reject({ status: 404, message: `Book with the Author name ${authorName} not found` });
        }
    })
    .catch(error => {
        console.error("Error:", error.message);
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    });
});


// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let bookTitle = req.params.title; // read title

    return new Promise((resolve, reject) => {
       let filteredBooks = Object.values(books).filter(book => book.title === bookTitle);

        if (filteredBooks.length > 0) {
            return resolve(res.send(filteredBooks));
        } else {
            return reject({ status: 404, message: `Book with the Title ${bookTitle} not found` });
        }
    })
    .catch(error => {
        console.error("Error:", error.message);
        const status = error.status || 500;
        return res.status(status).json({ message: error.message });
    });
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
