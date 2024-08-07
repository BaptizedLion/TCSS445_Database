"use strict";

var createError = require("http-errors");

var express = require("express");

var router = express.Router();

var path = require("path");

var cookieParser = require("cookie-parser");

var logger = require("morgan");

console.log("Authors router loaded");

var authorsRouter = require("./routes/authors");

var indexRouter = require("./routes/index");

var usersRouter = require("./routes/users");

var booksRouter = require("./routes/books");

var membersRouter = require("./routes/members");

var app = express(); // view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug"); //added variables michael

var mysql = require("mysql"); //changed PORT from 3000 to 3001 because 3000 was taken


var PORT = 3001; // add route

app.get("/books/add", function (req, res) {
  res.render("add_book", {
    title: "Add Book"
  });
}); // add route for find book

app.get("/books/find", function (req, res) {
  res.render("bookFind", {
    title: "Find Book"
  });
}); //add route for add authors

app.get("/authors/add", function (req, res) {
  res.render("authoradd", {
    title: "Add author"
  });
}); //add route for members

app.get("/members", function (req, res) {
  res.render("members", {
    title: "members"
  });
}); //creating a connection to mysql database

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test"
}); //open the mySQL connection

connection.connect(function (error) {
  if (error) {
    console.log("A error has occurred" + "while attempting to connect to database");
    throw error;
  } //if no error, proceed to express server


  app.listen(PORT, function () {
    console.log("Database connection is ready and" + "Server is listening on Port", PORT);
  });
}); //fetch data from database 8/1/2024

connection.query("SELECT * FROM Books", function (err, results, fields) {
  if (err) throw err;
  console.log(results);
}); // Route to handle search queries

router.get("/search", function (req, res, next) {
  var searchQuery = req.query.query;
  var sql = "\n    SELECT \n      ISBN as isbn, \n      TITLE as title, \n      AUTHORID as authorId, \n      PUBYEAR as pubYear, \n      PUBLISHER as publisher, \n      GENRE as genre, \n      BOOKCOST as bookCost \n    FROM books \n    WHERE LOWER(TITLE) LIKE LOWER(?)\n  ";
  var values = ["%".concat(searchQuery, "%")];
  connection.query(sql, values, function (err, results) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("An error occurred while executing the query.");
    }

    console.log("Query Results:", results);
    res.render("searchResults", {
      title: "Search Results",
      query: searchQuery,
      results: results
    });
  });
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, "public")));
app.use(express["static"]("css"));
app.use(express["static"]("public"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/authors", authorsRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;