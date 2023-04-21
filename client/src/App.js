import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AdminLogin } from "./components/AdminComponents/AdminLogin";
import { UserDetails } from "./components/UserDetails";
import { CreateBusinessAdmin } from "./components/AdminComponents/CreateBusinessAdmin";
import { AdminDashboard } from "./components/AdminComponents/AdminDashboard";

function App() {
  return (
    <div className="h-screen bg-indigo-200">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserDetails />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-create" element={<CreateBusinessAdmin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
