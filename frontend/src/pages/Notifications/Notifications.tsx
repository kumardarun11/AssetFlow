import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";

import api from "../../api/client";
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

const Notifications = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async (userId: number) => {
    const response = await api.get(
      `/api/notifications/user/${userId}`
    );

    const data: Notification[] =
      response.data;

    setNotifications(data);
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
    const response = await api.get(
      "/api/auth/me"
    );

    const currentUser: User =
      response.data;

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

      await api.put(
        `/api/notifications/${notificationId}/read`
      );

      if (user) {
        await loadNotifications(user.id);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Something went wrong"
      );
    }
  };

  const markAllRead = async () => {
    if (!user) {
      return;
    }

    try {
      setError("");

      await api.put(
        `/api/notifications/user/${user.id}/read-all`
      );

      await loadNotifications(user.id);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Something went wrong"
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