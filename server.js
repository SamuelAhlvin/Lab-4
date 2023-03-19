const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const db = require('./database.js')
require("dotenv").config()
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

let currentKey = null;
let isAdmin = null;
let dbData = null;

app.get('/', (req, res) => {
  res.redirect("/identify")
})

app.get('/identify', (req, res) => {
  res.render('login.ejs')
})

app.post('/identify', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Checks if the input fields are valid
  if (!username || !password) {
    return res.status(400).send('Please provide a username and password')
  }

  var userExists = await db.userExists(username)

  //If user exists check if correct password
  if (userExists) {
    var encPass = await db.validateLogin(username)

    if (encPass == password) {
      isAdmin = username == "admin"
      const token = jwt.sign(username, process.env.TOKEN);
      currentKey = token;
      res.redirect("/GRANTED")
    } else {
      res.render('fail.ejs');
    }

  } else {
    console.log("User does not exist")
    res.render('fail.ejs')
  }
})

function authenticateToken(req, res, next) {
  if (currentKey == "") {
    res.redirect("/identify")
  } else if (jwt.verify(currentKey, process.env.TOKEN)) {
    next();
  } else {
    res.redirect("/identify")
  }
}

app.get('/GRANTED', authenticateToken, async (req, res) => {

  if (isAdmin) {
    res.redirect("/admin");
  } else {
    res.render('start.ejs');
  }
})

app.get('/admin', async (req, res) => {
  dbData = await db.dbData();
  res.render('admin.ejs', { dbData });
})

app.get('/student1', (req, res) => {
  res.render('student1.ejs')
})

app.get('/student2', (req, res) => {
  res.render('student2.ejs')
})

app.get('/teacher', (req, res) => {
  res.render('teacher.ejs')
})

app.listen(5000, () => {
  console.log("Server listening on port: " + 5000);
}) 