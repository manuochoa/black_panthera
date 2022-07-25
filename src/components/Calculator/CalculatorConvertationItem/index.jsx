import React from "react";
import Dropdown from "../../Dropdown";
import classes from "./index.module.css";

const CalculatorConvertationItem = ({
  options,
  defaultOption,
  dropdownImg,
  dropdownHandler,
  setImg,
  children,
  chainId,
}) => {
  return (
    <div className={classes["convertation-item"]}>
      <div>
        <div className={classes["convertation-title"]}>
          <img src={dropdownImg} alt="dropdown logo" />
          <span className={classes["text"]}>{defaultOption.value}</span>
        </div>
        <div className={classes["dropdown-wrapper"]}>
          <Dropdown.Custom
            dropdownHandler={dropdownHandler}
            options={options}
            defaultValue={defaultOption}
            chainId={chainId}
          />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CalculatorConvertationItem;
