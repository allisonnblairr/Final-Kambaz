/* eslint-disable @typescript-eslint/no-explicit-any */
import {Editor, EditorProvider} from "react-simple-wysiwyg";
import {useState} from "react";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";

export default function QuestionEditor({question, show, handleClose}: {
  question: any, show: boolean, handleClose: () => void
}) {
  const [questionTitle, setQuestionTitle] = useState(question.title);
  const [questionType, setQuestionType] = useState(question.questionType);
  const [questionContent, setQuestionContent] = useState(question.content);
  const [points, setPoints] = useState(question.points);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Question Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3 align-items-center">
              <Col xs={8}>
                <Form.Control
                  type="text"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Question Title"
                />
              </Col>
              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>pts:</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value))}
                    min={0}
                  />
                </InputGroup>
              </Col>
            </Row>
            <EditorProvider>
              <Editor
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
              />
            </EditorProvider>
          </Form>

          <div className="mt-3">
            <Button
              onClick={handleClose}
              className="btn btn-secondary px-3 py-2 me-3"
            >
              Cancel
            </Button>
            <Button
              className="btn btn-danger px-3 py-2 text-white"
            >
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}