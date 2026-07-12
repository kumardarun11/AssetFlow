import "./Signup.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    "Information Technology",
    "Human Resources",
    "Finance",
    "Marketing",
    "Operations",
    "Administration",
  ];

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* Logo */}

        <div className="signup-logo">

          <div className="logo-box">
            <HiOutlineCube />
          </div>

          <div>
            <h2>
              Asset<span>Flow</span>
            </h2>

            <p>Enterprise Asset Management</p>
          </div>

        </div>

        {/* Heading */}

        <h1>Create Account</h1>

        <p className="subtitle">
          Create your employee account to access AssetFlow
        </p>

        {/* Full Name */}

        <div className="input-group">

          <label>Full Name</label>

          <div className="input-box">

            <FaUser />

            <input
              type="text"
              placeholder="Enter your full name"
            />

          </div>

        </div>

        {/* Email */}

        <div className="input-group">

          <label>Email Address</label>

          <div className="input-box">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Enter your email"
            />

          </div>

        </div>

        {/* Department */}

        <div className="input-group">

          <label>Department</label>

          <div className="input-box">

            <FaBuilding />

            <select defaultValue="">
              <option value="" disabled>
                Select Department
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Password */}

        <div className="input-group">

          <label>Password</label>

          <div className="input-box">

            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>

          </div>

        </div>

        {/* Confirm Password */}

        <div className="input-group">

          <label>Confirm Password</label>

          <div className="input-box">

            <FaLock />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>

          </div>

        </div>

        {/* Terms */}

        <label className="terms">

          <input type="checkbox" />

          <span>
            I agree to the Terms of Service and Privacy
            Policy
          </span>

        </label>

        {/* Button */}

        <button className="signup-btn">

          <FaArrowRight />

          Create Account

        </button>

        {/* Login */}

        <p className="login-text">
            Already have an account?
            <Link to="/login"> Sign In</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;