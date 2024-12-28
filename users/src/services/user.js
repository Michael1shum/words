const UserModel = require('../models/user-model');
const UserDTO = require('../dto/user-dto');
const ApiError = require('../exceptions/api-error');

//Функции для работы с БД

class UserService {
  async getAllUsers() {
    const users = await UserModel.find();
    console.log(users);
    return users.map((user) => {
      const userDTO = new UserDTO(user);
      return { ...userDTO };
    });
  }

  async getUserById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw ApiError.BadRequest('Пользователя не существует');
    }
    const userDTO = new UserDTO(user);
    return { ...userDTO };
  }

  async postUserDataById(userData) {
    const user = await UserModel.findById(userData.id);
    const [[testId, correctAnswersPercent]] = Object.entries(userData.testsAnswers);
    user.testsAnswers[testId] = correctAnswersPercent;
    user.markModified('testsAnswers');
    await user.save();
  }
}

module.exports = new UserService();
