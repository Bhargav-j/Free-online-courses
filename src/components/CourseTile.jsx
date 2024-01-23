import React from "react";
import "../styles/CourseTile_style.css";
import ex_tile from "../images/ex tile.jpg";
import { Link, useNavigate } from "react-router-dom";
import { updateUserObject } from "../Globals/actionTypes";
import { useDispatch } from "react-redux";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
import { manageUpdateUser } from "../firebase/CRUDoperations";

const CourseTile = ({ course, userID, UserData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let wishlistNew = [...UserData.wishlist];


  //--------------------------------------------------
  // Add pr remove the course to wishlit
  const addWishlistFun = () => {
    if (userID) {
      if (wishlistNew.includes(course.id)) {
        wishlistNew = wishlistNew.filter((item) => item !== course.id);
      } else {
        wishlistNew.push(course.id);
      }

      dispatch(updateUserObject("wishlist", wishlistNew));  //global state update
      manageUpdateUser(userID, "wishlist", wishlistNew);    // firebase database update
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="CourseTile">
      <div className="Content">
        <div className="tileImg">
          <Link to={`/${course.id}`}>
            <img src={ex_tile} alt="Img" />
          </Link>
        </div>
        <div className="tileContent">
          <div className="title">{course.name}</div>
          <div className="instructor">Instructor : {course.instructor}</div>
          <div className="category">{course.category}</div>
          <div className="info">
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
              {" "}
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
        </div>
      </div>
      <div className="status">
        <div className="wishlist" onClick={() => addWishlistFun()}>
          {userID ? (
            !UserData.wishlist.includes(course.id) &&
            !UserData.enrolled.includes(course.id) ? (
              <>
                <span>
                  <Bookmark />
                </span>
                wishlist
              </>
            ) : UserData.wishlist.includes(course.id) &&
              !UserData.enrolled.includes(course.id) ? (
              <>
                <span>
                  <BookmarkFill />
                </span>
                wishlisted
              </>
            ) : (
              <span className="fw-semibold fs-6 text-success">
                {(() => {
                  let progress;
                  let count = 0;
                  while (count < UserData.status.length) {
                    if (UserData.updatedStatus.includes(course.id)) {
                      progress = 100;
                      break;
                    }
                    if (UserData.status[count].id === course.id) {
                      progress = UserData.status[count].progress;
                      break;
                    }
                    count++;
                  }
                  return progress !== undefined
                    ? `${progress}% Complete`
                    : "Progress not found";
                })()}
              </span>
            )
          ) : (
            <>
              <span>
                <Bookmark />
              </span>
              wishlist
            </>
          )}
        </div>
        <div>
          <Link style={{ textDecoration: "none" }} to={`/${course.id}`}>
            {!UserData.enrolled.includes(course.id)
              ? course.enrollmentStatus
              : "In Progress"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseTile;
