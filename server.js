const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const db = require('./database.js')
require("dotenv").config()
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

var dbEncryption

app.get('/', (req, res) => {
  res.redirect("/LOGIN")
})

app.get('/LOGIN', (req, res) => {
  res.render('login.ejs')
})

app.post('/LOGIN', async (req, res) => {
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

    //Decrypts password from database
    bcrypt.compare(password, encPass, (err, result) => {
      if (err) {
        console.error(err.message);
        res.render('fail.ejs');
      } else if (result) {
        //Creates jwt and logs it
        const token = jwt.sign({ username: username }, process.env.TOKEN);
        console.log(token);

        res.render('start.ejs');
      } else {
        res.render('fail.ejs');
      }
    });
  } else {
    res.render('fail.ejs')
  }
})

app.post('/REGISTER', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Checks if the input fields are valid
  if (!username || !password) {
    return res.status(400).send('Please provide a username and password')
  }

  //Encrypts password and saves in database
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.error(err.message);
      res.redirect('/register');
    } else {
      try {
        await db.registerUser(username, hash)
        res.redirect("/LOGIN")
      } catch (error) {
        console.log(error.message);
        res.render('fail.ejs', { error: 'Username already taken' })
      }
    }
  });
})

app.get('/REGISTER', (req, res) => {
  res.render('register.ejs')
})

app.listen(5000, () => {
  console.log("Server listening on port: " + 5000);
}) 