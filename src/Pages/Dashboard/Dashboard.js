import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { dashboardDetailsServ } from "../../services/user.service";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
function Dashboard() {
  const [statics, setStatics] = useState(null);
  
   const [details, setDetails] = useState(null);
  const handleDashboardFunc = async () => {
    try {
      let response = await dashboardDetailsServ();
      setDetails(response?.data?.data);
    
    } catch (error) {}
  };
  useEffect(() => {
    handleDashboardFunc();
  }, []);
  const staticsArr = [
    {
      title: "Bookings",
      count: details?.bookings?.totalBooking,
      bgColor: "#6777EF",
      img: "https://cdn-icons-png.flaticon.com/128/7322/7322293.png",
      subMenu: [
        {
          title: "Active",
          count: details?.bookings?.activeBooking,
          bgColor: "#63ED7A",
        },
        {
          title: "Completed",
          count: details?.bookings?.bookingCompleted,
          bgColor: "#FFA426",
        },
      ],
    },
    {
      title: "Products",
      count: details?.products?.totalProduct,
      bgColor: "#6777EF",
      img: "https://cdn-icons-png.flaticon.com/128/3514/3514491.png",
      subMenu: [
        {
          title: "Active",
          count: details?.products?.singleProduct,
          bgColor: "#63ED7A",
        },
        {
          title: "Inactive",
          count: details?.products?.comboProduct,
          bgColor: "#FFA426",
        },
      ],
    },
    {
      title: "Funds",
      count: details?.products?.totalProduct,
      bgColor: "#6777EF",
      img: "https://cdn-icons-png.flaticon.com/128/3514/3514491.png",
      subMenu: [
        {
          title: "Earnings",
          count: details?.products?.singleProduct,
          bgColor: "#63ED7A",
        },
        {
          title: "Wallet",
          count: details?.products?.comboProduct,
          bgColor: "#FFA426",
        },
      ],
    },
    {
      title: "Users",
      count: details?.users?.totalUser,
      bgColor: "#6777EF",
      img: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
      subMenu: [
        {
          title: "Verified",
          count: details?.users?.activeUser,
          bgColor: "#63ED7A",
        },
        {
          title: "Incomplete",
          count: details?.users?.inactiveUser,
          bgColor: "#FFA426",
        },
      ],
    },
    {
      title: "Delivery Boys",
      count: details?.users?.totalUser,
      bgColor: "#6777EF",
      img: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
      subMenu: [
        {
          title: "Verified",
          count: details?.users?.activeUser,
          bgColor: "#63ED7A",
        },
        {
          title: "Incomplete",
          count: details?.users?.inactiveUser,
          bgColor: "#FFA426",
        },
      ],
    },
    {
      title: "Vendor",
      count: details?.users?.totalUser,
      bgColor: "#6777EF",
      img: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
      subMenu: [
        {
          title: "Verified",
          count: details?.users?.activeUser,
          bgColor: "#63ED7A",
        },
        {
          title: "Incomplete",
          count: details?.users?.inactiveUser,
          bgColor: "#FFA426",
        },
      ],
    },
    
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28",];
  const data = [
    { status: "Active", value: details?.bookings?.activeBooking },
    { status: "Completed", value: details?.bookings?.bookingCompleted },
    { status: "Cancelled", value: details?.bookings?.totalBooking - details?.bookings?.activeBooking },
  ]
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Dashboard" selectedItem="Dashboard" />
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
          >
            {staticsArr?.map((v, i) => {
              return (
                <div className="col-md-4 col-12 ">
                  <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                    <div className="d-flex align-items-center ">
                      <div
                        className="p-2 shadow rounded"
                        style={{ background: v?.bgColor }}
                      >
                        <img src={v?.img} />
                      </div>
                      <div className="ms-3">
                        <h2 className="text-secondary">{v?.count}</h2>
                        <h6>{v?.title}</h6>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      {v?.subMenu?.map((subMenu, i) => {
                        return (
                          <div
                            className=" d-flex justify-content-between align-items-center px-2 py-1 text-light"
                            style={{
                              borderRadius: "4px",
                              background: subMenu?.bgColor,
                              width: "45%",
                              opacity: "0.9",
                            }}
                          >
                            <h6>{subMenu?.title}</h6>
                            <p className="mb-0">{subMenu?.count}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
            <div className="row px-2 mt-2">
            <div className="col-7">
              <div className=" rounded shadow-sm p-4">
                <h5>Last 15 day bookings</h5>
                <div className="d-flex justify-content-between">
                  {details?.last15DaysBookings?.map((v, i) => {
                    return (
                      <div
                      // onClick={()=>navigate("/all-booking/"+v?.mongoDate)}
                        className="border d-flex align-items-end shadow-sm"
                        style={{
                          height: "300px",
                          width: "6%",
                          borderRadius: "12px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                        key={i}
                      >
                        <div
                          style={{
                            height: v?.noOfBookings * 3 + "px",
                            width: "100%",
                            background: "#139F01",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              writingMode: "vertical-rl",
                              textAlign: "center",
                              transform: "rotate(180deg)",
                              whiteSpace: "nowrap",
                              position: "absolute",
                              left: "50%",
                              // top: "50%",
                              bottom:"120px",
                              transform: "translate(-50%, -50%) rotate(180deg)", 
                            }}
                          >
                            {v?.date}, Bookings : {v?.noOfBookings}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-5 ">
               <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
