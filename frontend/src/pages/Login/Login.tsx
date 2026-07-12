import "./Login.css";

import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import illustration from "../../assets/images/illustration.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">

      {/* Right Section */}

      <div className="login-right">

        <div className="login-card">

          <div className="lock-icon">
            <FaLock />
          </div>

          <h1>Welcome Back!</h1>

          <p className="subtitle">
            Sign in to continue to AssetFlow
          </p>

          {/* Email */}

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">
              <FaEnvelope />

              <input
                type="email"
                placeholder="Enter your email address"
              />
            </div>

          </div>

          {/* Password */}

          <div className="input-group">

            <label>Password</label>

            <div className="input-box">

              <FaLock />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

            </div>

          </div>

          {/* Options */}

          <div className="login-options">

            <label className="remember">

              <input type="checkbox" />

              <span>Remember me</span>

            </label>

            <button className="forgot-btn">
              Forgot Password?
            </button>

          </div>

          {/* Login */}

          <button className="login-btn">
            <FaArrowRight style={{ marginRight: 10 }} />
            Sign In
          </button>

          <p className="signup-text">
            Don't have an account?
            <Link to="/signup"> Sign Up</Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;