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
import { useNavigate } from "react-router-dom";
import { setQuizzes, deleteQuiz, updateQuiz } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";

export default function Quizzes() {
  const { cid } = useParams();
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(
    null
  );
  const [contextMenuValue, setContextMenuValue] = useState("select-an-option");
  const navigate = useNavigate();
  const {quizzes} = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state: any) => state.accountReducer);

  const fetchQuizzes = async () => {
    let quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    if (currentUser.role === "STUDENT") {
      quizzes = quizzes.filter((quiz: any) => quiz.published);
    }
    dispatch(setQuizzes(quizzes));
  };
  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const removeQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const updatePublishStatus = async (quiz: any) => {
    const updatedQuiz = {
      ...quiz,
      published: !quiz.published,
    };
    await quizzesClient.updateQuiz(updatedQuiz);
    dispatch(updateQuiz(updatedQuiz));
  };

  const handleContextMenuOptionChange = (quiz: any, newMenuOption: string) => {
    setContextMenuValue(newMenuOption);
    if (newMenuOption === "edit") {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Details`);
    }
    if (newMenuOption === "publish" || newMenuOption === "unpublish") {
      updatePublishStatus(quiz);
    }
    if (newMenuOption === "delete") {
      removeQuiz(quiz._id);
    }
  };

  return (
    <div id="wd-quizzes">
      <QuizMenu />
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
                      <br />
                      {!quiz.availableFrom && quiz.availableUntil && (
                        <b>Available From Date TBD</b>
                      )}{" "}
                      {!quiz.availableUntil && quiz.availableFrom && (
                        <b>Available Until Date TBD</b>
                      )}{" "}
                      {!quiz.availableFrom && !quiz.availableUntil && (
                        <b>Available From and Available Until Dates TBD</b>
                      )}{" "}
                      {quiz.availableFrom &&
                        quiz.availableUntil &&
                        new Date() > new Date(quiz.availableUntil) && (
                          <b>Closed</b>
                        )}{" "}
                      {quiz.availableFrom &&
                        quiz.availableUntil &&
                        new Date() >= new Date(quiz.availableFrom) &&
                        new Date() <= new Date(quiz.availableUntil) && (
                          <b>Available</b>
                        )}{" "}
                      {quiz.availableFrom &&
                        quiz.availableUntil &&
                        new Date() < new Date(quiz.availableFrom) && (
                          <>
                            <b>Not available until</b>{" "}
                            {new Date(quiz.availableFrom)
                              .toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .replace(",", "")}{" "}
                          </>
                        )}{" "}
                      | <b>Due</b>{" "}
                      {quiz.due
                        ? new Date(quiz.due)
                            .toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .replace(",", "")
                        : "TBD"}{" "}
                      | {quiz.points} pts |{" "}
                      {quiz.questions?.length > 0 ? quiz.questions.length : "0"}{" "}
                      questions | <b>Score:</b> 100
                    </div>
                  </div>
                  <div className="float-end">
                    <Button
                      disabled={currentUser.role === "STUDENT"}
                      className="btn-sm bg-white border-0"
                      onClick={() => updatePublishStatus(quiz)}
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5"/>
                      ) : (
                        <RxCircleBackslash className="text-danger fs-5"/>
                      )}
                    </Button>
                    <Button
                      disabled={currentUser.role === "STUDENT"}
                      className="btn-sm"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "0px",
                      }}
                      onClick={() =>
                        setOpenContextMenuId(
                          openContextMenuId === quiz._id ? null : quiz._id
                        )
                      }
                    >
                      <IoEllipsisVertical className="fs-5"/>
                    </Button>
                    {openContextMenuId === quiz._id && (
                      <FormSelect
                        className="mt-3"
                        value={contextMenuValue}
                        onChange={(e) =>
                          handleContextMenuOptionChange(quiz, e.target.value)
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
