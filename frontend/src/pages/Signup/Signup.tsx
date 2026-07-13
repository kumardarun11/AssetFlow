import "./Signup.css";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms of Service");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.detail === "string") {
          throw new Error(data.detail);
        }

        throw new Error("Failed to create account");
      }

      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-card" onSubmit={handleSignup}>
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

        <h1>Create Account</h1>

        <p className="subtitle">
          Create your employee account to access AssetFlow
        </p>

        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}

        <div className="input-group">
          <label>Full Name</label>

          <div className="input-box">
            <FaUser />

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Email Address</label>

          <div className="input-box">
            <FaEnvelope />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>

          <div className="input-box">
            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              maxLength={72}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword((current) => !current)
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>

          <div className="input-box">
            <FaLock />

            <input
              type={
                showConfirmPassword ? "text" : "password"
              }
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={8}
              maxLength={72}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current
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

        <label className="terms">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) =>
              setTermsAccepted(event.target.checked)
            }
          />

          <span>
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>

        <button
          className="signup-btn"
          type="submit"
          disabled={loading}
        >
          <FaArrowRight />

          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="login-text">
          Already have an account?
          <Link to="/login"> Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;