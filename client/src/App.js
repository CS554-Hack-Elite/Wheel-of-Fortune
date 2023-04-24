import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AdminLogin } from "./components/AdminComponents/AdminLogin";
import { UserDetails } from "./components/UserDetails";
import { CreateBusinessAdmin } from "./components/AdminComponents/CreateBusinessAdmin";
import { AdminDashboard } from "./components/AdminComponents/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  console.log("qwewqe");
  console.log(process.env.REACT_APP_API_KEY);
  return (
    <div className="h-screen bg-indigo-200">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin-login" element={<AdminLogin />} />>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
