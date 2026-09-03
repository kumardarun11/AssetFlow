import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

import api from "../../api/client";
import "./Bookings.css";

interface Booking {
  id: number;
  asset_id: number;
  booked_by_id: number;
  department_id: number | null;
  start_time: string;
  end_time: string;
  purpose: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  role: string;
  status: string;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [assetId, setAssetId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    const response = await api.get("/api/bookings/");

    const data: Booking[] = response.data;

    setBookings(data);
  };

  const loadUser = async () => {
    const response = await api.get("/api/auth/me");
  
    const data: User = response.data;
  
    setUser(data);
  
    return data;
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        await Promise.all([
          loadBookings(),
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

  const createBooking = async () => {
    if (!user) {
      setError("Current user not loaded");
      return;
    }

    if (!assetId || !startTime || !endTime) {
      setError("Asset, start time and end time are required");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/bookings/", {
        asset_id: Number(assetId),
        booked_by_id: user.id,
        department_id: user.department_id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        purpose: purpose || null,
      });
    
      setAssetId("");
      setStartTime("");
      setEndTime("");
      setPurpose("");
    
      await loadBookings();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      setError("");

      await api.put(
        `/api/bookings/${bookingId}/cancel`
      );

      await loadBookings();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Something went wrong"
      );
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleString();

  if (loading) {
    return <div className="bookings-loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <h1>Bookings</h1>
          <p>Book and manage shared resources.</p>
        </div>

        <FaCalendarAlt />
      </div>

      {error && (
        <div className="bookings-error">
          {error}
        </div>
      )}

      <section className="booking-create-card">
        <h2>
          <FaPlus />
          Create Booking
        </h2>

        <div className="booking-form-grid">
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
            <label>Purpose</label>

            <input
              type="text"
              value={purpose}
              onChange={(event) =>
                setPurpose(event.target.value)
              }
              placeholder="Meeting, training..."
            />
          </div>

          <div>
            <label>Start Time</label>

            <input
              type="datetime-local"
              value={startTime}
              onChange={(event) =>
                setStartTime(event.target.value)
              }
            />
          </div>

          <div>
            <label>End Time</label>

            <input
              type="datetime-local"
              value={endTime}
              onChange={(event) =>
                setEndTime(event.target.value)
              }
            />
          </div>
        </div>

        <button
          className="create-booking-btn"
          onClick={createBooking}
          disabled={submitting}
        >
          <FaPlus />

          {submitting ? "Creating..." : "Create Booking"}
        </button>
      </section>

      <section className="booking-list-card">
        <h2>Booking Records</h2>

        {bookings.length === 0 ? (
          <div className="booking-empty">
            No bookings found.
          </div>
        ) : (
          <div className="booking-table-wrapper">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Booked By</th>
                  <th>Purpose</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>

                    <td>Asset #{booking.asset_id}</td>

                    <td>User #{booking.booked_by_id}</td>

                    <td>{booking.purpose || "—"}</td>

                    <td>{formatDate(booking.start_time)}</td>

                    <td>{formatDate(booking.end_time)}</td>

                    <td>
                      <span
                        className={`booking-status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      {booking.status !== "CANCELLED" &&
                        booking.status !== "COMPLETED" && (
                          <button
                            className="cancel-booking-btn"
                            onClick={() =>
                              cancelBooking(booking.id)
                            }
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        )}
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

export default Bookings;