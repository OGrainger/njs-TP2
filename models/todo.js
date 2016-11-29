//Module mongoose
var mongoose = require('mongoose');


//connection à la base de données todo
mongoose.connect('mongodb://localhost/todo', function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'todo'");
});

var todoSchema = new mongoose.Schema({
  pseudo: String,
  message:String,
  createdAt: { type : Date, default : Date.now },
  terminatedAt: { type : Date, default : Date.now }
});

var Todo = mongoose.model('todo', todoSchema)

module.exports = {
  addTodo: (pseudo, message)=>{
    var todo = new Todo ({                            //on peuple le model
      pseudo: pseudo,
      message: message,
      createdAt: dateNow,
      terminatedAt: dateNow
    });
    return new Promise ((resolve, reject)=>{
      return resolve(todo.save())
    })

  }
}
