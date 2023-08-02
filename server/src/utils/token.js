const moment = require('moment')
const jwt = require('jsonwebtoken')
const { TOKEN_TYPES } = require('../types')

const generateToken = (
    data,
    expires,
    type,
    secret = process.env.JWT_SECRET
) => {
    const payload = {
        sub: data,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    }
    return jwt.sign(payload, secret)
}

const generateAuthTokens = async (data, roles = {}) => {
    const accessTokenExpires = moment().add(1, 'minutes')
    const accessToken = generateToken(
        { ...data, roles },
        accessTokenExpires,
        TOKEN_TYPES.ACCESS
    )

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
    }
}

const generateServiceAuthToken = async (roles = {}) => generateAuthTokens(
        { name: process.env.NAME || 'va_sqs', type: TOKEN_TYPES.SERVICE },
        roles
    )
module.exports = { generateServiceAuthToken }
