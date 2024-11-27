import React, { useState } from "react";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("We have sent you a link to reset your password.");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <section
      className="forgot-password-section"
      style={{
        background: "linear-gradient(135deg, #74ebd5, #9face6)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="container d-flex justify-content-center flex-wrap align-items-center shadow-lg p-4 bg-white rounded-4 animate__animated animate__fadeInDown"
        style={{
          maxWidth: "900px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="col-12 col-md-6 col-lg-5 mb-4 text-center"
          style={{ animation: "bounce 2s infinite" }}
        >
          <img
            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80"
            className="img-fluid rounded-4 shadow-lg"
            alt="Forgot Password"
          />
        </div>

        <div
          className="col-12 col-md-6 col-lg-5 text-center animate__animated animate__fadeInRight"
        >
          <h1 className="mb-4 fw-bold text-dark">Forgot Your Password?</h1>
          <form onSubmit={onSubmit}>
            <p className="mb-4 text-muted fw-semibold">
              Enter your email to reset your Booking account password.
            </p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address (*)"
              className="form-control mb-4 rounded-pill px-3 py-3 shadow-sm border-0"
              style={{ background: "#f5f5f5", transition: "all 0.3s ease" }}
              onFocus={(e) => (e.target.style.background = "#fff")}
              onBlur={(e) => (e.target.style.background = "#f5f5f5")}
            />
            <button
              className="btn btn-gradient w-100 rounded-pill py-2 mb-4 shadow-lg"
              type="submit"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,131,139,1) 0%, rgba(255,195,113,1) 100%)",
                color: "white",
                border: "none",
              }}
            >
              SUBMIT
            </button>
            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" />
              <p className="text-center mx-3 mb-0 fw-bold text-muted">OR</p>
              <hr className="flex-grow-1" />
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
