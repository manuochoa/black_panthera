import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ConnectWalletModal from "./components/ConnectWalletModal";
import HomePage from "./pages/Home";

function App() {
  const [isShowWalletModal, setIsShowWalletModal] = useState(false);

  const handleIsShowWalletModal = () => {
    setIsShowWalletModal(!isShowWalletModal);
  };

  React.useEffect(() => console.log(isShowWalletModal), [isShowWalletModal]);

  return (
    <BrowserRouter>
      {isShowWalletModal && (
        <ConnectWalletModal onClose={handleIsShowWalletModal} />
      )}
      <div className="main">
        <Routes>
          <Route
            exact
            path="/"
            element={<HomePage showModal={handleIsShowWalletModal} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
