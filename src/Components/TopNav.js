import React from "react";
import { useGlobalState } from "../GlobalProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom"
function TopNav() {
  const navigate = useNavigate()
  const { globalState, setGlobalState } = useGlobalState();
  
  const handleLogoutFunc = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );
    if(confirmed){
      setGlobalState({
        user: null,
        token: null,
        permissions: null,
      });
      toast.success("Admin logged out successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      navigate("/")
    }
    
  };
  return (
    <div className="topNavMain p-3  p-md-4 ">
      <div className="d-flex justify-content-between align-items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/2976/2976215.png"
          onClick={() =>
            setGlobalState({
              ...globalState,
              showFullSidebar: !globalState.showFullSidebar,
            })
          }
          className="barIcon"
        />
        <div className="d-flex align-items-center navRightDiv">
          <div className="me-3 notificationDiv d-flex">
            <img src="https://cdn-icons-png.flaticon.com/128/3602/3602123.png" />
            <p>2</p>
          </div>
          <div
            className="d-flex align-items-center me-0 me-md-4"
            style={{ cursor: "pointer" }}
          >
            <img
              src={globalState?.user?.profilePic}
              style={{ borderRadius: "50%" }}
            />
            <p className="mb-0 ms-2  text-bold" style={{ color: "white" }}>
              {globalState?.user?.firstName + " " + globalState?.user?.lastName}
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/128/18387/18387745.png"
              style={{
                borderRadius: "50%",
                height: "20px",
                width: "20px",
                filter: "brightness(0) invert(1)",
              }}
              className="ms-3"
              onClick={() => handleLogoutFunc()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
