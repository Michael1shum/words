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
    const hashPassword = await bcrypt.hash(password, 3);

    if (!user || (user && hashPassword !== user.password)) {
      throw ApiError.BadRequest(`Некорректный email или пароль`);
    }

    return {
      refreshToken: user.refreshToken,
    };
  }
}

module.exports = new UserService();
