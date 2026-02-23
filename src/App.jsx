import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserTable from "./components/UserTable";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Default Route */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={token ? <UserTable /> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
