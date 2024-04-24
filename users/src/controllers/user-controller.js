const userService = require('../services/user');

class UserController {

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async postUserDataById(req, res, next) {
    try {
      const userData = await userService.postUserDataById(req.body);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

}

module.exports = new UserController();
