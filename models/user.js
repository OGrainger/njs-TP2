const db = require('sqlite')
const bcrypt = require('bcrypt')

module.exports = {

	get: (pseudo) => {
		return db.get("SELECT * FROM users WHERE pseudo = ?", pseudo)
	},

	count: () => {
		return db.get('SELECT COUNT(*) as count FROM users')
	},

	getAll: (limit, offset) => {
		return db.all('SELECT * FROM users LIMIT ? OFFSET ?', limit, offset)
	},

	insert: (params) => {
		const saltRounds = 10
		let hash = bcrypt.hashSync(params.password, saltRounds)
		let d = new Date()
		let dateNow = d.toLocaleDateString()
		return db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", params.pseudo, hash, '', params.email, params.firstname, params.lastname, dateNow, dateNow)
	},


	update: (pseudo, params) => {
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

		dbArgs.push(pseudo)
		dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE pseudo = ?')

		return db.run.apply(db, dbArgs).then((stmt) => {
			if (stmt.changes === 0) {
				let err = new Error('Not found')
				err.status = 404
				return Promise.reject(err)
			}

			return stmt
		})
	},

	remove: (pseudo) => {
		return db.run('DELETE FROM users WHERE pseudo = ?', pseudo)
	}

}
