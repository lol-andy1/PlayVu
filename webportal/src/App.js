import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/login";
import Home from "./Home";
import Schedule from "./Schedule";
import Fields from "./Fields";
import Games from "./Games";
import Search from "./Search";
import Navbar from "./components/navbar";
import GameDetails from "./components/GameDetails"
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function App() {
  // TODO: adding role base routes
  const { getAccessTokenSilently } = useAuth0();

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
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields"
          element={
            <ProtectedRoute>
              <Fields />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <Search />
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

export default App;
