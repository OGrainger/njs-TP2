const router = require('express').Router()
const db = require('sqlite')
const Session = require('../models/session')
const ModelTodo = require('../models/todo')
const Team = require('../models/team')
const bcrypt = require('bcrypt')



//middleware de recup d'informations lié au user
router.all('*', (req, res, next) => {
	req.displayError = ''
	req.json = ''
	let d = new Date()
	let dateNow = d.toLocaleString().replace(" ", " à ")
		//JSON d'infos
	req.team = {}
	if (req.user.teamName == '') {
		//Si le user n'est associé à aucune team (ce qui permet de diplay la colonne de login/create)
		req.team.isConnectedToTeam = false
		next()
	} else {
		req.team.isConnectedToTeam = true
		Promise.all([
			//Liste des membres de l'équipe
			Team.getTeamMembers(req.user.teamName),
			//Infos de la team
			Team.get(req.user.teamName)
		]).then((results) => {
			req.team.teamMembers = results[0]
			req.team.info = results[1]
			if (req.team.info.admin == req.user.pseudo) {
				//Est ce que le user est l'admin de la team (créateur de la team)
				req.team.isAdmin = true
				next()
			} else {
				req.team.isAdmin = false
				next()
			}
		})
	}
})

//POST Login de team
router.post('/teams/login', (req, res, next) => {
	if (req.team.isConnectedToTeam == true) {
		req.json = "Vous êtes déjà associé à une team"
		next()
	} else if (typeof req.body.teamName == 'undefined' || typeof req.body.password == 'undefined') {
		req.json = "Il manque un argument"
		next()
	} else if (req.body.password == '' || req.body.teamName == '') {
		req.displayError = "Au moins un champ est vide"
		req.json = req.displayError
		next()
	} else {
		Team.get(req.body.teamName).then((team) => {
			if (typeof team == 'undefined') {
				req.displayError = "Cette équipe n'existe pas"
				req.json = req.displayError
				next()
			} else if (bcrypt.compareSync(req.body.password, team.password)) {
				Team.addMember(req.user.pseudo, team.teamName)
				res.redirect('../')
			} else {
				req.displayError = "Mot de passe incorrect"
				req.json = req.displayError
				next()
			}
		})
	}
})

//POST Creation de team
router.post('/teams/create', (req, res, next) => {
	if (req.team.isConnectedToTeam == true) {
		req.json = "Vous êtes déjà associé à une team"
		next()
	} else if (typeof req.body.teamName == 'undefined' || typeof req.body.password == 'undefined' || typeof req.body.confirmPassword == 'undefined') {
		req.json = "Il manque un argument"
		next()
	} else if (req.body.password == '' || req.body.teamName == '' || req.body.confirmPassword == '') {
		req.displayError = "Au moins un champ est vide"
		req.json = req.displayError
		next()
	} else {
		Team.get(req.body.teamName).then((team) => {
			if (typeof team !== 'undefined') {
				req.displayError = "Ce nom est déjà attribué à une autre équipe"
				req.json = req.displayError
				next()
			} else if (req.body.password !== req.body.confirmPassword) {
				req.displayError = "Les mots de passe ne correspondent pas"
				req.json = req.displayError
				next()
				let params = {
					teamName: req.body.teamName,
					password: req.body.password,
				}
				Team.insert(req.user.pseudo, params)
				res.redirect('../')
			}
		})
	}
})

//POST de leave team
router.post('/teams/quit', (req, res, next) => {
	if (req.team.isConnectedToTeam == false) {
		req.json = "Vous n'êtes pas associé à une team"
		next()
	} else {
		Team.quit(req.user.pseudo)
		res.redirect('../')
	}
})

//POST de suppression de team
router.post('/teams/delete', (req, res, next) => {
	if (req.team.isConnectedToTeam == false) {
		req.json = "Vous n'êtes pas associé à une team"
		next()
	} else if (req.team.isAdmin == false) {
		req.json = "Vous n'êtes pas l'admin"
		next()
	} else {
		Team.delete(req.user.teamName)
		res.redirect('../')
	}
})

//---ZONE DE TRAVAIL DE CLEM------------------------------------------------------------------------------

//Ce que t'avais déjà fait
/* On ajoute un élément à la todolist */
// router.post('/ajouter/', (req, res, next) => {
// 	if (req.body.newtodo != '') {
// 		Session.checkAccess(req.cookies.accessToken).then((result) => {
// 			if (result !== false) {
// 				console.log("Ajout d'une todo, redirection")
// 				ModelTodo.addTodo(req.user.pseudo, req.body.message).then((result) => {
// 					res.redirect('/')
// 				}).catch((err) => {
// 					res.redirect('/')
// 				})
// 			} else {
// 				console.log('Acces refusé')
// 				let error = new Error('Forbidden')
// 				error.status = 403
// 				next(error)
// 			}
// 		})
// 	} else {
// 		console.log('Todo vide')
// 		res.redirect('/')
// 	}
// })

router.post('/complete', (req, res, next) => {
	let todoId = req.body.todoId
		// mettre la todo en "complétée" avec mangoose => Mettre une heure à la colonne completedAt
	next()
})

router.post('/undo', (req, res, next) => {
	let todoId = req.body.todoId
		// Enlever la mention "complétée" => Mettre 0 à la colonne completedAt
	next()
})

router.post('/delete', (req, res, next) => {
	// Supprimer la todo
	let todoId = req.body.todoId
	next()
})

router.post('/new', (req, res, next) => {
	let message = req.body.message
		// Ajoute la todo perso
	next()
})

router.post('/teams/new', (req, res, next) => {
	let message = req.body.message
	let forPseudo = req.body.for
		// Ajoute la todo de team
	next()
})

//---FIN DE LA ZONE DE TRAVAIL DE CLEM------------------------------------------------------------------------------


router.all('*', (req, res, next) => {
	let todolistPerso = [{
		"todoId": 9350158710837520,
		"message": "zrhgpiuhgpiaubiaugb",
		"completedAt": 0
	}, {
		"todoId": 097087,
		"message": "ijoij",
		"completedAt": "34/01/13"
	}, {
		"todoId": 110857,
		"message": "iuhfiuha",
		"completedAt": 0
	}]

	let todolistTeam = [{
		"todoId": 09870958695,
		"message": "zrhgpiuhgpiaubiaugb",
		"by": "Oscar",
		"for": "Axelle",
		"completedAt": 0
	}, {
		"todoId": 8768956895,
		"message": "ijoij",
		"by": "Axelle",
		"for": "Oscar",
		"completedAt": "34/01/13"
	}]
	res.format({
		html: () => {
			res.render('todo.ejs', {
				error: req.displayError,
				todolistPerso: todolistPerso,
				todolistTeam: todolistTeam,
				isConnectedToTeam: req.team.isConnectedToTeam,
				isAdmin: req.team.isAdmin,
				teamMembers: req.team.teamMembers
			})
		},
		json: () => {
			res.send(req.json)
		}
	})
})

module.exports = router
