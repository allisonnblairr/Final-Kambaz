/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<any>({});
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();

  const reformatString = (isoString: any) => {
    if(!isoString) {
      return "TBD";
    }
    const date = new Date(isoString);
    const finalDate = `${date.toDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return finalDate;
  }

  useEffect(() => {
      const foundQuiz = quizzes.find((q: any) => q._id === qid);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      }
    }, [qid, quizzes]);
  
  return (
    <div className="quiz-details"> 
    { currentUser.role === "STUDENT" &&
      <><h1> {quiz.title} </h1><div className='d-flex justify-content-center align-items-center' style={{ marginTop: '20px' }}>
          {quiz.published ? (
            <Button
              variant="danger"
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Preview`)}
            >
              Start Quiz
            </Button>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${quiz._id}`}>
                  Cannot Start Quiz Until it is Published
                </Tooltip>
              }
            >
              <span className="d-inline-block">
                <Button
                  variant="danger"
                  style={{ pointerEvents: "none" }}
                  disabled
                >
                  Start Quiz
                </Button>
              </span>
            </OverlayTrigger>
          )}
        </div></>
    }
    { currentUser.role === "FACULTY" &&
      <><div className="quiz-details-buttons d-flex justify-content-center my-4">
          <Button
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Preview`)}
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
            <FaPencil className="ms-2"></FaPencil>
          </Button>
        </div>
        <div style={{
            border: "2px dashed gray",
            padding: "1rem",
            margin: "2rem",
          }}
        >
          <h1> {quiz.title} </h1>
          <div className="d-flex justify-content-center">
              <div className="quiz-details-list d-flex flex-column text-center my-4">
                <div><strong>Quiz Type:</strong> {quiz.quizType || 'Graded Quiz'}</div>
                <div><strong>Points:</strong> {quiz.points}</div>
                <div><strong>Assignment Group:</strong> {quiz.assignmentGroup || 'QUIZZES'} </div>
                <div><strong>Shuffle Answers:</strong> {quiz.shuffleAnswers === true ? 'Yes' : 'No'}</div>
                <div><strong>Time Limit:</strong> {quiz.timeLimitLength || '20'} Minutes</div>
                <div><strong>Multiple Attempts:</strong> {quiz.hasMultipleAttempts === true ? 'Yes' : 'No'}</div>
                <div><strong>Number of Attempts:</strong> {quiz.numAttempts || '1'}</div>
                <div><strong>Show Correct Answers:</strong> {quiz.showCorrectAnswers === true ? 'Yes' : 'No'}</div>
                { quiz.showCorrectAnswers === true &&
                  <div><strong>When to Show Correct Answers:</strong> After {quiz.whenToShowCorrectAnswers || '1'} Day(s)</div>
                }
                <div><strong>Access Code:</strong> {quiz.accessCode || 'None'}</div>
                <div><strong>One Question At a Time:</strong> {quiz.oneQuestionAtATime === true ? 'Yes' : 'No'}</div>
                <div><strong>Webcam Required:</strong> {quiz.webcamRequired === true ? 'Yes' : 'No'}</div>
                <div><strong>Lock Questions After Answering:</strong> {quiz.lockQuestionsAfterAnswering === true ? 'Yes' : 'No'}</div>
              </div>
          </div>
          <div className="date-table">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Due</th><th>For</th><th>Available from</th><th>Until</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{reformatString(quiz.due)}</td><td>Everyone</td><td>{reformatString(quiz.availableFrom)}</td><td>{reformatString(quiz.availableUntil)}</td>
                  </tr>
                </tbody>
              </Table>
          </div>
      </div></>
        
    }
  </div>

  );

}
