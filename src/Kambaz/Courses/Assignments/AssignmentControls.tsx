/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaPlus } from "react-icons/fa6";
import { Button, Form } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

export default function AssignmentControls() {
const { cid } = useParams();
const newAssignmentId = uuidv4();
const { currentUser } = useSelector((state: any) => state.accountReducer);

 return (
   <div id="wd-modules-controls" className="text-nowrap d-flex align-items-center w-100 justify-content-end ms-auto gap-2">
      <div className="position-relative w-75">
        <Form.Control 
          id="wd-search-assignment" 
          placeholder="Search..." 
          type="search" 
          className="ps-5" 
        />
        <CiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
      </div>
    {currentUser.role === 'FACULTY' &&
     <><Button variant="secondary" size="lg" className="me-1" id="wd-add-assignment-group">
         <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
         Group
       </Button><Link to={`/Kambaz/Courses/${cid}/Assignments/${newAssignmentId}`} className="wd-assignment-page-link">
           <Button variant="danger" size="lg" className="me-1" id="wd-add-assignment">
             <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
             Assignment
           </Button>
         </Link></>
    }
   </div>
);}
