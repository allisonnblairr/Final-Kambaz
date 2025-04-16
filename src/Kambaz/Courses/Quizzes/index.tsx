import QuizMenu from "./Menu.tsx";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { RxCircleBackslash } from "react-icons/rx";
import { IoEllipsisVertical } from "react-icons/io5";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import FormSelect from "react-bootstrap/esm/FormSelect";
import { useNavigate } from "react-router-dom";

export default function Quizzes() {
  const { cid } = useParams();
  const quizzes = db.quizzes.filter((quiz) => quiz.course === cid);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuValue, setContextMenuValue] = useState("select-an-option");
  const navigate = useNavigate();

  const handlePublishStatusChange = (id: string, published: boolean) => {
    const publishedStatusChange = !published;
    db.quizzes.forEach((quiz, index) => {
      if (quiz._id === id) {
        db.quizzes[index] = { ...quiz, published: publishedStatusChange };
      }
    });
  };

  const handleContextMenuOptionChange = (
    quizId: string,
    published: boolean,
    value: string
  ) => {
    setContextMenuValue(value);
    if (value === "edit") {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Details`);
    }
    if (value === "delete") {
      const index = db.quizzes.findIndex((quiz) => quiz._id === quizId);
      db.quizzes.splice(index, 1);
    }
    if (value === "publish" || value === "unpublish") {
      handlePublishStatusChange(quizId, published);
    }
  };

  return (
    <div id="wd-quizzes">
      <QuizMenu />
      <ul className="list-group rounded-0" id="wd-quizzes">
        <li className="wd-quiz list-group-item p-0 mb-5 fs-5 border-gray">
          <div
            className="wd-title p-3 ps-2 bg-secondary"
            style={{ width: "auto" }}
          >
            <div>
              <IoMdArrowDropdown className="me-2 fs-3" /> QUIZZES
            </div>
          </div>
          {quizzes.length > 0 && (
            <ul className="wd-quizzes list-group rounded-0" id="wd-quiz-list">
              {quizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="wd-quiz list-group-item p-3 ps-1 d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <HiOutlineRocketLaunch
                      className="text-success me-2 fs-3"
                      style={{ marginLeft: "18px" }}
                    />
                    <div
                      className="quiz-details"
                      style={{ marginLeft: "16px" }}
                    >
                      <Link
                        to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <b>{quiz.title}</b>
                      </Link>
                      <br />
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
                      | {quiz.points} pts | {quiz.questions.length} questions |{" "}
                      <b>Score:</b> 100
                    </div>
                  </div>
                  <div className="float-end">
                    <Button
                      className="btn-sm bg-white border-0"
                      onClick={() =>
                        handlePublishStatusChange(quiz._id, quiz.published)
                      }
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5" />
                      ) : (
                        <RxCircleBackslash className="text-danger fs-5" />
                      )}
                    </Button>
                    <Button
                      className="btn-sm"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "0px",
                      }}
                      onClick={() => setContextMenuOpen(!contextMenuOpen)}
                    >
                      <IoEllipsisVertical className="fs-5" />
                    </Button>
                    {contextMenuOpen && (
                      <FormSelect
                        className="mt-3"
                        value={contextMenuValue}
                        onChange={(e) =>
                          handleContextMenuOptionChange(
                            quiz._id,
                            quiz.published,
                            e.target.value
                          )
                        }
                      >
                        <option value="select-an-option">
                          Select an Option
                        </option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
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
