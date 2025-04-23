/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import QuestionEditor from "./QuestionEditor.tsx";
import {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import { updateQuiz } from "./reducer";
import {
  addQuestion,
  deleteQuestion,
  setQuestions,
  updateQuestion
} from "./questionsreducer";
import * as quizzesClient from "./client";
import * as questionsClient from "./clientQuestion.ts"

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
    const questions = await quizzesClient.findQuestionsForQuiz(qid as string);
  
    for (const question of questions) {
      const resolvedAnswers = await Promise.all(
        question.answers.map(async (answerId : string) => {
          const answer = await questionsClient.findPossibleAnswerForQuestionById(qid as string, answerId as string);
          return answer;
        })
      );
      question.answers = resolvedAnswers;
    }
  
    dispatch(setQuestions(questions));
  };
  

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  useEffect(() => {
    calculatePoints();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedQuestions]);

  const handleOpenEditor = (question?: any) => {
    setQuestionToEdit(question || {
      title: "",
      content: "",
      questionType: "MULTIPLE_CHOICE",
      points: 1,
      answers: [
        { _id: uuidv4(), answerContent: "", isCorrect: false },
        { _id: uuidv4(), answerContent: "", isCorrect: false },
        { _id: uuidv4(), answerContent: "", isCorrect: false },
        { _id: uuidv4(), answerContent: "", isCorrect: true },
      ]
    });
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setQuestionToEdit(null);
  };

  const handleSaveQuestion = (updatedQuestion: any) => {
    if (updatedQuestion._id) {
      setChangedQuestions(prev =>
        prev.map(q => q._id === updatedQuestion._id ? updatedQuestion : q)
      );
    } else {
      const tempId = uuidv4();
      const newAnswers = (updatedQuestion.answers || []).map((a: any) => ({
        ...a,
        _id: uuidv4()
      }));
      const newQuestion = {
        _id: tempId,
        quizId: qid,
        ...updatedQuestion,
        answers: newAnswers
      };
      setChangedQuestions(prev => [...prev, newQuestion]);
    }
    handleCloseEditor();
  };

  const handleDeleteQuestion = (questionId: string) => {
    setChangedQuestions(prev => prev.filter(q => q._id !== questionId));
  };

  const handleSaveAll = async () => {
    const questions = allQuizQuestions.filter((q: any) => q.quizId === qid);
  
    for (const q of questions) {
      if (!changedQuestions.some((localQ: any) => localQ._id === q._id)) {
        await questionsClient.deleteQuestion(q._id as string);
        dispatch(deleteQuestion(q._id));
      }
    }
  
    const savedQuestionIds = [];
  
    for (const localQ of changedQuestions) {
      const exists = allQuizQuestions.find((q: any) => q._id === localQ._id);
      let savedQuestion: { _id: string; };
  
      if (!exists) {
        const newAnswers = await Promise.all(
          localQ.answers.map(async (answer: any) => {
            const savedAnswer = await questionsClient.createPossibleAnswerForQuestion(savedQuestion._id, {
              ...answer,
              _id: uuidv4()
            });
            return savedAnswer._id;
          })
        );
  
        savedQuestion = await quizzesClient.createQuestionForQuiz(qid as string, { ...localQ, answers: newAnswers });
        dispatch(addQuestion(savedQuestion));
      } else {
        savedQuestion = await questionsClient.updateQuestion(localQ);
        dispatch(updateQuestion(savedQuestion));
      }
  
      savedQuestionIds.push(savedQuestion._id);
    }
  
    const currentQuiz = quizzes.find((quiz: any) => quiz._id === qid);
    if (currentQuiz) {
      await quizzesClient.updateQuiz({
        ...currentQuiz,
        points: quizPoints.toString(),
        questions: savedQuestionIds
      });
      dispatch(updateQuiz({
        ...currentQuiz,
        points: quizPoints.toString(),
        questions: savedQuestionIds
      }));
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
