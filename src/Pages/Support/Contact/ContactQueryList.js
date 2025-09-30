import React, { useState, useEffect } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import {
  addFaqServ,
  updateFaqServ,
  deleteFaqServ,
} from "../../../services/faq.service";
import { getContactListServ } from "../../../services/support.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../../Components/NoRecordFound";
function ContactQueryList() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    category: "",
    pageNo: 1,
    pageCount: 25,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetContactListFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getContactListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "User Queries",
      count: statics?.userQueries,
      bgColor: "#6777EF",
    },
    {
      title: "Driver Queries",
      count: statics?.driverQueries,
      bgColor: "#63ED7A",
    },
    {
      title: "Vendor Queries",
      count: statics?.vendorQueries,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetContactListFunc();
  }, [payload]);
  
  
  
  const renderCategory = (category) => {
    if (category == "user") {
      return (
        <button
          className="badge"
          style={{ height: "30px", background: "#6777EF", border: "none" }}
        >
          User
        </button>
      );
    }
    if (category == "driver") {
      return (
        <button
          className="badge"
          style={{ height: "30px", background: "#63ED7A", border: "none" }}
        >
          Driver
        </button>
      );
    }
    if (category == "vender") {
      return (
        <button
          className="badge"
          style={{ height: "30px", background: "#FFA426", border: "none" }}
        >
          Vendor
        </button>
      );
    }
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="System Support" selectedItem="Contact Query" />
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
                        <img src="https://cdn-icons-png.flaticon.com/128/666/666120.png" />
                      </div>
                      <div className="ms-3">
                        <h6>{v?.title}</h6>
                        <h2 className="text-secondary">{v?.count}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row m-0 p-0 d-flex align-items-center my-4 justify-content-between topActionForm">
            <div className="col-lg-3 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Contact Queries</h3>
            </div>
          
            <div className="col-lg-5 mb-2  col-md-6 col-12">
              <div>
                <select
                  className="form-control borderRadius24"
                  onChange={(e) =>
                    setPayload({ ...payload, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="user">User</option>
                  <option value="vender">Vendor</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            </div>
            
          </div>
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <tbody>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "30px 0px 0px 30px" }}
                      >
                        Sr. No
                      </th>
                      <th className="text-center py-3">First Name</th>
                      <th className="text-center py-3">Last Name</th>
                      <th className="text-center py-3">Contact Number</th>
                      <th className="text-center py-3">Message</th>

                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Category
                      </th>
                    </tr>
                    <div className="py-2"></div>
                    {showSkelton
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                          return (
                            <>
                              <tr key={i}>
                                <td className="text-center">
                                  <Skeleton width={50} height={50} />
                                </td>

                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>

                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })
                      : list?.map((v, i) => {
                          return (
                            <>
                              <tr key={v._id}>
                                <td className="text-center">
      {(payload.pageNo - 1) * payload.pageCount + i + 1}
    </td>

                                <td className="font-weight-600 text-center">
                                  {v?.firstName}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.lastName}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.contactNumber}
                                </td>
                                <td className="font-weight-600 text-center d-flex justify-content-center">
                                  <div
                                    className="bg-dark text-light p-2"
                                    style={{
                                      width: "300px",
                                      borderRadius: "12px",
                                    }}
                                  >
                                    <h6>{v?.subject}</h6>
                                    <p className="mb-0">{v?.message}</p>
                                  </div>
                                </td>
                                <td className="text-center">
                                  {renderCategory(v?.category)}
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>
                {list.length == 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
     
     
    </div>
  );
}

export default ContactQueryList;
