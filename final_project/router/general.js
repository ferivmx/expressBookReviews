const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	//Write your code here
	return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	// return res.status(200).json(JSON.stringify(books));
	return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	let Id = req.params.isbn;
	return res.status(200).json(books[Id]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const author = req.params.author;
	let results = [];
	let myBooks = books;
	for (let book in myBooks) {
		if (myBooks[book].author.includes(author)) results.push(myBooks[book]);
	}
	return res.status(200).json(results);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	const title = req.params.title;
	let results = [];
	for (let book in books) {
		if (books[book].title.includes(title)) {
			results.push(books[book]);
		}
	}
	return res.status(200).json(results);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	let Id = req.params.isbn;
	if (books[Id]) {
		return res.status(200).json(books[Id].reviews);
	} else {
		return res.status(300).json({ message: `We don't have the isbn ${Id}` });
	}
});

module.exports.general = public_users;
