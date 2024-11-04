const authService = require('../services/auth');
const { clientUrl } = require('../configuration/index');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const TokenService = require('../services/token');

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req); //сбор ошибок при валидации?
      if (!errors.isEmpty()) { //Проверка на ошибки
        return next(ApiError.BadRequest('Ошибки при валидации', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await authService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
      return res.json(userData.user);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      await TokenService.setTokensInCookies(userData, res);

      return res.status(200).send('login success');
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken, accessToken } = req.cookies;
      await authService.logout(refreshToken, accessToken);
      authService.deleteCookie(res);
      res.status(200).send('logout success');
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await authService.activate(activationLink);
      return res.redirect(clientUrl);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
      return res.status(200).send('token refreshed');
    } catch (e) {
      next(e);
    }
  }

  async checkAuth(req, res, next) {
    try {
      const { accessToken } = req.body;
      const accessData = await TokenService.validateAccessToken(accessToken);

      if (!accessData) {
        return res.status(401).send('Токен не валидный');
      }
      return res.status(200).send('Токен валидный');
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new AuthController();
