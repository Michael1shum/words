module.exports = class UserDTO {
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
