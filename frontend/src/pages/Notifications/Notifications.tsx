import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";

import "./Notifications.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Notification {
  id: number;
  user_id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const API_URL = "http://127.0.0.1:8000";

const Notifications = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("access_token");

  const loadNotifications = async (userId: number) => {
    const response = await fetch(
      `${API_URL}/api/notifications/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load notifications");
    }

    const data: Notification[] = await response.json();

    setNotifications(data);
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load current user");
        }

        const currentUser: User = await response.json();

        setUser(currentUser);

        await loadNotifications(currentUser.id);
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

    loadPage();
  }, []);

  const markRead = async (notificationId: number) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to mark notification as read"
        );
      }

      if (user) {
        await loadNotifications(user.id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  };

  const markAllRead = async () => {
    if (!user) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/notifications/user/${user.id}/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to mark all notifications as read"
        );
      }

      await loadNotifications(user.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <div className="notifications-loading">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <h1>Notifications</h1>

          <p>
            You have {unreadCount} unread notifications.
          </p>
        </div>

        <FaBell />
      </header>

      {error && (
        <div className="notifications-error">
          {error}
        </div>
      )}

      <section className="notifications-card">
        <div className="notifications-toolbar">
          <h2>Notification Center</h2>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllRead}
            >
              <FaCheckDouble />
              Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <FaBell />
            <p>No notifications found.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.is_read ? "read" : "unread"
                }`}
              >
                <div className="notification-icon">
                  <FaBell />
                </div>

                <div className="notification-content">
                  <div className="notification-top">
                    <span className="notification-type">
                      {notification.type.replaceAll("_", " ")}
                    </span>

                    <span className="notification-date">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </span>
                  </div>

                  <p>{notification.message}</p>
                </div>

                {!notification.is_read && (
                  <button
                    className="mark-read-btn"
                    onClick={() =>
                      markRead(notification.id)
                    }
                  >
                    <FaCheck />
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;