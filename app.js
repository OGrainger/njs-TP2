// Dépendances native
const path = require('path')

// Dépendances 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const sass = require('node-sass-middleware')
const db = require('sqlite')
const cookieParser = require('cookie-parser')

// Constantes et initialisations
const PORT = process.PORT || 8080
const app = express()

//Dépendance : method override (pour simuler un PUT & DELETE)
const method = require('method-override')
app.use(method('_method'))

// Mise en place des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware cookie-parser
app.use(cookieParser())

// Middleware pour parser le body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Préprocesseur sur les fichiers scss -> css
app.use(sass({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'assets', 'css'),
  prefix: '/css',
  outputStyle: 'expanded'
}))

// On sert les fichiers statiques
app.use(express.static(path.join(__dirname, 'assets')))

// Création des db
db.open('database/data.db').then(() => {
  Promise.all([
    db.run("CREATE TABLE IF NOT EXISTS users (pseudo, password, email, firstname, lastname, createdAt, updatedAt)"),
    db.run("CREATE TABLE IF NOT EXISTS sessions (userId, accessToken, createdAt, expiresAt)"),
    db.run("CREATE TABLE IF NOT EXISTS todos (userId, message, createdAt, updatedAt, completedAt)")
  ])
}).catch((err) => {
	console.log('ERR > ', err)
})

// La liste des différents routeurs (dans l'ordre)
app.all('*', (req, res, next) => {
	next()
})
//DEBUG
app.use('/', require('./routes/index'))

// Erreur 404
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Gestion des erreurs
// Notez les 4 arguments !!
app.use(function(err, req, res, next) {
  // Les données de l'erreur
  let data = {
    message: err.message,
    status: err.status || 500
  }

  // En mode développement, on peut afficher les détails de l'erreur
  if (app.get('env') === 'development') {
    data.error = err.stack
  }

  // On set le status de la réponse
  res.status(data.status)

  // Réponse multi-format
  res.format({
    html: () => { res.render('error', {
      message: data.message,
      status: data.status,
      error: data.error,
      data : JSON.stringify(data)
      }
    )},
    json: () => { res.send(data) }
  })
})

app.listen(PORT, () => {
  console.log('Serveur démarré sur le port : ', PORT)
})
