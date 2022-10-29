import React, { useEffect } from "react";
import Calculator from "../Calculator";
import classes from "./Home.module.css";
import logo from "../../assets/png/logo.png";
import leftSideCoins from "../../assets/png/home-page-left-side-coins.png";
import rightSideCoins from "../../assets/png/home-page-right-side-coins.png";
import { NetworkTokensHook } from "../../hooks/tokenHooks";
import { ContractUtility } from "../../utility/contractUtility";
import { useMemo } from "react";

const Home = ({
  wallet,
  walletProvider,
  setIsShowWalletModal,
  disconnectWallet,
  userAddress,
  showModal,
  chainId,
  isChain,
  unknownNetwork,
}) => {

  const { getTokens, loading, data, error } = NetworkTokensHook();

  useEffect(() => {
    const get = () => {
      const symbol = ContractUtility.getSymbol(chainId.toString());
      getTokens(symbol);
    };
    isChain && get();
  }, [chainId, isChain]);

  const logoUri = useMemo(() => {
    if (data) {
      return data.map((item) => item.logoURI)
    }

  }, [data]);
  console.log("logoUri", logoUri)
  return (
    <div className={classes["home-container"]}>
      <header className={classes["header"]}>
        <div>
          <img src={logo} alt="logo" />
        </div>
        <button
          onClick={userAddress ? disconnectWallet : showModal}
          className={classes["connect-wallet"]}
        >
          {userAddress
            ? `${userAddress.slice(0, 6)}...
            ${userAddress.slice(-10)}`
            : " Connect Wallet"}
        </button>
      </header>
      {
        data &&  <Calculator
        unknownNetwork={unknownNetwork}
        chainId={chainId}
        wallet={wallet}
        walletProvider={walletProvider}
        setIsShowWalletModal={setIsShowWalletModal}
        userAddress={userAddress}
        networkTokens={data}
        logoUri={logoUri}

        showModal={showModal}
      />
      }
     
      <div className={classes["left-side-coins"]}>
        <img src={leftSideCoins} alt="home-page-left-side-coins" />
      </div>
      <div className={classes["right-side-coins"]}>
        <img src={rightSideCoins} alt="home-page-right-side-coins" />
      </div>
    </div>
  );
};

export default Home;
