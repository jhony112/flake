const passport = require('passport')
const httpStatus = require('http-status')
const ApiError = require('../utils/request/ApiError')
const { roleRights } = require('../config/roles')
const { TOKEN_TYPES } = require('../utils/security/token')

const setup = {
    [TOKEN_TYPES.USER]: {
        isUserValid: (user) => user && user.type === TOKEN_TYPES.USER,
        errorMsg: 'User authorization failed',
    },
    [TOKEN_TYPES.SERVICE]: {
        isUserValid: (user) => user && user.type === TOKEN_TYPES.SERVICE,
        errorMsg: 'Service authorization failed',
    },
    [TOKEN_TYPES.ADMIN]: {
        isUserValid: (user) => user && user.type === TOKEN_TYPES.ADMIN,
        errorMsg: 'Admin authorization failed',
    },
}

const setCredentials = (req, user, requiredRights) => (resolve, reject) => {
    req.user = user
    req.user.merchants = Object.keys(user.roles || {})
    global.__user = req.user

    if (requiredRights.length) {
        const userRights = roleRights.get(user.role)
        const hasRequiredRights = requiredRights.every((requiredRight) =>
            userRights.includes(requiredRight)
        )
        if (!hasRequiredRights && req.params.userId !== user.id) {
            return reject(
                new ApiError(httpStatus.FORBIDDEN, 'You have no rights here')
            )
        }
    }

    return resolve()
}

const auth =
    (type, ...requiredRights) =>
    async (req, res, next) => {
        const authData = setup[type]
        return new Promise((resolve, reject) => {
            if (req.app.locals.principalId) {
                const user = req.app.locals.principalId
                if (!authData.isUserValid(user)) {
                    return reject(
                        new ApiError(httpStatus.UNAUTHORIZED, authData.errorMsg)
                    )
                }

                return setCredentials(
                    req,
                    user,
                    requiredRights
                )(resolve, reject)
            }

            return passport.authenticate(
                'jwt',
                { session: false },
                async (err, user, info) => {
                    if (err || info || !authData.isUserValid(user)) {
                        let message = authData.errorMsg
                        if (err) message = err.message
                        if (info) message = info.message
                        return reject(
                            new ApiError(httpStatus.UNAUTHORIZED, message)
                        )
                    }

                    return setCredentials(
                        req,
                        user,
                        requiredRights
                    )(resolve, reject)
                }
            )(req, res, next)
        })
            .then(() => next())
            .catch((err) => next(err))
    }
module.exports = auth
