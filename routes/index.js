const router = require('express').Router()
const express = require('express')
const User = require('../models/user')

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
