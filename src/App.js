import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CourseListingPage from "./components/CourseListingPage";
import { Routes, Route } from "react-router-dom";
import CourseDescriptionPage from "./components/CourseDescriptionPage";
import UserDashboard from "./components/UserDashboard";
import NavTab from "./components/NavTab";
import SignInPage from "./components/SignInPage";
import { GlobalContextProvider } from "./Globals/context";
import { useEffect, useState } from "react";
import { CoursesDatabaseFetch } from "./firebase/CRUDoperations";
import LoadingPage from "./components/LoadingPage";

function App() {
  const [AllCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const courses = await CoursesDatabaseFetch();
      if (courses) {
        setAllCourses(courses);
        setLoading(false);
      } else {
        window.location.reload();
      }
    })();
  }, []);

  return (
    <GlobalContextProvider>
      <div className="App">
        <Routes>
          {loading ? (
            <>
              <Route path="/" element={<LoadingPage />} />
              <Route path="/user" element={<SignInPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<NavTab AllCourses={AllCourses} />}>
                <Route
                  path="/"
                  exact
                  element={<CourseListingPage AllCourses={AllCourses} />}
                />
                <Route
                  path="/:Courseid"
                  element={<CourseDescriptionPage AllCourses={AllCourses} />}
                />
                <Route
                  path="/dashboard"
                  element={<UserDashboard AllCourses={AllCourses} />}
                />
              </Route>
              <Route path="/user" element={<SignInPage />} />
            </>
          )}
        </Routes>
      </div>
    </GlobalContextProvider>
  );
}

export default App;
