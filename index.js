const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const db = require("./connection.js");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  db.query("SELECT * FROM `users` ", (err, result) => {
    res.send(result);
  });
});

const JWT_SECRET =
  "apiohdpioahfpoisaop;eifhjpro9euasdasdfrgfwerf1230948203-94jidf;ko";

app.post("/login", (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;
  if (email !== "" && pass !== "") {
    db.query(
      `SELECT password FROM users WHERE email = '${email}'`,
      (err, result) => {
        var phash = result[0].password;
        var p = pass;
        bcrypt.compare(p, phash, function (err, result) {
          if (result) {
            res.status(200);
            // Logged in correctly
            return res.json({
              token: jsonwebtoken.sign({ user: `${email}` }, JWT_SECRET),
              success: true,
            });
          }
          if (!result) {
            // No account found
            res.status(401);
            return res.json({
              success: false,
            });
          }
        });
      }
    );
  } else {
    res.status(404);
  }
});

app.post("/register", (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;
  if (email !== "" && pass !== "") {
    bcrypt.hash(pass, 10, function (err, hash) {
      if (err) {
        res.status(501);
      }
      db.query(
        `INSERT INTO users (email, password) VALUES ('${email}', '${hash}')`,
        (err, result) => {
          res.status(200);
        }
      );
    });
  } else {
    res.status(403);
  }
});

// UPDATE bikes SET available = 0 WHERE id = 2;

app.post("/update", (req, res) => {
  var a = req.body.a;
  var id = req.body.id;
  if (a === 1) {
    db.query(
      `UPDATE bikes SET available = 0 WHERE id = ${id}`,
      (err, result) => {
        res.status(200);
        // console.log("merge");
      }
    );
  } else res.status(401);

  if (a === 0) {
    db.query(
      `UPDATE bikes SET available = 1 WHERE id = ${id}`,
      (err, result) => {
        res.status(200);
        // console.log("merge si asta");
      }
    );
  } else res.status(401);
});

app.get("/bikes", (req, res) => {
  db.query("SELECT * FROM `bikes` ", (err, result) => {
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
