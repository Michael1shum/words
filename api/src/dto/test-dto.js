module.exports = class TestDTO {
    name;
    questions;

    constructor(model) {
        this.name = model.name;
        this.questions = model.questions.map(questionNumber => ({
            controlType: questionNumber.controlType,
            question: questionNumber.question,
            options: questionNumber.options,
            description: questionNumber.description
        }));
    }
};
