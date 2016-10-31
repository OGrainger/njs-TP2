const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('todo.ejs', {todolist: []})
})

// /* On ajoute un élément à la todolist */
// .post('/todo/ajouter/', urlencodedParser, function(req, res) {
//     if (req.body.newtodo != '') {
//         req.session.todolist.push(req.body.newtodo);
//     }
//     res.redirect('/todo');
// })
//
// /* Supprime un élément de la todolist */
// .get('/todo/supprimer/:id', function(req, res) {
//     if (req.params.id != '') {
//         req.session.todolist.splice(req.params.id, 1);
//     }
//     res.redirect('/todo');
// })
//
// /* On redirige vers la todolist si la page demandée n'est pas trouvée */
// .use(function(req, res, next){
//     res.redirect('/todo');
// })

module.exports = router
