import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";

export default function AssignmentControlButtons() {
  return (
    <div className="float-end ms-3 d-flex gap-2">
      <Button variant="secondary" size="sm" className="me-1 float-end border-dark rounded" id="wd-assignment-total">
      40% of Total
     </Button>
      <FaPlus className="fs-4"/>
      <IoEllipsisVertical className="fs-4" />
    </div>
     );}