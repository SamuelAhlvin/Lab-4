//This is only used when initializing the database

const sqlite3 = require('sqlite3').verbose()

//Connect to the database
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
})


function init() {
  sql = 'CREATE TABLE users (userID UNIQUE PRIMARY KEY, name TEXT NOT NULL UNIQUE, role, password TEXT NOT NULL)'
  db.run(sql)
}

function drop() {
  sql1 = 'DROP TABLE users;'
  db.run(sql1)
}

function insert() {
  const sql = `INSERT INTO users (userID, name, role, password) VALUES ("id1", "user1", "student", "password")`
  const sql2 = `INSERT INTO users (userID, name, role, password) VALUES ("id2", "user2", "student", "password2")`
  const sql3 = `INSERT INTO users (userID, name, role, password) VALUES ("id3", "user3", "teacher", "password3")`
  const sql4 = `INSERT INTO users (userID, name, role, password) VALUES ("admin", "admin", "admin", "admin")`
  db.run(sql)
  db.run(sql2)
  db.run(sql3)
  db.run(sql4)
}

//If you want to initialize the Database, run init() and insert()

//drop()
//init()
//insert()