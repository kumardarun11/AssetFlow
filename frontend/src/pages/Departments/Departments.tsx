import { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import "./Departments.css";

interface Department {
  id: number;
  name: string;
  parent_department_id: number | null;
  department_head_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const [form, setForm] = useState({
    name: "",
    parent_department_id: "",
    department_head_id: "",
    status: "ACTIVE",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [departmentResponse, usersResponse] = await Promise.all([
        api.get("/api/departments"),
        api.get("/api/users"),
      ]);

      setDepartments(departmentResponse.data);
      setUsers(usersResponse.data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setForm({
      name: "",
      parent_department_id: "",
      department_head_id: "",
      status: "ACTIVE",
    });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (department: Department) => {
    setEditing(department);

    setForm({
      name: department.name,
      parent_department_id:
        department.parent_department_id?.toString() || "",
      department_head_id:
        department.department_head_id?.toString() || "",
      status: department.status,
    });

    setShowForm(true);
  };

  const saveDepartment = async () => {
    if (!form.name.trim()) {
      alert("Department name is required");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      parent_department_id: form.parent_department_id
        ? Number(form.parent_department_id)
        : null,
      department_head_id: form.department_head_id
        ? Number(form.department_head_id)
        : null,
      status: form.status,
    };

    try {
      if (editing) {
        await api.put(`/api/departments/${editing.id}`, payload);
      } else {
        await api.post("/api/departments", payload);
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to save department"
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivateDepartment = async (id: number) => {
    if (!window.confirm("Deactivate this department?")) {
      return;
    }

    try {
      await api.put(`/api/departments/${id}/deactivate`);
      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to deactivate department"
      );
    }
  };

  const getUserName = (id: number | null) => {
    if (!id) return "Not assigned";

    return (
      users.find((user) => user.id === id)?.name ||
      `User #${id}`
    );
  };

  if (loading) {
    return <div className="departments-state">Loading departments...</div>;
  }

  if (error) {
    return <div className="departments-state error">{error}</div>;
  }

  return (
    <div className="departments-page">
      <div className="departments-header">
        <div>
          <h1>Departments</h1>
          <p>Manage organizational departments and department heads.</p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreate}
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <div className="department-form-card">
          <h2>{editing ? "Edit Department" : "Create Department"}</h2>

          <div className="form-grid">
            <label>
              Department Name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Information Technology"
              />
            </label>

            <label>
              Parent Department
              <select
                value={form.parent_department_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    parent_department_id: e.target.value,
                  })
                }
              >
                <option value="">None</option>

                {departments
                  .filter((department) => department.id !== editing?.id)
                  .map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
              </select>
            </label>

            <label>
              Department Head
              <select
                value={form.department_head_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department_head_id: e.target.value,
                  })
                }
              >
                <option value="">Not assigned</option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name} — {user.role}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button
              className="secondary-btn"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={saveDepartment}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Department"
                : "Create Department"}
            </button>
          </div>
        </div>
      )}

      <div className="departments-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Parent</th>
              <th>Department Head</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.id}>
                  <td>#{department.id}</td>

                  <td>
                    <strong>{department.name}</strong>
                  </td>

                  <td>
                    {department.parent_department_id
                      ? departments.find(
                          (d) =>
                            d.id === department.parent_department_id
                        )?.name ||
                        `#${department.parent_department_id}`
                      : "None"}
                  </td>

                  <td>
                    {getUserName(department.department_head_id)}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${department.status.toLowerCase()}`}
                    >
                      {department.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEdit(department)}
                      >
                        Edit
                      </button>

                      {department.status === "ACTIVE" && (
                        <button
                          className="deactivate-btn"
                          onClick={() =>
                            deactivateDepartment(department.id)
                          }
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
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

export default Departments;