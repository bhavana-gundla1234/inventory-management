import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
 
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Invoices from "./pages/invoices/Invoices";
import Statistics from "./pages/statistics/Statistics";
import Settings from "./pages/settings/Settings";
 
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
 
import "./styles/global.css";
 
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
 
          {/* PROTECTED DASHBOARD ROUTES */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
 
export default App;
 