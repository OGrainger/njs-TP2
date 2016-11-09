const Redis = require('ioredis')
const redis = new Redis()

module.exports = {
	generateToken: () => {
		return new Promise(function(resolve) {
			require('crypto').randomBytes(48, function(err, buffer) {
				resolve(buffer.toString('hex'))
			})
		})
	},

	getToken: (tokenCookie, tokenJson) => {
		return (typeof tokenCookie == 'undefined' ? (typeof tokenJson == 'undefined' ? undefined : tokenJson) : tokenCookie)
	},

	insert: (data) => {
		let pipeline = redis.pipeline()
		let expiresAt = 60 * 15
		pipeline.set(data.accessToken, data.pseudo)
		pipeline.expire(data.accessToken, expiresAt)
		console.log("---\nNouvelle session\n- token : "+data.accessToken+"\n- Pour l'ID : "+data.pseudo+"\n- Expire dans "+expiresAt+"s.\n---")
		return pipeline.exec()
	},

	get: (token) => {
		return redis.get(token)
	},

	delete: (token) => {
		return redis.del(token)
	},

	// get: (token) => {
	// 		let pipeline = redis.pipeline()
	// 			//On prend la liste de sessionId
	// 		redis.smembers("sessions")
	// 			.then((res) => {
	// 				//On récup toutes les données de toutes les sessions
	// 				for (i = 0; i < res.length; i++) {
	// 					pipeline.hgetall(`session:${res[i]}`)
	// 				}
	// 				return pipeline.exec()
	// 			}).then((res) => {
	// 				//Si le user n'a pas de token..
	// 				if (typeof token == 'undefined') {
	// 					//..On retourne une erreur
	// 					console.log("Pas de token")
	// 					Promise.resolve(false)
	// 				}
	// 				//Pour chaque session..
	// 				for (i = 0; i < res.length; i++) {
	// 					//..On check s'il existe un token correspondant au token du user
	// 					if (res[i][1].accessToken == token) {
	// 						let session = res[i][1]
	// 							//Par contre, si ce token est expiré..
	// 						if (session.expiresAt < Date.now()) {
	// 							//.. On supprime le token de la db
	// 							redis.del(`session:${res[i][0]}`)
	// 							redis.hdel("sessions", res[i][0])
	// 							console.log("Token expiré")
	// 							Promise.resolve(false)
	// 								//Sinon, on renvoie les données de la session correspondante au token
	// 						} else {
	// 							console.log("Session trouvée : ", session)
	// 							Promise.resolve(session)
	// 						}
	// 						//Si le token du user ne correspond à aucun token dans la db (bug, etc.)
	// 					} else if (res[i][1].accessToken == res[res.length][1].accessToken && res[i][1].accessToken != token) {
	// 						console.log("Pas de correspondance de token")
	// 						Promise.resolve(false)
	// 					}
	// 				}
	// 			})
	// 	})
	// },
}
