/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect} from "react";
import {Button, Modal, Form, Row, Col, InputGroup} from "react-bootstrap";
import Editor, {
  BtnBold,
  BtnItalic,
  createButton,
  EditorProvider,
  Toolbar
} from 'react-simple-wysiwyg';
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import FillBlankEditor from "./FillBlankEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import {useParams} from "react-router-dom";

export default function QuestionEditor({question, show, handleClose, onSave}: {
  question: any,
  show: boolean,
  handleClose: () => void,
  onSave?: (updatedQuestion: any) => void
}) {
  const [questionTitle, setQuestionTitle] = useState(question.title || "");
  const [questionType, setQuestionType] = useState(question.questionType || "MULTIPLE_CHOICE");
  const [questionContent, setQuestionContent] = useState(question.content || "");
  const [points, setPoints] = useState(question.points || 1);

  const [choiceInputs, setChoiceInputs] = useState([
    {text: "", isCorrect: false},
    {text: "", isCorrect: false},
    {text: "", isCorrect: false},
    {text: "", isCorrect: false}
  ]);
  const [blankInputs, setBlanksInputs] = useState([{answer: "", alternatives: []}]);
  const [trueFalseInput, setTrueFalseInput] = useState<boolean | null>(null);
  const {qid} = useParams();

  useEffect(() => {
    if (question.answers && question.answers.length > 0) {
      if (question.questionType === "MULTIPLE_CHOICE") {
        const choices = question.answers.map((answer: any) => ({
          text: answer.answerContent,
          isCorrect: answer.isCorrect
        }));
        setChoiceInputs(choices.length > 0 ? choices : choiceInputs);
      } else if (question.questionType === "FILL_BLANK") {
        const blanks = question.answers
          .filter((answer: any) => answer.isCorrect)
          .map((answer: any) => ({
            answer: answer.answerContent,
            alternatives: []
          }));
        setBlanksInputs(blanks.length > 0 ? blanks : blankInputs);
      } else if (question.questionType === "TRUE_FALSE") {
        const correctAnswer = question.answers.find((answer: any) => answer.isCorrect);
        if (correctAnswer) {
          setTrueFalseInput(correctAnswer.answerContent.toLowerCase() === "true");
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionType(e.target.value);
  };

  const handleSave = () => {
    try {
      const questionData = {
        ...question,
        title: questionTitle,
        questionType,
        content: questionContent,
        points,
        quizId: qid
      };

      if (questionType === "MULTIPLE_CHOICE") {
        questionData.answers = choiceInputs
          .filter(choice => choice.text.trim())
          .map(choice => ({
            answerContent: choice.text,
            isCorrect: choice.isCorrect
          }));
      } else if (questionType === "FILL_BLANK") {
        questionData.answers = blankInputs
          .filter(blank => blank.answer.trim())
          .map(blank => ({
            answerContent: blank.answer,
            isCorrect: true
          }));
      } else if (questionType === "TRUE_FALSE") {
        questionData.answers = [
          {
            answerContent: "True",
            isCorrect: trueFalseInput === true
          },
          {
            answerContent: "False",
            isCorrect: trueFalseInput === false
          }
        ];
      }

      if (onSave) {
        onSave(questionData);
      }
      handleClose();
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const renderQuestionTypeContent = () => {
    switch (questionType) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceEditor
            choices={choiceInputs}
            setChoices={setChoiceInputs}
          />
        );
      case "FILL_BLANK":
        return (
          <FillBlankEditor
            blanks={blankInputs}
            setBlanks={setBlanksInputs}
          />
        );
      case "TRUE_FALSE":
        return (
          <TrueFalseEditor
            selectedAnswer={trueFalseInput}
            setSelectedAnswer={setTrueFalseInput}
          />
        );
      default:
        return null;
    }
  };

  const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Question Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3 align-items-center">
              <Col xs={5}>
                <Form.Control
                  type="text"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Question Title"
                />
              </Col>
              <Col xs={4}>
                <Form.Select
                  value={questionType}
                  onChange={handleQuestionTypeChange}
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="FILL_BLANK">Fill in the Blank</option>
                  <option value="TRUE_FALSE">True/False</option>
                </Form.Select>
              </Col>
              <Col xs={3}>
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

            <Form.Group className="mb-3">
              <Form.Label>Question:</Form.Label>
              <EditorProvider>
                <Editor
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                >
                  <Toolbar>
                    <BtnBold/>
                    <BtnItalic/>
                    <BtnAlignCenter/>
                  </Toolbar>
                </Editor>
              </EditorProvider>
            </Form.Group>

            {renderQuestionTypeContent()}
          </Form>
          <div className="mt-3">
            <Button
              onClick={handleClose}
              className="btn btn-secondary px-3 py-2 me-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
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