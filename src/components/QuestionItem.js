import React from "react";

function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  const handleAnswerChange = (e) => {
    onUpdateQuestion(id, e.target.value);
  };

  const handleDelete = () => {
    onDeleteQuestion(id);
  };

  return (
    <li>
      <h4>Question {id}</h4>
      <h3>Prompt: {prompt}</h3>
      <label>
        Correct Answer:
        <select
          value={correctIndex.toString()}
          onChange={handleAnswerChange}
          data-testid="correct-answer-dropdown"
        >
          {answers.map((answer, index) => (
            <option key={index} value={index.toString()}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button 
        onClick={handleDelete}
        data-testid="delete-button" 
      >
        Delete Question
      </button>
    </li>
  );
}


export default QuestionItem;