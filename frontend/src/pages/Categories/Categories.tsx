import { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import "./Categories.css";

interface AssetCategory {
  id: number;
  name: string;
  custom_fields: Record<string, unknown> | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AssetCategory | null>(null);

  const [form, setForm] = useState({
    name: "",
    custom_fields: "",
    status: "ACTIVE",
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/categories");

      setCategories(response.data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to load asset categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setForm({
      name: "",
      custom_fields: "",
      status: "ACTIVE",
    });

    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (category: AssetCategory) => {
    setEditing(category);

    setForm({
      name: category.name,
      custom_fields: category.custom_fields
        ? JSON.stringify(category.custom_fields, null, 2)
        : "",
      status: category.status,
    });

    setShowForm(true);
  };

  const saveCategory = async () => {
    if (!form.name.trim()) {
      alert("Category name is required");
      return;
    }

    let customFields: Record<string, unknown> | null = null;

    if (form.custom_fields.trim()) {
      try {
        customFields = JSON.parse(form.custom_fields);
      } catch {
        alert(
          "Custom Fields must contain valid JSON.\n\nExample:\n{\"brand\": \"string\", \"warranty_years\": \"number\"}"
        );
        return;
      }
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      custom_fields: customFields,
      status: form.status,
    };

    try {
      if (editing) {
        await api.put(
          `/api/categories/${editing.id}`,
          payload
        );
      } else {
        await api.post("/api/categories", payload);
      }

      setShowForm(false);
      resetForm();

      await loadCategories();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to save asset category"
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivateCategory = async (id: number) => {
    if (!window.confirm("Deactivate this asset category?")) {
      return;
    }

    try {
      await api.put(`/api/categories/${id}/deactivate`);

      await loadCategories();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to deactivate category"
      );
    }
  };

  const formatCustomFields = (
    fields: Record<string, unknown> | null
  ) => {
    if (!fields || Object.keys(fields).length === 0) {
      return "None";
    }

    return Object.keys(fields).join(", ");
  };

  if (loading) {
    return (
      <div className="categories-state">
        Loading asset categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-state error">
        {error}
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <h1>Asset Categories</h1>
          <p>
            Manage asset categories and their custom fields.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreate}
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="category-form-card">
          <h2>
            {editing
              ? "Edit Asset Category"
              : "Create Asset Category"}
          </h2>

          <div className="form-grid">
            <label>
              Category Name
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Laptop"
              />
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

          <label className="custom-fields-label">
            Custom Fields
            <textarea
              value={form.custom_fields}
              onChange={(e) =>
                setForm({
                  ...form,
                  custom_fields: e.target.value,
                })
              }
              placeholder={`{
  "brand": "string",
  "model": "string",
  "warranty_years": "number"
}`}
              rows={8}
            />

            <span className="field-help">
              Enter valid JSON. Leave empty if this category
              does not need custom fields.
            </span>
          </label>

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
              onClick={saveCategory}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </div>
      )}

      <div className="categories-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Custom Fields</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="empty-cell"
                >
                  No asset categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>#{category.id}</td>

                  <td>
                    <strong>{category.name}</strong>
                  </td>

                  <td>
                    <span className="custom-fields">
                      {formatCustomFields(
                        category.custom_fields
                      )}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${category.status.toLowerCase()}`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      category.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEdit(category)
                        }
                      >
                        Edit
                      </button>

                      {category.status === "ACTIVE" && (
                        <button
                          className="deactivate-btn"
                          onClick={() =>
                            deactivateCategory(
                              category.id
                            )
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

export default Categories;