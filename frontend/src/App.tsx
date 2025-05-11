import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import TransactionPage from './pages/TransactionPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { PropertyProvider } from './context/PropertyContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import { getAccessToken, getTokenExpiry } from './core/utils/auth';
import { ConfigProvider } from './context/ConfigContext';

function App() {
  return (
    <ConfigProvider>
      <PropertyProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/transaction" element={<TransactionPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/crm" element={<SearchPage />} />
                </Route>
              </Routes>
            </div>
            <ToastContainer position="top-center" autoClose={3000} />
          </div>
        </Router>
      </PropertyProvider>
    </ConfigProvider>
  );
}

const RootRedirect: React.FC = () => {
  const token = getAccessToken();
  const expiry = getTokenExpiry();
  const isAuth = !!token && !!expiry && expiry > Date.now();
  return isAuth ? <Navigate to="/transaction" replace /> : <Navigate to="/login" replace />;
};

export default App;