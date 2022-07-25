import React, { useState, useEffect } from "react";
import classes from "./index.module.css";
import ethIcon from "../../assets/png/ehtIcon.png";
import inchIcon from "../../assets/png/inchIcon.png";
import binanceIcon from "../../assets/png/binanceIcon.png";
import CalculatorConvertationItem from "./CalculatorConvertationItem";
import Dropdown from "../Dropdown";
import tokens from "../../common/tokensList/tokenList.json";
import { ethers, providers } from "ethers";
import { router, factory, providerRpc } from "../../common/addresses";
import { factoryAbi, routerAbi, ercAbi } from "../../common/abis";

const Calculator = ({
  unknownNetwork,
  chainId,
  wallet,
  walletProvider,
  setIsShowWalletModal,
  userAddress,
  showModal,
}) => {
  const [options, setOptions] = useState(
    tokens[chainId].map((el) => el.symbol)
  );
  const [isInputsReverted, setIsInputsReverted] = useState(false);
  const [firstInputValue, setFirstInputValue] = useState(0);
  const [secondInputValue, setSecondInputValue] = useState(0);
  const [dropdownOneImg, setDropdownOneImg] = useState(
    tokens[chainId][0].logoURI
  );
  const [dropdownTwoImg, setDropdownTwoImg] = useState(
    tokens[chainId][1].logoURI
  );
  const [addressIn, setAddressIn] = useState(tokens[chainId][0].address);
  const [symbolIn, setSymbolIn] = useState(tokens[chainId][0].symbol);
  const [addressOut, setAddressOut] = useState(tokens[chainId][1].address);
  const [symbolOut, setSymbolOut] = useState(tokens[chainId][1].symbol);
  const [tokenIn, setTokenIn] = useState({
    balance: "0",
    isAllowed: false,
  });
  const [tokenOut, setTokenOut] = useState({
    balance: "0",
    isAllowed: false,
  });
  const [slippage, setSlippage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [enoughAllowance, setEnoughAllowance] = useState(true);
  const [trade, setTrade] = useState({
    amountIn: "",
    amountOut: "",
    amountOutMin: "",
    slippage: "30",
  });
  const [exchangeRate, setExchangeRate] = useState("");
  const [gasPrice, setGasPrice] = useState("");

  const dropdownHandlerOne = (selectedOption) => {
    let token = tokens[chainId].find(
      (el) => selectedOption.value === el.symbol
    );
    console.log(selectedOption, "selected", chainId, token);
    getTokenBalance(token.address, "first");
    setDropdownOneImg(token.logoURI);
    setAddressIn(token.address);
    setSymbolIn(token.symbol);
  };

  const dropdownHandlerTwo = (selectedOption) => {
    let token = tokens[chainId].find(
      (el) => selectedOption.value === el.symbol
    );
    getTokenBalance(token.address, "second");
    setDropdownTwoImg(token.logoURI);
    setAddressOut(token.address);
    setSymbolOut(token.symbol);
  };

  const setImg = (img) => {
    return img === "inchIcon" ? inchIcon : ethIcon;
  };

  const getSwapAmount = async (type, amount) => {
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);

    let routerInstance = new ethers.Contract(
      router[chainId],
      routerAbi,
      provider
    );
    let WETH =
      Number(chainId) !== 43114
        ? await routerInstance.WETH()
        : await routerInstance.WAVAX();
    let inDecimals = tokens[chainId].find(
      (el) => el.address === addressIn
    ).decimals;
    let outDecimals = tokens[chainId].find(
      (el) => el.address === addressOut
    ).decimals;

    console.log(WETH, "WETH");

    let path;

    switch (type) {
      case "first":
        if (amount > 0) {
          if (addressIn === "0x0000000000000000000000000000000000000000") {
            path = [WETH, addressOut];
          } else if (
            addressOut === "0x0000000000000000000000000000000000000000"
          ) {
            path = [addressIn, WETH];
          } else {
            path = [addressIn, WETH, addressOut];
          }
          let amountsOut = await routerInstance.getAmountsOut(
            ethers.utils.parseUnits(amount, inDecimals),
            path
          );
          return ethers.utils.formatUnits(amountsOut.at(-1), outDecimals);
        }
        break;
      case "second":
        if (amount > 0) {
          if (addressOut === "0x0000000000000000000000000000000000000000") {
            path = [addressIn, WETH];
          } else if (
            addressIn === "0x0000000000000000000000000000000000000000"
          ) {
            path = [WETH, addressOut];
          } else {
            path = [addressIn, WETH, addressOut];
          }
          let amountsIn = await routerInstance.getAmountsIn(
            ethers.utils.parseUnits(amount, outDecimals),
            path
          );
          return ethers.utils.formatUnits(amountsIn[0], inDecimals);
        }
        break;

      default:
        break;
    }
  };

  const approveToken = async () => {
    setIsLoading(true);
    try {
      let web3Provider;

      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let newInstance = new ethers.Contract(
        !isInputsReverted ? addressIn : addressOut,
        ercAbi,
        signer
      );

      let receipt = await newInstance.approve(
        router[chainId],
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      console.log("swap");

      if (addressIn === addressOut) {
        throw "Address in and out are the same";
      }
      let exchangeType;

      if (addressIn === "0x0000000000000000000000000000000000000000") {
        exchangeType = !isInputsReverted ? "ETHtoToken" : "tokenToEth";
      } else if (addressOut === "0x0000000000000000000000000000000000000000") {
        exchangeType = !isInputsReverted ? "tokenToEth" : "ETHtoToken";
      } else {
        exchangeType = "tokenToToken";
      }

      let inDecimals = tokens[chainId].find(
        (el) => el.address === addressIn
      ).decimals;
      let outDecimals = tokens[chainId].find(
        (el) => el.address === addressOut
      ).decimals;

      let amountIn = ethers.utils.parseUnits(
        !isInputsReverted
          ? Number(firstInputValue).toString()
          : Number(secondInputValue).toString(),
        !isInputsReverted ? inDecimals : outDecimals
      );
      let amountOutMin = ethers.utils.parseUnits(
        !isInputsReverted
          ? truncate(
              secondInputValue - (secondInputValue * slippage) / 100,
              6
            ).toString()
          : truncate(
              firstInputValue - (firstInputValue * slippage) / 100,
              6
            ).toString(),
        !isInputsReverted ? outDecimals : inDecimals
      );

      let web3Provider;

      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let routerInstance = new ethers.Contract(
        router[chainId],
        routerAbi,
        signer
      );

      let WETH =
        Number(chainId) !== 43114
          ? await routerInstance.WETH()
          : await routerInstance.WAVAX();
      let path = !isInputsReverted
        ? [addressIn, addressOut]
        : [addressOut, addressIn];

      if (addressIn === "0x0000000000000000000000000000000000000000") {
        path = !isInputsReverted ? [WETH, addressOut] : [addressOut, WETH];
      } else if (addressOut === "0x0000000000000000000000000000000000000000") {
        path = !isInputsReverted ? [addressIn, WETH] : [WETH, addressIn];
      }

      let tx;
      let deadline = Date.now() + 1000 * 60 * 10;
      let gasLimit = 300000;

      if (exchangeType === "ETHtoToken") {
        tx =
          await routerInstance.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            path,
            userAddress,
            deadline,
            { value: amountIn, gasLimit }
          );
      } else if (exchangeType === "tokenToEth") {
        tx =
          await routerInstance.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            userAddress,
            deadline,
            { gasLimit }
          );
      } else if (exchangeType === "tokenToToken") {
        if (path[0] !== WETH && path[1] !== WETH) {
          path[2] = path[1];
          path[1] = WETH;
        }
        tx =
          await routerInstance.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            userAddress,
            deadline,
            { gasLimit }
          );
      }

      let receipt = await tx.wait();
      getBalances();
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.log(error, "handleSwap");
    }
    setIsLoading(false);
  };

  const truncate = (value, numDecimalPlaces) =>
    Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
    Math.pow(10, numDecimalPlaces);

  const getTokenBalance = async (address, type) => {
    console.log(address);
    if (!userAddress) {
      return;
    }
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);

    let tokenInstance = new ethers.Contract(address, ercAbi, provider);

    let balance;
    let isAllowed;

    if (address === "0x0000000000000000000000000000000000000000") {
      balance = await provider.getBalance(userAddress);
      isAllowed = true;
    } else {
      balance = await tokenInstance.balanceOf(userAddress);
      let allowance = await tokenInstance.allowance(
        userAddress,
        router[chainId]
      );
      isAllowed = Number(allowance) > 0;
      console.log(
        Number(allowance),
        address,
        providerRpc[chainId],
        router[chainId],
        "allowance",
        isAllowed
      );
    }

    switch (type) {
      case "first":
        setTokenIn({
          balance: Number(balance / 10 ** 18),
          isAllowed,
        });
        break;
      case "second":
        setTokenOut({
          balance: Number(balance / 10 ** 18),
          isAllowed,
        });
        break;

      default:
        break;
    }
  };

  const handleInputChange = async (e, type) => {
    let amount = e;
    switch (type) {
      case "first":
        setFirstInputValue(amount);
        setSecondInputValue(await getSwapAmount(type, amount));
        break;
      case "second":
        setSecondInputValue(amount);
        setFirstInputValue(await getSwapAmount(type, amount));
        break;

      default:
        break;
    }
  };

  const getBalances = async () => {
    if (userAddress) {
      getTokenBalance(addressIn, "first");
      getTokenBalance(addressOut, "second");
    }
  };

  const getExchangeRate = async () => {
    let type = !isInputsReverted ? "first" : "second";
    let rate = await getSwapAmount(type, "1");
    setExchangeRate(rate);
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);
    setGasPrice(
      ethers.utils.formatUnits(await provider.getGasPrice()) * 200000
    );
  };

  useEffect(() => {
    dropdownHandlerOne({ value: options[0] });
    dropdownHandlerTwo({ value: options[1] });
  }, []);

  useEffect(() => {
    getBalances();
  }, [userAddress]);

  useEffect(() => {
    setAddressIn(tokens[chainId][0].address);
    setAddressOut(tokens[chainId][1].address);
    setOptions(tokens[chainId].map((el) => el.symbol));
    setDropdownOneImg(tokens[chainId][0].logoURI);
    setDropdownTwoImg(tokens[chainId][1].logoURI);
    setSymbolIn(tokens[chainId][0].symbol);
    setSymbolOut(tokens[chainId][1].symbol);
    getExchangeRate();
  }, [chainId]);

  useEffect(() => {
    getExchangeRate();
  }, [addressIn, addressOut, isInputsReverted]);

  const switchInputs = () => {
    setIsInputsReverted((prev) => !prev);
  };

  return (
    <div className={classes["calculator-wrapper"]}>
      <div className={classes["calculator-dropdown"]}>
        {userAddress ? (
          <Dropdown.Common unknownNetwork={unknownNetwork} chainId={chainId} />
        ) : (
          <button
            className={classes["calc-button"]}
            onClick={() => setIsShowWalletModal(true)}
          >
            Connect Wallet
          </button>
        )}
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
              chainId={chainId}
            >
              <div className={classes["line-left"]} />
              <div className={classes["balance-container"]}>
                <p>You Send</p>
                <p>Balance: {truncate(tokenIn.balance, 6)} </p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={truncate(firstInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "first")}
                  className={classes["calc-input"]}
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
              chainId={chainId}
            >
              <div className={classes["line-left"]} />
              <div className={classes["balance-container"]}>
                <p>You Send</p>
                <p> Balance: {truncate(tokenOut.balance, 6)}</p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={truncate(secondInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "second")}
                  className={classes["calc-input"]}
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
              chainId={chainId}
            >
              <div className={classes["line-right"]} />
              <div className={classes["balance-container"]}>
                <p>You Recieve</p>
                <p> Balance: {truncate(tokenOut.balance, 6)}</p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={truncate(secondInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "second")}
                  className={classes["calc-input"]}
                />
                <button className={classes["convertation-item-max"]}>
                  MAX
                </button>
              </div>
              {/* <p className={classes["total"]}>12, 675.64</p> */}
            </CalculatorConvertationItem>
          ) : (
            <CalculatorConvertationItem
              text="To"
              dropdownHandler={dropdownHandlerOne}
              dropdownImg={dropdownOneImg}
              defaultOption={options[0]}
              options={options}
              setImg={setImg}
              chainId={chainId}
            >
              <div className={classes["line-right"]} />
              <div className={classes["balance-container"]}>
                <p>You Recieve</p>
                <p>Balance: {truncate(tokenIn.balance, 6)} </p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={truncate(firstInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "first")}
                  className={classes["calc-input"]}
                />
                <button className={classes["convertation-item-max"]}>
                  MAX
                </button>
              </div>
              {/* <p className={classes["total"]}>3, 063</p> */}
            </CalculatorConvertationItem>
          )}
        </div>
      </div>
      {/* {!isWalletConnected ? (
        <button className={classes["calc-button"]} onClick={() => showModal()}>
          CONNECT WALLET
        </button>
      ) : (
        <button
          className={classes["calc-button"]}
          disabled={unknownNetwork || isLoading}
          onClick={
            // userAddress ? handleSwap : () => setIsShowWalletModal(true)
            userAddress
              ? !isInputsReverted
                ? tokenIn.isAllowed
                  ? handleSwap
                  : approveToken
                : tokenOut.isAllowed
                ? handleSwap
                : approveToken
              : () => setIsShowWalletModal(true)
          }
        >
          {userAddress
            ? !isInputsReverted
              ? tokenIn.isAllowed
                ? "Swap"
                : "Approve Token"
              : tokenOut.isAllowed
              ? "Swap"
              : "Approve Token"
            : "Connect Wallet"}
        </button>
      )} */}
      {userAddress && (
        <button
          className={classes["calc-button"]}
          disabled={unknownNetwork || isLoading}
          onClick={
            // userAddress ? handleSwap : () => setIsShowWalletModal(true)
            !isInputsReverted
              ? tokenIn.isAllowed
                ? handleSwap
                : approveToken
              : tokenOut.isAllowed
              ? handleSwap
              : approveToken
          }
        >
          {!isInputsReverted
            ? tokenIn.isAllowed
              ? "Swap"
              : "Approve Token"
            : tokenOut.isAllowed
            ? "Swap"
            : "Approve Token"}
        </button>
      )}
    </div>
  );
};

export default Calculator;
