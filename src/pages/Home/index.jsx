import React from "react";
import Home from "../../components/Home";
import classes from "./Home.module.css";

const HomePage = () => {
  return (
    <div className={classes["home-wrapper"]}>
      <Home />
    </div>
  );
};

export default HomePage;
