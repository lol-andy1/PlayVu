import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/login";
import Home from "./Home";
import Schedule from "./Schedule";
import Fields from "./Fields";
import Games from "./Games";
import Profile from "./Profile";
import Search from "./Search";
import Navbar from "./components/navbar";
import GameDetails from "./components/GameDetails"
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Organize from "./organizerView/Organize";
import SelectField from "./organizerView/SelectField";
import OrganizeGames from "./organizerView/OrganizeGames";
import SelectTimeslot from "./organizerView/SelectTimeslot";
import ConfigureGame from "./organizerView/ConfigureGame";
import OrganizeConfirm from "./organizerView/OrganizeConfirm";
import Admin from "./Admin";
import { RoleProvider, useRole } from "./RoleContext";

function App() {
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const { setRole } = useRole();

  useEffect(() => {
    axios.interceptors.request.use(
      async (config) => {
        try {
          const accessToken = await getAccessTokenSilently();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.error("Error fetching the token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get("/api/get-user");
          setRole(response.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole(null);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, getAccessTokenSilently, setRole]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        {/* <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/FieldOwner"
          element={
            <ProtectedRoute allowedRoles={["field owner", "admin"]}>
              <Fields />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/games"
          element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["field owner", "admin", "player"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organize"
          element={
            <ProtectedRoute allowedRoles={["admin", "player"]}>
              <Organize />
            </ProtectedRoute>
          }
        >
          <Route
            path="games"
            element={
              <ProtectedRoute allowedRoles={["admin", "player"]}>
                <OrganizeGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="select-field"
            element={
              <ProtectedRoute allowedRoles={["admin", "player"]}>
                <SelectField />
              </ProtectedRoute>
            }
          />
          <Route
            path="select-time"
            element={
              <ProtectedRoute allowedRoles={["admin", "player"]}>
                <SelectTimeslot />
              </ProtectedRoute>
            }
          />
          <Route
            path="configure"
            element={
              <ProtectedRoute allowedRoles={["admin", "player"]}>
                <ConfigureGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="confirm"
            element={
              <ProtectedRoute allowedRoles={["admin", "player"]}>
                <OrganizeConfirm />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["player", "admin"]}>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game-details/:slug"
          element={
            <ProtectedRoute>
              <GameDetails/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default function AppWithProviders() {
  return (
    <RoleProvider>
      <App />
    </RoleProvider>
  );
}
