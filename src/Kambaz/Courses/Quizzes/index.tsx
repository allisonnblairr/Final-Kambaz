import QuizMenu from "./Menu.tsx";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import Button from "react-bootstrap/esm/Button";
import { RxCircleBackslash } from "react-icons/rx";
import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";

export default function Quizzes() {
  const { cid } = useParams();
  const quizzes = db.quizzes.filter((quiz) => quiz.course === cid);
  const [published, setPublished] = useState(false);

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
                      onClick={() => setPublished(!published)}
                    >
                      {published ? (
                        <FaCheckCircle className="text-success fs-5" />
                      ) : (
                        <RxCircleBackslash className="text-danger fs-5" />
                      )}
                    </Button>
                    <IoEllipsisVertical className="fs-5" />
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
