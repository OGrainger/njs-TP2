const db = require('sqlite')
const bcrypt = require('bcrypt')

module.exports = {
	get: (userId) => {
		return db.get('SELECT rowid, * FROM users WHERE rowid = ?', userId)
	},

	getFromPseudo: (pseudo) => {
		return db.get("SELECT rowid, * FROM users WHERE pseudo = ?", pseudo)
	},

	count: () => {
		return db.get('SELECT COUNT(*) as count FROM users')
	},

	getAll: (limit, offset) => {
		return db.all('SELECT rowid, * FROM users LIMIT ? OFFSET ?', limit, offset)
	},

	insert: (params) => {
		const saltRounds = 10
		let hash = bcrypt.hashSync(params.password, saltRounds)
		let d = new Date()
		let dateNow = d.toLocaleDateString()
		return db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)", params.pseudo, hash, params.email, params.firstname, params.lastname, dateNow, dateNow)
	},

	generateToken: (user) => {
		return new Promise(function(resolve, err) {
			Promise.all([
				//On génère un token
				require('crypto').randomBytes(48, function(err, buffer) {
					return token = buffer.toString('hex')
				}),
				// On recherche l'ID lié au pseudo
				db.get("SELECT rowid FROM users WHERE pseudo = ?", user.pseudo)
			]).then((values) => {
					let createdAt = Date.now()
					let expiresAt = Date.now() + (60 * 15 * 1000)
					return db.run("INSERT INTO sessions VALUES (?, ?, ?, ?)", values[1].rowid, token, createdAt, expiresAt)
				}).then(() => {
					resolve(token)
				})
		})
	},

	update: (userId, params) => {
		const possibleKeys = ['firstname', 'lastname', 'email', 'pseudo', 'password']

		let dbArgs = []
		let queryArgs = []
		for (key in params) {
			if (-1 !== possibleKeys.indexOf(key)) {
				queryArgs.push(`${key} = ?`)
				dbArgs.push(req.body[key])
			}
		}

		if (!queryArgs.length) {
			let err = new Error('Bad Request')
			err.status = 400
			return Promise.reject(err)
		}

		dbArgs.push(userId)
		dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?')

		return db.run.apply(db, dbArgs).then((stmt) => {
			if (stmt.changes === 0) {
				let err = new Error('Not found')
				err.status = 404
				return Promise.reject(err)
			}

			return stmt
		})
	},

	remove: (userId) => {
		return db.run('DELETE FROM users WHERE rowid = ?', userId)
	}

}
