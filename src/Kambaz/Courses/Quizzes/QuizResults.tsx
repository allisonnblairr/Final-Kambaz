/* eslint-disable @typescript-eslint/no-explicit-any */
import * as questionsClient from "./clientQuestion";
import * as quizzesClient from "./client";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function QuizResults() {
  const {qid} = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answerCorrectness, setAnswerCorrectness] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);


  const fetchResults = async () => {
    try {
      const fetchedQuestions = await quizzesClient.findQuestionsForQuiz(qid as string);
      setQuestions(fetchedQuestions);
      await checkAnswers(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  };

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

  const calculatePoints = (answers: any[]) => {
    let points = 0;
    for (const answer of answers) {
      const pointsOfQuestion = answer.points || 0;
      if (answer.correct === true) {
        points += pointsOfQuestion;
      }
    }
    setTotalPoints(points);
    return points;
  };

  return (
    <div className="quiz-results-container">
      <h2>Quiz Results</h2>
      <p>Total Points: {totalPoints}</p>

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
    </div>
  );
}