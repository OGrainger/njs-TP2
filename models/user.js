const db = require('sqlite')
const bcrypt = require('bcrypt')

module.exports = {

	//Retourne les infos à partir du pseudo
	get: (pseudo) => {
		return db.get("SELECT * FROM users WHERE pseudo = ?", pseudo)
	},

	//Insert un nouvel utilisateur
	insert: (params) => {
		const saltRounds = 10
		let hash = bcrypt.hashSync(params.password, saltRounds)
		let d = new Date()
		let dateNow = d.toLocaleString()
		return db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", params.pseudo, hash, '', params.email, params.firstname, params.lastname, dateNow, dateNow)
	},

	//Met à jour un utilisateur
	update: (pseudo, params) => {
		let d = new Date()
		let dateNow = d.toLocaleString()
		const possibleKeys = ['pseudo', 'password', 'email', 'firstname', 'lastname']
		let dbArgs = []
		let queryArgs = []
		for (key in params) {
			if (-1 !== possibleKeys.indexOf(key)) {
				queryArgs.push(`${key} = ?`)
				dbArgs.push(params[key])
			}
		}
		queryArgs.push(`updatedAt = ?`)
		dbArgs.push(dateNow)
		dbArgs.push(pseudo)
		dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE pseudo = ?')
		return db.run.apply(db, dbArgs)
	},

	//Supprime un utilisateur
	delete: (pseudo) => {
		return db.run('DELETE FROM users WHERE pseudo = ?', pseudo)
	}
}
