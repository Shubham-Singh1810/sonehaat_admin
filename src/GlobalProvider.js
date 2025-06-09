import React, { createContext, useContext, useEffect, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(() => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: (localStorage.getItem("token")) || null,
    permissions: (localStorage.getItem("permissions")) || null,
    notificationList: 0,
    showFullSidebar: true,
    isMobile: window.innerWidth <= 768,
  }));

  useEffect(() => {
    const handleResize = () => {
      setGlobalState((prev) => ({ ...prev, isMobile: window.innerWidth <= 768 }));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value in case `useState` runs before window loads

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      globalState.showFullSidebar ? (globalState.isMobile ? "100%" : "20%") : "0%"
    );
  }, [globalState.showFullSidebar, globalState.isMobile]);

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
