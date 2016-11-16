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
}
