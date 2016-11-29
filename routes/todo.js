const router = require('express').Router()
const db = require('sqlite')
const Session = require('../models/session')
const ModelTodo = require ('../models/todo')

router.get('/', (req, res, next) => {
  console.log("DEBUG OK")
  next()
})

/* On ajoute un élément à la todolist */
router.post('/ajouter/', (req, res, next) => {
  if (req.body.newtodo != '') {
    Session.checkAccess(req.cookies.accessToken).then((result) => {
      if (result !== false) {
        console.log("Ajout d'une todo, redirection")
        ModelTodo.addTodo(req.user.pseudo, req.body.message).then((result)=>{
          res.redirect('/')
        }).catch ((err)=>{
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
          Todo.UPDATE()
          //db.run("UPDATE todos SET completedAt = ? WHERE todoId = ?", dateNow, req.params.todoId)
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
