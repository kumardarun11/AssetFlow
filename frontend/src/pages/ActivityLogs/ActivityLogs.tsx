import { useCallback, useEffect, useState } from "react";
import {
  FaHistory,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

import "./ActivityLogs.css";

interface ActivityLog {
  id: number;
  actor_id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  created_at: string;
}

const API_URL = "http://127.0.0.1:8000";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const [actorId, setActorId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("access_token");

  const loadLogs = useCallback(
    async (useFilters = false) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (useFilters) {
          if (actorId) {
            params.append("actor_id", actorId);
          }

          if (entityType.trim()) {
            params.append(
              "entity_type",
              entityType.trim()
            );
          }

          if (action.trim()) {
            params.append("action", action.trim());
          }
        }

        const query = params.toString();

        const response = await fetch(
          `${API_URL}/api/activity-logs/${
            query ? `?${query}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load activity logs"
          );
        }

        const data: ActivityLog[] =
          await response.json();

        setLogs(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
    [actorId, entityType, action]
  );

  useEffect(() => {
    loadLogs(false);
  }, []);

  const applyFilters = () => {
    loadLogs(true);
  };

  const resetFilters = () => {
    setActorId("");
    setEntityType("");
    setAction("");

    setTimeout(() => {
      loadLogs(false);
    }, 0);
  };

  return (
    <div className="activity-page">
      <header className="activity-header">
        <div>
          <h1>Activity Logs</h1>

          <p>
            Track system activity and entity changes.
          </p>
        </div>

        <FaHistory />
      </header>

      {error && (
        <div className="activity-error">
          {error}
        </div>
      )}

      <section className="activity-filter-card">
        <div className="activity-filter-grid">
          <div>
            <label>Actor ID</label>

            <input
              type="number"
              value={actorId}
              onChange={(event) =>
                setActorId(event.target.value)
              }
              placeholder="User ID"
            />
          </div>

          <div>
            <label>Entity Type</label>

            <input
              type="text"
              value={entityType}
              onChange={(event) =>
                setEntityType(event.target.value)
              }
              placeholder="e.g. ASSET"
            />
          </div>

          <div>
            <label>Action</label>

            <input
              type="text"
              value={action}
              onChange={(event) =>
                setAction(event.target.value)
              }
              placeholder="e.g. CREATED"
            />
          </div>
        </div>

        <div className="activity-filter-actions">
          <button
            className="activity-search-btn"
            onClick={applyFilters}
          >
            <FaSearch />
            Apply Filters
          </button>

          <button
            className="activity-reset-btn"
            onClick={resetFilters}
          >
            <FaSyncAlt />
            Reset
          </button>
        </div>
      </section>

      <section className="activity-list-card">
        <div className="activity-list-header">
          <h2>System Activity</h2>

          <span>{logs.length} records</span>
        </div>

        {loading ? (
          <div className="activity-empty">
            Loading activity logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="activity-empty">
            No activity logs found.
          </div>
        ) : (
          <div className="activity-table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>#{log.id}</td>

                    <td>User #{log.actor_id}</td>

                    <td>
                      <span className="action-badge">
                        {log.action}
                      </span>
                    </td>

                    <td>{log.entity_type}</td>

                    <td>
                      {log.entity_id !== null
                        ? `#${log.entity_id}`
                        : "—"}
                    </td>

                    <td>
                      {new Date(
                        log.created_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivityLogs;