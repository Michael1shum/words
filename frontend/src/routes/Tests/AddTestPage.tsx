import React, { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  controlType: string;
  description: string;
  answer: string[]; // Добавляем ответ
}

export const AddTestPage = () => {
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', ''], controlType: 'checkbox', description: '', answer: ['',''] }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Обработчик добавления нового вопроса
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', ''], controlType: 'checkbox', description: '', answer: ['',''] }
    ]);
  };

  // Удалить вопрос
  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Обработчик изменения значений для конкретного вопроса
  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | string[]  // Допускаем как string, так и string[]
  ) => {
    const newQuestions = [...questions];

    if (field === 'options') {
      // Если меняем options, убедимся, что value - это массив строк
      newQuestions[index][field] = Array.isArray(value) ? value : [value];  // Преобразуем в массив строк, если это не массив
    } else if (field === 'answer') {
      // Обработаем ответ (он может быть строкой или массивом строк)
      newQuestions[index][field] = Array.isArray(value) ? value : [value];  // Преобразуем в массив строк, если это не массив
    } else {
      // Для остальных полей (например, question, description) просто присваиваем строку
      newQuestions[index][field] = value as string;
    }

    setQuestions(newQuestions);
  };



  // Обработчик изменения опций
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  // Добавить новую опцию
  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  // Удалить опцию
  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

// Обработчик изменения ответа
  const handleAnswerChange = (
    questionIndex: number,
    value: string | string[] // Допускаем как строку, так и массив строк
  ) => {
    const newQuestions = [...questions];

    if (Array.isArray(value)) {
      newQuestions[questionIndex].answer = value; // Если это массив строк, просто присваиваем
    } else {
      newQuestions[questionIndex].answer = [value]; // Если строка, преобразуем в массив
    }

    setQuestions(newQuestions);
  };



  // Обработчик отправки данных на сервер
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const testData = { name, questions };

    try {
      const response = await fetch('/api/tests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        throw new Error('Не удалось добавить тест');
      }

      const result = await response.json();
      console.log('New test added:', result);
      alert('Test added successfully!');
    } catch (error) {
      setError('Error adding test');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Test</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {questions.map((question, index) => (
          <div key={index}>
            <h3>Question {index + 1}</h3>
            <div>
              <label>Question</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                required
              />
            </div>

            <div>
              <label>Description</label>
              <input
                type="text"
                value={question.description}
                onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
              />
            </div>

            <div>
              <label>Type of question</label>
              <select
                value={question.controlType}
                onChange={(e) => handleQuestionChange(index, 'controlType', e.target.value)}
              >
                <option value="checkbox">Checkbox</option>
                <option value="input">Input</option>
                {/* Можно добавить другие типы вопросов */}
              </select>
            </div>

            <div>
              <label>Options</label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                  />
                  <button type="button" onClick={() => handleRemoveOption(index, optionIndex)}>
                    Remove Option
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddOption(index)}>
                Add Option
              </button>
            </div>

            {/* Возможность выбора ответа */}
            {question.controlType === "checkbox" && (
              <div>
                <label>Answer</label>
                <select
                  multiple
                  value={question.answer}
                  onChange={(e) => handleAnswerChange(index, Array.from(e.target.selectedOptions, option => option.value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Возможность удаления вопроса */}
            <button type="button" onClick={() => handleRemoveQuestion(index)}>
              Remove Question
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Test'}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

/*  return (
    <div>
      <h1>Add New Test</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {questions.map((question, index) => (
          <div key={index}>
            <h3>Question {index + 1}</h3>
            <div>
              <label>Question</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <input
                type="text"
                value={question.description}
                onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
              />
            </div>
            <div>
              <label>Options</label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label>Answer</label>
              <select
                value={question.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" onClick={() => handleAddQuestion()}>
              Add Question
            </button>
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Test'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

return (
  <div>
    <h1>Add New Test</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {questions.map((question, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>
          <div>
            <label>Question</label>
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <input
              type="text"
              value={question.description}
              onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
            />
          </div>

          <div>
            <label>Type of question</label>
            <select
              value={question.controlType}
              onChange={(e) => handleQuestionChange(index, 'controlType', e.target.value)}
            >
              <option value="checkbox">Checkbox</option>
              <option value="input">Input</option>
              {/!* Можно добавить другие типы вопросов *!/}
            </select>
          </div>

          <div>
            <label>Options</label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
                <button type="button" onClick={() => handleRemoveOption(index, optionIndex)}>
                  Remove Option
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddOption(index)}>
              Add Option
            </button>
          </div>

          {/!* Возможность удаления вопроса *!/}
          <button type="button" onClick={() => handleRemoveQuestion(index)}>
            Remove Question
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddQuestion}>
        Add Question
      </button>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Add Test'}
      </button>

      {error && <p>{error}</p>}
    </form>
  </div>
);
};*/
