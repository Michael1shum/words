const ApiError = require('../exceptions/api-error');
const axios = require('axios');
const { authApiUrl } = require('../configuration/index');


module.exports = async function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const tokenData = await axios.post(`${authApiUrl}/check-auth`, { accessToken });
    if (tokenData.status !== 200) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = tokenData;
    next();

  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};