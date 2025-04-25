/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {FaPencil} from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import * as quizzesClient from "./client";
import * as questionsClient from "./clientQuestion";
import {addQuizAttempt} from "./quizattemptreducer";

export default function QuizPreview() {
  const {cid, qid} = useParams();
  const [quiz, setQuiz] = useState<any>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const {currentUser} = useSelector((state: any) => state.accountReducer);
  const [questions, setQuestions] = useState<any[]>([]);
  const [possibleAnswers, setPossibleAnswers] = useState<any[]>([]);

  const {quizzes} = useSelector((state: any) => state.quizzesReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // this may change depending on logic we use for questions editor
  const fetchQuestions = async () => {
    const questions = await quizzesClient.findQuestionsForQuiz(qid as string);

    setPossibleAnswers(questions.flatMap((q: { answers: any }) => q.answers));
    setQuestions(questions);
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  useEffect(() => {
    const foundQuiz = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) setQuiz(foundQuiz);
  }, [qid, quizzes]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers({...userAnswers, [questionId]: answer});
  };

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentAnswers = possibleAnswers.filter(
    (a) => a.questionId === currentQuestion._id
  );

  const saveQuizAttempt = async () => {
    const givenAnswerIds = [];

    for (const [questionId, answer] of Object.entries(userAnswers)) {
      const newGivenAnswer = {
        answerContent: answer,
        questionId
      };

      const savedAnswer = await questionsClient.createGivenAnswerForQuestion(
        questionId,
        newGivenAnswer
      );
      givenAnswerIds.push(savedAnswer._id);
    }

    const newQuizAttempt = {
      userId: currentUser._id,
      quizId: qid,
      score: 100, // fix when doing scoring logic
      dateTaken: new Date(),
      answers: givenAnswerIds,
    };

    await quizzesClient.createQuizAttemptForQuiz(qid as string, newQuizAttempt);
    dispatch(addQuizAttempt(newQuizAttempt));

    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Results`);
  };

  return (
    <div>
      <h1>{quiz.title}</h1>
      <div style={{color: "grey"}}>Started {new Date().toLocaleString()}</div>
      <h4>{quiz.instructions}</h4>
      <hr/>

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
          <Button className="btn btn-danger" onClick={saveQuizAttempt}>
            Submit Quiz
          </Button>
        )}
      </div>

      {/* an attempt to display results, however this is not linked to anything so will not work{*/}
      {/* will try to create a new page and pass stuff there {*/}
      {/*  displayCorrectness && (*/}
      {/*    <div>*/}
      {/*      {answerCorrectness.map((answerPair: any) => (*/}
      {/*              <div>*/}
      {/*          <p>{answerPair[0].content}</p>*/}
      {/*          <p>{answerPair[1]}</p>*/}
      {/*              </div>*/}
      {/*      ))*/}
      {/*      }*/}
      {/*  </div>*/}
      {/*  )*/}
      {/*}*/}


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
            <FaPencil className="me-3"/>
            Keep Editing this Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
