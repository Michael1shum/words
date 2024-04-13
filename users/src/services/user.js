const UserModel = require('../models/user-model');
const UserDTO = require('../dto/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
  async getAllUsers() {
    const users = await UserModel.find();
    console.log(users);
    return users.map(user => {
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
}

module.exports = new UserService();
