import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateProductHeroImage,
  updateProductVideoServ,
  updateProductGalleryServ,
  getProductDetailsServ,
  deleteProductGalleryServ
} from "../../services/product.services";
import { useParams, useNavigate } from "react-router-dom";
function ProductUpdateStep3() {
  const navigate = useNavigate();
  const params = useParams();
  const uploadHeroImage = async (img) => {
    try {
      const formData = new FormData();
      formData.append("productHeroImage", img);
      formData.append("id", params.id);
      let response = await updateProductHeroImage(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getProductDetails()
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const uploadProductVideo = async (video) => {
    try {
      const formData = new FormData();
      formData.append("productVideo", video);
      formData.append("id", params.id);
      let response = await updateProductVideoServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getProductDetails()
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const uploadProductGalleryFunc = async (img) => {
    try {
      const formData = new FormData();
      formData.append("images", img);
      formData.append("id", params.id);
      let response = await updateProductGalleryServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getProductDetails()
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  const [details, setDetails] = useState({
    productHeroImage: "",
    productGallery: [],
    productVideo: "",
  });
  const getProductDetails = async () => {
    try {
      let response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails({
          productHeroImage: response?.data?.data?.productHeroImage,
          productGallery: response?.data?.data?.productGallery,
          productVideo: response?.data?.data?.productVideo,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    getProductDetails();
  }, []);
  const deleteProductGalleryFunc =async (index)=>{
    try {
      let response = await deleteProductGalleryServ({id:params?.id, index:index});
      if(response?.data?.statusCode=="200"){
        toast.success(response?.data?.message)
        getProductDetails()
      }
    } catch (error) {
      toast.error("Internal Server Error")
    }
  }
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
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
                  <h4
                    className="p-2 text-dark shadow rounded mb-4"
                    style={{ background: "#e6f2ff" }}
                  >
                    Update Product : Step 3/4
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-4 mb-3">
                  <div className="border p-2">
                    <div className="d-flex justify-content-center">
                      <img
                        src={
                          details?.productHeroImage
                            ? details?.productHeroImage
                            : "https://cdn-icons-png.flaticon.com/128/159/159626.png"
                        }
                        className="img-fluid mb-2"
                        style={{ height: "150px" }}
                      />
                    </div>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) => uploadHeroImage(e?.target?.files[0])}
                    />
                    <label>Product Hero Image</label>
                  </div>
                </div>
                <div className="col-4 mb-3">
                  <div className="border p-2">
                    <div className="d-flex justify-content-center">
                      {details?.productVideo ? (
                        <video
                          className="mb-2"
                          style={{ height: "150px" }}
                          src={details?.productVideo}
                        ></video>
                      ) : (
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/16792/16792767.png"
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) => uploadProductVideo(e?.target?.files[0])}
                    />
                    <label>Product Video</label>
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <label>Product Gallery</label>
                  <div className="p-2 border d-flex">
                    <div>
                      <div className="d-flex justify-content-center">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/16792/16792767.png"
                          className="img-fluid mb-2"
                        />
                      </div>
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) =>
                          uploadProductGalleryFunc(e?.target?.files[0])
                        }
                      />
                    </div>
                    {details?.productGallery?.map((v, i) => {
                      return (
                        <div className="p-2 border mx-2">
                          <div className="d-flex justify-content-end">
                            <img
                              style={{
                                height: "20px",
                                position: "relative",
                                marginBottom: "-20px",
                              }}
                              onClick={()=>deleteProductGalleryFunc(i)}
                              src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                            />
                          </div>
                          <img
                            className="img-fluid"
                            style={{ height: "150px" }}
                            src={v}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-primary w-100"
                    style={{
                      color: "#fff",
      border: "none",
      borderRadius: "24px",
      background: "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
      boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                    }}
                    onClick={()=>navigate("/update-product-attributes/"+params?.id)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateStep3;
