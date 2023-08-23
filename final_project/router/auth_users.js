const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { "username": "user1", "password": "abc@123" },
  { "username": "userAB", "password": "qwer@789" },
];

const isValid = (username) => {
  //returns boolean
  let filteredUser = Object.values(users).filter((user) => user.username === username);
  if (filteredUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let filteredUser = Object.values(users).filter((user) => user.username === username && user.password === password);
  if (filteredUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const curUserName = req.body.username;
  const curPassword = req.body.password;
  if (authenticatedUser(curUserName, curPassword)) {
    let accessToken = jwt.sign(
      {
        data: curPassword,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      curUserName,
    };
    return res.status(200).send("User logged in Successfully.");
  } else {
    return res
      .status(208)
      .json({ message: `Invalid Login details. Check username and password.` });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userName = req.session.authorization.username;
  const isbn = req.body.isbn;
  const review = req.body.review;
  if (books[isbn] > 0) {
    if (review > 0) {
      books[isbn].review[userName] = review;
      return res.send("Review Added Succesfully.");
    } else {
      return res.status(400).json({ message: `Review cannot be left blank` });
    }
  } else {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
