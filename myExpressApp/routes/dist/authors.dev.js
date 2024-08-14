"use strict";

var express = require("express");

var router = express.Router();

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test2"
}); // GET route for displaying the add author form

router.get("/add", function (req, res) {
  res.render("authors/add", {
    success: req.query.success
  });
}); // POST route for adding a new author

router.post("/add", function (req, res) {
  var _req$body = req.body,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      authorID = _req$body.authorID,
      dateOfBirth = _req$body.dateOfBirth,
      phoneNumber = _req$body.phoneNumber,
      booksWritten = _req$body.booksWritten;
  var query = "INSERT INTO author (firstName, lastName, authorID, dateOfBirth, phoneNumber, booksWritten) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, [firstName, lastName, authorID, dateOfBirth, phoneNumber, booksWritten], function (err, result) {
    if (err) {
      console.error("Error adding author:", err);
      return res.status(500).render("authors/add", {
        error: "Error adding author"
      });
    }

    res.redirect("/authors/add?success=true"); // Redirect back to the add form with success parameter
  });
}); // GET route

router.get("/", function (req, res) {
  var query = "SELECT * FROM author";
  connection.query(query, function (err, results) {
    if (err) {
      console.error("Error fetching authors:", err);
      return res.status(500).render("error", {
        message: "Error fetching authors"
      });
    }

    res.render("authors/list", {
      authors: results,
      success: req.query.success
    });
  });
});
module.exports = router;