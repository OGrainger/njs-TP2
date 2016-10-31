const router = require('express').Router()
const bcrypt = require('bcrypt')
const express = require('express')
const Session = require('../models/session')

// REDIRIGE VERS TODO SI CO & TOKEN VALABLE SINON VERS SESSION
router.get('/', (req, res, next) => {
	if (typeof req.cookies.accessToken == 'undefined') {
		console.log("Pas ou plus de token, redirection")
		res.redirect('/sessions')
	} else {
		Session.getFromToken(req.cookies.accessToken)
			.then((session) => {
				//Si la session est expirée OU le token n'existe pas sur le serveur
				if (typeof session == 'undefined' || session.expiresAt < Date.now()) {
					res.clearCookie('accessToken')
					Session.deleteFromToken(req.cookies.accessToken)
						.then(() => {
							if (session.expiresAt < Date.now()) {
								console.log("Session expirée, redirection")
							} else {
								console.log("Token absent de notre base de donnée, redirection")
							}
							res.redirect('/sessions')
						})
				} else {
					res.redirect('/todo')
				}
			}).catch(next)
	}
})

router.use('/sessions', require('./sessions'))

router.use('/todo', require('./todo'))

module.exports = router
