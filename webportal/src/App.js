import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/login";
import Home from "./Home";
import Schedule from "./Schedule";
import Fields from "./Fields";
import Games from "./Games";
import Profile from "./Profile"
import Search from "./Search";
import Navbar from "./components/navbar";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Organize from "./organizerView/Organize";
import SelectField from "./organizerView/SelectField";
import OrganizeGames from "./organizerView/OrganizeGames";
import SelectTimeslot from "./organizerView/[subfieldId]";

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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organize"
          element={
            <ProtectedRoute>
              <Organize/>
            </ProtectedRoute>
          }
        >
          <Route 
            path="games"
            element={
              <ProtectedRoute>
                <OrganizeGames/>
              </ProtectedRoute>
            }
          />
          <Route 
            path="select-field"
            element={
              <ProtectedRoute>
                <SelectField/>
              </ProtectedRoute>
            }
          />
          <Route 
            path="select-time"
            element={
              <ProtectedRoute>
                <SelectTimeslot />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/search"
          element={
            <Search />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
