const router = require('express').Router()
const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Session = require('../models/session')

//On set le h1 et le json par défaut de la route
router.all('/*', (req, res, next) => {
	req.h1 = "Gestionnaire de compte"
	req.json = "Bad request"
	next()
})

//Post d'édition d'utilisateur
router.post('/', (req, res, next) => {
	let params = {}
	req.json = []
	Promise.resolve().then(() => {
		if (typeof req.body.password == 'undefined') {
			req.h1 = "Pas de mot de passe fourni"
			req.json.push(req.h1)
			return Promise.resolve()
		} else if (bcrypt.compareSync(req.body.password, req.user.password)) {
			return Promise.resolve()
		} else {
			req.h1 = "Mot de passe incorrect"
			req.json.push(req.h1)
			return Promise.resolve()
		}
	}).then(() => {
		const saltRounds = 10
		if (typeof req.body.newPassword !== 'undefined' && typeof req.body.confirmNewPassword !== 'undefined' && req.body.newPassword !== '') {
			if (req.body.newPassword == req.body.confirmNewPassword) {
				params.password = bcrypt.hashSync(req.body.newPassword, saltRounds)
				return Promise.resolve()
			} else {
				req.h1 = "Les mots de passe ne correspondent pas"
				req.json.push(req.h1)
				return Promise.resolve()
			}
		} else {
			return Promise.resolve()
		}
	}).then(() => {
		if (typeof req.body.email !== 'undefined' && req.body.email !== '') {
			params.email = req.body.email
			return Promise.resolve()
		} else {
			return Promise.resolve()
		}
	}).then(() => {
		if (typeof req.body.firstname !== 'undefined' && req.body.firstname !== '') {
			params.firstname = req.body.firstname
			return Promise.resolve()
		} else {
			return Promise.resolve()
		}
	}).then(() => {
		if (typeof req.body.lastname !== 'undefined' && req.body.lastname !== '') {
			params.lastname = req.body.lastname
			return Promise.resolve()
		} else {
			return Promise.resolve()
		}
	}).then(() => {
		if (isEmptyObject(params) && req.json.length == 0) {
			req.h1 = "Champs vides"
			req.json.push(req.h1)
			next()
		} else if (isEmptyObject(params) || req.json.length !== 0) {
			next()
		} else {
			return User.update(req.user.pseudo, params).then(() => {
				console.log("---\nMaJ Utilisateur\nParamètres : ", params, "\n---")
				res.format({
					html: () => {
						res.redirect('../sessions/manage')
					},
					json: () => {
						res.status(201).json({
							msg: "Utilisateur mis à jour. Ci-joint les paramètres mis à jours.",
							params: params,
						})
					}
				})
			})
		}
	})
})

//Préparation de l'affiche de la route
router.all('/', (req, res, next) => {
	req.user.createdAt = req.user.createdAt.replace(" ", " à ")
	req.user.updatedAt = req.user.updatedAt.replace(" ", " à ")
	res.format({
		html: () => {
			res.render('manage', {
				h1: req.h1,
				user: req.user,
			})
		},
		json: () => {
			let error = new Error(req.json)
			error.status = 201
			next(error)
		}
	})
})

//Post de suppression d'utilisateur
router.post('/delete', (req, res, next) => {
	if (bcrypt.compareSync(req.body.password, req.user.password)) {
		console.log("---\nUtilisateur supprimé\nPseudo : ", req.user.pseudo, "\n---")
		Session.delete(req.token)
		User.delete(req.user.pseudo)
		res.clearCookie('accessToken')
		res.redirect('../')
	} else {
		req.h1 = "Mot de passe incorrect"
		req.json = req.h1
		res.redirect('./')
	}
})

//petite fonction pour check si un object est vide
function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

module.exports = router
