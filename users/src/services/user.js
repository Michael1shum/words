const UserModel = require('../models/user-model');
const UserDTO = require('../dto/user-dto');

class UserService {
  async getAllUsers() {
    const users = await UserModel.find();
    console.log(users);
    return users.map(user => {
      const userDTO = new UserDTO(user);
      return { ...userDTO };
    });
  }
}

module.exports = new UserService();
