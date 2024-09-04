const dockerSettings = {
    socketPath: process.env.Path
}
const serverSettings = {
    port: process.env.PORT || 3000,
    shakey : process.env.SHAKEY || 'quangdepzaivcl'
}
const serverHelper = () => {
    const jwt = require('jsonwebtoken')
    const {shakey} = serverSettings
    function validateToken(token) {
        try {
            return jwt.verify(token, shakey)
        } catch(ex) {
            return null
        }
    }

    return {validateToken}
}

module.exports = {
    serverSettings, dockerSettings, serverHelper: serverHelper()
}