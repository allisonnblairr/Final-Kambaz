/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "react-bootstrap";
import * as db from "../../Database";
import { useParams } from "react-router-dom";
import QuestionEditor from "./QuestionEditor.tsx";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Questions({ handleCancel }: { handleCancel: () => void }) {
  const { qid } = useParams();
  const [quizquestions, setQuizquestions] = useState(
    db.quizquestions.filter((quizquestion) => quizquestion.quizId === qid)
  );
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleShow = (questionId: string) => setEditingQuestionId(questionId);
  const handleClose = () => setEditingQuestionId(null);

  const handleAddNewQuestion = () => {
    const newQuestion = {
      _id: uuidv4(),
      quizId: qid,
      title: "New Question",
      content: "",
      questionType: "MULTIPLE_CHOICE",
      points: 1,
      answers: [
        { answerContent: "Option 1", isCorrect: false },
        { answerContent: "Option 2", isCorrect: false },
        { answerContent: "Option 3", isCorrect: false },
        { answerContent: "Option 4", isCorrect: false }
      ]
    };

    setQuizquestions([...quizquestions, newQuestion]);

    db.quizquestions.push(newQuestion);

    setEditingQuestionId(newQuestion._id);
  };

  const handleSaveQuestion = (updatedQuestion: any) => {
    setQuizquestions(quizquestions.map(q =>
      q._id === updatedQuestion._id ? updatedQuestion : q
    ));

    const index = db.quizquestions.findIndex(q => q._id === updatedQuestion._id);
    if (index !== -1) {
      db.quizquestions[index] = updatedQuestion;
    }
  };

  const handleSaveAll = () => {
    console.log("All questions saved to database:", quizquestions);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuizquestions(quizquestions.filter(q => q._id !== questionId));
    const index = db.quizquestions.findIndex(q => q._id === questionId);
    if (index !== -1) {
      db.quizquestions.splice(index, 1);
    }
  };

  return (
    <div>
      <div className="text-center">
        <br />
        <Button
          className="btn btn-secondary px-3 py-2"
          onClick={handleAddNewQuestion}
        >
          + New Question
        </Button>
        <br />
        <hr />
      </div>
      {quizquestions?.map((question: any) => (
        <div key={question._id}>
          <div className="d-flex justify-content-between align-items-center">
            <p>Question: {question.title}</p>
            <div>
              <Button
                onClick={() => handleShow(question._id)}
                className="btn btn-danger px-3 py-2 text-white mb-2 me-2"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteQuestion(question._id)}
                className="btn btn-outline-danger px-3 py-2 mb-2"
                variant="outline-danger"
              >
                Delete
              </Button>
            </div>
          </div>
          <p>Content: {question.content}</p>
          <p>Type: {question.questionType}</p>
          <p>Points: {question.points}</p>
          <hr />
          <QuestionEditor
            question={question}
            show={editingQuestionId === question._id}
            handleClose={handleClose}
            onSave={handleSaveQuestion}
          />
        </div>
      ))}
      <div className="mt-3">
        <Button
          className="btn btn-secondary px-3 py-2 me-3"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className="btn btn-danger px-3 py-2 text-white"
          onClick={handleSaveAll}
        >
          Save All
        </Button>
      </div>
    </div>
  );
}