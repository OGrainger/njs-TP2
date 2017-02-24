//Module mongoose
const mongoose = require('mongoose');


//connection à la base de données todo
mongoose.connect('mongodb://db-mongo:27017', function(err) {
	if (err) {
		throw err;
	}
	console.log("Connecté à la base de données 'todolist'");
});

//Création de schéma mongoose
var todolistSchema = new mongoose.Schema({
	pseudo: String,
	message: String,
	team: {
		type: String,
		default: ''
	},
	forPseudo: {
		type: String,
		default: ''
	},
	createdAt: {
		type: String,
		default: 0
	},
	completedAt: {
		type: String,
		default: 0
	}
});


//Création du model
var Todo = mongoose.model('todo', todolistSchema)


//Apport des modules
module.exports = {
//Récup Todos perso
	getTodosPerso: (usr) => {
		return Todo.find({
			pseudo: usr,
			team: ''
		})
	},
//Récup Todos team
	getTodosTeam: (tm) => {
		return Todo.find({
			team: tm
		})
	},

//Nouvelle todo perso
	addTodoPerso: (pseudo, message) => {

		let d = new Date()
		let dateNow = d.toLocaleString()

		var todo = new Todo({
			pseudo: pseudo,
			message: message,
			createdAt: dateNow,
		});
		return new Promise((resolve, reject) => {
			return resolve(todo.save())
		})
	},

//Supprime todo
	suppTodo: (todoId) => {
		return new Promise((resolve, reject) => {
			return resolve(Todo.remove({
				_id: todoId
			}))
		})
	},

//Todo complétée
	compTodo: (todoId) => {
		let d = new Date()
		let dateNow = d.toLocaleString()
		return new Promise((resolve, reject) => {
			return resolve(Todo.update({
				_id: todoId
			}, {
				completedAt: dateNow
			}))
		})
	},

//Remise d'une todo complétée dans la liste des todos non complétées
	undoTodo: (todoId) => {
		return new Promise((resolve, reject) => {
			return resolve(Todo.update({
				_id: todoId
			}, {
				completedAt: 0
			}))
		})
	},

//Ajout d'une todo team
	addTodoTeam: (pseudo, message, frpsd, tm) => {

		let d = new Date()
		let dateNow = d.toLocaleString()

		var todo = new Todo({
			pseudo: pseudo,
			message: message,
			team: tm,
			forPseudo: frpsd,
			createdAt: dateNow,
			completedAt: 0
		});
		return new Promise((resolve, reject) => {
			return resolve(todo.save())
		})
	}
}
