/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<any>({});
  const { quizzes } = useSelector((state: any) => state.quizzesReducer); 
  const navigate = useNavigate();

  useEffect(() => {
      const foundQuiz = quizzes.find((q: any) => q._id === qid);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      }
    }, [qid, quizzes]);
  
  return (
    <div className="quiz-details"> 
    <h1> {quiz.title} </h1>
    <div className="quiz-details-buttons d-flex justify-content-center my-4">
      <Button
        className="btn btn-primary px-3 py-2 me-2"
        style={{
          backgroundColor: "lightgray",
          borderColor: "gray",
          color: "black",
        }}
      >
        Preview
      </Button>
      <Button
        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
        className="btn btn-primary px-3 py-2 me-2 gap-2"
        style={{
          backgroundColor: "lightgray",
          borderColor: "gray",
          color: "black",
        }}
      >
        Edit
        <FaPencil className="ms-2" ></FaPencil>
      </Button>
    </div>
    <div className="d-flex justify-content-center">
      <div className="quiz-details-list d-flex flex-column text-center my-4">
        <div><strong>Quiz Type:</strong> {quiz.type}</div>
        <div><strong>Points:</strong> {quiz.points}</div>
        <div><strong>Assignment Group:</strong> {quiz.assignmentGroup}</div>
        <div><strong>Shuffle Answers:</strong> {quiz.shuffleAnswers}</div>
        <div><strong>Time Limit:</strong> {quiz.timeLimit}</div>
        <div><strong>Multiple Attempts:</strong> {quiz.numAttempts}</div>
        <div><strong>Show Correct Answers:</strong> {quiz.showCorrectAnswers}</div>
        <div><strong>Access Code:</strong> {quiz.accessCode}</div>
        <div><strong>One Question At a Time:</strong> {quiz.oneQuestionAtATime}</div>
        <div><strong>Webcam Required:</strong> {quiz.webcamRequired}</div>
        <div><strong>Lock Questions After Answering:</strong> {quiz.lockQuestionsAfterAnswering}</div>
      </div>
    </div>
    <div className="date-table">
    <Table responsive>
      <thead>
          <tr>
            <th>Due</th><th>Available from</th><th>Until</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td>{quiz.due}</td><td>{quiz.availableFrom}</td><td>{quiz.availableUntil}</td>
          </tr>
      </tbody>
    </Table>
    </div>
  </div>
  );

}
