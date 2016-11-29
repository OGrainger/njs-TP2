const router = require('express').Router()
const express = require('express')
const User = require('../models/user')

//Middleware de récuperation des infos de l'utilisateur (s'il est connecté) et stockage dans req.user
router.all('*', (req, res, next) => {
	if (req.isConnected == true) {
		User.get(req.pseudo).then((user) => {
			req.user = user
			return next()
		})
	} else {
		next()
	}
})

//Si l'utilisateur est connecté, on le redirige de base vers /todo. Sinon, vers /sessions
router.get('/', (req, res, next) => {
	if (req.isConnected == true) {
		res.redirect('/todo')
	} else {
		res.format({
			html: () => {
	    	res.redirect('/sessions')
			},
			json: () => {
				let error = new Error("Vous n'êtes pas ou plus connecté")
				error.status = 401
				next(error)
			}
		})
	}
})

//Si l'utilisateur est dans /todo (et plus, tel quel /todo/delete), check de connexion
router.all('/todo*', (req, res, next) => {
	if (req.isConnected == true) {
    next()
  } else {
		res.format({
			html: () => {
	    	res.redirect('/sessions')
			},
			json: () => {
				let error = new Error("Vous n'êtes pas ou plus connecté")
				error.status = 401
				next(error)
			}
		})
  }
})
//Si l'utilisateur est dans /sessions/manage (et plus, tel quel /sessions/manage/edit), check de connexion
router.all('/sessions/manage*', (req, res, next) => {
	if (req.isConnected == true) {
    next()
  } else {
		res.format({
			html: () => {
	    	res.redirect('/sessions')
			},
			json: () => {
				let error = new Error("Vous n'êtes pas ou plus connecté")
				error.status = 401
				next(error)
			}
		})
  }
})

router.use('/sessions', require('./sessions'))

router.use('/todo', require('./todo'))

module.exports = router
