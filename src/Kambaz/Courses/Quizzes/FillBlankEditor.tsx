import { Form, Button } from "react-bootstrap";

interface Blank {
  answer: string;
  alternatives: string[];
}

export default function FillBlankEditor({ blanks, setBlanks }:
  {
    blanks: Blank[];
    setBlanks: (blanks: Blank[]) => void;
  }) {
  const handleAddBlank = () => {
    setBlanks([...blanks, { answer: "", alternatives: [] }]);
  };

  const handleRemoveBlank = (index: number) => {
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
              placeholder={`Answer for Blank ${index + 1}`}
            />
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-2"
              onClick={() => handleRemoveBlank(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline-primary"
        onClick={handleAddBlank}
        className="mt-2"
      >
        + Add Another Blank
      </Button>
    </div>
  );
}