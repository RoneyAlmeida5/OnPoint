import { Navigate } from "react-router";
import { useUser } from "../contexts/UserContext";

const PrivateRoute = ({
  children,
  allowedRoles = [],
  requireCompany = false,
}) => {
  const { user } = useUser();

  const isAuthenticated = !!user?.sub;
  const hasAllowedRole = allowedRoles.length
    ? allowedRoles.includes(user?.role)
    : true;
  const hasCompany = requireCompany ? !!user?.companyId : true;

  if (!isAuthenticated || !hasAllowedRole || !hasCompany) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
