const ApiError = require('../exceptions/api-error')
const TokenService = require('../services/token')

module.exports = function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const tokenData = TokenService.validateAccessToken(accessToken)
    next()
    if (!tokenData) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = tokenData
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}