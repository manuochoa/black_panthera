import React from "react";
import Home from "../../components/Home";
import classes from "./Home.module.css";

const HomePage = ({
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

  return (
    <div className={classes["home-wrapper"]}>
      <Home
        wallet={wallet}
        walletProvider={walletProvider}
        setIsShowWalletModal={setIsShowWalletModal}
        disconnectWallet={disconnectWallet}
        userAddress={userAddress}
        showModal={showModal}
        chainId={chainId}
        isChain={isChain}
        unknownNetwork={unknownNetwork}
      />
    </div>
  );
};

export default HomePage;
