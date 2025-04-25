import {useSelector} from "react-redux";

export default function QuizResults() {

  // retrieve answerCorrectness from reducer
  const {quizCorrectness} = useSelector((state: any) => state.quizCorrectnessReducer);

  const calculatePoints = () => {
    let totalPoints = 0;
    for (const answer of quizCorrectness) {
      let pointsOfQuestion = answer.points;
      if (answer.correct === true) {
        totalPoints += pointsOfQuestion;
      }
    }
    return totalPoints;
  }

  return (
    <>
      <div>
           {quizCorrectness.map((answer: any) => (
                    <div>
                <p>{answer.content}</p>
                <p>{answer.correct}</p>
                    </div>
            ))
            }
      </div>
  </>
  );
}