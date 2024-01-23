import React from "react";
import LoadingTile from "./LoadingTile";
import { Container } from "react-bootstrap";
import NavTab from "./NavTab";

const LoadingPage = () => {
  return (
    <div>
      <NavTab AllCourses={[]} />
      <Container className="pt-4">
        <div className="loading d-flex flex-wrap align-items-center justify-content-evenly">
          {(() => {
            const elements = [];
            for (let index = 0; index < 10; index++) {
              elements.push(<LoadingTile key={index} />);
            }
            return elements;
          })()}
        </div>
      </Container>
    </div>
  );
};

export default LoadingPage;
