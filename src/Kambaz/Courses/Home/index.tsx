/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return (
    <div className="d-flex" id="wd-home">
  <div className="flex-fill me-3">
    <Modules />
  </div>
  <div className="d-none d-xl-block">
  { currentUser.role === 'FACULTY' &&
    <CourseStatus />
  }
  </div>
  </div>
);}
