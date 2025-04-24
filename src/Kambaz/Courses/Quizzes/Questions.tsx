/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import QuestionEditor from "./QuestionEditor.tsx";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setQuestions
} from "./questionsreducer";
import * as client from "./client.ts";

export default function Questions() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state: any) =>
    state.quizQuestionsReducer.quizquestions.filter((q: any) => q.quizId === qid)
  );
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);

  const [questionToEdit, setQuestionToEdit] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (qid) {
        setLoading(true);
        try {
          const fetchedQuestions = await client.findQuestionsForQuiz(qid);
          dispatch(setQuestions(fetchedQuestions));
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [qid, dispatch]);

  const calculatePoints = () => {
    const totalPoints = questions.reduce(
      (sum: number, q: any) => sum + (parseInt(q.points) || 0),
      0
    );
    return totalPoints;
  };

  const handleOpenEditor = (question?: any) => {
    setQuestionToEdit(question || {
      _id: `temp_${Date.now()}`,
      title: "",
      content: "",
      questionType: "MULTIPLE_CHOICE",
      points: 1,
      quizId: qid
    });
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setQuestionToEdit(null);
  };

  const handleSaveQuestion = (updatedQuestion: any) => {
    if (questions.some((q: any) => q._id === updatedQuestion._id)) {
      dispatch(updateQuestion(updatedQuestion));
    } else {
      dispatch(addQuestion(updatedQuestion));
    }
    handleCloseEditor();
  };

  const handleDeleteQuestion = (questionId: string) => {
    dispatch(deleteQuestion(questionId));
  };

  const handleSaveAll = async () => {
    if (qid) {
      try {
        const apiQuestions = await client.findQuestionsForQuiz(qid);

        for (const apiQ of apiQuestions) {
          if (!questions.some((reducerQ: any) => reducerQ._id === apiQ._id)) {
            await client.deleteQuestion(apiQ._id);
          }
        }

        const finalQuestionIds = [];

        for (const reducerQ of questions) {
          let questionId = reducerQ._id;

          if (reducerQ._id.startsWith('temp_')) {
            const newQuestion = await client.createQuestionForQuiz(qid, {
              title: reducerQ.title,
              questionType: reducerQ.questionType,
              content: reducerQ.content,
              points: reducerQ.points
            });

            questionId = newQuestion._id;

            if (reducerQ.answers && reducerQ.answers.length > 0) {
              for (const answer of reducerQ.answers) {
                await client.createPossibleAnswer(questionId, {
                  answerContent: answer.answerContent,
                  isCorrect: answer.isCorrect
                });
              }
            }
          } else {

            const existingAnswers = await client.findPossibleAnswersForQuestion(questionId);
            for (const answer of existingAnswers) {
              await client.deletePossibleAnswer(answer._id);
            }

            if (reducerQ.answers && reducerQ.answers.length > 0) {
              for (const answer of reducerQ.answers) {
                await client.createPossibleAnswer(questionId, {
                  answerContent: answer.answerContent,
                  isCorrect: answer.isCorrect
                });
              }
            }

            const possibleAnswers = [];

            await client.updateQuestion(questionId, {
              title: reducerQ.title,
              questionType: reducerQ.questionType,
              content: reducerQ.content,
              points: reducerQ.points
            });
          }

          finalQuestionIds.push(questionId);
        }

        const totalPoints = calculatePoints();

        const currentQuiz = quizzes.find((quiz: any) => quiz._id === qid);
        if (currentQuiz) {
          await client.updateQuiz({
            ...currentQuiz,
            points: totalPoints.toString(),
            questions: finalQuestionIds
          });
        }

        const refreshedQuestions = await client.findQuestionsForQuiz(qid);
        dispatch(setQuestions(refreshedQuestions));

        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } catch (error) {
        console.error("Error in handleSaveAll:", error);
      }
    }
  };

  const handleCancel = () => {
    window.location.reload();
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

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
        <h4>Total Quiz Points: {calculatePoints()}</h4>
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

      {questions.map((question: any) => (
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