const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	if (username && password) {
		if (!isValid(username)) {
			users.push({ username: username, password: password });
			return res
				.status(200)
				.json({ message: "User successfully registred. Now you can login" });
		} else {
			return res.status(404).json({ message: "User already exists!" });
		}
	}
	return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	let Id = req.params.isbn;
	return res.status(200).json(JSON.stringify(books[Id]));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const author = req.params.author;
	let results = [];
	let myBooks = books;
	for (let book in myBooks) {
		if (myBooks[book].author.includes(author))
			results.push(JSON.stringify(myBooks[book]));
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
	return res.status(200).json(JSON.stringify(results));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	let Id = req.params.isbn;
	if (books[Id]) {
		if (books[Id].reviews)
			return res.status(200).json(JSON.stringify(books[Id].reviews));
	} else {
		return res.status(300).json({ message: `We don't have the isbn ${Id}` });
	}
});

module.exports.general = public_users;
//Dont get what exactly was required
module.exports.promises = {
	async getAllBooks() {
		const books = await axios.get("/");
		return books.data;
	},
	async getBooksbyISBN(isbn) {
		const books = await axios.get(`/isbn/${isbn}`);
		return books.data;
	},
	async getBooksbyAuthor(author) {
		const books = await axios.get(`/author/${author}`);
		return books.data;
	},
	async getBooksbytitle(title) {
		const books = await axios.get(`/title/${title}`);
		return books.data;
	},
};
