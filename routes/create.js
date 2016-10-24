const router = require('express').Router()
const db = require('sqlite')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/', (req, res) => {
	res.format({
		html: () => {
			res.send(
				res.render('edit', {
					entete: "Nouvel utilisateur",
					user: {},
					action: "/create"
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
	// Si un champ est vide...
	if (req.body.pseudo === "" || req.body.password === "" || req.body.email === "" || req.body.firstname === "" || req.body.lastname === "") {
		// Alors on réactualise la page avec une annotation
		res.format({
			html: () => {
				res.send(
					res.render('edit', {
						entete: "Nouvel utilisateur - Veuillez remplir tous les champs",
						user: {},
						action: "/create"
					})
				)
			},
			json: () => {
				let error = new Error('Au moins un champ vide')
				error.status = 400
				next(error)
			}
		})
	} else {
		//sinon, on ajoute le nouvel utilisateur à la db
		let hash = bcrypt.hashSync(req.body.password, saltRounds)
		let d = new Date()
		let dateNow = d.toLocaleDateString()
		db.open('db/users.db').then(() => {
			return db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)", req.body.pseudo, hash, req.body.email, req.body.firstname, req.body.lastname, dateNow, dateNow)
		}).then(() => {
			return db.close('db/users.db')
		}).then(() => {
			res.redirect(301, '/')
		}).catch(next)
	}
})

module.exports = router
