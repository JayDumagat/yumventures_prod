import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

export default function ProtectedRoute({ children, routeTo, rolesAllowed = [] }) {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    if (user === undefined) {
      checkAuth();
    }
  }, [user, checkAuth]);

  if (user === undefined) {
    return <div>Loading...</div>; 
  }

  if (rolesAllowed.includes("everyone")) {
    // Let everyone access
    return children;
  }

  if (user === null) {
    return <Navigate to={routeTo || "/login"} replace />;
  }

  if (rolesAllowed.length > 0 && !rolesAllowed.includes(user.role)) {
    // User is not authorized
    return <Navigate to={routeTo || "/unauthorized"} replace />;
  }
  

  return children;
}
