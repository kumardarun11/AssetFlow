import { useCallback, useEffect, useState } from "react";
import {
  FaLaptop,
  FaPlus,
  FaSyncAlt,
} from "react-icons/fa";

import "./Allocations.css";

interface Allocation {
  id: number;
  asset_id: number;
  employee_id: number | null;
  department_id: number | null;
  allocated_by_id: number;
  allocated_at: string;
  expected_return_date: string | null;
  returned_at: string | null;
  is_active: boolean;
  notes: string | null;
  is_overdue: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  role: string;
  status: string;
  created_at: string;
}

const Allocations = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] =
    useState("");
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("access_token");

  const fetchData = useCallback(async () => {
    if (!token) {
      setError("Authentication token missing");
      setLoading(false);
      return;
    }

    try {
      const [allocationResponse, usersResponse] =
        await Promise.all([
          fetch(
            "http://127.0.0.1:8000/api/allocations",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            "http://127.0.0.1:8000/api/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      if (!allocationResponse.ok) {
        throw new Error("Failed to load allocations");
      }

      if (!usersResponse.ok) {
        throw new Error("Failed to load employees");
      }

      const allocationData: Allocation[] =
        await allocationResponse.json();

      const usersData: User[] =
        await usersResponse.json();

      setAllocations(allocationData);
      setUsers(usersData);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getEmployeeName = (
    employeeId: number | null
  ) => {
    if (!employeeId) {
      return "Department Allocation";
    }

    const employee = users.find(
      (user) => user.id === employeeId
    );

    return employee
      ? employee.name
      : `Employee #${employeeId}`;
  };

  const handleAllocate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!token) return;

    if (!assetId || !employeeId) {
      alert("Asset ID and employee are required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/allocations",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            asset_id: Number(assetId),
            employee_id: Number(employeeId),
            department_id: null,
            expected_return_date:
              expectedReturnDate || null,
            notes: notes || null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.detail || "Failed to allocate asset"
        );
      }

      setAssetId("");
      setEmployeeId("");
      setExpectedReturnDate("");
      setNotes("");

      setShowForm(false);

      await fetchData();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to allocate asset"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="allocations-state">
        Loading allocations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="allocations-state error">
        {error}
      </div>
    );
  }

  const activeCount = allocations.filter(
    (allocation) => allocation.is_active
  ).length;

  const overdueCount = allocations.filter(
    (allocation) => allocation.is_overdue
  ).length;

  return (
    <div className="allocations-page">
      <div className="allocations-header">
        <div>
          <h1>Asset Allocations</h1>

          <p>
            Assign and track assets across employees.
          </p>
        </div>

        <div className="allocation-actions">
          <button
            className="refresh-btn"
            onClick={fetchData}
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            className="new-allocation-btn"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            <FaPlus />
            Allocate Asset
          </button>
        </div>
      </div>

      <section className="allocation-summary">
        <div className="allocation-summary-card">
          <FaLaptop />

          <div>
            <span>Total Allocations</span>
            <strong>{allocations.length}</strong>
          </div>
        </div>

        <div className="allocation-summary-card">
          <FaLaptop />

          <div>
            <span>Active Allocations</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="allocation-summary-card">
          <FaLaptop />

          <div>
            <span>Overdue</span>
            <strong>{overdueCount}</strong>
          </div>
        </div>
      </section>

      {showForm && (
        <form
          className="allocation-form"
          onSubmit={handleAllocate}
        >
          <div className="allocation-form-header">
            <div>
              <h2>Allocate Asset</h2>

              <p>
                Assign an available asset to an employee.
              </p>
            </div>
          </div>

          <div className="allocation-form-grid">
            <div>
              <label>Asset ID</label>

              <input
                type="number"
                min="1"
                value={assetId}
                onChange={(event) =>
                  setAssetId(event.target.value)
                }
                placeholder="Enter asset ID"
              />
            </div>

            <div>
              <label>Employee</label>

              <select
                value={employeeId}
                onChange={(event) =>
                  setEmployeeId(event.target.value)
                }
              >
                <option value="">
                  Select employee
                </option>

                {users
                  .filter(
                    (user) =>
                      user.status === "ACTIVE"
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

            <div>
              <label>Expected Return Date</label>

              <input
                type="date"
                value={expectedReturnDate}
                onChange={(event) =>
                  setExpectedReturnDate(
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label>Notes</label>

              <input
                type="text"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Allocation notes"
              />
            </div>
          </div>

          <div className="allocation-form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-allocation-btn"
              disabled={submitting}
            >
              {submitting
                ? "Allocating..."
                : "Allocate Asset"}
            </button>
          </div>
        </form>
      )}

      <div className="allocations-table-card">
        <table className="allocations-table">
          <thead>
            <tr>
              <th>Allocation</th>
              <th>Asset</th>
              <th>Assigned To</th>
              <th>Allocated At</th>
              <th>Expected Return</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {allocations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="empty-allocations"
                >
                  No allocations found.
                </td>
              </tr>
            ) : (
              allocations.map((allocation) => (
                <tr key={allocation.id}>
                  <td>
                    <strong>
                      #{allocation.id}
                    </strong>
                  </td>

                  <td>
                    Asset #{allocation.asset_id}
                  </td>

                  <td>
                    {getEmployeeName(
                      allocation.employee_id
                    )}
                  </td>

                  <td>
                    {new Date(
                      allocation.allocated_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    {allocation.expected_return_date
                      ? new Date(
                          `${allocation.expected_return_date}T00:00:00`
                        ).toLocaleDateString()
                      : "Not specified"}
                  </td>

                  <td>
                    {allocation.is_overdue ? (
                      <span className="allocation-badge overdue">
                        OVERDUE
                      </span>
                    ) : allocation.is_active ? (
                      <span className="allocation-badge active">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="allocation-badge returned">
                        CLOSED
                      </span>
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

export default Allocations;