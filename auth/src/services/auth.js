const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./mail');
const TokenService = require('./token');
const UserDTO = require('../dto/user-dto');
const { appUrl } = require('../configuration/index');
const ApiError = require('../exceptions/api-error');

class AuthService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует!`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    //TODO добавить возможность добавить роль пользователю через админку
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
      role: 'user',
    });
    await MailService.sendActivationMail(email, `${appUrl}/auth/activate/${activationLink}`);

    const userDto = new UserDTO(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveTokens(userDto.id, tokens.refreshToken, tokens.accessToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    const isPassEquals = await bcrypt.compare(password, user?.password || '');

    if (!user) {
      throw ApiError.BadRequest(`Пользователя с таким email не существует`);
    }

    if (user && !isPassEquals) {
      throw ApiError.BadRequest(`Некорректный пароль`);
    }

    const userDto = new UserDTO(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveTokens(userDto.id, tokens.refreshToken, tokens.accessToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken, accessToken) {
    await TokenService.removeTokens(refreshToken, accessToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const tokenData = await TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = TokenService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(tokenData.id);
    const userDto = new UserDTO(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveTokens(userDto.id, tokens.refreshToken, tokens.accessToken);

    return { ...tokens, user: userDto };
  }

  deleteCookie(res) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.clearCookie('role');
  }
}

module.exports = new AuthService();
