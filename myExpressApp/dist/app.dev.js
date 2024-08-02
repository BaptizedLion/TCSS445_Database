"use strict";

var createError = require("http-errors");

var express = require("express");

var router = express.Router();

var path = require("path");

var cookieParser = require("cookie-parser");

var logger = require("morgan");

var indexRouter = require("./routes/index");

var usersRouter = require("./routes/users");

var booksRouter = require("./routes/books");

var app = express(); //added variables michael

var mysql = require("mysql"); //changed PORT from 3000 to 3001 because 3000 was taken


var PORT = 3001; // add route

app.get("/books/add", function (req, res) {
  res.render("add_book", {
    title: "Add Book"
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
}); // view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
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
app.use("/books", booksRouter); // catch 404 and forward to error handler

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