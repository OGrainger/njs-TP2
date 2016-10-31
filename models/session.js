const db = require('sqlite')

module.exports = {
  getFromToken: (token) => {
    return db.get("SELECT * FROM sessions WHERE accessToken = ?", token)
  },
  deleteFromToken: (token) => {
    return db.run("DELETE FROM sessions WHERE accessToken = ?", token)
  }
}
