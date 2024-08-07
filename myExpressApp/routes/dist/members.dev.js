"use strict";

var express = require("express");

var router = express.Router();

var mysql = require("mysql");

var app = express();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test"
}); // Route to handle search query for members who have books checked out

router.get("/searchMembers", function (req, res, next) {
  var _req$query = req.query,
      memberid = _req$query.memberid,
      fname = _req$query.fname,
      lname = _req$query.lname,
      isbn = _req$query.isbn,
      title = _req$query.title,
      duedate = _req$query.duedate;
  var sql = "\n    SELECT librarymembers.memberid, fname, lname, bookcheckouts.isbn, books.title, duedate\n    FROM librarymembers\n    JOIN bookcheckouts USING (memberid)\n    JOIN books ON bookcheckouts.isbn = books.isbn\n    WHERE 1=1\n  ";
  var values = [];

  if (duedate) {
    sql += " AND DUEDATE > ?";
    values.push(duedate);
  }

  if (memberid) {
    sql += " AND LOWER(librarymembers.memberid) LIKE LOWER(?)";
    values.push("%".concat(memberid, "%"));
  }

  if (fname) {
    sql += " AND LOWER(fname) LIKE LOWER(?)";
    values.push("%".concat(fname, "%"));
  }

  if (lname) {
    sql += " AND LOWER(lname) LIKE LOWER(?)";
    values.push("%".concat(lname, "%"));
  }

  if (isbn) {
    sql += " AND LOWER(bookcheckouts.isbn) LIKE LOWER(?)";
    values.push("%".concat(isbn, "%"));
  }

  if (title) {
    sql += " AND LOWER(books.title) LIKE LOWER(?)";
    values.push("%".concat(title, "%"));
  }

  console.log("SQL Query:", sql);
  console.log("Values:", values);
  connection.query(sql, values, function (err, results) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("An error occurred while executing the query.");
    }

    console.log("Query Results:", results);
    res.render("memberResults", {
      title: "Member Search Results",
      query: req.query,
      results: results
    });
  });
});
module.exports = router;