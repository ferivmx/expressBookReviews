const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let validusers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	if (validusers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in" });
	}
	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			"access",
			{ expiresIn: 60 * 60 }
		);

		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send("User successfully logged in");
	} else {
		return res
			.status(208)
			.json({ message: "Invalid Login. Check username and password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	let Id = req.params.isbn;
	let counter = 0;
	for (let review in books[Id].reviews) {
		counter++;
	}
	books[Id].reviews[counter] = {
		user: req.user,
		review: `This is a review ${counter}`,
	};

	return res.status(200).json({ message: "Review added correctly" });
});

// modify review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
	//Write your code here
	let isbn = req.params.isbn;
	let review = req.params.review;
	if (books[isbn]) {
		if (books[isbn].reviews[review]) {
			if (req.user.data === books[isbn].reviews[review].user.data) {
				books[isbn].reviews[review].review = "This review was modify";
				return res.status(200).json({ message: "Review was modify correctly" });
			} else {
				return res
					.status(200)
					.json({ message: "Only the owner of this review can make changes" });
			}
		} else return res.status(200).json({ message: "Review Not found" });
	} else return res.status(200).json({ message: "The Books does not exist" });
});

// delete review
regd_users.delete("/auth/review/:isbn/:review", (req, res) => {
	//Write your code here
	let isbn = req.params.isbn;
	let review = req.params.review;
	if (books[isbn]) {
		if (books[isbn].reviews[review]) {
			if (req.user.data === books[isbn].reviews[review].user.data) {
				delete books[isbn].reviews[review];
				return res
					.status(200)
					.json({ message: "Review was deleted correctly" });
			} else {
				return res
					.status(200)
					.json({ message: "Only the owner of this review can dalete it" });
			}
		} else return res.status(200).json({ message: "Review Not found" });
	} else return res.status(200).json({ message: "The Books does not exist" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
