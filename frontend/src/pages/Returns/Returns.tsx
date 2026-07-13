import { useCallback, useEffect, useState } from "react";
import {
  FaUndo,
  FaPlus,
  FaSyncAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import "./Returns.css";

interface AssetReturn {
  id: number;
  allocation_id: number;
  requested_by_id: number;
  approved_by_id: number | null;
  condition: string | null;
  check_in_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

const Returns = () => {
  const [returns, setReturns] = useState<AssetReturn[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [allocationId, setAllocationId] = useState("");

  const [approveId, setApproveId] = useState<number | null>(null);
  const [condition, setCondition] = useState("GOOD");
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("access_token");

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [returnsResponse, usersResponse, meResponse] =
        await Promise.all([
          fetch("http://127.0.0.1:8000/api/returns", {
            headers,
          }),

          fetch("http://127.0.0.1:8000/api/users", {
            headers,
          }),

          fetch("http://127.0.0.1:8000/api/auth/me", {
            headers,
          }),
        ]);

      if (!returnsResponse.ok) {
        throw new Error("Failed to load returns");
      }

      setReturns(await returnsResponse.json());

      if (usersResponse.ok) {
        setUsers(await usersResponse.json());
      }

      if (meResponse.ok) {
        setCurrentUser(await meResponse.json());
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

  const requestReturn = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!token) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/returns",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            allocation_id: Number(allocationId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Return request failed"
        );
      }

      setAllocationId("");
      setShowForm(false);

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Return request failed"
      );
    }
  };

  const approveReturn = async () => {
    if (!token || approveId === null) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/returns/${approveId}/approve`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            condition,
            check_in_notes: notes || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Return approval failed"
        );
      }

      setApproveId(null);
      setCondition("GOOD");
      setNotes("");

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Return approval failed"
      );
    }
  };

  const rejectReturn = async (returnId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/returns/${returnId}/reject`,
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
          data.detail || "Return rejection failed"
        );
      }

      await fetchData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Return rejection failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="returns-state">
        Loading returns...
      </div>
    );
  }

  const requestedCount = returns.filter(
    (item) => item.status === "REQUESTED"
  ).length;

  const approvedCount = returns.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedCount = returns.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const canReview =
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "ASSET_MANAGER";

  return (
    <div className="returns-page">
      <div className="returns-header">
        <div>
          <h1>Asset Returns</h1>
          <p>Request and process asset returns.</p>
        </div>

        <div className="returns-header-actions">
          <button
            className="returns-refresh-btn"
            onClick={fetchData}
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            className="new-return-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus />
            Request Return
          </button>
        </div>
      </div>

      <section className="returns-summary">
        <div className="returns-summary-card">
          <FaUndo />

          <div>
            <span>Requested</span>
            <strong>{requestedCount}</strong>
          </div>
        </div>

        <div className="returns-summary-card">
          <FaCheck />

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="returns-summary-card">
          <FaTimes />

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </section>

      {showForm && (
        <form
          className="return-form"
          onSubmit={requestReturn}
        >
          <h2>Request Asset Return</h2>

          <label>Allocation ID</label>

          <input
            type="number"
            min="1"
            value={allocationId}
            onChange={(event) =>
              setAllocationId(event.target.value)
            }
            required
          />

          <div className="return-form-actions">
            <button
              type="button"
              className="return-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="return-submit-btn"
            >
              Request Return
            </button>
          </div>
        </form>
      )}

      {approveId !== null && (
        <div className="approve-return-panel">
          <h2>Approve Return #{approveId}</h2>

          <div className="approve-return-grid">
            <div>
              <label>Asset Condition</label>

              <select
                value={condition}
                onChange={(event) =>
                  setCondition(event.target.value)
                }
              >
                <option value="EXCELLENT">EXCELLENT</option>
                <option value="GOOD">GOOD</option>
                <option value="FAIR">FAIR</option>
                <option value="POOR">POOR</option>
                <option value="DAMAGED">DAMAGED</option>
              </select>
            </div>

            <div>
              <label>Check-in Notes</label>

              <input
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Asset inspection notes"
              />
            </div>
          </div>

          <div className="return-form-actions">
            <button
              className="return-cancel-btn"
              onClick={() => setApproveId(null)}
            >
              Cancel
            </button>

            <button
              className="approve-confirm-btn"
              onClick={approveReturn}
            >
              Approve Return
            </button>
          </div>
        </div>
      )}

      <div className="returns-table-card">
        <table className="returns-table">
          <thead>
            <tr>
              <th>Return</th>
              <th>Allocation</th>
              <th>Requested By</th>
              <th>Condition</th>
              <th>Check-in Notes</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {returns.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-returns">
                  No return requests found.
                </td>
              </tr>
            ) : (
              returns.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>#{item.id}</strong>
                  </td>

                  <td>#{item.allocation_id}</td>

                  <td>
                    {getUserName(item.requested_by_id)}
                  </td>

                  <td>{item.condition || "—"}</td>

                  <td>{item.check_in_notes || "—"}</td>

                  <td>
                    <span
                      className={`return-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    {item.status === "REQUESTED" &&
                    canReview ? (
                      <div className="return-row-actions">
                        <button
                          className="approve-return-btn"
                          onClick={() =>
                            setApproveId(item.id)
                          }
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="reject-return-btn"
                          onClick={() =>
                            rejectReturn(item.id)
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

export default Returns;