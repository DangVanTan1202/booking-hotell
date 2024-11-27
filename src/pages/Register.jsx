import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { email, password, name } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
      toast.success("Successful account registration!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <section className="register-container mt-5">
      <h1 className="text-center mb-4">Create Your Booking Account</h1>
      <h6 className="text-center mb-4">
        Already have a Booking Account?{" "}
        <b>
          <Link to="/login" className="text-primary">
            Sign In
          </Link>
        </b>
      </h6>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={onChange}
                placeholder="Full name (*)"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={onChange}
                placeholder="Email address (*)"
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password (*)"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="position-absolute top-50 end-0 translate-middle-y text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="position-absolute top-50 end-0 translate-middle-y text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>

            <button className="btn btn-success w-100 mt-3" type="submit">
              Create Account
            </button>

            <div className="d-flex align-items-center my-4">
              <div className="border-top flex-grow-1"></div>
              <p className="mx-4 mb-0">OR</p>
              <div className="border-top flex-grow-1"></div>
            </div>

            <OAuth />
          </form>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          <img
            className="w-100 rounded-3"
            src="https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            alt="Register"
          />
        </div>
      </div>
    </section>
  );
}
