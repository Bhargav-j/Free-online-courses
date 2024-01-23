import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import "../styles/CoursesListing_style.css";
import CourseTile from "./CourseTile";
import { useSelector } from "react-redux";
import { GlobalStateContext } from "../Globals/context";
import { initialUserObject } from "../Globals/Reducers";

const CourseListingPage = ({ AllCourses }) => {
  //---------------------------------------------------------------------
  // Global search bar input text and selected course categories from Global context
  const { searchInput, selectedcategories, setselectedcategories } =
    useContext(GlobalStateContext);

  const [categories, setCategories] = useState([]);
  const [categoryDiv, setCategoryDiv] = useState(false);

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

  //-------------------------------------------------------------------
  // Storing the unique categories list on initial component load
  useEffect(() => {
    let categoryList = AllCourses.map((each) => each.category);

    const uniqueCategories = [...new Set(categoryList)];
    setCategories(uniqueCategories);
  }, [AllCourses]);

  const [displayCourses, setDisplayCourses] = useState([]);


  //--------------------------------------------------------------------
  // Changing the courses that need to be displayed based on selected courses categories
  useEffect(() => {
    if (selectedcategories.length !== 0) {
      let newArray = [];

      AllCourses.map((each) => {
        if (selectedcategories.includes(each.category)) {
          newArray.push(each);
        }
        return null;
      });

      setDisplayCourses(newArray);
    } else {
      setDisplayCourses(AllCourses);
    }
  }, [selectedcategories, AllCourses]);

  //------------------------------------------------------------
  // Selecting the courses categories based on category check button click
  const CategorySelectfun = (event, each) => {
    if (event.target.checked) {
      setselectedcategories([...selectedcategories, each]);   // Updated to global context
    } else {
      setselectedcategories((selectedcategories) => {
        const newArray = selectedcategories.filter((item) => item !== each);
        return newArray;
      });
    }
  };

  return (
    <Container className="courses-container">
      <div className="lftClm">
        <p
          className="m-2 fs-4 coursesheading"
          onClick={() => setCategoryDiv(!categoryDiv)}
        >
          Categories
        </p>
        <div className="categories">
          {categories.map((each) => (
            <div key={each} className="m-2">
              <input
                type="checkbox"
                className="btn-check"
                id={each}
                autoComplete="off"
                onClick={(event) => CategorySelectfun(event, each)}
              />
              <label
                className="btn btn-outline-primary text-dark"
                htmlFor={each}
              >
                {each}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="RhtClm">
        <p>
          {selectedcategories.length !== 0
            ? "Selected Categories Courses"
            : "All Courses"}
        </p>
        <div className="coursesContent  d-flex flex-wrap align-items-center justify-content-evenly">
          {displayCourses.map((course) => {
            if (!searchInput) {
              return (
                <CourseTile
                  course={course}
                  userID={userID}
                  UserData={UserData}
                  key={course.id}
                />
              );
            } else if (
              course["name"]
                .toLowerCase()
                .startsWith(searchInput.toLowerCase()) ||
              course["instructor"]
                .toLowerCase()
                .startsWith(searchInput.toLowerCase())
            ) {
              return (
                <CourseTile
                  course={course}
                  userID={userID}
                  UserData={UserData}
                  key={course.id}
                />
              );
            } else {
              return "";
            }
          })}
        </div>
      </div>
    </Container>
  );
};

export default CourseListingPage;
