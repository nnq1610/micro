module.exports = (mongoClient, {serverHelper}) => {
    const {encodedPassword} = serverHelper

    function createIndex() {
        mongoClient.collection('users').createIndex('username', { unique: true })
        mongoClient.createCollection('users', {strict: true}, (err, res) => {
            if (err) {
                return console.log(err)
            }
            mongoClient.collection('users').createIndex('username', {unique: true})
        })
    }

    createIndex()
    const addUser = (user) => {
        const {username, password} = user
        const encodedPass = encodedPassword(password)

        return new Promise((resolve, reject) => {
            mongoClient.collection('users').insertOne({username, name, isAdmin, encodedPass, createTime}, (err, data) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    const {result, ops} = data
                    if(result.ok) {
                        resolve(ops)
                    } else {
                        reject(new Error('Không thể thêm User'))
                    }
                }
            })
        })
    }

    const userLogin = (user) => {
        const {username} = user
        const password = encodedPassword(user.password)
        return new Promise((resolve, reject) => {
            mongoClient.collection('users').findOne({username, password}, {name: 1, username: 1}, (err, data) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    const {username, name, createTime, _id} = data
                    const user = {username, name, createTime, _id}

                    resolve(user)
                }
            })
        })
    }

    return {
        userLogin, addUser
    }
}