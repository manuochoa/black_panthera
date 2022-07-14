import React, { useState } from "react";
import classes from "./index.module.css";
import ethIcon from "../../assets/png/ehtIcon.png";
import inchIcon from "../../assets/png/inchIcon.png";
import binanceIcon from "../../assets/png/binanceIcon.png";
import CalculatorConvertationItem from "./CalculatorConvertationItem";
import Dropdown from "../Dropdown";

const Calculator = () => {
  const [isInputsReverted, setIsInputsReverted] = useState(false);
  const options = [
    { value: "ETH", label: "Ethereum", icon: ethIcon },
    { value: "1INC", label: "1inch Network (1INCH)", icon: inchIcon },
  ];

  const [dropdownOneImg, setDropdownOneImg] = useState("ethIcon");
  const [dropdownTwoImg, setDropdownTwoImg] = useState("inchIcon");

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const dropdownHandlerOne = (selectedOption) => {
    if (selectedOption.value === "1INCH") {
      setDropdownOneImg("inchIcon");
    } else setDropdownOneImg("ethIcon");
  };

  const dropdownHandlerTwo = (selectedOption) => {
    if (selectedOption.value === "1INCH") {
      setDropdownTwoImg("inchIcon");
    } else setDropdownTwoImg("ethIcon");
  };

  const setImg = (img) => {
    return img === "inchIcon" ? inchIcon : ethIcon;
  };

  const switchInputs = () => {
    setIsInputsReverted((prev) => !prev);
  };

  return (
    <div className={classes["calculator-wrapper"]}>
      <div className={classes["calculator-dropdown"]}>
        <Dropdown.Common
          options={[
            {
              value: "Binance Smart Chain",
              label: "Binance Smart Chain",
              icon: binanceIcon,
            },
          ]}
          defaultValue={{
            value: "Binance Smart Chain",
            label: "Binance Smart Chain",
            icon: binanceIcon,
          }}
        />
      </div>
      <div className={classes["calculator-container"]}>
        <div className={`${classes["left-side"]} ${classes["card-default"]}`}>
          {!isInputsReverted ? (
            <CalculatorConvertationItem
              text="From"
              dropdownHandler={dropdownHandlerOne}
              dropdownImg={dropdownOneImg}
              defaultOption={options[0]}
              options={options}
              setImg={setImg}
            >
              <div className={classes["line-left"]} />
              <div className={classes["balance-container"]}>
                <p>You Send</p>
                <p>Balance: 3.43</p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="text"
                  value={3.063}
                  className={classes["calc-input"]}
                  onChange={() => {}}
                />
                <button className={classes["convertation-item-max"]}>
                  MAX
                </button>
              </div>
            </CalculatorConvertationItem>
          ) : (
            <CalculatorConvertationItem
              text="From"
              dropdownHandler={dropdownHandlerTwo}
              dropdownImg={dropdownTwoImg}
              defaultOption={options[1]}
              options={options}
              setImg={setImg}
            >
              <div className={classes["line-left"]} />
              <div className={classes["balance-container"]}>
                <p>You Recieve</p>
                <p>Balance: 0</p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="text"
                  value={12675.64}
                  className={classes["calc-input"]}
                  onChange={() => {}}
                />
                <button className={classes["convertation-item-max"]}>
                  MAX
                </button>
              </div>
            </CalculatorConvertationItem>
          )}
        </div>
        <button className={classes["reverse-button"]} onClick={switchInputs} />
        <div className={`${classes["right-side"]} ${classes["card-default"]}`}>
          {!isInputsReverted ? (
            <CalculatorConvertationItem
              text="To"
              dropdownHandler={dropdownHandlerTwo}
              dropdownImg={dropdownTwoImg}
              defaultOption={options[1]}
              options={options}
              setImg={setImg}
            >
              <div className={classes["line-right"]} />
              <div className={classes["balance-container"]}>
                <p>You Recieve</p>
                <p>Balance: 0</p>
              </div>
              <p className={classes["total"]}>12, 675.64</p>
            </CalculatorConvertationItem>
          ) : (
            <CalculatorConvertationItem
              text="To"
              dropdownHandler={dropdownHandlerOne}
              dropdownImg={dropdownOneImg}
              defaultOption={options[0]}
              options={options}
              setImg={setImg}
            >
              <div className={classes["line-right"]} />
              <div className={classes["balance-container"]}>
                <p>You Send</p>
                <p>Balance: 3.43</p>
              </div>
              <p className={classes["total"]}>3, 063</p>
            </CalculatorConvertationItem>
          )}
        </div>
      </div>
      {!isWalletConnected ? (
        <button
          className={classes["calc-button"]}
          onClick={() => setIsWalletConnected(true)}
        >
          CONNECT WALLET
        </button>
      ) : (
        <button
          className={classes["calc-button"]}
          onClick={() => setIsWalletConnected(false)}
        >
          SWAP
        </button>
      )}
    </div>
  );
};

export default Calculator;
