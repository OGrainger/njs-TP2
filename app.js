// Dépendances native
const path = require('path')

// Dépendances 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const sass = require('node-sass-middleware')
const db = require('sqlite')

// Constantes et initialisations
const PORT = process.PORT || 8080
const app = express()

//Dépendance : method override (pour simuler un PUT & DELETE)
const method = require('method-override')
app.use(method('_method'))

// Mise en place des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
db.open('db/users.db').then(() => {
	return db.run("CREATE TABLE IF NOT EXISTS users (pseudo, password, email, firstname, lastname, createdAt, updatedAt)")
}).then(() => {
  return db.close('db/users.db')
}).then(() => {
  return db.open('db/sessions.db')
}).then(() => {
	return db.run("CREATE TABLE IF NOT EXISTS sessions (userId, accessToken, createdAt, expiresAt)")
}).then(() => {
  return db.close('db/sessions.db')
}).catch((err) => {
	console.log('ERR > ', err)
})

// La liste des différents routeurs (dans l'ordre)
app.all('*', (req, res, next) => {
	console.log('REQ')
	next()
})

app.get('/', (req, res, next) => {
  res.redirect(301, '/login')
})

app.use('/login', require('./routes/index'))

app.use('/create', require('./routes/create'))


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
