const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new customer
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register customer."});
});

// Task 1 & Task 10: Get the book list available in the shop using async/await with Promises
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getAllBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching book list"});
  }
});

// Task 2 & Task 11: Get book details based on ISBN using async/await with Promises
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({status: 404, message: "Book not found"});
    }
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(error.status || 404).json({message: error.message});
  }
});
  
// Task 3 & Task 12: Get book details based on author using async/await with Promises
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = {};
    for (const key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks[key] = books[key];
      }
    }
    if (Object.keys(matchingBooks).length > 0) {
      resolve(matchingBooks);
    } else {
      reject({status: 404, message: "No books found for this author"});
    }
  });
};

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const authorBooks = await getBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(authorBooks, null, 4));
  } catch (error) {
    return res.status(error.status || 404).json({message: error.message});
  }
});

// Task 4 & Task 13: Get all books based on title using async/await with Promises
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = {};
    for (const key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks[key] = books[key];
      }
    }
    if (Object.keys(matchingBooks).length > 0) {
      resolve(matchingBooks);
    } else {
      reject({status: 404, message: "No books found with this title"});
    }
  });
};

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const titleBooks = await getBooksByTitle(title);
    return res.status(200).send(JSON.stringify(titleBooks, null, 4));
  } catch (error) {
    return res.status(error.status || 404).json({message: error.message});
  }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Functions demonstrating retrieving book data using Axios with Async/Await (Tasks 10-13)
const fetchAllBooksAxios = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    console.error("Error fetching all books via Axios:", error);
  }
};

const fetchBookByISBNAxios = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn} via Axios:`, error);
  }
};

const fetchBooksByAuthorAxios = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author} via Axios:`, error);
  }
};

const fetchBooksByTitleAxios = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by title ${title} via Axios:`, error);
  }
};

module.exports.general = public_users;
module.exports.fetchAllBooksAxios = fetchAllBooksAxios;
module.exports.fetchBookByISBNAxios = fetchBookByISBNAxios;
module.exports.fetchBooksByAuthorAxios = fetchBooksByAuthorAxios;
module.exports.fetchBooksByTitleAxios = fetchBooksByTitleAxios;
