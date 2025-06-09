import React from "react";
import { useGlobalState } from "./GlobalProvider";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnAuthenticatedRoutes from "./routes/UnAuthenticatedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"
import { useEffect } from "react";
import { generateToken, messaging } from "../src/utils/firebase";
import { onMessage } from "firebase/messaging";

function App() {
  const { globalState } = useGlobalState();

  const renderLayout = () => {
    if (globalState?.user) {
      return <AuthenticatedRoutes />;
    } else {
      return <UnAuthenticatedRoutes />;
    }
  };
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);

  return (
    <>
      {renderLayout()}
      <ToastContainer />
    </>
  );
}

export default App;
