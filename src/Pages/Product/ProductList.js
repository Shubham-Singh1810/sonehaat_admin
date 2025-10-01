import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getProductServ,
  updateProductServ,
  deleteProductServ,
  uploadExcelServ,
  downloadProductExportServ,
  downloadSampleProductFileServ,
} from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import Pagination from "../../Components/Pagination";
import { triggerFileDownload } from "../../utils/fileDownload";

function ProductList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetProductFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getProductServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Products",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Products",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Inactive Products",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetProductFunc();
  }, [payload]);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    productHeroImage: "",
    status: "",
    _id: "",
  });
  const updateProductFunc = async () => {
    try {
      let response = await updateProductServ({
        id: editFormData?._id,
        status: editFormData?.status,
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          name: "",
          productHeroImage: "",
          status: "",
          _id: "",
        });
        handleGetProductFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const handleDeleteProductFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        let response = await deleteProductServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleGetProductFunc();
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    name: "",
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleBulkUpload = async () => {
    if (!bulkForm.name || !bulkForm.file) {
      toast.error("Please enter a name and select a file");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", bulkForm.file);

    try {
      const res = await uploadExcelServ(formData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Bulk upload successful!");
        setShowBulkModal(false);
        setBulkForm({ name: "", file: null });
        handleGetProductFunc();
      } else {
        toast.error(res?.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Bulk Upload Error:", err);
      const errorData = err?.response?.data;
      if (errorData?.statusCode === 409) {
        toast.error(errorData.message);
      } else if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error("Server Error during upload");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      const response = await downloadProductExportServ(payload, format);
      const ext = format === "excel" ? "xlsx" : format;
      triggerFileDownload(response.data, `productList.${ext}`);
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const handleDownloadSample = async (format) => {
    try {
      const res = await downloadSampleProductFileServ(format);
      const ext = format === "excel" ? "xlsx" : format;
      triggerFileDownload(res.data, `BulkProductUploadTemplate.${ext}`);
    } catch (err) {
      toast.error("Sample file download failed");
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Products" />
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
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Products</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <div>
                <input
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-lg-3 mb-2  col-md-6 col-12">
              <div>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="reUploaded">Re-Uploaded</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100"
                  style={{
                    color: "#fff",
                    border: "none",
                    // borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                  }}
                  onClick={() => navigate("/add-product")}
                >
                  Add Product
                </button>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <button
                className="btn w-100 text-light p-2"
                style={{ background: "#354f52" }}
                onClick={() => setShowBulkModal(true)}
              >
                Add Bulk Products
              </button>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12 dropdown">
              <button
                className="btn w-100 text-light p-2 dropdown-toggle"
                style={{ background: "#227C9D" }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul className="dropdown-menu w-100">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload("txt")}
                  >
                    Download as TXT
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload("excel")}
                  >
                    Download as Excel
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownload("csv")}
                  >
                    Download as CSV
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownloadSample("excel")}
                  >
                    Download Sample Excel
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownloadSample("csv")}
                  >
                    Download Sample CSV
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDownloadSample("txt")}
                  >
                    Download Sample TXT
                  </button>
                </li>
              </ul>
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
                      <th className="text-center py-3">Name</th>
                      <th className="text-center py-3">Hero Image</th>
                      <th className="text-center py-3">Category</th>
                      <th className="text-center py-3">Appernce</th>

                      <th className="text-center py-3">Price</th>
                      <th className="text-center py-3">Venor Name</th>
                      <th className="text-center py-3">Status</th>

                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
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
                                  <Skeleton
                                    width={50}
                                    height={50}
                                    borderRadius={25}
                                  />
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
                                  {(payload.pageNo - 1) * payload.pageCount +
                                    i +
                                    1}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.name}
                                </td>
                                <td className="text-center">
                                  <img
                                    src={v?.productHeroImage}
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td className="text-center">
                                  {v?.categoryId?.name}
                                </td>
                                <td className="text-center">
                                  {v?.specialApperence || "None"}
                                </td>
                                <td className="text-center">{v?.price}</td>
                                <td className="text-center">
                                  {v?.createdBy
                                    ? `${v.createdBy.firstName} ${v.createdBy.lastName}`
                                    : "N/A"}
                                </td>

                                <td className="text-center">
                                  {v?.status && (
                                    <div
                                      className="badge py-2 px-3"
                                      style={{
                                        cursor: "pointer",
                                        background:
                                          v.status === "approved"
                                            ? "#63ED7A" 
                                            : v.status === "pending"
                                            ? "#FFA426" 
                                            : v.status === "rejected"
                                            ? "#FF4D4F" 
                                            : "#4C6EF5", 
                                      }}
                                      onClick={() =>
                                        navigate("/product-approval/" + v?._id)
                                      }
                                    >
                                      {v.status.charAt(0).toUpperCase() +
                                        v.status.slice(1)}
                                    </div>
                                  )}
                                </td>

                                <td className="text-center">
                                  <BsEye
                                    size={15}
                                    className="mx-1 text-info"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate("/product-details/" + v?._id)
                                    }
                                    title="View"
                                  />
                                  <BsPencil
                                    size={14}
                                    className="mx-1 text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate(
                                        "/update-product-step1/" + v?._id
                                      )
                                    }
                                    title="Edit"
                                  />
                                  <BsTrash
                                    size={15}
                                    className="mx-1 text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteProductFunc(v?._id)
                                    }
                                    title="Delete"
                                  />
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>
                {list.length == 0 && !showSkelton && <NoRecordFound />}
                {statics?.totalCount > 0 && (
                  <div className="d-flex justify-content-center my-3">
                    <Pagination
                      payload={payload}
                      setPayload={setPayload}
                      totalCount={statics?.totalCount || 0}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {editFormData?._id && (
        <div
          className="modal fade show d-flex align-items-center  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() =>
                    setEditFormData({
                      _id: "",
                      name: "",
                      productHeroImage: "",
                      status: "",
                    })
                  }
                />
              </div>

              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <h5 className="mb-4">Update Status</h5>
                    <div className="p-3 border rounded mb-2">
                      <img
                        src={editFormData?.productHeroImage}
                        className="img-fluid w-100 shadow rounded"
                        style={{ height: "200px" }}
                      />
                    </div>

                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      readOnly
                      value={editFormData?.name}
                    />
                    <label className="mt-3">Status</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e?.target?.value,
                        })
                      }
                      value={editFormData?.status}
                    >
                      <option value="">Select Status</option>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>

                    {editFormData?.status ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && updateProductFunc}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 mt-4"
                        style={{ opacity: "0.5" }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}
      {showBulkModal && (
        <>
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div
                className="modal-content"
                style={{
                  borderRadius: "16px",
                  background: "#f7f7f5",
                  width: "364px",
                }}
              >
                {/* Custom close button */}
                <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                    style={{ height: "20px", cursor: "pointer" }}
                    onClick={() => setShowBulkModal(false)}
                    alt="Close"
                  />
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  <div
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                    className="d-flex justify-content-center w-100"
                  >
                    <div className="w-100 px-2">
                      <h5 className="mb-4">Upload Bulk Products</h5>

                      <div className="mb-3">
                        <label className="form-label">Bulk Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={bulkForm.name}
                          onChange={(e) =>
                            setBulkForm({ ...bulkForm, name: e.target.value })
                          }
                          placeholder="Enter bulk upload name"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Upload File (CSV/Excel)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          onChange={(e) =>
                            setBulkForm({
                              ...bulkForm,
                              file: e.target.files[0],
                            })
                          }
                        />
                      </div>

                      <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={handleBulkUpload}
                        disabled={
                          isUploading || !bulkForm.name || !bulkForm.file
                        }
                        style={{
                          opacity: !bulkForm.name || !bulkForm.file ? 0.6 : 1,
                        }}
                      >
                        {isUploading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Uploading...
                          </>
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default ProductList;
