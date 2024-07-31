const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

//added variables michael
const mysql = require("mysql");
//changed PORT from 3000 to 3001 because 3000 was taken
const PORT = 3001;

//creating a connection to mysql database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test",
});

//open the mySQL connection
connection.connect((error) => {
  if (error) {
    console.log(
      "A error has occurred" + "while attempting to connect to database"
    );
    throw error;
  }

  //if no error, proceed to express server
  app.listen(PORT, () => {
    console.log(
      "Database connection is ready and" + "Server is listening on Port",
      PORT
    );
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//Home Route
app.get("/", function (req, res) {
  res.render("index", {
    title: "Library System",
    anotherVariable: "Test Variable",
  });
});

//add route
app.get("/Books/add"),
  function (req, res) {
    res.render("add_book", {
      title: "add book",
    });
  };

app.get("/", function (req, res) {
  console.log("Rendering index with title:", "Library System");
  console.log("Another Variable:", "Test Variable");
  res.render("index", {
    title: "Library System",
    anotherVariable: "Test Variable",
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
