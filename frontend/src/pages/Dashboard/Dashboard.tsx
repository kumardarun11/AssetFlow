import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBox,
  FaCheckCircle,
  FaExchangeAlt,
  FaHistory,
  FaLaptop,
  FaTools,
  FaUndo,
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

interface Activity {
  id: number;
  actor_id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  created_at: string;
}

interface DashboardSummary {
  total_assets: number;
  available_assets: number;
  active_allocations: number;
  pending_transfers: number;
  pending_returns: number;
  open_maintenance: number;
  unread_notifications: number;
  recent_activity: Activity[];
}

const API_URL = "http://127.0.0.1:8000";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [userResponse, summaryResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/auth/me`, {
              headers,
            }),
            fetch(`${API_URL}/api/dashboard/summary`, {
              headers,
            }),
          ]);

        if (
          userResponse.status === 401 ||
          summaryResponse.status === 401
        ) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }

        if (!userResponse.ok || !summaryResponse.ok) {
          throw new Error("Failed to load dashboard");
        }

        const userData: User =
          await userResponse.json();

        const summaryData: DashboardSummary =
          await summaryResponse.json();

        setUser(userData);
        setSummary(summaryData);
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

    loadDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading AssetFlow...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="dashboard-error">
        {error || "Dashboard unavailable"}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Assets",
      value: summary.total_assets,
      icon: <FaBox />,
      path: "/assets",
    },
    {
      title: "Available Assets",
      value: summary.available_assets,
      icon: <FaCheckCircle />,
      path: "/assets",
    },
    {
      title: "Active Allocations",
      value: summary.active_allocations,
      icon: <FaLaptop />,
      path: "/allocations",
    },
    {
      title: "Pending Transfers",
      value: summary.pending_transfers,
      icon: <FaExchangeAlt />,
      path: "/transfers",
    },
    {
      title: "Pending Returns",
      value: summary.pending_returns,
      icon: <FaUndo />,
      path: "/returns",
    },
    {
      title: "Open Maintenance",
      value: summary.open_maintenance,
      icon: <FaTools />,
      path: "/maintenance",
    },
    {
      title: "Unread Notifications",
      value: summary.unread_notifications,
      icon: <FaBell />,
      path: "/notifications",
    },
  ];

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>

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

      <section className="dashboard-stats">
        {cards.map((card) => (
          <div
            key={card.title}
            className="dashboard-stat-card"
            onClick={() => navigate(card.path)}
          >
            <div className="dashboard-stat-icon">
              {card.icon}
            </div>

            <div>
              <span>{card.title}</span>
              <h2>{card.value}</h2>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-activity">
        <div className="dashboard-section-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest AssetFlow system events.</p>
          </div>

          <button
            onClick={() => navigate("/activity-logs")}
          >
            <FaHistory />
            View All
          </button>
        </div>

        {summary.recent_activity.length === 0 ? (
          <div className="dashboard-empty">
            No recent activity.
          </div>
        ) : (
          <div className="dashboard-activity-list">
            {summary.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="dashboard-activity-item"
              >
                <div className="activity-circle">
                  <FaHistory />
                </div>

                <div className="dashboard-activity-details">
                  <strong>
                    {activity.action.replaceAll("_", " ")}
                  </strong>

                  <span>
                    {activity.entity_type}
                    {activity.entity_id !== null &&
                      ` #${activity.entity_id}`}
                  </span>
                </div>

                <div className="dashboard-activity-meta">
                  <span>
                    User #{activity.actor_id}
                  </span>

                  <small>
                    {new Date(
                      activity.created_at
                    ).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
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