import { Form } from "react-bootstrap";

export default function TrueFalseEditor({ selectedAnswer, setSelectedAnswer }:
  {
    selectedAnswer: boolean | null;
    setSelectedAnswer: (answer: boolean) => void
  }) {
  return (
    <div className="mt-3">
      <Form.Label>Correct Answer:</Form.Label>
      <div className="d-flex gap-3">
        <Form.Check
          type="radio"
          label="True"
          checked={selectedAnswer === true}
          onChange={() => setSelectedAnswer(true)}
        />
        <Form.Check
          type="radio"
          label="False"
          checked={selectedAnswer === false}
          onChange={() => setSelectedAnswer(false)}
        />
      </div>
    </div>
  );
}