import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Allocations from "./pages/Allocations/Allocations";
import Transfers from "./pages/Transfers/Transfers";
import Returns from "./pages/Returns/Returns";
import Bookings from "./pages/Bookings/Bookings";
import Maintenance from "./pages/Maintenance/Maintenance";
import Notifications from "./pages/Notifications/Notifications";
import ActivityLogs from "./pages/ActivityLogs/ActivityLogs";
import ProtectedRoute from "./routes/ProtectedRoute";
import Departments from "./pages/Departments/Departments";
import Categories from "./pages/Categories/Categories";
import Assets from "./pages/Assets/Assets";
import Audits from "./pages/Audits/Audits";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Employees />} />
          <Route path="/allocations" element={<Allocations />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/audits" element={<Audits />} />

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;