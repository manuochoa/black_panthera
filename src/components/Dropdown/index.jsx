import React, { useEffect, useState } from "react";
import classesIndex from "./index.module.css";
import classesCustom from "./custom.module.css";
import Polygon from "../../assets/png/polygon.png";
import ArrowBottom from "../../assets/png/arrow-bottom.png";

const Common = ({ defaultValue, getValue, options }) => {
  const [value, setValue] = useState(
    defaultValue || { label: "", value: "", icon: "" }
  );
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    if (getValue) getValue(value);
  }, [value, getValue]);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const chooseNewOption = (option) => {
    setValue(option);
    setIsOptionsOpen(false);
  };

  return (
    <div className={classesIndex["dropdown-wrapper"]}>
      <div
        onClick={toggleOptions}
        className={classesIndex["dropdown-value-container"]}
      >
        <img src={value.icon} alt="icon" />
        <p>{value.label}</p>
        <div className={classesIndex["dropdown-arrow"]}>
          <img src={Polygon} alt="arrow" />
        </div>
      </div>
      {isOptionsOpen && (
        <div className={classesIndex["dropdown-options-container"]}>
          {options.map((option) => (
            <div
              key={`--option-${option.value}-${option.icon}`}
              onClick={() => chooseNewOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Custom = ({ defaultValue, getValue, options }) => {
  const [value, setValue] = useState(defaultValue || { label: "", value: "" });
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    if (getValue) getValue(value);
  }, [value, getValue]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const chooseNewOption = (option) => {
    setValue(option);
    setIsOptionsOpen(false);
  };

  return (
    <div className={classesCustom["dropdown-wrapper"]}>
      <div
        onClick={toggleOptions}
        className={classesCustom["dropdown-value-container"]}
      >
        <p>{value.label}</p>
        <div className={classesCustom["dropdown-arrow"]}>
          <img src={ArrowBottom} alt="arrow" />
        </div>
      </div>
      {isOptionsOpen && (
        <div className={classesIndex["dropdown-options-container"]}>
          {options.map((option) => (
            <div
              key={`--option-${option.value}-${option.icon}`}
              onClick={() => chooseNewOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dropdown = {
  Common,
  Custom,
};

export default Dropdown;
