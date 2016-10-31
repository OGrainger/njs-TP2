const router = require('express').Router()
const User = require('../models/user')
const db = require('sqlite')
const bcrypt = require('bcrypt')

router.get('/', (req, res, next) => {
	res.format({
		html: () => {
			res.send(
				res.render('login', {
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
	User.getFromPseudo(req.body.pseudo)
		.then((user) => {
			// Si l'utilisateur existe
			if (typeof user !== 'undefined') {
				// Si le mdp correspond
				if (bcrypt.compareSync(req.body.password, user.password)) {
					User.generateToken(user).then((token) => {
						res.format({
							html: () => {
								res.cookie("accessToken", token)
								console.log("Cookie parsé ! Votre token : ", token)
								res.redirect("/")
							},
							json: () => {
								res.status(201).send({
									accessToken: token
								})
							}
						})
					}).catch(next)
				} else {
					// Sinon renvoie une page avec l'err (mdp inc)
					res.format({
						html: () => {
							res.send(
								res.render('login', {
									h1: "Mot de passe incorrect"
								})
							)
						},
						json: () => {
							let error = new Error('Mot de passe incorrect')
							error.status = 400
							next(error)
						}
					})
				}
			} else {
				// Sinon renvoie une page avec l'err (utilisateur introuvable)
				res.format({
					html: () => {
						res.send(
							res.render('login', {
								h1: "Utilisateur introuvable"
							})
						)
					},
					json: () => {
						let error = new Error('Utilisateur introuvable')
						error.status = 400
						next(error)
					}
				})
			}
		})
})

router.get('/new', (req, res, next) => {
	res.format({
		html: () => {
			res.send(
				res.render('create_edit', {
					entete: "Nouvel utilisateur",
					user: {},
					action: "/sessions/new"
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

router.post('/new', (req, res, next) => {
	if (req.body.pseudo === "" || req.body.password === "" || req.body.email === "" || req.body.firstname === "" || req.body.lastname === "") {
		// Si un champ est vide, on réactualise avec une note
		res.format({
			html: () => {
				res.send(
					res.render('create_edit', {
						entete: "Veuillez remplir tous les champs",
						user: {},
						action: "/sessions/new"
					})
				)
			},
			json: () => {
				let error = new Error('Au moins une donnée manquante parmis les suivantes : pseudo, mdp, email, prénom, nom')
				error.status = 400
				next(error)
			}
		})
	} else {
		//sinon, on check si le pseudo est dispo
		User.getFromPseudo(req.body.pseudo)
			.then((user) => {
				if (typeof user !== "undefined") {
					// Si le pseudo existe déjà, on réactualise avec une note
					res.format({
						html: () => {
							res.send(
								res.render('create_edit', {
									entete: "Utilisateur existant",
									user: {},
									action: "/sessions/new"
								})
							)
						},
						json: () => {
							let error = new Error('Utilisateur existant')
							error.status = 400
							next(error)
						}
					})
				} else {
					User.insert(req.body).then(() => {
						res.format({
							html: () => {
								console.log("new user")
								res.redirect(301, '/')
							},
							json: () => {
								res.status(201).send({
									message: 'success'
								})
							}
						})
					})
				}
			})
	}
})

module.exports = router
