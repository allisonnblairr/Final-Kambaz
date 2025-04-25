/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Button } from "react-bootstrap";

interface Blank {
  answer: string;
  alternatives: string[];
}

export default function FillBlankEditor({
  blanks,
  setBlanks,
}: {
  blanks: Blank[];
  setBlanks: any;
}) {
  const handleAddAnswer = () => {
    setBlanks([...blanks, { answer: "", alternatives: [] }]);
  };

  const handleRemoveAnswer = (index: number) => {
    setBlanks(blanks.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const newBlanks = [...blanks];
    newBlanks[index].answer = answer;
    setBlanks(newBlanks);
  };

  return (
    <div>
      <Form.Label className="mt-3">Blank Answers:</Form.Label>
      {blanks.map((blank, index) => (
        <div key={index} className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              value={blank.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-2"
              onClick={() => handleRemoveAnswer(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline-primary"
        onClick={handleAddAnswer}
        className="mt-2"
      >
        + Add Another Answer
      </Button>
    </div>
  );
}
