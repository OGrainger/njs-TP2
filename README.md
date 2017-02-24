#Todo list

##Résumé
TP avec Express, ioredis et mangoose de gestion de tâches, personnelles et en équipe.

## Contributeurs

- **Oscar Grainger** - _oscarvgrainger@gmail.com_
- **Clément Lambert** - _clement.lambert@ynov.com_

##Requis
 - Mongo DB
 - Redis

##Guide d'installation

Naviguez vers le dossier du projet

Installez les packages avec la commande suivante :
`npm install`

Installez redis
Lancez un serveur redis avec
`redis-server`

Dans un nouvel onglet de console, lancez MongoDB avec
`mongod`

Dans un nouvel onglet de console, lancez le serveur avec
`node app.js`

##Guide d'Utilisation

###Accès
Accedez au serveur à l'adresse suivante :
**localhost:8080**

D'autres personnes peuvent accéder à votre serveur en local ainsi :
**votre_IP_locale:8080**

En forwardant le port 8080, n'importe qui peut accéder à votre serveur ainsi :
**votre_IPv4:8080**

###Login & équipes
Par défaut, vous vous trouverez devant une page de connexion. Pour votre première utilisation, il vous faudra créer un nouveau compte. Pour information, une session est périmée 15 minutes après la connexion.
Une fois connecté, l'affichage est scindé en deux parties. A gauche, la partie équipe et à droite la partie personnelle.
Vous pouvez rejoindre une équipe ou en créer une nouvelle. Le créateur est alors l'admin de l'équipe. Il peut alors la supprimer.

Vous pouvez ajouter une tâche en équipe ou personnelle. Pour les tâches en équipe, vous pouvez l'assigner à une personne ou toute l'équipe. Les tâches s'affichent en liste et vous pouvez soit la marquer comme terminé, ou la supprimer.
Il est aussi possible de la re-rendre disponible.

Dans cette page, vous avez aussi accès à un gestionnaire de compte pour modifier vos informations.

###Postman

L'app est compatible avec Postman.
Pour avoir un meilleure visibilité, mettez dans le header **Accept : Application/json**
Voici les différentes routes :

####Connexion

- `localhost:8080/session` POST : Retourne un token pour pouvoir se connecter. Mettre dans le body votre **pseudo** et votre mot de passe (**password**).

- `localhost:8080/session/new` POST : Créé un nouvel utilisateur. Mettre dans le body le **pseudo**, le **password**, le **confirmPassword**, l' **email**, le **firstname** et le **lastname**.

####Routes disponibles après Connexion

Les routes suivantes nécessitent un token. Mettez dans le header **token : votre token**.

####Route de déconnexion

- `localhost:8080/sessions/disconnect` POST : Vous déconnecte en supprimant le token de la base de données.

####Routes de todo

- `localhost:8080/todo` GET : Retourne toutes les todos.

- `localhost:8080/todo/new` POST : Ajoute une todo perso. Mettez dans le body le **message**.

- `localhost:8080/todo/complete` POST : Met une todo en complétée. Mettez dans le body l'id de la todo (**_id**).

- `localhost:8080/todo/undo` POST : Enlève une todo de la liste de todos complétées. Mettez dans le body l'id de la todo (voir "complete").

- `localhost:8080/todo/delete` POST : Supprime une todo. Mettez dans le body l'id de la todo (voir "complete").

####Routes de team

- `localhost:8080/todo/teamNew` POST :Ajoute une todo de team. Mettez dans le body le **message** et le pseudo du destinataire (**"for"**).

- `localhost:8080/todo/teams/login` POST : Rejoins une team. Mettez dans le body le nom de l'équipe ("**teamName**") ainsi que le **password**.

- `localhost:8080/todo/teams/quit` POST : Quitte une team.

- `localhost:8080/todo/teams/delete` POST : Supprime une équipe. Disponible uniquement pour l'admin.

- `localhost:8080/todo/teams/create` POST : Créé une team. Mettez dans le body le nom de l'équipe ("**teamName**"), le **password** ainsi que la confirmation du mot de passe (**"confirmPassword"**).

####Routes de gestion de compte

- `localhost:8080/sessions/manage` POST : Modifie votre compte. Les arguments possibles correspondent à ceux de la création de compte. Il est nécessaire à chaque fois de mettre un **password** et un **confirmPassword**. Pour modifier votre mot de passe, ajoutez une clé **newPassword**.

- `localhost:8080/sessions/manage/delete` POST : Supprime votre compte. Mettez dans le body **password**.

#Personel

##A faire

- [x] Architecture de la gestion de teams (1 user appartient à 1 équipe OU pas d'équipe)
- [x] Architecture de la todolist avec système de teams - Mongoose
- [x] En cours - Codage du todo.js (model possible)
- [x] Codage du todo.ejs
- [x] Optimisation du système de sessions (req? redirect? - router.all dans le "/" qui gère la page APRES le router.post > action du post > génération de page OU redirect.. Bref, à voir)
- [x] Système de déconnexion
- [x] Commentaires
- [x] readme.md
- [x] Optimisation

##Si on a le temps

- [x] Pimp my views (materialize)
- [ ] Panel admin
- [ ] Idées ?
