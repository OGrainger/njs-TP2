const Redis = require('ioredis')
const redis = new Redis()

module.exports = {
	//Retourne un token aléatoire
	generateToken: () => {
		return new Promise(function(resolve) {
			require('crypto').randomBytes(48, function(err, buffer) {
				resolve(buffer.toString('hex'))
			})
		})
	},

	//Retourne le token suivant la méthode de connexion du user (html / JSON)
	getToken: (tokenCookie, tokenJson) => {
		//Condition ternaire
		return (typeof tokenCookie == 'undefined' ? (typeof tokenJson == 'undefined' ? undefined : tokenJson) : tokenCookie)
	},

	//Ajoute une session dans la base Redis avec comme clé le token, et sa valeur le pseudo. On met aussi une date d'expiration 15mn après la création de la session
	insert: (data) => {
		let pipeline = redis.pipeline()
		let expiresAt = 60 * 15
		pipeline.set(data.accessToken, data.pseudo)
		pipeline.expire(data.accessToken, expiresAt)
		console.log("---\nNouvelle session\n- token : "+data.accessToken+"\n- Pour l'ID : "+data.pseudo+"\n- Expire dans "+expiresAt+"s.\n---")
		return pipeline.exec()
	},

	//A partir du token, retourne le pseudo du user
	get: (token) => {
		return redis.get(token)
	},

	//Supprime la session
	delete: (token) => {
		return redis.del(token)
	},
}
