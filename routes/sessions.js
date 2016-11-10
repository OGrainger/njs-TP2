const router = require('express').Router()
const User = require('../models/user')
const db = require('sqlite')
const bcrypt = require('bcrypt')
const Session = require('../models/session')

router.get('/', (req, res, next) => {
	req.h1 = "login"
	req.jsonError = "Bad request"
	next()
})

router.post('/', (req, res, next) => {
	User.get(req.body.pseudo)
		.then((user) => {
			// Si l'utilisateur existe
			if (typeof user !== 'undefined') {
				// Si le mdp correspond
				if (bcrypt.compareSync(req.body.password, user.password)) {
					Session.generateToken()
						.then((token) => {
							data = {}
							data.pseudo = user.pseudo
							data.accessToken = token
							Session.insert(data)
							return Promise.resolve(token)
						}).then((token) => {
							res.format({
								html: () => {
									res.cookie("accessToken", token)
									res.redirect("/")
								},
								json: () => {
									res.status(201).json({
										accessToken: token,
										note: "(JSON UNIQUEMENT) Losque que vous allez faire des requêtes pour vos todos, utilisez ce token en le mettant en header avec comme clé \'accessToken\'. Pour les différentes requêtes, veuillez vous référer à la documentation."
									})
								}
							})
						}).catch(next)
				} else {
					req.h1 = "Mot de passe incorrect"
					req.jsonError = req.h1
					next()
				}
			} else {
				req.h1 = "Utilisateur introuvable"
				req.jsonError = req.h1
				next()
			}
		})
})

router.all('/', (req, res, next) => {
	res.format({
		html: () => {
			return res.send(
				res.render('login', {
					h1: req.h1
				})
			)
		},
		json: () => {
			let error = new Error(req.jsonError)
			error.status = 400
			next(error)
		}
	})
})

//-------- PAGE NOUVEL UTILISATEUR --------

router.get('/new', (req, res, next) => {
	req.h1 = "Nouvel utilisateur"
	req.jsonError = "bad request"
	next()
})

router.post('/new', (req, res, next) => {
	if (req.body.pseudo === "" || req.body.password === "" || req.body.email === "" || req.body.firstname === "" || req.body.lastname === "") {
		// Si un champ est vide, on réactualise avec une note
		req.h1 = "Veuillez remplir tous les champs"
		req.jsonError = "Au moins une donnée manquante parmis les suivantes : pseudo, mdp, email, prénom, nom"
	} else {
		//sinon, on check si le pseudo est dispo
		User.get(req.body.pseudo)
			.then((user) => {
				if (typeof user !== "undefined") {
					req.h1 = "Utilisateur existant"
					req.jsonError = req.h1
					// Si le pseudo existe déjà, on réactualise avec une note
				} else {
					User.insert(req.body).then(() => {
						res.format({
							html: () => {
								console.log("new user")
								res.redirect(301, '/')
							},
							json: () => {
								res.status(201).send({
									message: 'Nouvel utilisateur créé avec succès'
								})
							}
						})
					})
				}
			})
	}
})

router.all('/new', (req, res, next) => {
	res.format({
		html: () => {
			return res.send(
				res.render('create_edit', {
					h1: req.h1,
					user: {},
					action: "/sessions/new"
				})
			)
		},
		json: () => {
			let error = new Error(req.jsonError)
			error.status = 400
			next(error)
		}
	})
})

module.exports = router
