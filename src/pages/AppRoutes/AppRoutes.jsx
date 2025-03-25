import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Login from "../Login/Login";
import CaixaMercadinho from "../CaixaMercadinho/CaixaMercadinho";
import SalesPage from "../SalesPage/SalesPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/caixamercadinho"
          element={
            <PrivateRoute>
              <CaixaMercadinho />
            </PrivateRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <SalesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
