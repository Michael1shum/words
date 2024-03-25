const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./mail');
const TokenService = require('./token');
const UserDTO = require('../dto/user-dto');
const { appUrl } = require('../configuration/index');
const ApiError = require('../exceptions/api-error');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {

      throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует!`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({ email, password: hashPassword, activationLink });
    await MailService.sendActivationMail(email, `${appUrl}/api/activate/${activationLink}`);

    const userDto = new UserDTO(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

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

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    await TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const tokenData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = TokenService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(tokenData.id);
    const userDto = new UserDTO(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users.map(user => {
      const userDTO = new UserDTO(user);
      return { ...userDTO };
    });
  }
}

module.exports = new UserService();
