import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/login";
import Home from "./Home";
import Schedule from "./Schedule";
import Fields from "./Fields";
import Games from "./Games";
import Navbar from "./components/navbar";

function App() {
  // TODO: adding role base routes
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
      </Routes>
    </Router>
  );
}

export default App;
