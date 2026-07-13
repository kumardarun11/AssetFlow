import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Allocations from "./pages/Allocations/Allocations";
import Transfers from "./pages/Transfers/Transfers";
import Returns from "./pages/Returns/Returns";
import Bookings from "./pages/Bookings/Bookings";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

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
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;