// PAGES
import Login from "../Login/Login";
import CaixaMercadinho from "../CaixaMercadinho/CaixaMercadinho";
import SalesPage from "../SalesPage/SalesPage";
import CompanyManagement from "../Management/CompanyManagement";
import UserManagement from "../Gestao/UserManagement";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "../../contexts/AuthContext";
import PrivateRoute from "../../componentcss/PrivateRoute";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/companymanagement"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CompanyManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/usermanagement"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <UserManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/caixamercadinho"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <CaixaMercadinho />
              </PrivateRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <SalesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
