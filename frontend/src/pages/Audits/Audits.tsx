import { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import "./Audits.css";

interface AuditCycle {
  id: number;
  name: string;
  department_id: number | null;
  location: string | null;
  start_date: string;
  end_date: string;
  status: string;
  created_by_id: number;
  created_at: string;
  updated_at: string;
}

interface AuditAuditor {
  id: number;
  audit_cycle_id: number;
  auditor_id: number;
}

interface AuditItem {
  id: number;
  audit_cycle_id: number;
  asset_id: number;
  verified_by_id: number | null;
  status: string;
  discrepancy_notes: string | null;
  verified_at: string | null;
}

interface DiscrepancyResponse {
  total: number;
  items: AuditItem[];
}

interface Department {
  id: number;
  name: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
  role: string;
}

interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  status: string;
}

const ITEM_STATUSES = [
  "PENDING",
  "VERIFIED",
  "MISSING",
  "DAMAGED",
];

const Audits = () => {
  const [audits, setAudits] = useState<AuditCycle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedAudit, setSelectedAudit] =
    useState<AuditCycle | null>(null);

  const [auditors, setAuditors] = useState<AuditAuditor[]>([]);
  const [items, setItems] = useState<AuditItem[]>([]);
  const [discrepancies, setDiscrepancies] =
    useState<DiscrepancyResponse>({
      total: 0,
      items: [],
    });

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [form, setForm] = useState({
    name: "",
    department_id: "",
    location: "",
    start_date: "",
    end_date: "",
  });

  const [auditorId, setAuditorId] = useState("");
  const [assetId, setAssetId] = useState("");

  const [verifyForms, setVerifyForms] = useState<
    Record<
      number,
      {
        status: string;
        discrepancy_notes: string;
        verified_by_id: string;
      }
    >
  >({});

  const loadBaseData = useCallback(async () => {
    try {
      const [
        auditsResponse,
        departmentsResponse,
        usersResponse,
        assetsResponse,
      ] = await Promise.all([
        api.get("/api/audits"),
        api.get("/api/departments"),
        api.get("/api/users"),
        api.get("/api/assets"),
      ]);

      setAudits(auditsResponse.data);
      setDepartments(departmentsResponse.data);
      setUsers(usersResponse.data);
      setAssets(assetsResponse.data);

      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to load audit data"
      );
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadBaseData();
      setLoading(false);
    };

    load();
  }, [loadBaseData]);

  const loadAuditDetails = async (audit: AuditCycle) => {
    try {
      setSelectedAudit(audit);
      setShowDetails(true);

      const [
        auditorsResponse,
        itemsResponse,
        discrepanciesResponse,
      ] = await Promise.all([
        api.get(
          `/api/audits/${audit.id}/auditors`
        ).catch(() => ({ data: [] })),
        api.get(
          `/api/audits/${audit.id}/items`
        ),
        api.get(
          `/api/audits/${audit.id}/discrepancies`
        ),
      ]);

      setAuditors(auditorsResponse.data);
      setItems(itemsResponse.data);
      setDiscrepancies(discrepanciesResponse.data);

      const initialVerifyForms: Record<
        number,
        {
          status: string;
          discrepancy_notes: string;
          verified_by_id: string;
        }
      > = {};

      itemsResponse.data.forEach(
        (item: AuditItem) => {
          initialVerifyForms[item.id] = {
            status: item.status,
            discrepancy_notes:
              item.discrepancy_notes || "",
            verified_by_id:
              item.verified_by_id?.toString() || "",
          };
        }
      );

      setVerifyForms(initialVerifyForms);
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to load audit details"
      );
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      department_id: "",
      location: "",
      start_date: "",
      end_date: "",
    });
  };

  const createAudit = async () => {
    if (!form.name.trim()) {
      alert("Audit name is required");
      return;
    }

    if (!form.start_date || !form.end_date) {
      alert("Start date and end date are required");
      return;
    }

    if (form.end_date < form.start_date) {
      alert(
        "End date cannot be earlier than start date"
      );
      return;
    }

    /*
     * The backend requires created_by_id.
     * We obtain the currently authenticated user
     * from /api/auth/me.
     */
    let currentUser: User;

    try {
      const response = await api.get("/api/auth/me");
      currentUser = response.data;
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Unable to determine current user"
      );
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      department_id: form.department_id
        ? Number(form.department_id)
        : null,
      location: form.location.trim() || null,
      start_date: form.start_date,
      end_date: form.end_date,
      created_by_id: currentUser.id,
    };

    try {
      await api.post("/api/audits", payload);

      setShowForm(false);
      resetForm();

      await loadBaseData();
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to create audit"
      );
    } finally {
      setSaving(false);
    }
  };

  const addAuditor = async () => {
    if (!selectedAudit) return;

    if (!auditorId) {
      alert("Please select an auditor");
      return;
    }

    try {
      await api.post(
        `/api/audits/${selectedAudit.id}/auditors`,
        {
          auditor_id: Number(auditorId),
        }
      );

      setAuditorId("");

      await loadAuditDetails(selectedAudit);
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to add auditor"
      );
    }
  };

  const addAuditItem = async () => {
    if (!selectedAudit) return;

    if (!assetId) {
      alert("Please select an asset");
      return;
    }

    try {
      await api.post(
        `/api/audits/${selectedAudit.id}/items`,
        {
          asset_id: Number(assetId),
        }
      );

      setAssetId("");

      await loadAuditDetails(selectedAudit);
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to add audit item"
      );
    }
  };

  const updateVerifyForm = (
    itemId: number,
    field:
      | "status"
      | "discrepancy_notes"
      | "verified_by_id",
    value: string
  ) => {
    setVerifyForms((previous) => ({
      ...previous,
      [itemId]: {
        ...previous[itemId],
        [field]: value,
      },
    }));
  };

  const verifyItem = async (item: AuditItem) => {
    if (!selectedAudit) return;

    const data = verifyForms[item.id];

    if (!data?.status) {
      alert("Please select an item status");
      return;
    }

    if (!data?.verified_by_id) {
      alert("Please select who verified this item");
      return;
    }

    try {
      await api.put(
        `/api/audits/items/${item.id}/verify`,
        {
          status: data.status,
          discrepancy_notes:
            data.discrepancy_notes.trim() || null,
          verified_by_id: Number(
            data.verified_by_id
          ),
        }
      );

      await loadAuditDetails(selectedAudit);
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to verify audit item"
      );
    }
  };

  const closeAudit = async () => {
    if (!selectedAudit) return;

    if (
      !window.confirm(
        "Close this audit cycle? This action may prevent further audit changes."
      )
    ) {
      return;
    }

    try {
      await api.put(
        `/api/audits/${selectedAudit.id}/close`
      );

      await loadBaseData();

      const updatedAudit = {
        ...selectedAudit,
        status: "CLOSED",
      };

      setSelectedAudit(updatedAudit);

      await loadAuditDetails(updatedAudit);
    } catch (err: any) {
      alert(
        err.response?.data?.detail ||
          "Failed to close audit"
      );
    }
  };

  const getDepartmentName = (
    departmentId: number | null
  ) => {
    if (!departmentId) return "All Departments";

    return (
      departments.find(
        (department) =>
          department.id === departmentId
      )?.name ||
      `Department #${departmentId}`
    );
  };

  const getUserName = (userId: number | null) => {
    if (!userId) return "Not assigned";

    return (
      users.find((user) => user.id === userId)
        ?.name || `User #${userId}`
    );
  };

  const getAsset = (assetId: number) => {
    return assets.find(
      (asset) => asset.id === assetId
    );
  };

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="audits-state">
        Loading audits...
      </div>
    );
  }

  if (error) {
    return (
      <div className="audits-state error">
        {error}
      </div>
    );
  }

  return (
    <div className="audits-page">
      <div className="audits-header">
        <div>
          <h1>Audits</h1>
          <p>
            Plan, perform and track organizational
            asset audits.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Create Audit
        </button>
      </div>

      {showForm && (
        <div className="audit-form-card">
          <h2>Create Audit Cycle</h2>

          <div className="form-grid">
            <label>
              Audit Name *
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Q3 Asset Audit"
              />
            </label>

            <label>
              Department
              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department_id:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  All Departments
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
                placeholder="e.g. Head Office"
              />
            </label>

            <label>
              Start Date *
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_date:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              End Date *
              <input
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    end_date:
                      e.target.value,
                  })
                }
              />
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
              onClick={createAudit}
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Audit"}
            </button>
          </div>
        </div>
      )}

      {showDetails && selectedAudit && (
        <div className="audit-details">
          <div className="details-header">
            <div>
              <button
                className="back-btn"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedAudit(null);
                }}
              >
                ← Back to Audits
              </button>

              <h2>{selectedAudit.name}</h2>

              <div className="audit-meta">
                <span>
                  Department:{" "}
                  <strong>
                    {getDepartmentName(
                      selectedAudit.department_id
                    )}
                  </strong>
                </span>

                <span>
                  Location:{" "}
                  <strong>
                    {selectedAudit.location ||
                      "All locations"}
                  </strong>
                </span>

                <span>
                  Period:{" "}
                  <strong>
                    {formatDate(
                      selectedAudit.start_date
                    )}{" "}
                    –{" "}
                    {formatDate(
                      selectedAudit.end_date
                    )}
                  </strong>
                </span>
              </div>
            </div>

            <div className="details-actions">
              <span
                className={`status-badge ${selectedAudit.status.toLowerCase()}`}
              >
                {selectedAudit.status.replaceAll(
                  "_",
                  " "
                )}
              </span>

              {selectedAudit.status !==
                "CLOSED" && (
                <button
                  className="close-audit-btn"
                  onClick={closeAudit}
                >
                  Close Audit
                </button>
              )}
            </div>
          </div>

          <div className="audit-stats">
            <div>
              <span>Total Items</span>
              <strong>{items.length}</strong>
            </div>

            <div>
              <span>Verified</span>
              <strong>
                {
                  items.filter(
                    (item) =>
                      item.status === "VERIFIED"
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {
                  items.filter(
                    (item) =>
                      item.status === "PENDING"
                  ).length
                }
              </strong>
            </div>

            <div className="discrepancy-stat">
              <span>Discrepancies</span>
              <strong>
                {discrepancies.total}
              </strong>
            </div>
          </div>

          <div className="details-grid">
            <div className="details-card">
              <h3>Auditors</h3>

              {selectedAudit.status !==
                "CLOSED" && (
                <div className="inline-form">
                  <select
                    value={auditorId}
                    onChange={(e) =>
                      setAuditorId(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Auditor
                    </option>

                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.name} — {user.role}
                      </option>
                    ))}
                  </select>

                  <button
                    className="primary-btn"
                    onClick={addAuditor}
                  >
                    Add
                  </button>
                </div>
              )}

              {auditors.length === 0 ? (
                <p className="empty-text">
                  No auditors assigned.
                </p>
              ) : (
                <div className="auditor-list">
                  {auditors.map((auditor) => (
                    <div
                      className="auditor-item"
                      key={auditor.id}
                    >
                      <span className="user-avatar">
                        {getUserName(
                          auditor.auditor_id
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <div>
                        <strong>
                          {getUserName(
                            auditor.auditor_id
                          )}
                        </strong>
                        <small>
                          Auditor
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="details-card">
              <h3>Add Asset to Audit</h3>

              {selectedAudit.status !==
                "CLOSED" && (
                <div className="inline-form">
                  <select
                    value={assetId}
                    onChange={(e) =>
                      setAssetId(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Asset
                    </option>

                    {assets.map((asset) => (
                      <option
                        key={asset.id}
                        value={asset.id}
                      >
                        {asset.asset_tag} —{" "}
                        {asset.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="primary-btn"
                    onClick={addAuditItem}
                  >
                    Add
                  </button>
                </div>
              )}

              <p className="helper-text">
                Add assets that need to be physically
                verified during this audit.
              </p>
            </div>
          </div>

          <div className="details-card items-card">
            <div className="card-heading">
              <div>
                <h3>Audit Items</h3>
                <p>
                  Verify each asset and record any
                  discrepancy.
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="empty-items">
                No assets have been added to this audit.
              </div>
            ) : (
              <div className="items-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Current Asset Status</th>
                      <th>Audit Status</th>
                      <th>Verified By</th>
                      <th>Discrepancy Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => {
                      const asset =
                        getAsset(item.asset_id);

                      const verifyData =
                        verifyForms[item.id] || {
                          status: item.status,
                          discrepancy_notes:
                            item.discrepancy_notes ||
                            "",
                          verified_by_id:
                            item.verified_by_id?.toString() ||
                            "",
                        };

                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="asset-info">
                              <strong>
                                {asset?.name ||
                                  `Asset #${item.asset_id}`}
                              </strong>

                              <span>
                                {asset?.asset_tag ||
                                  `#${item.asset_id}`}
                              </span>
                            </div>
                          </td>

                          <td>
                            {asset?.status ||
                              "Unknown"}
                          </td>

                          <td>
                            <select
                              value={
                                verifyData.status
                              }
                              disabled={
                                selectedAudit.status ===
                                "CLOSED"
                              }
                              onChange={(e) =>
                                updateVerifyForm(
                                  item.id,
                                  "status",
                                  e.target.value
                                )
                              }
                            >
                              {ITEM_STATUSES.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}
                            </select>
                          </td>

                          <td>
                            <select
                              value={
                                verifyData.verified_by_id
                              }
                              disabled={
                                selectedAudit.status ===
                                "CLOSED"
                              }
                              onChange={(e) =>
                                updateVerifyForm(
                                  item.id,
                                  "verified_by_id",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">
                                Select
                              </option>

                              {users.map(
                                (user) => (
                                  <option
                                    key={user.id}
                                    value={user.id}
                                  >
                                    {user.name}
                                  </option>
                                )
                              )}
                            </select>
                          </td>

                          <td>
                            <input
                              type="text"
                              value={
                                verifyData.discrepancy_notes
                              }
                              disabled={
                                selectedAudit.status ===
                                "CLOSED"
                              }
                              onChange={(e) =>
                                updateVerifyForm(
                                  item.id,
                                  "discrepancy_notes",
                                  e.target.value
                                )
                              }
                              placeholder="Optional"
                            />
                          </td>

                          <td>
                            {selectedAudit.status !==
                              "CLOSED" && (
                              <button
                                className="verify-btn"
                                onClick={() =>
                                  verifyItem(
                                    item
                                  )
                                }
                              >
                                Verify
                              </button>
                            )}

                            {item.verified_at && (
                              <small className="verified-time">
                                Verified{" "}
                                {formatDate(
                                  item.verified_at
                                )}
                              </small>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {discrepancies.total > 0 && (
            <div className="details-card discrepancy-card">
              <h3>
                Discrepancies ({discrepancies.total})
              </h3>

              {discrepancies.items.map(
                (item) => {
                  const asset = getAsset(
                    item.asset_id
                  );

                  return (
                    <div
                      className="discrepancy-item"
                      key={item.id}
                    >
                      <div>
                        <strong>
                          {asset?.name ||
                            `Asset #${item.asset_id}`}
                        </strong>

                        <span>
                          {asset?.asset_tag ||
                            `#${item.asset_id}`}
                        </span>
                      </div>

                      <span
                        className={`condition-badge ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>

                      <p>
                        {item.discrepancy_notes ||
                          "No notes provided."}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}

      {!showDetails && (
        <div className="audits-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Audit</th>
                <th>Department</th>
                <th>Location</th>
                <th>Period</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {audits.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="empty-cell"
                  >
                    No audit cycles found.
                  </td>
                </tr>
              ) : (
                audits.map((audit) => (
                  <tr key={audit.id}>
                    <td>#{audit.id}</td>

                    <td>
                      <strong>{audit.name}</strong>
                    </td>

                    <td>
                      {getDepartmentName(
                        audit.department_id
                      )}
                    </td>

                    <td>
                      {audit.location ||
                        "All locations"}
                    </td>

                    <td>
                      {formatDate(
                        audit.start_date
                      )}{" "}
                      –{" "}
                      {formatDate(
                        audit.end_date
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${audit.status.toLowerCase()}`}
                      >
                        {audit.status}
                      </span>
                    </td>

                    <td>
                      {getUserName(
                        audit.created_by_id
                      )}
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          loadAuditDetails(
                            audit
                          )
                        }
                      >
                        Open Audit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Audits;