import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { useRole } from "../RoleContext";

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

export function LogoutButton() {
  const { logout } = useAuth0();
  const { setRole } = useRole();

  return (
    <button
      onClick={() => {
        setRole(null);
        logout({ returnTo: window.location.origin });
      }}
    >
      Log Out
    </button>
  );
}

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { role } = useRole();
  {
    //console.log(role);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
