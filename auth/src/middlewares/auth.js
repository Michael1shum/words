const { createProxyMiddleware } = require('http-proxy-middleware');
const TokenService = require('../services/token');
const userService = require('../services/user');
const ApiError = require('../exceptions/api-error');
const { apiUrl, usersUrl } = require('../configuration/index');
const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');


module.exports.authMiddleware = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    /**
     * нет токенов
     */
    if (!accessToken && !refreshToken) {
      return next(ApiError.UnauthorizedError());
    }

    /**
     * есть только рефреш
     */
    if (!accessToken && refreshToken) {
      const refreshTokenData = TokenService.validateRefreshToken(refreshToken);
      /**
       * не валидный рефреш
       */
      if (!refreshTokenData) {
        return next(ApiError.UnauthorizedError());
      }
      /**
       * валидный рефреш, но нет аксесса, перевыпускаем токены
       */
      const userData = await userService.refresh(refreshToken);
      await TokenService.setTokensInCookies(userData, res);

      return next();
    }

    const accessTokenData = TokenService.validateAccessToken(accessToken);
    if (!accessTokenData) {
      /**
       * не валидный аксесс
       */
      if (refreshToken) {
        /**
         * не валидный аксесс, но есть рефреш
         */
        const refreshTokenData = TokenService.validateRefreshToken(refreshToken);
        if (!refreshTokenData) {
          /**
           * не валидные и аксесс и рефреш
           */
          return next(ApiError.UnauthorizedError());
        }
        const userData = await userService.refresh(refreshToken);
        await TokenService.setTokensInCookies(userData, res);

        return next();
      }
      /**
       * не валидный аксесс и нет рефреша
       */
      return next(ApiError.UnauthorizedError());
    }
    /**
     * валидный аксесс. Дописываем роль в заголовки для сервиса api
     */
    if (refreshToken && accessTokenData) {
      const tokenData = TokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);
      if (tokenData && tokenFromDb) {
        const user = await UserModel.findById(tokenData.id);
        const hashedRole = await bcrypt.hash(user.role, 3);

        res.cookie('role', hashedRole, { maxAge: 15 * 60 * 1000, httpOnly: true });
      }
    }
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};

module.exports.apiProxy = createProxyMiddleware({
  target: '', // Пустой target для избежания ошибки
  changeOrigin: true,
  router: function(req) {
    switch (req.headers.path) {
      case 'users': {
        console.log('ttttttttt')
        return usersUrl;
      }

      default:
        return apiUrl;
    }
    return apiUrl; // Здесь должен быть ваш логика определения apiUrl на основе req
  },
});