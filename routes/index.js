const router = require('express').Router()
const db = require('sqlite')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/', (req, res) => {
	res.format({
		html: () => {
			res.send(
				res.render('index', {
					h1: "Login"
				})
			)
		},
		json: () => {
			let error = new Error('Bad request')
			error.status = 400
			next(error)
		}
	})
})

router.post('/', (req, res, next) => {
	db.open('db/users.db').then(() => {
		return db.get("SELECT rowid, * FROM users WHERE pseudo = ?", req.body.pseudo)
	}).then((user) => {
		// Si l'utilisateur existe
		if (typeof user !== 'undefined') {
			// Si le mdp correspond
			if (bcrypt.compareSync(req.body.password, user.password)) {
				db.close('db/users.db').then(() => {
					return db.open('db/sessions.db')
				}).then(() => {
					//
				})
				// si l'utilisateur n'existe pas
			} else {
				db.close('db/users.db')
				res.format({
					html: () => {
						res.send(
							res.render('index', {
								h1: "Login - Mot de passe incorrect"
							})
						)
					},
					json: () => {
						let error = new Error('Bad request')
						error.status = 400
						next(error)
					}
				})
			}
			// Si le mdp ne correspond pas
		} else {
			db.close('db/users.db')
			res.format({
				html: () => {
					res.send(
						res.render('index', {
							h1: "Login - Utilisateur introuvable"
						})
					)
				},
				json: () => {
					let error = new Error('Bad request')
					error.status = 400
					next(error)
				}
			})
		}
		}).catch(next)
})

module.exports = router
