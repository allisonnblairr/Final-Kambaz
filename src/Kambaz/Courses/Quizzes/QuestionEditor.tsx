import {Button, Modal} from "react-bootstrap";
import {Editor} from "react-simple-wysiwyg";

export default function QuestionEditor({show, handleClose}: {
  show: boolean, handleClose: () => void
}) {
  return (
    <>
      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Question Editor</Modal.Title>
         </Modal.Header>
        <Modal.Body>
          <Editor></Editor>
          <Button
            onClick={handleClose}
            className="btn btn-secondary px-3 py-2 me-3"
          >
            Cancel
          </Button><Button
          className="btn btn-danger px-3 py-2 text-white"
        >
          Save
        </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}