const router = require('express').Router()
const db = require('sqlite')
const Session = require('../models/session')
const ModelTodo = require('../models/todo')
const Team = require('../models/team')
const bcrypt = require('bcrypt')

//middleware de recup d'informations lié au user
router.all('*', (req, res, next) => {
	//affichage de l'erreur (h1 en HTML)
	req.displayError = ''
	//JSON d'infos
	req.json = ''
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
			} else {
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
		Team.delete(req.user.teamName, req.user.pseudo)
		res.redirect('../')
	}
})

//POST pour marquer une todo en complétée
router.post('/complete', (req, res, next) => {
  let _id = req.body._id
	ModelTodo.compTodo(_id).then(() => {
	  next()
	})
})

//POST pour remettre une todo dans la liste des todos non complétées
router.post('/undo', (req, res, next) => {
	let _id = req.body._id
  ModelTodo.undoTodo(_id).then(() => {
		next()
	})
})

//POST pour supprimer une todo
router.post('/delete', (req, res, next) => {
  let _id = req.body._id
  ModelTodo.suppTodo(_id).then(() => {
	  next()
	})
})

//POST pour créer une nouvelle todo personelle
router.post('/new', (req, res, next) => {
	let message = req.body.message
	let pseudo = req.user.pseudo
		// Ajoute la todo perso
  ModelTodo.addTodoPerso(pseudo, message).then(() => {
    next()
  })
})

//POST pour créer une nouvelle todo pour l'équipe
router.post('/teamNew', (req, res, next) => {
	let message = req.body.message
	let pseudo = req.user.pseudo
	let forPseudo = req.body.for
	let team = req.user.teamName
		// Ajoute la todo de team
	ModelTodo.addTodoTeam(pseudo, message, forPseudo, team).then(() => {
    next()
  })
})

//récupère toutes les todos personelles
router.all('*', (req, res, next) => {
	ModelTodo.getTodosPerso(req.user.pseudo).then((result) => {
		req.user.todolistPerso = result
	}).then(() => {
		next()
	})
})

//récupère les todos de la team de l'user
router.all('*', (req, res, next) => {
	ModelTodo.getTodosTeam(req.user.teamName).then((result) => {
		req.team.todolistTeam = result
	}).then(() => {
		next()
	})
})

//Affichage
router.all('*', (req, res, next) => {
	res.format({
		html: () => {
			//Rendu du html
			res.render('todo.ejs', {
				error: req.displayError,
				todolistPerso: req.user.todolistPerso,
				todolistTeam: req.team.todolistTeam,
				isConnectedToTeam: req.team.isConnectedToTeam,
				isAdmin: req.team.isAdmin,
				teamMembers: req.team.teamMembers,
				teamName: req.user.teamName
			})
		},
		json: () => {
			//Renvoie une liste avec les erreurs, la liste des todos perso et la liste des todos de team
			let json = []
			json.push(req.json)
			json.push(req.user.todolistPerso)
			json.push(req.team.todolistTeam)
			res.send(json)
		}
	})
})

module.exports = router
