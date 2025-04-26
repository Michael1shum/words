class TheoryDto {
  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.content = model.content;
    this.category = model.category;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}

module.exports = TheoryDto;
