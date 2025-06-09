import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getNotificationServ, deleteNotificationServ } from "../../services/notification.service";
import moment from "moment";
import socket from "../../utils/socket"; 
function NotificationList() {
  const [list, setList] = useState([]);
  const [payload, setPayload] = useState({
    notifyUser: "Admin",
    category: "All",
  });
  const getNotificationFunc = async () => {
    let updatedPayload ={
        notifyUser: "Admin",
        category: "",
      };
    try {
      let response = await getNotificationServ(updatedPayload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getNotificationFunc();
  }, [payload]);
  useEffect(() => {
    
    socket.on("notificationCreated", (data) => {
      console.log("📢 New Notification Received:", data);
      getNotificationFunc();
    });
    return () => {
      socket.off("notificationCreated");
    };
  }, []);
  const handleDeleteNotification =async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (confirmed) {
      try {
        let response = await deleteNotificationServ(id);
        if(response?.data?.statusCode=="200"){
          getNotificationFunc();
          toast.success(response?.data?.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  };
  const navItems = [
    {
      name: "All",
      count: list.filter((v, i) => {
        return v?.isRead == false;
      }).length,
    },
    {
      name: "Order",
      count: list.filter((v, i) => {
        return v?.isRead == false && v?.category == "Order";
      }).length,
    },
    {
      name: "Driver",
      count: list.filter((v, i) => {
        return v?.isRead == false && v?.category == "Driver";
      }).length,
    },
    {
      name: "Vendor",
      count: list.filter((v, i) => {
        return v?.isRead == false && v?.category == "Vendor";
      }).length,
    },
    {
      name: "User",
      count: list.filter((v, i) => {
        return v?.isRead == false && v?.category == "User";
      }).length,
    },
    {
      name: "Product",
      count: list.filter((v, i) => {
        return v?.isRead == false && v?.category == "Product";
      }).length,
    },
  ];
  return (
    <div className="bodyContainer">
      <Sidebar />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          ></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  {navItems?.map((v, i) => {
                    return (
                      <div
                        className="py-2 px-5 text-dark shadow mb-4 me-4 d-flex  justify-content-between"
                        style={{
                          background:
                            payload.category == v?.name ? "#05E2B5" : "#F9F6EE",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setPayload({
                            ...payload,
                            category: v?.name,
                          })
                        }
                      >
                        <h5 className="mb-0">{v?.name}</h5>
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            background: "red",
                            position: "relative",
                            left: "16px",
                            top: "12px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "500",
                            }}
                          >
                            {v?.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="contificationListMain">
              {list?.map((v, i) => {
                return (
                  <div
                    className="border p-2 mb-3 rounded shadow-sm d-flex justify-content-between"
                    style={{
                      opacity: i == 0 ? "1" : "0.8",
                      background: i == 0 ? "#F9F6EE" : "#fff",
                    }}
                  >
                    <div className="d-flex">
                      <div>
                        <img
                          src={v?.icon}
                          style={{
                            height: "60px",
                            width: "60px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div className="ms-3">
                        <h5 className="mb-1">{v?.title}</h5>
                        <p className="mb-0">{v?.subTitle}</p>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-end mt-2">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/5028/5028066.png"
                          style={{ height: "24px", cursor: "pointer" }}
                          onClick={() => handleDeleteNotification(v?._id)}
                        />
                      </div>
                      <span className="text-secondary mt-2">
                        {moment(v?.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationList;
