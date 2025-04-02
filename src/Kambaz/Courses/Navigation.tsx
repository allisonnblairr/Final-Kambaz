import { Link, useLocation, useParams } from "react-router-dom";

export default function CourseNavigation() {
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  const { cid } = useParams();
  const location = useLocation();
  const isActive = (link: string) => {
    const linkPath = `/Kambaz/Courses/${cid}/${link}`;
    return location.pathname === linkPath;
  };
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
          <Link to={`/Kambaz/Courses/${cid}/${link}`} id={`wd-course-${link}-link`}
              className={`list-group-item border-0 ${isActive(link) ? "active" : "text-danger"}`}
              key={link}
              > {link} 
          </Link>
      ))}
    </div>
);}

