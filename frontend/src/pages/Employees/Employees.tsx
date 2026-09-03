import { useCallback, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import api from "../../api/client";
import "./Employees.css";

interface User {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  role: string;
  status: string;
  created_at: string;
}

const roles = [
  "ADMIN",
  "ASSET_MANAGER",
  "DEPARTMENT_HEAD",
  "EMPLOYEE",
];

const Employees = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const token = localStorage.getItem("access_token");

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("Authentication token missing");
      setLoading(false);
      return;
    }
  
    try {
      const [usersResponse, meResponse] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/auth/me"),
      ]);
    
      const usersData: User[] = usersResponse.data;
      const meData: User = meResponse.data;
    
      setUsers(usersData);
      setCurrentUser(meData);
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
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (
    userId: number,
    role: string
  ) => {
    if (!token) return;

    setUpdatingId(userId);

    try {
      await api.patch(`/api/users/${userId}/role`, {
        role,
      });

      await fetchUsers();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          err.message ||
          "Failed to update role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleStatus = async (user: User) => {
    if (!token) return;
  
    const newStatus =
      user.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";
  
    setUpdatingId(user.id);
  
    try {
      await api.patch(`/api/users/${user.id}/status`, {
        status: newStatus,
      });
    
      await fetchUsers();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          err.message ||
          "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="employees-state">Loading employees...</div>;
  }

  if (error) {
    return <div className="employees-state error">{error}</div>;
  }

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="employees-page">
      <div className="employees-header">
        <div>
          <h1>Employee Directory</h1>
          <p>
            View and manage AssetFlow users.
          </p>
        </div>

        <div className="employee-count">
          <FaUsers />
          <span>{users.length} Employees</span>
        </div>
      </div>

      <div className="employees-table-card">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isUpdating = updatingId === user.id;

              return (
                <tr key={user.id}>
                  <td>
                    <div className="employee-name">
                      <div className="employee-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <span>ID #{user.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    {user.department_id ?? "Unassigned"}
                  </td>

                  <td>
                    {isAdmin ? (
                      <select
                        value={user.role}
                        disabled={isUpdating}
                        onChange={(event) =>
                          updateRole(
                            user.id,
                            event.target.value
                          )
                        }
                      >
                        {roles.map((role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{user.role}</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {isAdmin && (
                    <td>
                      <button
                        className={
                          user.status === "ACTIVE"
                            ? "deactivate-btn"
                            : "activate-btn"
                        }
                        disabled={isUpdating}
                        onClick={() =>
                          toggleStatus(user)
                        }
                      >
                        {isUpdating
                          ? "Updating..."
                          : user.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;