import React, { useContext, useEffect, useState } from "react";
import "../styles/searchSuggest_style.css";
import { ListGroup } from "react-bootstrap";
// import courseModel from "../data/courseModel";
import { GlobalStateContext } from "../Globals/context";

const SearchSuggestionbox = ({
  searchInput,
  setSearchInput,
  setSuggestBox,
  AllCourses,
}) => {
  // Get the selected Course Categories to display only suggestion based on categories
  const { selectedcategories } = useContext(GlobalStateContext);

  const [displayCourses, setDisplayCourses] = useState([]);

  // Display suggestions array on component mount
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

  return (
    <div className="search_suggest">
      <ListGroup className="search_suggest-list">
        {displayCourses.map((course) => {
          if (
            course["name"]
              .toLowerCase()
              .startsWith(searchInput.toLowerCase()) ||
            course["instructor"]
              .toLowerCase()
              .startsWith(searchInput.toLowerCase())
          ) {
            return (
              <ListGroup.Item
                key={course["id"]}
                onClick={() => {
                  setSuggestBox(false);
                  setSearchInput(course["name"]);
                }}
              >
                <div className="each-item-div">
                  <div className="fw-semibold">{course["name"]}</div>
                  <div>- {course["instructor"]}</div>
                </div>
              </ListGroup.Item>
            );
          } else {
            return "";
          }
        })}
      </ListGroup>
    </div>
  );
};

export default SearchSuggestionbox;
