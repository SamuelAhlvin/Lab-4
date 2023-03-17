//This is only used when initializing the database

const sqlite3 = require('sqlite3').verbose()

//Connect to the database
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
})


function init() {
  sql = 'CREATE TABLE users (username TEXT NOT NULL UNIQUE,password TEXT NOT NULL)'
  db.run(sql)
}

function drop() {
  sql1 = 'DROP TABLE users;'
  db.run(sql1)
}


init()