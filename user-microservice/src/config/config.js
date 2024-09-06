const dbSettings = {
    db: process.env.DB || 'news',
    user: process.env.DB_USER || 'quangnn',
    pass: process.env.DB_PASS || '123456',
    repl: process.env.DB_REPLS || 'rs0',
    servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : [
        '127.0.0.1:27018'
    ],
    dbParameters: () => ({
        w: 'majority',
        wtimeout: 10000,
        j: true,
        readPreference: 'secondaryPreferred',
        native_parser: false
    }),
    serverParameters: () => ({
        autoReconnect: true,
        poolSize: 10,
        socketoptions: {
            keepAlive: 300,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000
        }
    }),
    replsetParameters: (replset = 'rs0') => ({
        replicaSet: replset,
        ha: true,
        haInterval: 10000,
        poolSize: 10,
        socketoptions: {
            keepAlive: 300,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000
        }
    })
}
const serverSettings = {
    port: process.env.PORT || 3001,
    shakey : process.env.SHAKEY || 'hihihaha',
    version: 'v1',
}
const errorCode = {
    VALIDATE_ERR: 100,
    DB_ERR: 101,
    PERMISSION_DENIED: 102,
    ACCESS_TOKEN_DENIED: 103,
}
const serverHelper = () => {
    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt');

    const {shakey } = serverSettings

    async function encodePassword(password) {
        const saltRounds = 10;
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash
        } catch (err) {
            console.error('Error hashing password:', err);
            return null

        }
    }
    async function   validateToken(token) {
        try {
             await jwt.verify(token, shakey)
        } catch(ex) {
            return null
        }
    }

    function getUserToken(user) {
        return jwt.sign({user}, shakey, {expiresIn: '24h'})
    }

    return {encodePassword, validateToken, getUserToken}
}
module.exports = { dbSettings, serverHelper: serverHelper(), serverSettings, errorCode }
