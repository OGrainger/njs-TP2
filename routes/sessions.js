const router = require('express').Router()
const User = require('../models/user')
const db = require('sqlite')
const bcrypt = require('bcryptjs')
const Session = require('../models/session')

//------PAGE LOGIN-----------

//Affichage (h1 et JSON) de base de la page login
router.get('/', (req, res, next) => {
	req.h1 = "login"
	req.jsonError = "Bad request"
	next()
})

//Post pour tenter de se login
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
									res.redirect(301, "./todo")
								},
								json: () => {
									res.status(201).json({
										accessToken: token,
										note: "(JSON UNIQUEMENT) Losque que vous allez faire des requêtes pour vos todos, utilisez ce token en le mettant en header avec comme clé \'token\'. Pour les différentes requêtes, veuillez vous référer à la documentation."
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

//Quelque soit la demande (get ou post), affichage de la page login
router.all('/', (req, res, next) => {
	res.format({
		html: () => {
			res.render('login', {
				h1: req.h1
			})
		},
		json: () => {
			let error = new Error(req.jsonError)
			error.status = 400
			next(error)
		}
	})
})

//-------- PAGE NOUVEL UTILISATEUR --------

//Préparation de l'affichage de la page
router.get('/new', (req, res, next) => {
	req.h1 = "Nouvel utilisateur"
	req.jsonError = "bad request"
	next()
})

//Post de création d'utilisateur
router.post('/new', (req, res, next) => {
	if (req.body.pseudo === "" || req.body.password === "" || req.body.confirmPassword === "" || req.body.email === "" || req.body.firstname === "" || req.body.lastname === "") {
		// Si un champ est vide, on réactualise avec une note
		req.h1 = "Veuillez remplir tous les champs"
		req.jsonError = "Au moins une donnée manquante parmis les suivantes : pseudo, mdp, email, prénom, nom"
		next()
	} else if (req.body.password !== req.body.confirmPassword) {
		req.h1 = "Les mots de passe ne correspondent pas"
		req.jsonError = "Les mots de passe ne correspondent pas"
		next()
	} else {
		//sinon, on check si le pseudo est dispo
		User.get(req.body.pseudo)
			.then((user) => {
				if (typeof user !== "undefined") {
					req.h1 = "Pseudo non disponible"
					req.jsonError = req.h1
					next()
						// Si le pseudo existe déjà, on réactualise avec une note
				} else {
					User.insert(req.body).then(() => {
						res.format({
							html: () => {
								console.log("---\nNouvel utilisateur\n- Pseudo : " + req.body.pseudo + "\n- Email : " + req.body.email + "\n---")
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

//Affichage de la page création d'utilisateur
router.all('/new', (req, res, next) => {
	res.format({
		html: () => {
			res.render('create', {
				h1: req.h1,
			})
		},
		json: () => {
			let error = new Error(req.jsonError)
			error.status = 400
			next(error)
		}
	})
})

//------ PAGE GESTION DE COMPTE -------

//Utilisation de la route manage pour la page gestion de compte
router.use('/manage', require('./manage'))


//-----DECONNEXION-----

//Ce post est utilisé dans la page /todo, pour se déconnecter
router.post('/disconnect', (req, res, next) => {
	res.clearCookie('accessToken')
	Session.delete(req.token)
	res.redirect(301, './')
})

module.exports = router
