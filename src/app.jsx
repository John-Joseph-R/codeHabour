import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";

import Profile from "./pages/Profile";
import Repositories from "./pages/Repositories";
import RepoDashboard from "./pages/RepoDashboard";


/* 🔒 Protect dashboard */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/repositories"
            element={
                <ProtectedRoute>
                <Repositories />
                </ProtectedRoute>
            }
          />

          <Route
            path="/repositories/:repoId"
            element={
                <ProtectedRoute>
                <RepoDashboard />
                </ProtectedRoute>
            }
         />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
