import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Homepage } from "./components/Homepage";
import { CustomerDashboard } from "./components/CustomerComponents/CustomerDashboard";
import { CustomerCoupons } from "./components/CustomerComponents/CustomerCoupons";
import { CustomerProof } from "./components/CustomerComponents/CustomerProof";
import { CustomerProfile } from "./components/CustomerComponents/CustomerProfile";
import { AdminLogin } from "./components/AdminComponents/AdminLogin";
import { UserDetails } from "./components/UserDetails";
import { CreateBusinessAdmin } from "./components/AdminComponents/CreateBusinessAdmin";
import { AdminDashboard } from "./components/AdminComponents/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { Logout } from "./components/Logout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BusinessAdminDashboard } from "./components/AdminComponents/BusinessAdminDashboard";

function App() {
	return (
		<div className="h-screen bg-gradient-to-r from-blue-500 via-indigo-300 to-sky-200">
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<CustomerDashboard />
								</ProtectedRoute>
							}
						/>
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/admin-login" element={<AdminLogin />} />
						<Route path="/admin-dashboard" element={<AdminDashboard />} />
						<Route path="/admin-business-dashboard" element={<BusinessAdminDashboard />} />
						<Route path="*" element={<Navigate to="/"></Navigate>} />
						<Route
							path="customer/dashboard"
							element={
								<ProtectedRoute>
									<CustomerDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="customer/proof"
							element={
								<ProtectedRoute>
									<CustomerProof />
								</ProtectedRoute>
							}
						/>
						<Route
							path="customer/coupons"
							element={
								<ProtectedRoute>
									<CustomerCoupons />
								</ProtectedRoute>
							}
						/>
						<Route
							path="customer/account"
							element={
								<ProtectedRoute>
									<CustomerProfile />
								</ProtectedRoute>
							}
						/>
						<Route path="/admin-create" element={<CreateBusinessAdmin />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</div>
	);
}

export default App;
