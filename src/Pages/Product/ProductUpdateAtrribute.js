import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getSubcategoryAttributeListServ, updateProductServ } from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";

function ProductUpdateAttribute() {
  const params = useParams();
  const navigate = useNavigate();
  const [attributeList, setAttributeList] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const getSubcategoryAttributeListFunc = async () => {
    try {
      let response = await getSubcategoryAttributeListServ({
        productId: params?.id,
      });
      if (response?.data?.statusCode == "200") {
        setAttributeList(response?.data?.data);
      }
    } catch (error) {
      toast.error("Failed to fetch attributes");
    }
  };

  useEffect(() => {
    getSubcategoryAttributeListFunc();
  }, []);

  const handleCheckboxChange = (attrName, checked) => {
    setSelectedAttributes((prev) => {
      const updated = { ...prev };
      if (!checked) {
        delete updated[attrName];
      } else {
        updated[attrName] = []; // initialize empty array
      }
      return updated;
    });
  };

  const handleSelectChange = (attrName, selectedOptions) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrName]: selectedOptions.map((opt) => opt.value),
    }));
  };

  const handleSubmit = async() => {
    const productOtherDetails = Object.entries(selectedAttributes).map(
      ([key, value]) => ({
        key,
        value,
      })
    );

    const finalPayload = {
      id: params?.id,
      productOtherDetails,
    };

    try {
      let response = await updateProductServ(finalPayload);
      if(response?.data?.statusCode=="200"){
        toast.success(response?.data?.message);
        navigate("/product-list")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0" style={{ position: "relative", top: "-75px", marginBottom: "-75px" }}></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4 className="p-2 text-dark shadow rounded mb-4"
                  style={{ background: "#e6f2ff" }}>
                    Update Product Attributes : Step 4/4
                  </h4>
                </div>
              </div>
              <div className="row">
                {attributeList?.map((v, i) => {
                  const isChecked = selectedAttributes.hasOwnProperty(v?.name);
                  return (
                    <div className="col-6 mb-3" key={i}>
                      <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(v?.name, e.target.checked)}
                      />
                      <h5>{v?.name}</h5>
                        </div>
                      

                      
                        <Select
                          isMulti
                          options={v?.value?.map((val) => ({
                            label: val,
                            value: val,
                          }))}
                          onChange={(selectedOptions) =>
                            handleSelectChange(v?.name, selectedOptions)
                          }
                          className="basic-multi-select mt-2"
                          classNamePrefix="select"
                        />
                      
                    </div>
                  );
                })}
              </div>
              <button className="btn btn-primary w-100" style={{  color: "#fff",
                        border: "none",
                        borderRadius: "24px",
                        background: "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                        boxShadow: "0 4px 12px rgba(255,103,30,0.45)", }} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateAttribute;
