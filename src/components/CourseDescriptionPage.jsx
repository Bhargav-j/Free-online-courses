import React, { useEffect, useMemo, useState } from "react";
import { Accordion, Button, Container } from "react-bootstrap";
import "../styles/CourseDesc_style.css";
import imgi from "../images/ex tile.jpg";
import {
  Calendar3Week,
  Check,
  ClockHistory,
  CreditCard2Front,
  GeoAltFill,
} from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserObject } from "../Globals/actionTypes";
import { manageUpdateUser } from "../firebase/CRUDoperations";
import moment from "moment";
import { initialUserObject } from "../Globals/Reducers";

const CourseDescriptionPage = ({AllCourses}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --------------------------------------------------------------
  // Global user data from redux
  const selector = useSelector((state) => state.user);

  const memoizedData = useMemo(() => {
    return {
      userID: selector.UID,
      UserData: selector.UserData,
    };
  }, [selector]);

  const [userID, setuserID] = useState(null);
  const [UserData, setUserData] = useState(initialUserObject.UserData);

  useEffect(() => {
    setuserID(memoizedData.userID);
    setUserData(memoizedData.UserData);
  }, [memoizedData]);
  // --------------------------------------------------------------------

  const { Courseid } = useParams();

  const course = AllCourses[Courseid - 1];

  // ------------------------------------------------------------------
  // Update the User Data based on enroll button click
  const EnrollCoursefun = () => {
    if (!userID) {
      navigate("/user");
    } else {
      let enrolledNew = [...UserData["enrolled"]];

      if (enrolledNew.includes(course.id)) {
        enrolledNew = enrolledNew.filter((item) => item !== course.id);
      } else {
        enrolledNew.push(course.id);
      }

      let progress = parseInt(Math.random() * 10) * 10;
      let totalLessons = course.syllabus.length;
      let completedLessons = Math.floor(totalLessons * (progress / 100));

      const currentDate = moment()
      const dueDate = currentDate.add(totalLessons, "weeks")

      const courseDesc = {
        id: course.id,
        course: course.name,
        progress: progress,
        chapterscompleted: completedLessons,
        status:
          progress === 0
            ? "Yet to Start"
            : progress === 100
            ? "Completed"
            : "In Progress",
        dueDate : dueDate.format('Do MMMM YYYY'),
      };

      let coursesDetails = [...UserData["status"]];
      coursesDetails.push(courseDesc);

      dispatch(updateUserObject("enrolled", enrolledNew));  // Redux state update
      dispatch(updateUserObject("status", coursesDetails));
      manageUpdateUser(userID, "enrolled", enrolledNew);    // Firebase Database Update
      manageUpdateUser(userID, "status", coursesDetails);
    }
  };

  return (
    <Container>
      <header>
        <div className="CourseTitle p-4">
          <div className="fs-2 fw-bold text-light py-2">{course.name}</div>
          <div className="fs-5 text-light py-2 ">
            <span className="fw-semibold">Instructor : </span>
            {course.instructor}
          </div>
          <div className="fs-5 text-light py-2 ">
            <span className="fw-semibold">Category : </span>
            {course.category}
          </div>
          <div className="info fs-6 text-light py-1">
            <div className="rating">
              <div>{course.rating}</div>
              <div>
                <i className="bi bi-star-fill"></i>
              </div>
            </div>
            <div>
              <i className="bi bi-dot"></i>
            </div>
            <div>
              {UserData.enrolled.includes(course.id)
                ? course.enrolled + 1
                : course.enrolled}{" "}
              Enrolled
            </div>
            <div>
              <i className="bi bi-dot"></i>
            </div>
            <div>{course.duration}</div>
          </div>
          <p className=" fs-6 text-light py-1">{course.description}</p>
        </div>
      </header>
      <div className="CourseTitleRight">
        <div className="CourseCard">
          <div className="imgdiv">
            <img src={imgi} alt="img" />
          </div>
          <div className="courseCardDetils">
            <Button
              className="Enrollbutton w-100"
              disabled={
                course["enrollmentStatus"] !== "Open" ||
                UserData["enrolled"].includes(course.id)
              }
              onClick={() => EnrollCoursefun()}
            >
              {course["enrollmentStatus"] === "Closed"
                ? "Enrollment Closed"
                : UserData["enrolled"].includes(course.id)
                ? "In Progress"
                : "Enroll Now"}
            </Button>
            <div className="courseDetails">
              <p>This Course Includes</p>
              <div className="detail1">
                <div className="icon">
                  <Calendar3Week size={25} />
                </div>
                <div>
                  <div className="fw-bold">Schedule</div>
                  <div>{course.schedule}</div>
                </div>
              </div>
              <div className="detail2">
                <div>
                  <GeoAltFill size={25} />
                </div>
                <div>
                  <div className="fw-bold">Location</div>
                  <div>{course.location}</div>
                </div>
              </div>
              <div className="detail3">
                <div>
                  <ClockHistory size={25} />
                </div>
                <div>
                  <div className="fw-bold">Duration</div>
                  <div>{course.duration}</div>
                </div>
              </div>
              <div className="detail4">
                <div>
                  <CreditCard2Front size={25} />
                </div>
                <div>
                  <div className="fw-bold">Completion Certificate</div>
                  <div>awarded on course completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="m-4">
        <div className="mb-4">
          <div className="my-2 fs-4 fw-semibold">Prerequisites:</div>
          {course.prerequisites.map((each) => (
            <div key={each}>
              <span>
                <Check size={25} color="green" />
              </span>
              {each}
            </div>
          ))}
        </div>
        <div>
          <div className="my-2 fs-4 fw-semibold">Course Content</div>
          <Accordion className="">
            {course.syllabus.map((each, index) => (
              <Accordion.Item eventKey={index} key={index}>
                <Accordion.Header>
                  <div className="w-100 ps-2 pe-4 d-flex flex-column flex-md-row justify-content-between">
                    <div className="fw-semibold">Topic : {each.topic}</div>
                    <div>Week : {each.week}</div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>{each.content}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </section>
    </Container>
  );
};

export default CourseDescriptionPage;
