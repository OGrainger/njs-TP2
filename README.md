#Todo list

TP avec Express, ioredis et mangoose

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

#Personel

##A faire

- [x] Architecture de la gestion de teams (1 user appartient à 1 équipe OU pas d'équipe)
- [x] Architecture de la todolist avec système de teams - Mongoose
- [ ] En cours - Codage du todo.js (model possible)
- [x] Codage du todo.ejs
- [x] Optimisation du système de sessions (req? redirect? - router.all dans le "/" qui gère la page APRES le router.post > action du post > génération de page OU redirect.. Bref, à voir)
- [x] Système de déconnexion
- [x] Commentaires
- [ ] readme.md
- [ ] Beautifier / Optimisation

##Si on a le temps

- [ ] Pimp my views (CSS, bootstrap..)
- [ ] Panel admin
- [ ] Idées ?
