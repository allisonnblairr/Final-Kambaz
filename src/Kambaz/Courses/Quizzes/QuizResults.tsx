/* eslint-disable @typescript-eslint/no-explicit-any */
import * as questionsClient from "./clientQuestion";
import * as quizzesClient from "./client";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateQuiz } from "./reducer";

export default function QuizResults() {
  const {cid, qid} = useParams();
  const [answerCorrectness, setAnswerCorrectness] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [possiblePoints, setPossiblePoints] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state: any) => state.accountReducer);
  const {quizzes} = useSelector((state: any) => state.quizzesReducer);
  const [quiz, setQuiz] = useState<any>({});

  const checkAnswers = async (questionsList: any[]) => {
    if (!questionsList.length) return;

    const correctnessArray = [];

    for (const question of questionsList) {
      let correct;
      try {
        const givenAnswersForQuestion = await questionsClient.findGivenAnswersForQuestion(question._id);

        if (!givenAnswersForQuestion || givenAnswersForQuestion.length === 0) {
          correct = false;
        } else if (question.questionType === "FILL_BLANK") {
          const possibleAnswersForQuestions = question.answers.map((answer: any) => answer.answerContent);
          correct = possibleAnswersForQuestions.some((answerContent: string) =>
            answerContent.toLowerCase().trim() === givenAnswersForQuestion[0].answerContent.toLowerCase().trim());
        } else {
          const selectedPossibleAnswer = question.answers.find((answer: any) =>
            givenAnswersForQuestion[0].answerContent === answer._id);
          correct = selectedPossibleAnswer?.isCorrect || false;
        }
      } catch (error) {
        console.error("Error checking answer for question:", question._id, error);
        correct = false;
      }

      correctnessArray.push({...question, correct});
    }

    setAnswerCorrectness(correctnessArray);
    calculatePoints(correctnessArray);
  };

  const fetchResults = async () => {
    try {
      const fetchedQuestions = await quizzesClient.findQuestionsForQuiz(qid as string);
      await checkAnswers(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  useEffect(() => {
    const foundQuiz = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) setQuiz(foundQuiz);
  }, [qid, quizzes]);

  const calculatePoints = (answers: any[]) => {
    let points = 0;
    let possiblePoints = 0;
    for (const answer of answers) {
      const pointsOfQuestion = answer.points || 0;
      possiblePoints += pointsOfQuestion;
      if (answer.correct === true) {
        points += pointsOfQuestion;
      }
    }
    setTotalPoints(points);
    setPossiblePoints(possiblePoints);
    return points;
  };

  const handleLeavePage = async () => {
    let calculatedPoints;
    if (possiblePoints > 0) {
      calculatedPoints = (totalPoints / possiblePoints) * 100 ;
    } else {
      calculatedPoints = 0;
    }
    if (currentUser.role === 'STUDENT') {
      const updatedQuiz = {...quiz, score: calculatedPoints};
      await quizzesClient.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } else {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  };

  const getScorePercentage = () => {
    if (possiblePoints === 0) return "0";
    return `${((totalPoints / possiblePoints) * 100).toFixed(2)}%`;
  };
  

  return (
    <div className="quiz-results-container">
      <h2>Quiz Results for {quiz.title} </h2>
      <p><strong>Score:</strong> {getScorePercentage()}</p>
      <p><strong>Total Points:</strong> {totalPoints}</p>

      <div className="answers-list">
        {
          answerCorrectness.map((answer: any) => (
            <div key={answer._id} className={`answer-item ${answer.correct ? 'correct' : 'incorrect'}`}>
              <p>{answer.content}</p>
              <p>
                {answer.correct ? "✓ Correct" : "✗ Incorrect"}
              </p>
            </div>
          ))
        }
      </div>

      <div className='d-flex justify-content-center align-items-center'>
        <Button variant="danger" onClick={handleLeavePage}>
          Return to Quiz Page
        </Button>
      </div>

    </div>
  );
}