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
  if (filteredUser[0]) {
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
      const payload = {
        username: curUserName,
      };

      const accessToken = jwt.sign(payload, "your-secret-key", { expiresIn: "1h" });

      // Set authorization information in session
      req.session.authorization = {
        accessToken,
        username: curUserName
      };

      return res.status(200).json({message:"Login Successful", accessToken });
    } else {
      return res.status(401).json({ message: "Invalid login credentials." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userName = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (books[isbn]) {
    if (review.length > 0) {
      if (!books[isbn].reviews) {
        books[isbn].reviews = {}; // Initialize the reviews object if not present
      }
      books[isbn].reviews[userName] = review; // Use 'reviews' instead of 'review'
      return res.send("Review Added Successfully.");
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
