/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormGroup, FormLabel, FormControl, Form, Col, Row, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addAssignment, updateAssignment } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

export default function AssignmentEditor() {
  const { aid, cid } = useParams<{ aid: string; cid: string }>();
  const [assignment, setAssignment] = useState<any>({});
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editingMode, setEditingMode] = useState(false);
  const createAssignmentForCourse = async () => {
    if (!cid) return;
    const newAssignment = { 
      title: assignment.title, 
      course: cid,
      description: assignment.description,
      pts: assignment.pts,
      due: assignment.due,
      from: assignment.from,
      until: assignment.until };
    const returnedAssignment = await coursesClient.createAssignmentForCourse(cid, newAssignment);
    dispatch(addAssignment(returnedAssignment));
  };
  const saveAssignment = async (assignment: any) => {
    await assignmentsClient.updateAssignment(assignment);
    dispatch(updateAssignment(assignment));
  };
  
  useEffect(() => {
    const foundAssignment = assignments.find((asmnt: any) => asmnt._id === aid);
    if (foundAssignment) {
      setAssignment(foundAssignment);
      setEditingMode(true);
    }
  }, [aid, assignments]);

    return (
      <div id="wd-assignments-editor">
        <FormGroup className="mb-3 wd-name" controlId="wd-textarea">
                <FormLabel>Assignment Name</FormLabel>
                <FormControl as="textarea" rows={3} value={assignment?.title || ""} className="custom-textarea wd-name"
                onChange={(e) => setAssignment({ ...assignment, title:  e.target.value })}/>
        </FormGroup>
        <FormGroup className="textarea-wrapper p-3 border rounded-3 wd-description" controlId="wd-textarea" style={{height: '100px'}}>
                <FormLabel>Assignment Description</FormLabel>
                <FormControl as="textarea" rows={3} value={assignment?.description || ""} className="custom-textarea wd-description"
                onChange={(e) => setAssignment({ ...assignment, description:  e.target.value })}/>
        </FormGroup>
        <div> 
        <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3} className="text-end wd-points"> Points </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="textarea" value={assignment?.pts || ""} className="wd-points"
                            onChange={(e) => setAssignment({ ...assignment, pts: e.target.value })}/>
                        </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} className="text-end wd-group"> Assignment Group </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-group" defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} className="text-end wd-display-grade-as"> Display Grade as </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-display-grade-as" defaultValue="ASSIGNMENTS">
              <option value="Points">Points</option>
              <option value="Percentage">Percentage</option>
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3} className="text-end wd-submission-type"> Submission Type </Form.Label>
                        <Col sm={9}>
                          <div className="textarea-wrapper p-3 border rounded-3" style={{height: '300px'}}>
                            <div className="mb-3">
                              <Form.Select id="wd-submission-type" className="mt-2">
                                <option value="Online">Online</option>
                              </Form.Select>
                            </div>
                            <div>
                              <label><strong>Online Entry Options</strong></label>
                              <div>
                                <Form.Check
                                  type="checkbox"
                                  label="Text Entry"
                                  id="wd-text-entry"
                                  className="mt-2"
                                />
                                <Form.Check
                                  type="checkbox"
                                  label="Website URL"
                                  id="wd-website-url"
                                  className="mt-2"
                                />
                                <Form.Check
                                  type="checkbox"
                                  label="Media Recordings"
                                  id="wd-media-recordings"
                                  className="mt-2"
                                />
                                <Form.Check
                                  type="checkbox"
                                  label="Student Annotation"
                                  id="wd-student-annotation"
                                  className="mt-2"
                                />
                                <Form.Check
                                  type="checkbox"
                                  label="File Upload"
                                  id="wd-file-upload"
                                  className="mt-2"
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3} className="text-end wd-assign-to"> Assign </Form.Label>
                        <Col sm={9}>
                          <div className="textarea-wrapper p-3 border rounded-3" style={{height: '220px'}}>
                            <div>
                              <label className="wd-assign-to"><strong>Assign to</strong></label>
                              <Form.Control type="textarea" value="Everyone" className="wd-assign-to"/>
                            </div>
                            <div>
                              <label className="wd-due-date"><strong>Due</strong></label>
                              <Form.Control type="date" value={assignment?.due || ""} className="wd-due-date"
                              onChange={(e) => setAssignment({ ...assignment, due: e.target.value })}/>
                            </div>
                            <div className="d-flex gap-5">
                              <div> 
                              <label className="wwd-available-from"><strong>Available From</strong></label>
                              <Form.Control type="date" value={assignment?.from || ""} className="wwd-available-from"
                              onChange={(e) => setAssignment({ ...assignment, from: e.target.value })}/>
                              </div>
                              <div> 
                              <label className="wd-available-until"><strong>Until</strong></label>
                              <Form.Control type="date" value={assignment?.until || ""} className="wd-available-until"
                              onChange={(e) => setAssignment({ ...assignment, until: e.target.value })}/>
                              </div>                             
                            </div>
                          </div>
                        </Col>
        </Form.Group>
        </div>
        <hr></hr>
        <div className="float-end d-flex">
        <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="wd-assignment-page-link">
        <Button variant="secondary" size="sm" className="me-1 float-end border-dark rounded-0" id="wd-cancel">
        Cancel
        </Button></Link>
        <Button variant="danger" size="sm" className="me-1 float-end border-dark rounded-0" id="wd-save"
        onClick={() => { if (editingMode) {
          saveAssignment(assignment)
        } else {
          createAssignmentForCourse()
        }
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
         }}>
         Save
        </Button>
        </div>
      </div>
  );}
  