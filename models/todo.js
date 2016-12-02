//Module mongoose
const mongoose = require('mongoose');


//connection à la base de données todo
mongoose.connect('mongodb://localhost/todolist', function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'todolist'");
});


var todolistSchema = new mongoose.Schema({
  pseudo: String,
  message:String,
  team: { type : String, default : '' },
  forPseudo: { type : String, default : '' },
  createdAt: { type : String, default : 0 },
  completedAt: {type : String, default : 0}
});

var Todo = mongoose.model('todo', todolistSchema)



module.exports = {

  getTodosPerso: (usr)=>{
    return Todo.find({pseudo: usr, team: ''})
  },

  getTodosTeam: (tm)=>{
    return Todo.find({team: tm})
  },

  addTodoPerso: (pseudo, message)=>{

    let d = new Date()
    let dateNow = d.toLocaleString()

    var todo = new Todo ({
      pseudo: pseudo,
      message: message,
      createdAt: dateNow,
    });
   return new Promise ((resolve, reject)=>{
      return resolve(todo.save())
    })
  },

  addTodoTeam: (pseudo, message, frpsd, tm)=>{

    let d = new Date()
    let dateNow = d.toLocaleString()

    var todo = new Todo ({
      pseudo: pseudo,
      message: message,
      team: tm,
      forPseudo: frpsd,
      createdAt: dateNow,
      completedAt: 0
    });
   return new Promise ((resolve, reject)=>{
      return resolve(todo.save())
    })
  },

  suppTodo: (todoId) => {
    return new Promise ((resolve, reject)=>{
       return resolve(Todo.remove({_id:todoId}))
    })
  },

  compTodo: (todoId) => {
    let d = new Date()
    let dateNow = d.toLocaleString()
    return new Promise ((resolve, reject) => {
      return resolve(Todo.update({_id:todoId}, {completedAt: dateNow}))
    })
  },

  undoTodo: (todoId) => {
    return new Promise ((resolve, reject) => {
      return resolve(Todo.update({_id:todoId}, {completedAt: 0}))
    })
  }
}
