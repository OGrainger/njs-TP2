const router = require('express').Router()
const express = require('express')

router.get('/', (req, res, next) => {
	if (req.isConnected == true) {
		res.redirect('/todo')
	} else {
		res.redirect('/sessions')
	}
})

router.all('/todo*', (req, res, next) => {
	if (req.isConnected == true) {
    next()
  } else {
    res.redirect('/sessions')
  }
})

router.use('/sessions', require('./sessions'))

router.use('/todo', require('./todo'))

module.exports = router
