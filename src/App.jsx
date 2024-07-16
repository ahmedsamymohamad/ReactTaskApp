import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
            <Route path="/login"     element={<Login/>}    />
            <Route path="/register"  element={<Register/>}  />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
