/* eslint-disable @typescript-eslint/no-explicit-any */
import QuizMenu from "./Menu.tsx";
import {IoMdArrowDropdown} from "react-icons/io";
import {Link, useParams} from "react-router-dom";
import {HiOutlineRocketLaunch} from "react-icons/hi2";
import {FaCheckCircle} from "react-icons/fa";
import {RxCircleBackslash} from "react-icons/rx";
import {IoEllipsisVertical} from "react-icons/io5";
import Button from "react-bootstrap/esm/Button";
import {useEffect, useState} from "react";
import FormSelect from "react-bootstrap/esm/FormSelect";
import {useNavigate} from "react-router-dom";
import {deleteQuiz, updateQuiz} from "./reducer";
import {useSelector, useDispatch} from "react-redux";

export default function Quizzes() {
  const {cid} = useParams();
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const [contextMenuValue, setContextMenuValue] = useState("select-an-option");
  const navigate = useNavigate();
  const {quizzes} = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state: any) => state.accountReducer);

  const handlePublishStatusChange = (id: string) => {
    const quizToUpdate = quizzes.find((q: any) => q._id === id);
    if (quizToUpdate) {
      const updatedQuiz = {...quizToUpdate, published: !quizToUpdate.published};
      dispatch(updateQuiz(updatedQuiz));
    }
  };

  const handleContextMenuOptionChange = (
    quizId: string,
    value: string
  ) => {
    setContextMenuValue(value);
    if (value === "edit") {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Details`);
    }
    if (value === "publish" || value === "unpublish") {
      handlePublishStatusChange(quizId);
    }
    if (value === "delete") {
      dispatch(deleteQuiz(quizId));
    }
  };

  useEffect(() => {
    // You can re-fetch quizzes here if needed
    // or rely on the updated Redux state
  }, [quizzes]);

  return (
    <div id="wd-quizzes">
      <QuizMenu/>
      <ul className="list-group rounded-0" id="wd-quizzes">
        <li className="wd-quiz list-group-item p-0 mb-5 fs-5 border-gray">
          <div
            className="wd-title p-3 ps-2 bg-secondary"
            style={{width: "auto"}}
          >
            <div>
              <IoMdArrowDropdown className="me-2 fs-3"/> QUIZZES
            </div>
          </div>
          {quizzes.length > 0 && (
            <ul className="wd-quizzes list-group rounded-0" id="wd-quiz-list">
              {quizzes.map((quiz: any) => (
                <li
                  key={quiz._id}
                  className="wd-quiz list-group-item p-3 ps-1 d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <HiOutlineRocketLaunch
                      className="text-success me-2 fs-3"
                      style={{marginLeft: "18px"}}
                    />
                    <div
                      className="quiz-details"
                      style={{marginLeft: "16px"}}
                    >
                      <Link
                        to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/details`}
                        style={{color: "black", textDecoration: "none"}}
                      >
                        <b>{quiz.title}</b>
                      </Link>
                      <br/>
                      <b>Not available until</b>{" "}
                      {quiz.availableFrom
                        ? new Date(quiz.availableFrom)
                          .toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", " at")
                        : ""}{" "}
                      | <b>Due</b>{" "}
                      {quiz.due
                        ? new Date(quiz.due)
                          .toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", " at")
                        : ""}{" "}
                      | {quiz.points} pts | {quiz.questions?.length > 0 ? quiz.questions.length : '0'} questions
                    </div>
                  </div>
                  <div className="float-end">
                    <Button
                      disabled={currentUser.role === 'STUDENT'}
                      className="btn-sm bg-white border-0"
                      onClick={() =>
                        handlePublishStatusChange(quiz._id)
                      }
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5"/>
                      ) : (
                        <RxCircleBackslash className="text-danger fs-5"/>
                      )}
                    </Button>
                    <Button
                      disabled={currentUser.role === 'STUDENT'}
                      className="btn-sm"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "0px",
                      }}
                      onClick={() => setOpenContextMenuId(
                        openContextMenuId === quiz._id ? null : quiz._id
                      )}
                    >
                      <IoEllipsisVertical className="fs-5"/>
                    </Button>
                    {openContextMenuId === quiz._id && (
                      <FormSelect
                        className="mt-3"
                        value={contextMenuValue}
                        onChange={(e) =>
                          handleContextMenuOptionChange(
                            quiz._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="select-an-option">
                          Select an Option
                        </option>
                        <option value="edit">Edit</option>
                        <option value="delete"> Delete</option>
                        <option
                          value={quiz.published ? "unpublish" : "publish"}
                        >
                          {quiz.published ? "Unpublish" : "Publish"}
                        </option>
                      </FormSelect>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

