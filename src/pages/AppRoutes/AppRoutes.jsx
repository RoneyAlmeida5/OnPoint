// PAGES
import Login from "../Login/Login";
import CaixaMercadinho from "../CaixaMercadinho/CaixaMercadinho";
import SalesPage from "../SalesPage/SalesPage";
import CompanyManagement from "../Management/CompanyManagement";
import UserManagement from "../Gestao/UserManagement";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useEffect } from "react";

import { AuthProvider } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return navigate("/Login", { replace: true });
  }

  if (role && user.role !== role) {
    return navigate("/Login", { replace: true });
  }

  return children;
}

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route
            path="/companymanagement"
            element={
              <ProtectedRoute role="admin">
                <CompanyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usermanagement"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixamercadinho"
            element={
              <ProtectedRoute role="user">
                <CaixaMercadinho />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute role="user">
                <SalesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
