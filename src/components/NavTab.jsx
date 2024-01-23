import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

import "../styles/navtab_style.css";
import SearchSuggestionbox from "./SearchSuggestionbox";
import { Link, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { handleSignOut } from "../firebase/FirebaseSignIn";
import { GlobalStateContext } from "../Globals/context";

const NavTab = ({AllCourses}) => {
  const [suggestBox, setSuggestBox] = useState(false);

  const {searchInput, setSearchInput} = useContext(GlobalStateContext)

  // --------------------------------------------------------------
  // Global login data from redux
  const selector = useSelector((state) => state.login);

  const memoizedData = useMemo(() => {
    return {
      loginStatus: selector.userlogin,
    };
  }, [selector]);

  const [loginStatus, setloginStatus] = useState(false);

  useEffect(() => {
    setloginStatus(memoizedData.loginStatus);
  }, [memoizedData]);

  // ------------------------------------------
  // Add the event to document to close the searchbar when clicked outside the search bar
  const searchBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        // console.log("activated");
        setSuggestBox(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        sticky="top"
        className="bg-primary"
        style={{ height: "70px" }}
      >
        <div className="mainNav">
          <div className="fs-4 fw-semibold" tooltip="Home">
            <Link to="/" className="logo">
              Free Online Courses Platform
            </Link>
          </div>
          <div className="search-bar">
            <span className="search-icon">
              <Search size={22} />
            </span>
            <input
              type="text"
              name="text"
              id="text_input"
              value={searchInput}
              ref={searchBarRef}
              placeholder="Search for Courses or Instructors"
              onChange={(e) => setSearchInput(e.target.value.trim())}
              onFocus={() => setSuggestBox(true)}
              // onBlur={() => setSuggestBox(false)}
            />
            {suggestBox && AllCourses.length !== 0 &&(
              <SearchSuggestionbox
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                setSuggestBox={setSuggestBox}
                AllCourses = {AllCourses}
              />
            )}
          </div>
          {!loginStatus ? (
            <div className="userLogin">
              <div className="SignUp">
                <Link
                  to="/user"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Sign up
                </Link>
              </div>
              <div className="login">
                <Link
                  to="/user"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log In
                </Link>
              </div>
            </div>
          ) : (
            <div className="loginprofile">
              <div className="mydashboard">
                <Link
                  to="/dashboard"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  My Dashboard
                </Link>
              </div>
              <div className="exit" onClick={() => handleSignOut()}>
                Log out
              </div>
            </div>
          )}
        </div>
      </Navbar>
      <Outlet/>
    </>
  );
};

export default NavTab;
