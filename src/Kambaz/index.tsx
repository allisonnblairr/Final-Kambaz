/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import { useEffect, useState } from "react";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import { useSelector } from "react-redux";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  
  const findCoursesForUser = async () => {
    try {
      const courses = await userClient.findCoursesForUser(currentUser._id);
      const validEnrolledCourses = courses.filter((enrollment: any) => enrollment !== null);
      setCourses(validEnrolledCourses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    if (!currentUser) {
      return;
    }
  
    try {
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(currentUser._id);
  
      const validEnrolledCourses = (enrolledCourses || [])
        .filter((enrollment: any) => enrollment !== null && enrollment._id)
        .map((enrollment: any) => ({ ...enrollment, _id: String(enrollment._id) }));
  
      const normalizedAllCourses = allCourses.map((course: any) => ({
        ...course,
        _id: String(course._id),
      }));
  
      const courses = normalizedAllCourses.map((course: any) => {
        const isEnrolled = validEnrolledCourses.some((enrolled: any) => enrolled._id === course._id);
        return { ...course, enrolled: isEnrolled };
      });
  
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    if (enrolling) {
      fetchCourses();
    } else {
      findCoursesForUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, enrolling]);

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (enrolled) {
      await userClient.enrollIntoCourse(currentUser._id, courseId);
    } else {
      await userClient.unenrollFromCourse(currentUser._id, courseId);
    }
    setCourses(
      courses.map((course) => {
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      })
    );
  }; 

  const [course, setCourse] = useState<any>({
    _id: "1234", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
    image: "/images/reactjs.jpg",
  });

  const addNewCourse = async () => {
    const newCourse = await courseClient.createCourse(course);
    setCourses([...courses, { ...course, newCourse }]);
  };
  const deleteCourse = async (courseId: any) => {
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
  };
  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/Kambaz/Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={
              <ProtectedRoute>
              <Dashboard
                courses={courses}
                course={course}
                setCourse={setCourse}
                addNewCourse={addNewCourse}
                deleteCourse={deleteCourse}
                updateCourse={updateCourse}
                enrolling={enrolling} setEnrolling={setEnrolling}
                updateEnrollment={updateEnrollment} /> 
              </ProtectedRoute>} />
            <Route path="/Courses/:cid/*" element={ 
              <ProtectedRoute>
              <Courses courses={courses} />
              </ProtectedRoute>} />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
