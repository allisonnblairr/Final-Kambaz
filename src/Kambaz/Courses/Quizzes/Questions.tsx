import {Button} from "react-bootstrap";

export default function Questions({handleCancel}: { handleCancel: never }) {
  return (
    <div>
      <div className="text-center">
        <br></br>
        <Button
          className="btn btn-secondary px-3 py-2"
        >
          + New Question
        </Button>
        <br></br>
        <hr></hr>
      </div>
      <Button
        className="btn btn-secondary px-3 py-2 me-3"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        className="btn btn-danger px-3 py-2 text-white"
      >
        Save
      </Button>
    </div>
  );
}