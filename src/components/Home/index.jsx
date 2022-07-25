import React from "react";
import Calculator from "../Calculator";
import classes from "./Home.module.css";
import logo from "../../assets/png/logo.png";
import leftSideCoins from "../../assets/png/home-page-left-side-coins.png";
import rightSideCoins from "../../assets/png/home-page-right-side-coins.png";

const Home = ({
  wallet,
  walletProvider,
  setIsShowWalletModal,
  disconnectWallet,
  userAddress,
  showModal,
  chainId,
  unknownNetwork,
}) => {
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
      <Calculator
        unknownNetwork={unknownNetwork}
        chainId={chainId}
        wallet={wallet}
        walletProvider={walletProvider}
        setIsShowWalletModal={setIsShowWalletModal}
        userAddress={userAddress}
        showModal={showModal}
      />
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
