import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

function Dashboard() {
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Dashboard" selectedItem="Dashboard" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-4 vh-100 d-flex justify-content-center align-items-center">
          <h1>Comming Soon</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
