/* eslint-disable @typescript-eslint/no-explicit-any */
import {Route, Routes, useParams, useLocation} from "react-router-dom";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import {FaAlignJustify} from "react-icons/fa";
import PeopleTable from "./People/Table";
import * as client from "./client";
import {useEffect, useState} from "react";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/QuizEditor.tsx";
import QuizDetails from "./Quizzes/QuizDetails.tsx";
import QuizPreview from "./Quizzes/QuizPreview.tsx";
import QuizResults from "./Quizzes/QuizResults.tsx";

export default function Courses({courses}: { courses: any[] }) {
  const {cid} = useParams();
  const course = courses.find((course) => course._id === cid);
  const {pathname} = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const fetchUsers = async () => {
    const users = await client.findUsersForCourse(cid as string);
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1"/>
        {course && course.name} &gt; {pathname.split("/")[4]}{" "}
      </h2>{" "}
      <hr/>
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation/>
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="Home" element={<Home/>}/>
            <Route path="Modules" element={<Modules/>}/>
            <Route path="Assignments" element={<Assignments/>}/>
            <Route path="Assignments/:aid" element={<AssignmentEditor/>}/>
            <Route path="Quizzes" element={<Quizzes/>}/>
            <Route path="Quizzes/:qid" element={<QuizEditor/>}/>
            <Route path="Quizzes/:qid/Details" element={<QuizDetails/>}/>
            <Route path="Quizzes/:qid/Preview" element={<QuizPreview />} />
            <Route path="Quizzes/:qid/Results" element={<QuizResults/>}/>
            <Route path="People" element={<PeopleTable users={users}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}
