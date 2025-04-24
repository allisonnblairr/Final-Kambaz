/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import QuestionEditor from "./QuestionEditor.tsx";
import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  addQuestion,
  deleteQuestion,
} from "./questionsreducer";
import {updateQuiz} from "./reducer";
import * as client from "./client.ts";

export default function Questions() {
  const {cid, qid} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allQuizQuestions = useSelector((state: any) => state.quizQuestionsReducer.quizquestions);
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);
  const [changedQuestions, setChangedQuestions] = useState<any[]>([]);
  const [questionToEdit, setQuestionToEdit] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [quizPoints, setQuizPoints] = useState(0);

  const fetchQuestions = async () => {
    if (qid) {
      const filteredQuestions = await client.findQuestionsForQuiz(qid);
      setChangedQuestions(filteredQuestions);
    }
  }

  useEffect(() => {
    fetchQuestions();
    calculatePoints();
  }, [qid, allQuizQuestions, changedQuestions]);

  const handleOpenEditor = (question?: any) => {
    setQuestionToEdit(question || {
      title: "",
      content: "",
      questionType: "MULTIPLE_CHOICE",
      points: 1
    });
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setQuestionToEdit(null);
  };

  const handleSaveQuestion = async (updatedQuestion: any) => {
    setChangedQuestions(prev =>
      prev.map(q => q._id === updatedQuestion._id ? updatedQuestion : q)
    );
    handleCloseEditor();
  };

  const handleDeleteQuestion = (questionId: string) => {
    setChangedQuestions(prev => prev.filter(q => q._id !== questionId));
  };

  const handleSaveAll = async () => {
    const questions = allQuizQuestions.filter((q: any) => q.quizId === qid);

    questions
      .filter((reduxQ: any) => !changedQuestions.some((localQ: any) => localQ._id === reduxQ._id))
      .forEach((q: any) => dispatch(deleteQuestion(q._id)));

    changedQuestions.forEach((localQ: any) => {
      dispatch(addQuestion(localQ));
    });

    const questionIds = changedQuestions.map(q => q._id);

    const currentQuiz = quizzes.find((quiz: any) => quiz._id === qid);
    if (currentQuiz) {
      dispatch(updateQuiz({
        ...currentQuiz,
        points: quizPoints.toString(),
        questions: questionIds
      }));
      await client.updateQuiz({
        ...currentQuiz,
        points: quizPoints.toString(),
        questions: questionIds
      });
    }

    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const calculatePoints = () => {
    const totalPoints = changedQuestions.reduce(
      (sum: number, q: any) => sum + (parseInt(q.points) || 0),
      0
    );
    setQuizPoints(totalPoints);
  };

  return (
    <div>
      <div className="text-center">
        <br/>
        <Button
          className="btn btn-secondary px-3 py-2"
          onClick={() => handleOpenEditor()}
        >
          + New Question
        </Button>
        <br/>
        <hr/>
        <h4>Total Quiz Points: {quizPoints}</h4>
        <hr/>
      </div>

      {showEditor && (
        <QuestionEditor
          question={questionToEdit}
          show={showEditor}
          handleClose={handleCloseEditor}
          onSave={handleSaveQuestion}
        />
      )}

      {changedQuestions.map((question: any) => (
        <div key={question._id}>
          <div className="d-flex justify-content-between align-items-center">
            <p>Question: {question.title}</p>
            <div>
              <Button
                onClick={() => handleOpenEditor(question)}
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