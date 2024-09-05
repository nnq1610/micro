module.exports = (mongoClient, {serverHelper}) => {
    const {encodedPassword} = serverHelper

    function createIndex() {
        mongoClient.createCollection('users', (error, collection)=> {
            mongoClient.createCollection('users', (err) => {
                if (err) {
                    return console.log(err)
                }
                mongoClient.collection('users').createIndex('username', {unique: true})
            })
        })

    }

    createIndex()
    const addUser = (user) => {
        const { username, name, isAdmin, createTime } = user
        const encodedPass = encodedPassword(user.password)

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
                }
                else if (data) {
                        const { name, username, createTime, _id } = data
                        const user = { name, username, createTime, _id }
                        resolve(user)
                    } else {
                        reject(new Error('username or password doesn\'t match'))
                    }
                })
            })
        }
        return { userLogin, addUser }
    }