const router = require('express').Router()
const db = require('sqlite')
const Session = require('../models/session')
//Module mongoose
var mongoose = require('mongoose');


//connection à la base de données todo
mongoose.connect('mongodb://localhost/todo', function(err) {
  if (err) { throw err; }
  console.log("Connecté à la base de données 'todo'");
});


router.get('/', (req, res, next) => {
    console.log("DEBUG OK")
    next()
})


var todoSchema = new mongoose.Schema({
  pseudo: String,
  message:String,
  createdAt: { type : Date, default : Date.now },
  terminatedAt: { type : Date, default : Date.now }
});

var Todo = mongoose.model('todo', todoSchema)



/* On ajoute un élément à la todolist */
router.post('/ajouter/', (req, res, next) => {
    if (req.body.newtodo != '') {
        Session.checkAccess(req.cookies.accessToken).then((result) => {
            if (result !== false) {
                console.log("Ajout d'une todo, redirection")
                let d = new Date()
                let dateNow = d.toLocaleDateString()
                require('crypto').randomBytes(48, function(err, buffer) {
                  var todo = new Todo ({                            //on peuple le model
                    pseudo: req.user.pseudo,
                    message: req.body.message,
                    createdAt: dateNow,
                  });
                  Todo.save(function (err) {                        //on sauvegarde le model dans la abase
                    if (err) {
                      return err;
                    }
                    else {
                     console.log("Post saved");
                    }
                });
                //db.run("INSERT INTO todos VALUES (?, ?, ?, ?, ?, ?)", buffer.toString('hex'), result.userId, req.body.newtodo, dateNow, dateNow, 0)
                res.redirect('/')
                })
            } else {
                console.log('Acces refusé')
                let error = new Error('Forbidden')
                error.status = 403
                next(error)
            }
        })
    } else {
        console.log('Todo vide')
        res.redirect('/')
    }
})


/*//modification todo
router.get('/completer/:todoId', (req, res, next) => {
    Session.checkAccess(req.cookies.accessToken).then((resultAccess) => {
        if (resultAccess !== false) {
            let checkVars = [req.cookies.accessToken, req.params.todoId]
            Session.checkAccessOfTodo(checkVars).then((resultTodo) => {
                if (resultTodo !== false) {
                    let d = new Date()
                    let dateNow = d.toLocaleString()
                    console.log("Todo fini : ", req.params.todoId)
                    db.run("UPDATE todos SET completedAt = ? WHERE todoId = ?", dateNow, req.params.todoId)
                    res.redirect('/')
                } else {
                    console.log('Accès refusé à ce todo')
                    let error = new Error('Forbidden')
                    error.status = 403
                    next(error)
                }

            })
        } else {
            console.log('Accès refusé')
            let error = new Error('Forbidden')
            error.status = 403
            next(error)
        }
    })
})

//supprimer todo
router.get('/supprimer/:todoId', (req, res, next) => {
    Session.checkAccess(req.cookies.accessToken).then((resultAccess) => {
        if (resultAccess !== false) {
            let checkVars = [req.cookies.accessToken, req.params.todoId]
            Session.checkAccessOfTodo(checkVars).then((resultTodo) => {
                if (resultTodo !== false) {
                    db.run("DELETE FROM todos WHERE todoId = ?", req.params.todoId)
                    console.log("todo supprimé : ", req.params.todoId)
                    res.redirect('/')
                } else {
                    console.log('Accès refusé à ce todo')
                    let error = new Error('Forbidden')
                    error.status = 403
                    next(error)
                }
            })
        } else {
            console.log('Accès refusé')
            let error = new Error('Forbidden')
            error.status = 403
            next(error)
        }
    })
})*/

module.exports = router
