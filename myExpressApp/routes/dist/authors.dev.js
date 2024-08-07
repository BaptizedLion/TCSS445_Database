"use strict";

var express = require("express");

var router = express.Router(); //const Author = require("../models/author");

var mysql = require("mysql");

var app = express();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test"
}); // GET route for displaying all authors

router.get("/", function _callee(req, res) {
  var authors;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Author.find());

        case 3:
          authors = _context.sent;
          res.render("authors/index", {
            authors: authors
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // GET route for displaying the add author form

router.get("/add", function (req, res) {
  res.render("authors/add");
}); // POST route for adding a new author

router.post("/add", function _callee2(req, res) {
  var author, newAuthor;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          author = new Author({
            id: req.body.authorId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate
          });
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(author.save());

        case 4:
          newAuthor = _context2.sent;
          res.redirect("/authors");
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(400).render("authors/add", {
            author: author,
            errorMessage: "Error creating Author"
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // GET route for editing an author

router.get("/edit/:id", function _callee3(req, res) {
  var author;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Author.findById(req.params.id));

        case 3:
          author = _context3.sent;
          res.render("authors/edit", {
            author: author
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.redirect("/authors");

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // POST route for updating an author

router.post("/edit/:id", function _callee4(req, res) {
  var author;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Author.findById(req.params.id));

        case 3:
          author = _context4.sent;
          author.firstName = req.body.firstName;
          author.lastName = req.body.lastName;
          author.birthDate = req.body.birthDate;
          _context4.next = 9;
          return regeneratorRuntime.awrap(author.save());

        case 9:
          res.redirect("/authors");
          _context4.next = 15;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);

          if (author == null) {
            res.redirect("/authors");
          } else {
            res.render("authors/edit", {
              author: author,
              errorMessage: "Error updating Author"
            });
          }

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // DELETE route for removing an author

router["delete"]("/:id", function _callee5(req, res) {
  var author;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Author.findById(req.params.id));

        case 3:
          author = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(author.remove());

        case 6:
          res.redirect("/authors");
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);

          if (author == null) {
            res.redirect("/authors");
          } else {
            res.redirect("/authors");
          }

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;