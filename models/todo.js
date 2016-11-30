//Module mongoose
var mongoose = require('mongoose');


//connection à la base de données todo
mongoose.connect('mongodb://localhost/todolistPerso', function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'todolistPerso'");
});
mongoose.connect('mongodb://localhost/todolistTeam', function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'todolistTeam'");
});

var todolistPersoSchema = new mongoose.Schema({
  pseudo: String,
  message:String,
  createdAt: { type : Date, default : Date.now },
  terminatedAt: {type : Date, default : 0}
});

var todolistTeamSchema = new mongoose.Schema({
  pseudo: String,
  team:String,
  for:String,
  message:String,
  createdAt: { type : Date, default : Date.now },
  terminatedAt: {type : Date, default : 0}
});

var Todo = mongoose.model('todo', todolistPersoSchema)

var TodoTeam = mongoose.model('todoTeam', todolistTeamS)


module.exports = {
  addTodo: (pseudo, message)=>{
    var todo = new Todo ({
      pseudo: pseudo,
      message: message,
      createdAt: Date.now,
      terminatedAt: 0
    });
   return new Promise ((resolve, reject)=>{
      return resolve(Todo.save())
    })
  },

  suppTodo: (pseudoId) => {
    return new Promise ((resolve, reject)=>{
       return resolve(Todo.remove({_id:pseudoId}))
    })
  },

  compTodo: (pseudoId) => {
    Todo.findById(pseudoId, function(err, todo){
      todo.createdAt=Date.now
      return new promise ((resolve, reject) => {
        return resolve(todo.save())
      }
    )}
    )
  },

  undoTodo: (pseudoId) => {
    Todo.findById(pseudoId, function(err, todo){
      todo.completedAt=0
      return new promise ((resolve, reject) => {
        return resolve(todo.save())
      })
    })
  }


  // addTodoTeam: (pseudo, forwho)=>{
  //   var todo = new Todo ({
  //     pseudo: pseudo,
  //     forwho:forwho,
  //     message: message,
  //     createdAt: Date.now,
  //     terminatedAt: 0
  //   });
  //  return new Promise ((resolve, reject)=>{
  //     return resolve(Todo.save())
  //   })
  // },










}
