import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { logout } from "../../api/auth";

import "./AppLayout.css";

const AppLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>AssetFlow</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/users">Employees</NavLink>
          <NavLink to="/assets">Assets</NavLink>
          <NavLink to="/allocations">Allocations</NavLink>
          <NavLink to="/transfers">Transfers</NavLink>
          <NavLink to="/returns">Returns</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/maintenance">Maintenance</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
          <NavLink to="/activity-logs">Activity Logs</NavLink>
        </nav>

        <button onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;