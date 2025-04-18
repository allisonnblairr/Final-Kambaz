/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from "react-bootstrap";
import * as db from "../../Database";
import {useParams} from "react-router-dom";
import QuestionEditor from "./QuestionEditor.tsx";
import {useState} from "react";

export default function Questions({handleCancel}: { handleCancel: () => void }) {
  const {qid} = useParams();
  const quizquestions = db.quizquestions.filter((quizquestion) => quizquestion.quizId === qid);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <div className="text-center">
        <br></br>
        <Button
          className="btn btn-secondary px-3 py-2"
        >
          + New Question
        </Button>
        <br></br>
        <hr></hr>
      </div>
      {quizquestions?.map((question: any) => (
          <div key={question._id}>
            <div className="d-flex justify-content-between align-items-center">
              <p>Question Title: {question.title}</p>
              <Button
                onClick={handleShow}
                className="btn btn-danger px-3 py-2 text-white mb-2"
              >
                Edit
              </Button>
            </div>
            <p>Question Content: {question.content}</p>
            <p>Points: {question.points}</p>
            <hr></hr>
          </div>
        )
      )}
      <Button
        className="btn btn-secondary px-3 py-2 me-3"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        className="btn btn-danger px-3 py-2 text-white"
      >
        Save
      </Button>
      <QuestionEditor show={show} handleClose={handleClose}/>
    </div>
  )
    ;
}