import { useCallback, useEffect, useState } from "react";
import {
  FaExchangeAlt,
  FaPlus,
  FaSyncAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import "./Transfers.css";

interface Transfer {
  id: number;
  asset_id: number;
  requested_by_id: number;
  target_employee_id: number | null;
  target_department_id: number | null;
  approved_by_id: number | null;
  status: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Transfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [assetId, setAssetId] = useState("");
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("access_token");

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const [transferResponse, userResponse] =
        await Promise.all([
          fetch("http://127.0.0.1:8000/api/transfers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://127.0.0.1:8000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      if (!transferResponse.ok) {
        throw new Error("Failed to load transfers");
      }

      const transferData = await transferResponse.json();

      setTransfers(transferData);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getUserName = (id: number | null) => {
    if (!id) return "—";

    const user = users.find((item) => item.id === id);

    return user ? user.name : `User #${id}`;
  };

  const requestTransfer = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!token) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/transfers",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            asset_id: Number(assetId),
            target_employee_id: Number(targetEmployeeId),
            target_department_id: null,
            reason: reason || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Transfer request failed"
        );
      }

      setAssetId("");
      setTargetEmployeeId("");
      setReason("");
      setShowForm(false);

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Transfer request failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reviewTransfer = async (
    transferId: number,
    action: "approve" | "reject"
  ) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/transfers/${transferId}/${action}`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to ${action} transfer`
        );
      }

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Transfer review failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="transfers-state">
        Loading transfers...
      </div>
    );
  }

  const pendingCount = transfers.filter(
    (transfer) => transfer.status === "REQUESTED"
  ).length;

  const approvedCount = transfers.filter(
    (transfer) => transfer.status === "APPROVED"
  ).length;

  const rejectedCount = transfers.filter(
    (transfer) => transfer.status === "REJECTED"
  ).length;

  return (
    <div className="transfers-page">
      <div className="transfers-header">
        <div>
          <h1>Asset Transfers</h1>

          <p>
            Request and manage asset transfers.
          </p>
        </div>

        <div className="transfer-header-actions">
          <button
            className="transfer-refresh-btn"
            onClick={fetchData}
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            className="new-transfer-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus />
            Request Transfer
          </button>
        </div>
      </div>

      <section className="transfer-summary">
        <div className="transfer-summary-card">
          <FaExchangeAlt />

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="transfer-summary-card">
          <FaCheck />

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="transfer-summary-card">
          <FaTimes />

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </section>

      {showForm && (
        <form
          className="transfer-form"
          onSubmit={requestTransfer}
        >
          <h2>Request Asset Transfer</h2>

          <div className="transfer-form-grid">
            <div>
              <label>Asset ID</label>

              <input
                type="number"
                min="1"
                value={assetId}
                onChange={(event) =>
                  setAssetId(event.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Target Employee</label>

              <select
                value={targetEmployeeId}
                onChange={(event) =>
                  setTargetEmployeeId(event.target.value)
                }
                required
              >
                <option value="">
                  Select employee
                </option>

                {users
                  .filter(
                    (user) => user.status === "ACTIVE"
                  )
                  .map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} — {user.role}
                    </option>
                  ))}
              </select>
            </div>

            <div className="transfer-reason">
              <label>Reason</label>

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Reason for transfer"
              />
            </div>
          </div>

          <div className="transfer-form-actions">
            <button
              type="button"
              className="transfer-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="transfer-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Request Transfer"}
            </button>
          </div>
        </form>
      )}

      <div className="transfers-table-card">
        <table className="transfers-table">
          <thead>
            <tr>
              <th>Transfer</th>
              <th>Asset</th>
              <th>Requested By</th>
              <th>Target Employee</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {transfers.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-transfers">
                  No transfer requests found.
                </td>
              </tr>
            ) : (
              transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>
                    <strong>#{transfer.id}</strong>
                  </td>

                  <td>Asset #{transfer.asset_id}</td>

                  <td>
                    {getUserName(
                      transfer.requested_by_id
                    )}
                  </td>

                  <td>
                    {getUserName(
                      transfer.target_employee_id
                    )}
                  </td>

                  <td>
                    {transfer.reason || "—"}
                  </td>

                  <td>
                    <span
                      className={`transfer-badge ${transfer.status.toLowerCase()}`}
                    >
                      {transfer.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      transfer.created_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    {transfer.status === "REQUESTED" ? (
                      <div className="transfer-row-actions">
                        <button
                          className="approve-transfer-btn"
                          onClick={() =>
                            reviewTransfer(
                              transfer.id,
                              "approve"
                            )
                          }
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="reject-transfer-btn"
                          onClick={() =>
                            reviewTransfer(
                              transfer.id,
                              "reject"
                            )
                          }
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transfers;