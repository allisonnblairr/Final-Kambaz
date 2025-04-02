/* eslint-disable @typescript-eslint/no-explicit-any */
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentControls from "./AssignmentControls";
import { useNavigate } from "react-router";
import { LuNotebookPen } from "react-icons/lu";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { setAssignments, deleteAssignment } from "./reducer";
import * as coursesClient from "../client";
import { useEffect } from "react";
import * as assignmentsClient from "./client";

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const fetchAssignments = async () => {
    const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };
  useEffect(() => {
    fetchAssignments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const removeAssignment = async (assignmentId: string) => {
    await assignmentsClient.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };


  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    };
    return date.toLocaleString("en-US", options);
}
  
  return (
    <div>
      <AssignmentControls /><br/>
      <ul id="wd-assignments" className="list-group rounded-0">
        <div className="wd-title p-3 ps-2 bg-secondary">
          <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS <AssignmentControlButtons />
        </div>
        {assignments
          .map((assignment: any) => (
            <li key={assignment._id} className="wd-assignment p-3 d-flex align-items-center list-group-item ps-1">
              <div className="d-flex align-items-center me-3">
                <BsGripVertical className="fs-3" />
                <LuNotebookPen className="wd-green ms-2 fs-3" />
              </div>
              <div className="flex-grow-1">
                <p className="flex-grow-1 d-block text-start fs-4 mb-0">
                {assignment.title}
                </p>
                <div className="text-start mx-auto">
                  <span className="text-danger">Multiple Modules</span> | 
                  <strong> Not available until </strong> {assignment.from? formatDate(assignment.from) : "TBD"} |  
                  <strong> Due </strong> {assignment.due? formatDate(assignment.due) : "TBD"} |  
                  {assignment.pts} pts
                </div>
              </div>
              <div className="d-flex align-items-center ms-3 gap-2">
               {currentUser.role === 'FACULTY' &&
                <><FaPencil onClick={() => navigate(`/Kambaz/Courses/${assignment.course}/Assignments/${assignment._id}`)} className="text-primary me-3" />
                <FaTrash className="text-danger me-2 mb-1" onClick={() => removeAssignment(assignment._id)} /></>
               }
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
