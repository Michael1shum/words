const TokenService = require('../services/token');


class AuthController {
  checkAuth(req, res, next) {
    try {
      const { accessToken } = req.body;
      const accessData = TokenService.validateAccessToken(accessToken);

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