import React, { useState } from "react";
import { useEffect } from "react";
import { TokenInfoHook } from "../../../hooks/tokenHooks";
import Dropdown from "../../Dropdown";
import classes from "./index.module.css";

const CalculatorConvertationItem = ({
  options,
  defaultOption,
  dropdownImg,
  dropdownHandler,
  setImg,
  children,
  networkTokens,
  wallet,
  walletProvider,
  chainId,
}) => {

  return (
    <div className={classes["convertation-item"]}>
      <div>
        <div className={classes["convertation-title"]}>
          {networkTokens && <img src={dropdownImg} alt="dropdown logo" />}
        </div>
        <div className={classes["dropdown-wrapper"]}>
          <Dropdown.Custom
            dropdownHandler={dropdownHandler}
            options={options}
            defaultValue={defaultOption}
            chainId={chainId}
            networkTokens={networkTokens}
          />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CalculatorConvertationItem;
