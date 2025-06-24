import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginServ } from "../../services/authentication.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";

export default function Login() {
  const { setGlobalState } = useGlobalState();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let deviceId = localStorage.getItem("deviceId");
        const response = await loginServ({ ...values, deviceId });
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          localStorage.setItem(
            "token",
            JSON.stringify(response?.data?.data?.token)
          );
          localStorage.setItem("user", JSON.stringify(response?.data?.data));
          localStorage.setItem(
            "permissions",
            JSON.stringify(response?.data?.data?.permissions)
          );
          setGlobalState({
            token: response?.data?.data?.token,
            user: response?.data?.data,
            permissions: response?.data?.data?.permissions,
          });
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bgGradient">
      <div className="border shadow rounded loginMain bg-light">
        <div className="d-flex justify-content-center my-3">
          <img
            className="img-fluid"
            src="/brandLogo.jpeg"
            alt="Login Icon"
            style={{height:"100px"}}
          />
        </div>
        <h3 className="pt-3 px-3 mb-0 text-center">Welcome Back!</h3>
        <p className="text-secondary text-center pb-2 mb-0">
          Please login to your account
        </p>
        <form className="p-3 py-4" onSubmit={formik.handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control mb-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger mb-2">{formik.errors.email}</div>
          ) : null}
          <div className="d-flex justify-content-between align-items-center">
            <label>Password</label>
            <i
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "relative",
                top: "30px",
                right: "10px",
                cursor: "pointer",
              }}
              className="fa fa-eye"
            ></i>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-control mb-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger mb-2">{formik.errors.password}</div>
          ) : null}

          <button
            type="submit"
            className="btn btn-success w-100 mt-3 shadow-sm"
            style={{
              borderRadius: "20px",
              background: "#139F01",
              opacity: formik.isSubmitting ? "0.5" : "1",
            }}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? "Saving ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
