/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from "react-bootstrap";
import {useParams} from "react-router-dom";
import QuestionEditor from "./QuestionEditor.tsx";
import {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import {
  addQuestion,
  deleteQuestion,
  updateQuestion
} from "./questionsreducer";

export default function Questions({handleCancel}: { handleCancel: () => void }) {
  const {qid} = useParams();
  const dispatch = useDispatch();

  const allQuizQuestions = useSelector((state: any) => state.quizQuestionsReducer.quizquestions);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (qid) {
      const filteredQuestions = allQuizQuestions.filter(
        (question: any) => question.quizId === qid
      );
      setQuizQuestions(filteredQuestions);
    }
  }, [qid, allQuizQuestions]);

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
      points: 1
    };

    dispatch(addQuestion(newQuestion));
    setEditingQuestionId(newQuestion._id);
  };

  const handleSaveQuestion = (updatedQuestion: any) => {
    dispatch(updateQuestion(updatedQuestion));
    handleClose();
  };

  const handleDeleteQuestion = (questionId: string) => {
    dispatch(deleteQuestion(questionId));
  };

  const handleSaveAll = () => {
    console.log("All questions saved");
    handleCancel();
  };

  return (
    <div>
      <div className="text-center">
        <br/>
        <Button
          className="btn btn-secondary px-3 py-2"
          onClick={handleAddNewQuestion}
        >
          + New Question
        </Button>
        <br/>
        <hr/>
      </div>

      {quizQuestions.map((question: any) => (
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
          <hr/>
          {editingQuestionId === question._id && (
            <QuestionEditor
              question={question}
              show={true}
              handleClose={handleClose}
              onSave={handleSaveQuestion}
            />
          )}
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