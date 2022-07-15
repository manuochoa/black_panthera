import React from "react";
import Home from "../../components/Home";
import classes from "./Home.module.css";

const HomePage = ({showModal}) => {
  return (
    <div className={classes["home-wrapper"]}>
      <Home showModal={showModal} />
    </div>
  );
};

export default HomePage;
