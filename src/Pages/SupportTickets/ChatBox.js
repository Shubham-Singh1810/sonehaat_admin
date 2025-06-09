import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  updateTicketServ,
  getTicketDetailsServ,
  sendMessageServ,
  updateMessageStatusServ,
} from "../../services/ticker.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useGlobalState } from "../../GlobalProvider";
import { useParams } from "react-router-dom";
function ChatBox() {
  const params = useParams();
  const { globalState, setGlobalState } = useGlobalState();
  const [showSkelton, setShowSkelton] = useState(false);
  const [details, setDetails] = useState();
  const getChatDetailsFunc = async () => {
    try {
      let response = await getTicketDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getChatDetailsFunc();
  }, []);
  const [isLoadingId, setIsLoadingId] = useState("");
  const updateTicketFunc = async (formData) => {
    setIsLoadingId(formData?._id);
    try {
      let response = await updateTicketServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getChatDetailsFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setIsLoadingId("");
  };
  const [formData, setFormData] = useState({
    message: "",
    image: "",
    userId: globalState?.user?._id,
    userType: "Admin",
    ticketId: params?.id,
  });
  const [isSending, setIsSending] = useState(false);
  const handleSendMessageFunc = async () => {
    setIsSending(true);
    try {
      const finalFormData = new FormData();
      if (formData?.image) {
        finalFormData?.append("image", formData?.image);
        finalFormData?.append("ticketId", formData?.ticketId);
        finalFormData?.append("userType", "Admin");
        finalFormData?.append("userId", formData?.userId);
        finalFormData?.append("message", formData?.message);
      }
      let response = await sendMessageServ(
        formData?.image ? finalFormData : formData
      );
      if (response?.data?.statusCode == "200") {
        getChatDetailsFunc();
        setFormData({
          message: "",
          image: "",
          userId: globalState?.user?._id,
          userType: "Admin",
          ticketId: params?.id,
        });
        setImgPrev("");
      }
    } catch (error) {
      console.log(error);
    }
    setIsSending(false);
  };
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };
  const [imgPrev, setImgPrev] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImgPrev(URL.createObjectURL(e.target.files[0]));
    }
  };
  const updateMessageStatus = async (formData) => {
    try {
      await updateMessageStatusServ(formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (details?.data?.length) {
      const updatePromises = details.data
        .filter((v) => v.userType !== "Admin")
        .map((v) =>
          updateMessageStatus({
            id: v._id,
            isRead: true,
          })
        );

      Promise.all(updatePromises)
        .then(() => {
          console.log("All message status updated");
        })
        .catch((err) => {
          console.log("Some error occurred while updating messages", err);
        });
    }
  }, [details?.data]);

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Support Tickets" selectedItem="" />
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
            <div className="col-md-12 col-12 ">
              <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                <div className="d-flex align-items-center ">
                  <div
                    className="p-1 shadow rounded"
                    // style={{ background: "red" }}
                  >
                    <img
                      src={
                        details?.userDetails?.profilePic
                          ? details?.userDetails?.profilePic
                          : "https://cdn-icons-png.flaticon.com/128/64/64572.png"
                      }
                      style={{ height: "65px", width: "65px", filter: "none" }}
                    />
                  </div>
                  <div className="ms-3">
                    <h5 className="text-secondary mb-0">
                      {details?.userDetails?.firstName +
                        " " +
                        details?.userDetails?.lastName}{" "}
                      ({details?.ticketDetails?.userType})
                    </h5>
                    <p className="text-secondary mb-0">
                      {details?.userDetails?.phone}
                    </p>
                    <p className="text-secondary mb-0">
                      {details?.userDetails?.email}
                    </p>
                  </div>
                </div>
                <div className="row mt-4 d-flex align-items-center">
                  <div className=" col-md-6 col-12   ">
                    <div
                      className="d-flex algn-items-center px-4 py-2 shadow-sm text-dark my-md-0 my-2"
                      style={{ borderRadius: "20px", background: "whitesmoke" }}
                    >
                      <h5 className="mb-0">Subject :</h5>
                      <p className="mb-0 ms-2">
                        {details?.ticketDetails?.subject}
                      </p>
                    </div>
                  </div>
                  <div className=" col-md-4 col-12   ">
                    <div
                      className="d-flex algn-items-center px-4 py-2 shadow-sm text-dark my-md-0 my-2"
                      style={{ borderRadius: "20px", background: "whitesmoke" }}
                    >
                      <h5 className="mb-0">Category :</h5>
                      <p className="mb-0 ms-2">
                        {details?.ticketDetails?.ticketCategoryId?.name}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-2 col-12 my-md-0 my-2">
                    {isLoadingId == details?.ticketDetails?._id ? (
                      <button className="btn btn-sm shadow-sm ">
                        Updating ...
                      </button>
                    ) : (
                      <select
                        className={
                          "form-control shadow-sm text-light py-0" +
                          (details?.ticketDetails?.status
                            ? " bg-info"
                            : " bg-danger")
                        }
                        style={{ height: "40px", borderRadius: "20px" }}
                        value={details?.ticketDetails?.status}
                        onChange={(e) =>
                          updateTicketFunc({
                            status: e.target.value === "true",
                            _id: details?.ticketDetails?._id,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="true">Open</option>
                        <option value="false">Closed</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 mx-3   shadow" style={{ position: "relative" }}>
            <div className="chatBox pb-5">
              {details?.data?.map((v, i) => {
                return (
                  <>
                    <div
                      className={
                        "d-flex  " +
                        (v?.userType == "Admin" ? "justify-content-end" : " ")
                      }
                    >
                      <div
                        className={
                          " text-light p-1  d-flex align-items-center shadow-sm mt-3 mx-3 " +
                          (v?.message ? " px-4" : " px-1 ") +
                          (v?.userType == "Admin"
                            ? " bg-dark"
                            : " bg-secondary")
                        }
                        style={{ borderRadius: "16px", maxWidth: "50%" }}
                      >
                        {v?.message ? (
                          <p className="mb-0 me-2">{v?.message}</p>
                        ) : (
                          <img src={v?.image} className="form-control" />
                        )}
                      </div>
                    </div>
                    <div
                      className={
                        "d-flex  " +
                        (v?.userType == "Admin" ? "justify-content-end" : " ")
                      }
                    >
                      <div
                        className="text-secondary mt-2 ms-2 me-4 "
                        style={{ fontSize: "10px" }}
                      >
                        <span className="mx-3">
                          {moment(v?.createdAt).fromNow()}
                        </span>
                        {v?.userType == "Admin" && (
                          <>
                            {v?.isRead ? (
                              <img
                                style={{ height: "20px" }}
                                src="https://cdn-icons-png.flaticon.com/128/11205/11205182.png"
                              />
                            ) : (
                              <i
                                style={{ fontWeight: "400" }}
                                className="fa fa-check text-secondary"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            {details?.ticketDetails?.status ? (
              <div className="row d-flex align-items-center bottomChatAction">
                <div className="col-10 p-0">
                  <input
                    className="form-control"
                    placeholder="Start Typing ..."
                    value={formData?.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e?.target.value })
                    }
                  />
                </div>
                <div className="row col-2 p-0 m-0 d-flex align-items-center">
                  <div className="col-3 d-flex justify-content-center p-0">
                    <div>
                      <img
                        onClick={handleIconClick}
                        src={
                          imgPrev
                            ? imgPrev
                            : "https://cdn-icons-png.flaticon.com/128/8191/8191607.png"
                        }
                        alt="upload"
                        style={{ cursor: "pointer" }}
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="col-9 p-0">
                    {formData?.message || formData?.image ? (
                      !isSending ? (
                        <button
                          className="btn btn-sm btn-success w-100 "
                          onClick={handleSendMessageFunc}
                        >
                          Send
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success w-100 "
                          style={{ opacity: "0.5" }}
                        >
                          Sending ...
                        </button>
                      )
                    ) : (
                      <button
                        className="btn btn-sm btn-success w-100 "
                        style={{ opacity: "0.5" }}
                      >
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-center text-secondary pb-3">
                  This Ticket is marked as closed, You may reopen the ticket to
                  continue chating !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
