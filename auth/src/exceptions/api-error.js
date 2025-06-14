module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message); //Вызов родительского класса Error
    this.errors = errors;
    this.status = status;
  }

  static UnauthorizedError(message) {
    return new ApiError(401, message ? message :'Пользователь не авторизован');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};
