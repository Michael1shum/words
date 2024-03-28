const { createProxyMiddleware } = require('http-proxy-middleware');
const TokenService = require('../services/token');
const userService = require('../services/user');
const ApiError = require('../exceptions/api-error');
const { apiUrl } = require('../configuration/index');
const tokenModel = require('../models/token-model');
const userModel = require('../models/user-model');
const UserModel = require('../models/user-model');


module.exports.authMiddleware = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

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
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 10 * 1000, httpOnly: true });
      res.cookie('accessToken', userData.accessToken, { maxAge: 10 * 1000, httpOnly: true });
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
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
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
    if (refreshToken) {
      const tokenData = TokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);
      if (tokenData && tokenFromDb) {
        const user = await UserModel.findById(tokenData.id);
        req._role = user.role;
      }
    }
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};

module.exports.apiProxy = createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true,
  onProxyReq: async (proxyReq, req, res) => {
    proxyReq.setHeader('role', req._role);
  },
});