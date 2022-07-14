import React from "react";
import Calculator from "../Calculator";
import classes from "./Home.module.css";

const Home = () => {
  return (
    <div className={classes["home-container"]}>
      <header>
        <button className={classes["connect-wallet"]}>Connect Wallet</button>
      </header>
      <Calculator />
    </div>
  );
};

export default Home;
