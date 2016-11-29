const db = require('sqlite')
const bcrypt = require('bcrypt')

module.exports = {

  //La liste des membres d'une équipe n'est pas stockée dans la table "teams". On récupère les membres à partir d'une recherche dans la table "users"

  //Retourne les infos de la team à partir du nom de la team
  get: (teamName) => {
		return db.get("SELECT * FROM teams WHERE teamName = ?", teamName)
	},

  //Retourne la liste des membres de l'équipe à partir du nom de la team
  getTeamMembers: (teamName) => {
    return db.all("SELECT pseudo FROM users WHERE teamName = ?", teamName)
  },

  //Ajoute un membre à cette équipe
  addMember: (pseudo, teamName) => {
    return db.run('UPDATE users SET teamName = ? WHERE pseudo = ?', teamName, pseudo)
    console.log("---\nNouveau Membre de l'équipe ", teamName," : ",pseudo,".\n---")
  },

  //Insert une nouvelle équipe
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

  //Fait quitter l'utilisateur de son équipe
  quit: (pseudo) => {
    return db.run('UPDATE users SET teamName = ? WHERE pseudo = ?', '', pseudo)
  },

  //Supprime l'équipe (commande admin)
  delete: (teamName) => {
    return db.run("DELETE FROM teams where teamName = ?", teamname)
  },
}
