import { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import "./Assets.css";

interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  category_id: number;
  department_id: number | null;
  serial_number: string | null;
  acquisition_date: string | null;
  acquisition_cost: number | null;
  condition: string;
  status: string;
  location: string | null;
  is_bookable: boolean;
  photo_url: string | null;
  custom_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  status: string;
}

interface Department {
  id: number;
  name: string;
  status: string;
}

const CONDITIONS = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
];

const STATUSES = [
  "AVAILABLE",
  "ALLOCATED",
  "RESERVED",
  "UNDER_MAINTENANCE",
  "LOST",
  "RETIRED",
  "DISPOSED",
];

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    department_id: "",
    serial_number: "",
    acquisition_date: "",
    acquisition_cost: "",
    condition: "GOOD",
    location: "",
    is_bookable: false,
    photo_url: "",
    custom_data: "",
    status: "AVAILABLE",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const params: Record<string, string> = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (filterCategory) {
        params.category_id = filterCategory;
      }

      if (filterDepartment) {
        params.department_id = filterDepartment;
      }

      if (filterStatus) {
        params.status = filterStatus;
      }

      const [assetsResponse, categoriesResponse, departmentsResponse] =
        await Promise.all([
          api.get("/api/assets", { params }),
          api.get("/api/categories"),
          api.get("/api/departments"),
        ]);

      setAssets(assetsResponse.data);
      setCategories(categoriesResponse.data);
      setDepartments(departmentsResponse.data);

      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to load asset data"
      );
    } finally {
      setLoading(false);
    }
  }, [
    search,
    filterCategory,
    filterDepartment,
    filterStatus,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadData]);

  const resetForm = () => {
    setForm({
      name: "",
      category_id: "",
      department_id: "",
      serial_number: "",
      acquisition_date: "",
      acquisition_cost: "",
      condition: "GOOD",
      location: "",
      is_bookable: false,
      photo_url: "",
      custom_data: "",
      status: "AVAILABLE",
    });

    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (asset: Asset) => {
    setEditing(asset);

    setForm({
      name: asset.name,
      category_id: asset.category_id.toString(),
      department_id: asset.department_id?.toString() || "",
      serial_number: asset.serial_number || "",
      acquisition_date: asset.acquisition_date
        ? asset.acquisition_date.split("T")[0]
        : "",
      acquisition_cost:
        asset.acquisition_cost !== null
          ? asset.acquisition_cost.toString()
          : "",
      condition: asset.condition,
      location: asset.location || "",
      is_bookable: asset.is_bookable,
      photo_url: asset.photo_url || "",
      custom_data: asset.custom_data
        ? JSON.stringify(asset.custom_data, null, 2)
        : "",
      status: asset.status,
    });

    setShowForm(true);
  };

  const saveAsset = async () => {
    if (!form.name.trim()) {
      alert("Asset name is required");
      return;
    }

    if (!form.category_id) {
      alert("Please select an asset category");
      return;
    }

    let customData: Record<string, unknown> | null = null;

    if (form.custom_data.trim()) {
      try {
        customData = JSON.parse(form.custom_data);
      } catch {
        alert(
          "Custom Data must contain valid JSON.\n\nExample:\n{\"brand\":\"Dell\",\"ram\":\"16GB\"}"
        );
        return;
      }
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      category_id: Number(form.category_id),
      department_id: form.department_id
        ? Number(form.department_id)
        : null,
      serial_number: form.serial_number.trim() || null,
      acquisition_date: form.acquisition_date || null,
      acquisition_cost: form.acquisition_cost
        ? Number(form.acquisition_cost)
        : null,
      condition: form.condition,
      location: form.location.trim() || null,
      is_bookable: form.is_bookable,
      photo_url: form.photo_url.trim() || null,
      custom_data: customData,
      status: form.status,
    };

    try {
      if (editing) {
        await api.put(
          `/api/assets/${editing.id}`,
          payload
        );
      } else {
        await api.post("/api/assets", payload);
      }

      setShowForm(false);
      resetForm();

      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to save asset"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateAssetStatus = async (
    assetId: number,
    newStatus: string
  ) => {
    try {
      await api.patch(
        `/api/assets/${assetId}/status`,
        null,
        {
          params: {
            new_status: newStatus,
          },
        }
      );

      await loadData();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to update asset status"
      );
    }
  };

  const getCategoryName = (id: number) => {
    return (
      categories.find((category) => category.id === id)?.name ||
      `Category #${id}`
    );
  };

  const getDepartmentName = (id: number | null) => {
    if (!id) return "Unassigned";

    return (
      departments.find(
        (department) => department.id === id
      )?.name || `Department #${id}`
    );
  };

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterDepartment("");
    setFilterStatus("");
  };

  if (loading && assets.length === 0) {
    return (
      <div className="assets-state">
        Loading assets...
      </div>
    );
  }

  if (error && assets.length === 0) {
    return (
      <div className="assets-state error">
        {error}
      </div>
    );
  }

  return (
    <div className="assets-page">
      <div className="assets-header">
        <div>
          <h1>Assets</h1>
          <p>
            Manage and track organizational assets.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreate}
        >
          + Add Asset
        </button>
      </div>

      <div className="assets-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value)
          }
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filterDepartment}
          onChange={(e) =>
            setFilterDepartment(e.target.value)
          }
        >
          <option value="">All Departments</option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.id}
            >
              {department.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value)
          }
        >
          <option value="">All Statuses</option>

          {STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        {(search ||
          filterCategory ||
          filterDepartment ||
          filterStatus) && (
          <button
            className="clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>

      {showForm && (
        <div className="asset-form-card">
          <div className="form-title">
            <h2>
              {editing
                ? "Edit Asset"
                : "Create Asset"}
            </h2>

            {editing && (
              <span className="asset-tag-display">
                {editing.asset_tag}
              </span>
            )}
          </div>

          <div className="form-grid">
            <label>
              Asset Name *
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Dell Latitude 5540"
              />
            </label>

            <label>
              Category *
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Category
                </option>

                {categories
                  .filter(
                    (category) =>
                      category.status === "ACTIVE"
                  )
                  .map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </label>

            <label>
              Department
              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Unassigned
                </option>

                {departments
                  .filter(
                    (department) =>
                      department.status === "ACTIVE"
                  )
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
              Serial Number
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    serial_number: e.target.value,
                  })
                }
                placeholder="e.g. DL5540-001"
              />
            </label>

            <label>
              Acquisition Date
              <input
                type="date"
                value={form.acquisition_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    acquisition_date:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Acquisition Cost
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.acquisition_cost}
                onChange={(e) =>
                  setForm({
                    ...form,
                    acquisition_cost:
                      e.target.value,
                  })
                }
                placeholder="e.g. 75000"
              />
            </label>

            <label>
              Condition
              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition: e.target.value,
                  })
                }
              >
                {CONDITIONS.map((condition) => (
                  <option
                    key={condition}
                    value={condition}
                  >
                    {condition}
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
                {STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Location
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                placeholder="e.g. IT Room - Floor 2"
              />
            </label>

            <label>
              Photo URL
              <input
                type="url"
                value={form.photo_url}
                onChange={(e) =>
                  setForm({
                    ...form,
                    photo_url: e.target.value,
                  })
                }
                placeholder="https://..."
              />
            </label>

            <label className="checkbox-label">
              <span>Bookable Asset</span>

              <input
                type="checkbox"
                checked={form.is_bookable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_bookable:
                      e.target.checked,
                  })
                }
              />
            </label>
          </div>

          <label className="custom-data-label">
            Custom Data
            <textarea
              value={form.custom_data}
              onChange={(e) =>
                setForm({
                  ...form,
                  custom_data: e.target.value,
                })
              }
              placeholder={`{
  "brand": "Dell",
  "model": "Latitude 5540",
  "ram": "16GB"
}`}
              rows={7}
            />

            <span className="field-help">
              Enter additional asset information as
              valid JSON. Leave empty if not required.
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
              onClick={saveAsset}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Asset"
                : "Create Asset"}
            </button>
          </div>
        </div>
      )}

      <div className="assets-summary">
        <div className="summary-item">
          <span>Total Assets</span>
          <strong>{assets.length}</strong>
        </div>

        <div className="summary-item available">
          <span>Available</span>
          <strong>
            {
              assets.filter(
                (asset) =>
                  asset.status === "AVAILABLE"
              ).length
            }
          </strong>
        </div>

        <div className="summary-item allocated">
          <span>Allocated</span>
          <strong>
            {
              assets.filter(
                (asset) =>
                  asset.status === "ALLOCATED"
              ).length
            }
          </strong>
        </div>

        <div className="summary-item maintenance">
          <span>Maintenance</span>
          <strong>
            {
              assets.filter(
                (asset) =>
                  asset.status ===
                  "UNDER_MAINTENANCE"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="assets-card">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Category</th>
              <th>Department</th>
              <th>Serial Number</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="empty-cell"
                >
                  No assets found.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <div className="asset-name">
                      <strong>{asset.name}</strong>
                      <span>
                        {asset.asset_tag}
                      </span>
                    </div>
                  </td>

                  <td>
                    {getCategoryName(
                      asset.category_id
                    )}
                  </td>

                  <td>
                    {getDepartmentName(
                      asset.department_id
                    )}
                  </td>

                  <td>
                    {asset.serial_number ||
                      "—"}
                  </td>

                  <td>
                    <span
                      className={`condition-badge ${asset.condition.toLowerCase()}`}
                    >
                      {asset.condition}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${asset.status.toLowerCase()}`}
                    >
                      {asset.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  <td>
                    {asset.location || "—"}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEdit(asset)
                        }
                      >
                        Edit
                      </button>

                      <select
                        className="status-select"
                        value={asset.status}
                        onChange={(e) =>
                          updateAssetStatus(
                            asset.id,
                            e.target.value
                          )
                        }
                      >
                        {STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status.replaceAll(
                                "_",
                                " "
                              )}
                            </option>
                          )
                        )}
                      </select>
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

export default Assets;