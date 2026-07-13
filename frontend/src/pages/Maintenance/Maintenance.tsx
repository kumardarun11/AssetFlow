import { useEffect, useState } from "react";
import {
  FaCheck,
  FaPlus,
  FaTools,
  FaTimes,
} from "react-icons/fa";

import "./Maintenance.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface MaintenanceRequest {
  id: number;
  asset_id: number;
  requested_by_id: number;
  approved_by_id: number | null;
  technician_id: number | null;
  issue_description: string;
  priority: string;
  status: string;
  photo_url: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface MaintenanceHistory {
  total: number;
  maintenance_requests: MaintenanceRequest[];
}

const API_URL = "http://127.0.0.1:8000";

const Maintenance = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [assetId, setAssetId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [photoUrl, setPhotoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const getToken = () => localStorage.getItem("access_token");

  const loadRequests = async () => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/api/maintenance/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load maintenance requests");
    }

    const data: MaintenanceHistory = await response.json();

    setRequests(data.maintenance_requests);
  };

  const loadUser = async () => {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load current user");
    }

    const data: User = await response.json();

    setUser(data);

    return data;
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        await Promise.all([
          loadRequests(),
          loadUser(),
        ]);
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

  const createRequest = async () => {
    if (!user) {
      setError("Current user not loaded");
      return;
    }

    if (!assetId || !description.trim()) {
      setError("Asset ID and issue description are required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/maintenance/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asset_id: Number(assetId),
            requested_by_id: user.id,
            issue_description: description,
            priority,
            photo_url: photoUrl || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to create maintenance request"
        );
      }

      setAssetId("");
      setDescription("");
      setPriority("MEDIUM");
      setPhotoUrl("");

      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reviewRequest = async (
    requestId: number,
    action: "approve" | "reject"
  ) => {
    if (!user) {
      return;
    }

    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/maintenance/${requestId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approved_by_id: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : `Failed to ${action} request`
        );
      }

      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  };

  const assignTechnician = async (
    requestId: number
  ) => {
    const id = Number(technicianId);
  
    if (!Number.isInteger(id) || id <= 0) {
      setError("Enter a valid technician ID");
      return;
    }
  
    try {
      setError("");
  
      const token = getToken();
  
      const response = await fetch(
        `${API_URL}/api/maintenance/${requestId}/assign`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            technician_id: id,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to assign technician"
        );
      }
  
      setTechnicianId("");
  
      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  };
  const updateStatus = async (
    requestId: number,
    status: string
  ) => {
    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/maintenance/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to update maintenance status"
        );
      }

      await loadRequests();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleString();

  const canManage =
    user?.role === "ADMIN" ||
    user?.role === "ASSET_MANAGER";

  if (loading) {
    return (
      <div className="maintenance-loading">
        Loading maintenance...
      </div>
    );
  }

  return (
    <div className="maintenance-page">
      <header className="maintenance-header">
        <div>
          <h1>Maintenance</h1>
          <p>Report and track asset maintenance issues.</p>
        </div>

        <FaTools />
      </header>

      {error && (
        <div className="maintenance-error">
          {error}
        </div>
      )}

      <section className="maintenance-create-card">
        <h2>
          <FaPlus />
          Raise Maintenance Request
        </h2>

        <div className="maintenance-form-grid">
          <div>
            <label>Asset ID</label>

            <input
              type="number"
              value={assetId}
              onChange={(event) =>
                setAssetId(event.target.value)
              }
              placeholder="Enter asset ID"
            />
          </div>

          <div>
            <label>Priority</label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="maintenance-wide">
            <label>Issue Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the asset issue"
            />
          </div>

          <div className="maintenance-wide">
            <label>Photo URL</label>

            <input
              type="url"
              value={photoUrl}
              onChange={(event) =>
                setPhotoUrl(event.target.value)
              }
              placeholder="Optional photo URL"
            />
          </div>
        </div>

        <button
          className="maintenance-create-btn"
          onClick={createRequest}
          disabled={submitting}
        >
          <FaPlus />

          {submitting
            ? "Submitting..."
            : "Submit Request"}
        </button>
      </section>

      <section className="maintenance-list-card">
        <div className="maintenance-list-heading">
          <h2>Maintenance Requests</h2>

          <span>{requests.length} records</span>
        </div>

        {requests.length === 0 ? (
          <div className="maintenance-empty">
            No maintenance requests found.
          </div>
        ) : (
          <div className="maintenance-table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Issue</th>
                  <th>Priority</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>#{request.id}</td>

                    <td>Asset #{request.asset_id}</td>

                    <td>{request.issue_description}</td>

                    <td>
                      <span
                        className={`priority-badge ${request.priority.toLowerCase()}`}
                      >
                        {request.priority}
                      </span>
                    </td>

                    <td>
                      {request.technician_id
                        ? `User #${request.technician_id}`
                        : "—"}
                    </td>

                    <td>
                      <span className="maintenance-status">
                        {request.status}
                      </span>
                    </td>

                    <td>{formatDate(request.created_at)}</td>

                    <td>
                      <div className="maintenance-actions">
                        {canManage &&
                          request.status === "PENDING" && (
                            <>
                              <button
                                className="approve-maintenance-btn"
                                onClick={() =>
                                  reviewRequest(
                                    request.id,
                                    "approve"
                                  )
                                }
                              >
                                <FaCheck />
                              </button>

                              <button
                                className="reject-maintenance-btn"
                                onClick={() =>
                                  reviewRequest(
                                    request.id,
                                    "reject"
                                  )
                                }
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}

                        {canManage &&
                          request.status === "APPROVED" && (
                            <>
                              <input
                                type="number"
                                className="technician-input"
                                placeholder="Tech ID"
                                value={technicianId}
                                onChange={(event) =>
                                  setTechnicianId(event.target.value)
                                }
                              />
                        
                              <button
                                className="assign-maintenance-btn"
                                onClick={() =>
                                  assignTechnician(request.id)
                                }
                              >
                                Assign
                              </button>
                            </>
                          )}

                        {canManage &&
                          request.status ===
                            "TECHNICIAN_ASSIGNED" && (
                            <button
                              className="status-maintenance-btn"
                              onClick={() =>
                                updateStatus(
                                  request.id,
                                  "IN_PROGRESS"
                                )
                              }
                            >
                              Start
                            </button>
                          )}

                        {canManage &&
                          request.status === "IN_PROGRESS" && (
                            <button
                              className="status-maintenance-btn"
                              onClick={() =>
                                updateStatus(
                                  request.id,
                                  "RESOLVED"
                                )
                              }
                            >
                              Resolve
                            </button>
                          )}
                      </div>
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

export default Maintenance;