const { createProxyMiddleware } = require('http-proxy-middleware');
const TokenService = require('../services/token');
const authService = require('../services/auth');
const ApiError = require('../exceptions/api-error');
const { apiUrl, usersUrl } = require('../configuration/index');
const UserModel = require('../models/user-model');
const axios = require('axios');


module.exports.authMiddleware = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, role } = req.cookies;

    if (role) {
      const refreshTokenData = await TokenService.validateRefreshToken(refreshToken);
      if (!refreshTokenData) {
        await TokenService.removeTokens(refreshToken, accessToken);
        authService.deleteCookie(res);

        return next(ApiError.UnauthorizedError());
      }

      const user = await axios.get(`${usersUrl}/user/${refreshTokenData.id}`);
      if (role !== user.data.role) {
        await TokenService.removeTokens(refreshToken, accessToken);
        authService.deleteCookie(res);

        return next(ApiError.UnauthorizedError());
      }
    }
    /**
     * нет токенов
     */
    if (!accessToken && !refreshToken) {
      await TokenService.removeTokens(refreshToken, accessToken);
      authService.deleteCookie(res);

      return next(ApiError.UnauthorizedError());
    }

    /**
     * есть только рефреш
     */
    if (!accessToken && refreshToken) {
      const refreshTokenData = await TokenService.validateRefreshToken(refreshToken);
      /**
       * не валидный рефреш
       */
      if (!refreshTokenData) {
        await TokenService.removeTokens(refreshToken, accessToken);
        authService.deleteCookie(res);

        return next(ApiError.UnauthorizedError());
      }
      /**
       * валидный рефреш, но нет аксесса, перевыпускаем токены
       */
      const userData = await authService.refresh(refreshToken);
      await TokenService.setTokensInCookies(userData, res);

      return next();
    }

    const accessTokenData = await TokenService.validateAccessToken(accessToken);

    if (!accessTokenData) {
      /**
       * не валидный аксесс
       */
      if (refreshToken) {
        /**
         * не валидный аксесс, но есть рефреш
         */
        const refreshTokenData = await TokenService.validateRefreshToken(refreshToken);
        if (!refreshTokenData) {
          await TokenService.removeTokens(refreshToken, accessToken);
          authService.deleteCookie(res);

          /**
           * не валидные и аксесс и рефреш
           */
          return next(ApiError.UnauthorizedError());
        }
        const userData = await authService.refresh(refreshToken);
        await TokenService.setTokensInCookies(userData, res);

        return next();
      }

      await TokenService.removeTokens(refreshToken, accessToken);
      authService.deleteCookie(res);
      /**
       * не валидный аксесс и нет рефреша
       */
      return next(ApiError.UnauthorizedError());
    }
    /**
     * валидный аксесс. Дописываем роль в куки
     */
    if (refreshToken && accessTokenData) {
      const tokenData = await TokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);
      if (tokenData && tokenFromDb) {
        const user = await UserModel.findById(tokenData.id);
        res.cookie('role', user.role ?? 'user', { maxAge: 15 * 60 * 1000, httpOnly: true });
        req.headers['X-id'] = user._id;
      }
    }
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};

module.exports.apiProxy = createProxyMiddleware({
  target: '',
  changeOrigin: true,
  router: function(req) {
    switch (req.headers.path) {
      case 'users': {
        return usersUrl;
      }

      default:
        return apiUrl;
    }
    return apiUrl;
  },
});