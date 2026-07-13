import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaLaptop,
  FaExchangeAlt,
  FaUserCircle,
} from "react-icons/fa";

import "./Dashboard.css";

interface User {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  role: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data: User = await response.json();
        setUser(data);
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

    loadUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading AssetFlow...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>
            Welcome back, {user?.name} 👋
          </h1>

          <p>
            Here's what's happening in AssetFlow.
          </p>
        </div>

        <div className="dashboard-user">
          <FaUserCircle />

          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
        </div>
      </header>

      <section className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => navigate("/allocations")}
        >
          <FaLaptop />

          <div>
            <span>Asset Allocation</span>
            <h3>Manage Assets</h3>
          </div>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/transfers")}
        >
          <FaExchangeAlt />

          <div>
            <span>Transfers</span>
            <h3>Transfer Requests</h3>
          </div>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/users")}
        >
          <FaUsers />

          <div>
            <span>Account Role</span>
            <h3>{user?.role}</h3>
          </div>
        </div>
      </section>

      <section className="dashboard-profile">
        <h2>Account Information</h2>

        <div className="profile-grid">
          <div>
            <span>Name</span>
            <strong>{user?.name}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div>
            <span>Role</span>
            <strong>{user?.role}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{user?.status}</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;