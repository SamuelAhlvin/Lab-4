const sqlite3 = require('sqlite3').verbose()

//Connect to the database
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
})

//Check if username exists in database
async function userExists(username) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users WHERE username = $username `, { $username: username }, (error, rows) => {
      if (error) reject(error)
      else resolve(rows.length > 0)
    })
  })
}

//Gets encrypted password from username
async function validateLogin(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT password FROM users WHERE username = $username`, { $username: username }, (error, row) => {
      if (error) reject(error)
      else resolve(row.password)
    })
  })
}

//Register user
async function registerUser(username, password) {
  const sql = `INSERT INTO users (username, password) VALUES ($username, $password)`
  const params = { $username: username, $password: password }

  return new Promise((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) {
        if (error.errno === 19) {
          reject(new Error('Username already taken'))
        } else {
          reject(error)
        }
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  userExists,
  registerUser,
  validateLogin
}