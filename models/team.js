const db = require('sqlite')
const bcrypt = require('bcrypt')

module.exports = {
  get: (teamName) => {
		return db.get("SELECT * FROM teams WHERE teamName = ?", teamName)
	},

  insert: (params) => {
		const saltRounds = 10
		let hash = bcrypt.hashSync(params.password, saltRounds)
		let d = new Date()
		let dateNow = d.toLocaleDateString()
		return db.run("INSERT INTO users VALUES (?, ?, ?)", params.teamName, hash, dateNow)
	},
}
