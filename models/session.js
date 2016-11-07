const db = require('sqlite')

module.exports = {
	getFromToken: (token) => {
		return db.get("SELECT * FROM sessions WHERE accessToken = ?", token)
	},
	deleteFromToken: (token) => {
		return db.run("DELETE FROM sessions WHERE accessToken = ?", token)
	},
	checkAccess: (token) => {
		return new Promise(function(resolve, err) {
			db.get("SELECT * FROM sessions WHERE accessToken = ?", token)
				.then((res) => {
					if (typeof res == 'undefined') {
						resolve(false)
					} else {
						if (res.expiresAt < Date.now()) {
							resolve(false)
						} else {
							resolve(res)
						}
          }
				})
		})
	},
	checkAccessOfTodo: (checkVars) => {
		return new Promise(function(resolve, err) {
			Promise.all([
				db.get("SELECT userId FROM sessions WHERE accessToken = ?", checkVars[0]),
				db.get("SELECT userId FROM todos WHERE todoId = ?", checkVars[1])
			]).then((userIds) => {
				if (userIds[0].userId == userIds[1].userId) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}
}
