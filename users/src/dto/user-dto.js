module.exports = class UserDTO { //DTO - (Data transfer objecct) позволяет преобразовать типы данных из хранящихся в монго в json
  email;
  id;
  isActivated;
  role;
  testsAnswers;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.role = model.role;
    this.testsAnswers = model.testsAnswers;
  }
};
