/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<any>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const navigate = useNavigate();

  const questions = [
    {
      _id: "q1",
      questionType: "MULTIPLE_CHOICE",
      quizId: "quiz123",
      title: "Which of the following is a Database?",
      content: "Choose the correct database.",
      points: 5,
      answers: ["a1", "a2", "a3", "a4"],
    },
    {
      _id: "q2",
      questionType: "TRUE_FALSE",
      quizId: "quiz123",
      title: "Learning HTML is fun!",
      content: "Select whether this is true or false.",
      points: 3,
      answers: ["a5", "a6"],
    },
    {
      _id: "q3",
      questionType: "FILL_BLANK",
      quizId: "quiz123",
      title: "Fill in the blank: We are using a server / ____ architecture.",
      content: "Write your answer in the blank space.",
      points: 4,
      answers: ["a7"],
    },
  ];

  const possibleAnswers = [
    { _id: "a1", answerContent: "MongoDB", questionId: "q1", isCorrect: true },
    { _id: "a2", answerContent: "React", questionId: "q1", isCorrect: false },
    { _id: "a3", answerContent: "NodeJs", questionId: "q1", isCorrect: false },
    {
      _id: "a4",
      answerContent: "TypeScript",
      questionId: "q1",
      isCorrect: false,
    },
    { _id: "a5", answerContent: "True", questionId: "q2", isCorrect: false },
    { _id: "a6", answerContent: "False", questionId: "q2", isCorrect: true },
    { _id: "a7", answerContent: "client", questionId: "q3", isCorrect: true },
  ];

  useEffect(() => {
    const foundQuiz = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) setQuiz(foundQuiz);
  }, [qid, quizzes]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswers = possibleAnswers.filter(
    (a) => a.questionId === currentQuestion._id
  );

  return (
    <div>
      <h1>{quiz.title}</h1>
      <div style={{ color: "grey" }}>Started {new Date().toLocaleString()}</div>
      <h4>{quiz.instructions}</h4>
      <hr />

      <div className="question-box-container">
        <div
          className="question-box"
          style={{
            border: "1px solid gray",
            padding: "1rem",
            margin: "2rem",
            borderRadius: "8px",
          }}
        >
          <div className="d-flex justify-content-between mb-4">
            <h4> Question {currentIndex + 1}</h4>
            <h5> {currentQuestion.points} points</h5>
          </div>
          <hr></hr>
          <h5>{currentQuestion.title}</h5>
          <p>{currentQuestion.content}</p>
          {currentQuestion.questionType === "FILL_BLANK" ? (
            <Form.Control
              type="text"
              value={userAnswers[currentQuestion._id] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion._id, e.target.value)
              }
            />
          ) : (
            currentAnswers.map((a) => (
              <Form.Check
                type="radio"
                key={a._id}
                name={currentQuestion._id}
                label={a.answerContent}
                checked={userAnswers[currentQuestion._id] === a._id}
                onChange={() => handleAnswerChange(currentQuestion._id, a._id)}
              />
            ))
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center mb-4 gap-2">
        <Button
          className="btn btn-primary"
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          style={{
            backgroundColor: "lightgray",
            borderColor: "gray",
            color: "black",
          }}
        >
          Back
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button
            className="btn btn-primary"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            style={{
              backgroundColor: "lightgray",
              borderColor: "gray",
              color: "black",
            }}
          >
            Next
          </Button>
        ) : (
          <Button className="btn btn-danger">Submit Quiz</Button>
        )}
      </div>

      {currentUser.role === "FACULTY" && (
        <div className="quiz-details-buttons d-flex justify-content-center my-4">
          <Button
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
            className="btn btn-primary px-3 py-2 me-2"
            style={{
              backgroundColor: "lightgray",
              borderColor: "gray",
              color: "black",
            }}
          >
            <FaPencil className="me-3" />
            Keep Editing this Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
