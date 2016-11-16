const db = require('sqlite')
const bcrypt = require('bcrypt')

module.exports = {
  get: (teamName) => {
		return db.get("SELECT * FROM teams WHERE teamName = ?", teamName)
	},

  getTeamMembers: (teamName) => {
    return db.all("SELECT pseudo FROM users WHERE teamName = ?", teamName)
  },

  addMember: (pseudo, teamName) => {
    return db.run('UPDATE users SET teamName = ? WHERE pseudo = ?', teamName, pseudo)
    console.log("---\nNouveau Membre de l'équipe ", teamName," : ",pseudo,".\n---")
  },

  insert: (pseudo, params) => {
		const saltRounds = 10
		let hash = bcrypt.hashSync(params.password, saltRounds)
		let d = new Date()
		let dateNow = d.toLocaleString()
		return Promise.all([
      db.run("INSERT INTO teams VALUES (?, ?, ?, ?)", params.teamName, hash, pseudo, dateNow),
      db.run('UPDATE users SET teamName = ? WHERE pseudo = ?', params.teamName, pseudo)
    ])
    console.log("---\nNouvelle Team\nNom de la team : " + params.teamName + "\n---")
	},

  quit: (pseudo) => {
    return db.run('UPDATE users SET teamName = ? WHERE pseudo = ?', '', pseudo)
  },

  delete: (teamName) => {
    return db.run("DELETE FROM teams where teamName = ?", teamname)
  },
}
