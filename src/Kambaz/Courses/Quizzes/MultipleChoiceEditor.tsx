import { Form, Button } from "react-bootstrap";

interface Choice {
  text: string;
  isCorrect: boolean;
}

export default function MultipleChoiceEditor({ choices, setChoices }:
  {
    choices: Choice[];
    setChoices: (choices: Choice[]) => void;
  }) {
  const handleAddChoice = () => {
    setChoices([...choices, { text: "", isCorrect: false }]);
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleChoiceTextChange = (index: number, text: string) => {
    const newChoices = [...choices];
    newChoices[index].text = text;
    setChoices(newChoices);
  };

  const handleCorrectChoiceChange = (index: number) => {
    const newChoices = choices.map((choice, i) => ({
      ...choice,
      isCorrect: i === index
    }));
    setChoices(newChoices);
  };

  return (
    <div>
      <Form.Label className="mt-3">Answer Choices:</Form.Label>
      {choices.map((choice, index) => (
        <div key={index} className="d-flex mb-2 align-items-center">
          <Form.Check
            type="radio"
            name="correctAnswer"
            checked={choice.isCorrect}
            onChange={() => handleCorrectChoiceChange(index)}
            className="me-2"
          />
          <Form.Control
            type="text"
            value={choice.text}
            onChange={(e) => handleChoiceTextChange(index, e.target.value)}
            placeholder={`Choice ${index + 1}`}
          />
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={() => handleRemoveChoice(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline-primary"
        onClick={handleAddChoice}
        className="mt-2"
      >
        + Add Another Choice
      </Button>
    </div>
  );
}