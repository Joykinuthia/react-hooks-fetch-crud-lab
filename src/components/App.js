import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  // GET all questions on initial render
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  // POST a new question
  const handleAddQuestion = (newQuestion) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: newQuestion.prompt,
        answers: newQuestion.answers,
        correctIndex: parseInt(newQuestion.correctIndex),
      }),
    })
      .then((r) => r.json())
      .then((newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setPage("List"); // Switch back to list view
      });
  };

  // DELETE a question
  const handleDeleteQuestion = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setQuestions(questions.filter((q) => q.id !== id));
      })
      .catch((error) => console.error("Error deleting question:", error));
  };

  // PATCH (update) a question's correct answer
  const handleUpdateQuestion = (id, newCorrectIndex) => {
    const correctIndex = Number(newCorrectIndex); // Convert to number
    
    // Optimistic UI update
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, correctIndex } : q
    ));
  
    // Server update
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex }),
    })
      .then(r => r.json())
      .catch(error => {
        console.error("Update failed:", error);
        // Revert if server update fails
        setQuestions(questions);
      });
  };
  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
