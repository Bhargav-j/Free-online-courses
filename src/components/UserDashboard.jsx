import React, { useEffect, useMemo, useState } from "react";
import "../styles/UserDashboard_style.css";
import img1 from "../images/ex tile.jpg";

import {
  AwardFill,
  Clock,
  ClockHistory,
  HourglassSplit,
  MortarboardFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CourseTile from "./CourseTile";
import { Form } from "react-bootstrap";
import { initialUserObject } from "../Globals/Reducers";
import { manageUpdateUser } from "../firebase/CRUDoperations";
import { updateUserObject } from "../Globals/actionTypes";

const UserDashboard = ({ AllCourses }) => {
  const [editCourseStatus, seteditCourseStatus] = useState(false);
  const [CourseStatusCompleted, setCourseStatusCompleted] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -------------------------------------------------------------
  // Global Data from Redux
  const selector = useSelector((state) => state.user);
  const memoizedData = useMemo(() => {
    return {
      userID: selector.UID,
      UserData: selector.UserData,
    };
  }, [selector]);

  const [userID, setUser] = useState(true);

  const [UserData, setUserData] = useState(initialUserObject.UserData);

  useEffect(() => {
    setUser(memoizedData.userID);
    setUserData(memoizedData.UserData);
    setCourseStatusCompleted(memoizedData.UserData.updatedStatus);
  }, [memoizedData, userID]);
  
  
  // ----------------------------------------------------------------
  // Overview of user
  let courseEnrolled = UserData.enrolled.length;
  let coursesYettoStart = 0;
  let coursesInProgress = 0;
  let coursesCompleted = 0;

  UserData.status.map((eachCourse) => {
    if (!CourseStatusCompleted.includes(eachCourse.id)) {
      if (eachCourse.progress === 0) {
        coursesYettoStart += 1;
      } else if (eachCourse.progress !== 100) {
        coursesInProgress += 1;
      } else {
        coursesCompleted += 1;
      }
    } else {
      coursesCompleted += 1;
    }
    return null;
  });

  //-----------------------------------
  // Navigate to Main page if user is logout
  useEffect(() => {
    if (!userID) {
      navigate("/");
    }
  }, [navigate, userID]);


  //----------------------------------------------------------------
  // Save the courses completed updated array to global state and firestore
  const CourseStatusEditfun = () => {
    if (editCourseStatus) {
      dispatch(updateUserObject("updatedStatus", CourseStatusCompleted));
      manageUpdateUser(userID, "updatedStatus", CourseStatusCompleted);
    }
    seteditCourseStatus(!editCourseStatus);
  };

  //------------------------------------------------------------------
  // Edit the course completed status function on each course tile and save data to array
  const CourseCompletedfun = (event, courseID) => {
    if (event.target.checked) {
      if (!CourseStatusCompleted.includes(courseID)) {
        setCourseStatusCompleted([...CourseStatusCompleted, courseID]);
      }
    } else {
      setCourseStatusCompleted((CourseStatusCompleted) => {
        const newArray = CourseStatusCompleted.filter(
          (item) => item !== courseID
        );
        return newArray;
      });
    }
  };

  return (
    <div className="container-fluid container-lg">
      <div className="overview">
        <div>overview</div>
        <div className="overviewSections">
          <div className="section1">
            <div className="fw-bold">
              <MortarboardFill color="blue" />
              {courseEnrolled}
            </div>
            <div>Courses Enrolled</div>
          </div>
          <div className="section2">
            <div className="fw-bold">
              <Clock color="red" />
              {coursesYettoStart}
            </div>
            <div>Yet to Start</div>
          </div>
          <div className="section3">
            <div className="fw-bold">
              <HourglassSplit color="orange" />
              {coursesInProgress}
            </div>
            <div>In Progress</div>
          </div>
          <div className="section4">
            <div className="fw-bold">
              <AwardFill color="green" />
              {coursesCompleted}
            </div>
            <div>Completed</div>
          </div>
        </div>
      </div>

      {courseEnrolled ? (
        <div className="myCourses">
          <div className="fs-5 fw-bold">My Courses</div>
          <div className="w-100 d-flex justify-content-end">
            <div
              className="courseStatusEdit"
              onClick={() => CourseStatusEditfun()}
              style={
                editCourseStatus
                  ? { backgroundColor: "rgb(157, 218, 73)" }
                  : { backgroundColor: "rgb(239, 243, 13)" }
              }
            >
              {editCourseStatus ? "Save Edits" : "Edit Course Status"}
            </div>
          </div>
          {UserData.status.map((eachCourse) => {
            let course = AllCourses[eachCourse["id"] - 1];
            return (
              <div className="DashboardCourseTile" key={eachCourse["id"]}>
                <div className="DashboardCourseDesc">
                  <div className="Dashboardpic">
                    <img src={img1} alt="img" />
                  </div>
                  <div className="Dashboardinfo">
                    <div className="Dashboardinfo1 fs-5 fw-bold">
                      {course.name}
                    </div>
                    <div className="Dashboardinfo2">
                      <div>{course.instructor}</div>
                      <div>{course.category}</div>
                      <div>{course.duration}</div>
                    </div>
                    <div className="Dashboardinfo3">
                      <div>Timings : </div>
                      <div>{course.schedule}</div>
                    </div>
                  </div>
                  <div className="DashboarddueStatus">
                    <div className="Dashboardduedate">
                      <div>
                        <ClockHistory />
                      </div>
                      <div>{eachCourse.dueDate}</div>
                    </div>
                    {editCourseStatus ? (
                      <div className="checkboxStatus">
                        <Form.Check
                          type="checkbox"
                          id={eachCourse["id"]}
                          checked={
                            CourseStatusCompleted.includes(eachCourse["id"])
                              ? true
                              : false
                          }
                          label="Completed"
                          onChange={(event) =>
                            CourseCompletedfun(event, eachCourse["id"])
                          }
                        />
                      </div>
                    ) : (
                      <div className="Dashboardstatus">
                        {CourseStatusCompleted.includes(eachCourse["id"])
                          ? "Completed"
                          : eachCourse.status}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="fw-bold">
                    {course.syllabus.length} Lessons{" "}
                    <span className="fw-semibold ms-2">
                      -{" "}
                      {CourseStatusCompleted.includes(eachCourse["id"])
                        ? course.syllabus.length
                        : eachCourse.chapterscompleted}{" "}
                      Completed (
                      {CourseStatusCompleted.includes(eachCourse["id"])
                        ? 100
                        : eachCourse.progress}
                      % Progress)
                    </span>
                  </div>
                  <div
                    className="DashboardProgressbar"
                    style={{
                      background: `linear-gradient(to right, #34db87 ${
                        CourseStatusCompleted.includes(eachCourse["id"])
                          ? 100
                          : eachCourse.progress
                      }%, #c9d1cc ${100 - eachCourse.progress}%)`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}

      {UserData.wishlist.length ? (
        <div className="myWishlist">
          <div className="fs-5 fw-bold">My Wishlist</div>
          <div className="d-flex align-items-center justify-content-start flex-wrap gap-2 mt-4">
            {UserData.wishlist.map((courseID) => {
              let course = AllCourses[courseID - 1];
              if (!UserData.enrolled.includes(courseID)) {
                return (
                  <CourseTile
                    course={course}
                    userID={userID}
                    UserData={UserData}
                    key={courseID}
                  />
                );
              } else {
                return "";
              }
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserDashboard;
