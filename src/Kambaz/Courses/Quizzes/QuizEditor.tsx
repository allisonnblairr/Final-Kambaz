/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { RxCircleBackslash } from "react-icons/rx";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaRegKeyboard } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { BsGripVertical } from "react-icons/bs";
import Editor from "react-simple-wysiwyg";
import Questions from "./Questions.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { addQuiz, updateQuiz } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<any>({
    title: "Unnamed Quiz",
    instructions: "",
    published: false,
    availableFrom: "",
    availableUntil: "",
    due: "",
    points: 0,
    questions: [],
    attempts: [],
    quizType: "GRADED_QUIZ",
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    hasTimeLimit: true,
    timeLimitLength: 20,
    hasMultipleAttempts: false,
    numAttempts: 1,
    showCorrectAnswers: false,
    whenToShowCorrectAnswers: "",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
  });
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editingMode, setEditingMode] = useState(false);

  useEffect(() => {
    const foundQuiz = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setEditingMode(true);
    }
  }, [qid, quizzes]);

  const [activeKey, setActiveKey] = useState("details");
  const [publishButtonClicked, setPublishButtonClicked] = useState(false);

  const createQuiz = async () => {
    const newQuiz = {
      ...quiz,
      course: cid,
    };
    const createdQuiz = await coursesClient.createQuizForCourse(
      cid as string,
      newQuiz
    );
    dispatch(addQuiz(createdQuiz));

    if (publishButtonClicked) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } else {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${createdQuiz._id}/Details`);
    }
  };

  const saveUpdatedQuiz = async () => {
    await quizzesClient.updateQuiz(quiz);
    dispatch(updateQuiz(quiz));

    if (publishButtonClicked) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } else {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Details`);
    }
  };

  const handlePublishButtonClick = () => {
    setQuiz({ ...quiz, published: !quiz.published });
    setPublishButtonClicked(true);
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const formatDateTimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div id="wd-quiz-editor">
      <Row>
        <Col md={8}></Col>
        <Col md={4}>
          <div>
            Points {quiz.points || "0"}{" "}
            <Button
              onClick={handlePublishButtonClick}
              style={{
                backgroundColor: "lightgray",
                color: "black",
                borderColor: "gray",
              }}
            >
              {quiz.published ? (
                <div>
                  <FaCheckCircle className="text-success me-1 fs-5 mb-1" />
                  Published
                </div>
              ) : (
                <div>
                  <RxCircleBackslash className="text-danger fs-5 me-1 mb-1" />
                  Not Published
                </div>
              )}
            </Button>{" "}
            <Button
              className="btn-sm"
              style={{
                backgroundColor: "lightgray",
                color: "black",
                borderColor: "gray",
              }}
            >
              <IoEllipsisVertical className="fs-5" />
            </Button>
          </div>
        </Col>
      </Row>
      <hr />
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => {
          if (k !== null) setActiveKey(k);
        }}
        style={{ width: "1100px", marginBottom: "20px" }}
      >
        <Tab
          eventKey="details"
          title={
            activeKey === "details" ? (
              <span style={{ color: "black" }}>Details</span>
            ) : (
              <span className="text-danger">Details</span>
            )
          }
        >
          <Form>
            <Form.Group className="col-6 mb-3">
              <Form.Control
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="col-10 mb-3">
              <Form.Label>Quiz Instructions:</Form.Label>
              <Editor
                value={quiz.instructions}
                onChange={(e) =>
                  setQuiz({ ...quiz, instructions: e.target.value })
                }
              />
              <Row className="mt-3">
                <Col md={8}></Col>
                <Col md={4} className="text-end">
                  <div>
                    <FaRegKeyboard className="fs-5 text-danger" />{" "}
                    <span style={{ color: "black" }}>|</span>{" "}
                    <span className="text-danger">0 words</span>{" "}
                    <span style={{ color: "black" }}>|</span>{" "}
                    <FaCode className="fs-5 text-danger" />{" "}
                    <span style={{ color: "black" }}>|</span>{" "}
                    <RiExpandDiagonalSLine className="fs-3 text-danger" />{" "}
                    <span style={{ color: "black" }}>|</span>{" "}
                    <BsGripVertical
                      className="fs-5 border border-danger rounded-1"
                      style={{ color: "black" }}
                    />
                  </div>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              {" "}
              <Row className="mb-3">
                <Col md={3} className="text-end">
                  <Form.Label>Quiz Type</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={quiz.quizType}
                    onChange={(e) =>
                      setQuiz({ ...quiz, quizType: e.target.value })
                    }
                  >
                    <option value="GRADED_QUIZ">Graded Quiz</option>
                    <option value="PRACTICE_QUIZ">Practice Quiz</option>
                    <option value="GRADED_SURVEY">Graded Survey</option>
                    <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} className="text-end">
                  <Form.Label>Assignment Group</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={quiz.assignmentGroup}
                    onChange={(e) =>
                      setQuiz({ ...quiz, assignmentGroup: e.target.value })
                    }
                  >
                    <option value="QUIZZES">QUIZZES</option>
                    <option value="EXAMS">EXAMS</option>
                    <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                    <option value="PROJECTS">PROJECTS</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} className="text-end">
                  <Form.Label>Access Code</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={quiz.accessCode}
                    onChange={(e) =>
                      setQuiz({ ...quiz, accessCode: e.target.value })
                    }
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Row className="mb-3">
                <Col md={4} className="text-end">
                  <Form.Label>
                    <b>Options</b>
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={5} className="d-flex">
                  <Form.Check
                    checked={quiz.shuffleAnswers}
                    onChange={(e) =>
                      setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
                    }
                    label="Shuffle Answers"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={5} className="d-flex">
                  <Form.Check
                    checked={quiz.oneQuestionAtATime}
                    onChange={(e) =>
                      setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })
                    }
                    label="One Question at a Time"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={5} className="d-flex">
                  <Form.Check
                    checked={quiz.lockQuestionsAfterAnswering}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        lockQuestionsAfterAnswering: e.target.checked,
                      })
                    }
                    label="Lock Questions After Answering"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={2} className="d-flex">
                  <Form.Check
                    checked={quiz.showCorrectAnswers}
                    onChange={(e) =>
                      setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })
                    }
                    label="Show Correct Answers"
                  />
                </Col>
                <Col md={1}>
                  <Form.Control
                    value={quiz.whenToShowCorrectAnswers}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        whenToShowCorrectAnswers: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Label>Days After Due Date</Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={2} className="d-flex">
                  <Form.Check
                    checked={quiz.hasTimeLimit}
                    onChange={(e) =>
                      setQuiz({ ...quiz, hasTimeLimit: e.target.checked })
                    }
                    label="Time Limit"
                  />
                </Col>
                <Col md={1}>
                  <Form.Control
                    type="number"
                    value={
                      quiz.timeLimitLength === 0 ? "" : quiz.timeLimitLength
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setQuiz({
                        ...quiz,
                        timeLimitLength: val === "" ? 0 : parseInt(val, 10),
                      });
                    }}
                  />
                </Col>
                <Col md={1}>
                  <Form.Label>Minutes</Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col
                  md={7}
                  className="p-2 border border-2 border-gray rounded-1 d-flex"
                >
                  <Form.Check
                    checked={quiz.webcamRequired}
                    onChange={(e) =>
                      setQuiz({ ...quiz, webcamRequired: e.target.checked })
                    }
                    label="Webcam Required"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col
                  md={7}
                  className="p-3 border border-2 border-gray rounded-1 d-flex"
                >
                  <Col md={6}>
                    <Form.Check
                      checked={quiz.hasMultipleAttempts}
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          hasMultipleAttempts: e.target.checked,
                        })
                      }
                      label="Allow Multiple Attempts"
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      value={quiz.numAttempts}
                      onChange={(e) =>
                        setQuiz({ ...quiz, numAttempts: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={1} />
                  <Col md={3}>
                    <Form.Label>Number of Attempts</Form.Label>
                  </Col>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Row>
                <Col md={3} className="text-end">
                  <Form.Label htmlFor="wd-assign-to">Assign</Form.Label>
                </Col>
                <Col
                  md={6}
                  className="border border-2 border-gray rounded-1"
                  style={{ width: "600px", height: "300px" }}
                >
                  <Row className="mt-3 mb-3">
                    <Form.Label htmlFor="wd-assign-to">
                      <b>Assign to</b>
                    </Form.Label>
                    <Col>
                      <Form.Control
                        id="wd-assign-to"
                        value={"Everyone"}
                        readOnly
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Form.Label htmlFor="wd-due-date">
                        <b>Due</b>
                      </Form.Label>
                      <Form.Control
                        id="wd-due-date"
                        type="datetime-local"
                        value={formatDateTimeLocal(quiz.due)}
                        onChange={(e) =>
                          setQuiz({ ...quiz, due: e.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Label htmlFor="wd-available-from">
                        <b>Available from</b>
                      </Form.Label>
                      <Form.Control
                        id="wd-available-from"
                        type="datetime-local"
                        value={formatDateTimeLocal(quiz.availableFrom)}
                        onChange={(e) =>
                          setQuiz({ ...quiz, availableFrom: e.target.value })
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="wd-available-until">
                        <b>Available Until</b>
                      </Form.Label>
                      <Form.Control
                        id="wd-available-until"
                        type="datetime-local"
                        value={formatDateTimeLocal(quiz.availableUntil)}
                        onChange={(e) =>
                          setQuiz({ ...quiz, availableUntil: e.target.value })
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form.Group>
            <Row className="offset-md-3 mb-3">
              <Button
                style={{
                  backgroundColor: "lightgray",
                  border: "0px",
                  color: "black",
                  width: "600px",
                }}
              >
                + Add
              </Button>
            </Row>
            <hr className="mx-auto w-25" />
            <Row className="mt-3">
              <Col className="offset-md-5">
                <Button
                  onClick={handleCancel}
                  className="btn btn-primary px-3 py-2 me-2"
                  style={{
                    backgroundColor: "lightgray",
                    borderColor: "gray",
                    color: "black",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingMode) {
                      saveUpdatedQuiz();
                    } else {
                      createQuiz();
                    }
                  }}
                  className="btn btn-danger px-3 py-2"
                >
                  Save
                </Button>
              </Col>
            </Row>
            <hr className="mx-auto w-25" />
          </Form>
        </Tab>
        <Tab
          eventKey="questions"
          title={
            activeKey === "questions" ? (
              <span style={{ color: "black" }}>Questions</span>
            ) : (
              <span className="text-danger">Questions</span>
            )
          }
        >
          <Questions quiz={quiz} />
        </Tab>
      </Tabs>
    </div>
  );
}
