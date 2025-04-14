import { useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { RxCircleBackslash } from "react-icons/rx";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaRegKeyboard } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { BsGripVertical } from "react-icons/bs";
import Editor from "react-simple-wysiwyg";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const quiz = db.quizzes.find((quiz) => quiz._id === qid);

  const [activeKey, setActiveKey] = useState("details");

  const [published, setPublished] = useState(quiz ? quiz.published : false);
  const [quizName, setQuizName] = useState(quiz ? quiz.title : "Unnamed Quiz");
  const [quizInstructions, setQuizInstructions] = useState(
    quiz ? quiz.instructions : ""
  );
  const [quizType, setQuizType] = useState(
    quiz ? quiz.quizType : "graded-quiz"
  );
  const [assignmentGroup, setAssignmentGroup] = useState(
    quiz ? quiz.assignmentGroup : "quizzes"
  );
  const [points, setPoints] = useState(quiz ? quiz.points : "");
  const [accessCode, setAccessCode] = useState(quiz ? quiz.accessCode : "");
  const [shuffleAnswers, setShuffleAnswers] = useState(
    quiz ? quiz.shuffleAnswers : true
  );
  const [oneQuestionAtATime, setOneQuestionAtATime] = useState(
    quiz ? quiz.oneQuestionAtATime : true
  );
  const [lockQuestionsAfterAnswering, setLockQuestionsAfterAnswering] =
    useState(quiz ? quiz.lockQuestionsAfterAnswering : false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(
    quiz ? quiz.showCorrectAnswers : false
  );
  const [showCorrectAnswersDays, setShowCorrectAnswersDays] = useState(
    quiz ? quiz.whenToShowCorrectAnswers : ""
  );
  const [timeLimit, setTimeLimit] = useState(quiz ? quiz.hasTimeLimit : true);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    quiz ? quiz.timeLimitLength : "20"
  );
  const [webcamRequired, setWebcamRequired] = useState(
    quiz ? quiz.webcamRequired : false
  );
  const [multipleAttempts, setMultipleAttempts] = useState(
    quiz ? quiz.hasMultipleAttempts : false
  );
  const [numberOfAttempts, setNumberOfAttempts] = useState(
    quiz ? quiz.numAttempts : "1"
  );
  const [dueDate, setDueDate] = useState(quiz ? quiz.due : "");
  const [availableFromDate, setAvailableFromDate] = useState(
    quiz ? quiz.availableFrom : ""
  );
  const [availableUntilDate, setAvailableUntilDate] = useState(
    quiz ? quiz.availableUntil : ""
  );

  const handleSave = () => {
    const quizPayload = {
      _id: quiz ? (qid as string) : "QUIZ" + String(db.quizzes.length + 1),
      course: cid as string,
      title: quizName,
      instructions: quizInstructions,
      published: published,
      availableFrom: availableFromDate,
      availableUntil: availableUntilDate,
      due: dueDate,
      points: points,
      questions: [],
      attempts: [],
      quizType: quizType,
      assignmentGroup: assignmentGroup,
      shuffleAnswers: shuffleAnswers,
      hasTimeLimit: timeLimit,
      timeLimitLength: timeLimitMinutes,
      hasMultipleAttempts: multipleAttempts,
      numAttempts: numberOfAttempts,
      showCorrectAnswers: showCorrectAnswers,
      whenToShowCorrectAnswers: showCorrectAnswersDays,
      accessCode: accessCode,
      oneQuestionAtATime: oneQuestionAtATime,
      webcamRequired: webcamRequired,
      lockQuestionsAfterAnswering: lockQuestionsAfterAnswering,
    };
    if (quiz) {
      db.quizzes.map((quiz) => (quiz._id === qid ? quizPayload : quiz));
    } else {
      db.quizzes.push(quizPayload);
    }
  };

  return (
    <div id="wd-quiz-editor">
      <Row>
        <Col md={8}></Col>
        <Col md={4}>
          <div>
            Points {points}{" "}
            <Button
              onClick={() => setPublished(!published)}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "0px",
              }}
            >
              {published ? (
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
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="col-10 mb-3">
              <Form.Label>Quiz Instructions:</Form.Label>
              <Editor
                value={quizInstructions}
                onChange={(e) => setQuizInstructions(e.target.value)}
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
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value)}
                  >
                    <option value="graded-quiz">Graded Quiz</option>
                    <option value="practice-quiz">Practice Quiz</option>
                    <option value="graded-survey">Graded Survey</option>
                    <option value="ungraded-survey">Ungraded Survey</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} className="text-end">
                  <Form.Label>Assignment Group</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={assignmentGroup}
                    onChange={(e) => setAssignmentGroup(e.target.value)}
                  >
                    <option value="quizzes">QUIZZES</option>
                    <option value="exams">EXAMS</option>
                    <option value="assignments">ASSIGNMENTS</option>
                    <option value="projects">PROJECTS</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} className="text-end">
                  <Form.Label>Points</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} className="text-end">
                  <Form.Label>Access Code</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
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
                    defaultChecked={shuffleAnswers}
                    onChange={(e) => setShuffleAnswers(e.target.checked)}
                    label="Shuffle Answers"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={5} className="d-flex">
                  <Form.Check
                    defaultChecked={oneQuestionAtATime}
                    onChange={(e) => setOneQuestionAtATime(e.target.checked)}
                    label="One Question at a Time"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={5} className="d-flex">
                  <Form.Check
                    defaultChecked={lockQuestionsAfterAnswering}
                    onChange={(e) =>
                      setLockQuestionsAfterAnswering(e.target.checked)
                    }
                    label="Lock Questions After Answering"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={3} />
                <Col md={2} className="d-flex">
                  <Form.Check
                    defaultChecked={showCorrectAnswers}
                    onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                    label="Show Correct Answers"
                  />
                </Col>
                <Col md={1}>
                  <Form.Control
                    value={showCorrectAnswersDays}
                    onChange={(e) => setShowCorrectAnswersDays(e.target.value)}
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
                    defaultChecked={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.checked)}
                    label="Time Limit"
                  />
                </Col>
                <Col md={1}>
                  <Form.Control
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(e.target.value)}
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
                    defaultChecked={webcamRequired}
                    onChange={(e) => setWebcamRequired(e.target.checked)}
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
                      defaultChecked={multipleAttempts}
                      onChange={(e) => setMultipleAttempts(e.target.checked)}
                      label="Allow Multiple Attempts"
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      value={numberOfAttempts}
                      onChange={(e) => setNumberOfAttempts(e.target.value)}
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
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
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
                        value={availableFromDate}
                        onChange={(e) => setAvailableFromDate(e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="wd-available-until">
                        <b>Available Until</b>
                      </Form.Label>
                      <Form.Control
                        id="wd-available-until"
                        type="datetime-local"
                        value={availableUntilDate}
                        onChange={(e) => setAvailableUntilDate(e.target.value)}
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
                <Link
                  to={`/Kambaz/Courses/${cid}/Quizzes`}
                  className="btn btn-primary px-3 py-2 me-2"
                  style={{
                    backgroundColor: "lightgray",
                    borderColor: "gray",
                    color: "black",
                  }}
                >
                  Cancel
                </Link>
                <Link
                  onClick={handleSave}
                  to={`/Kambaz/Courses/${cid}/Quizzes/${quiz?._id}/Details`}
                  className="btn btn-danger px-3 py-2 text-white"
                >
                  Save
                </Link>
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
        ></Tab>
      </Tabs>
    </div>
  );
}
