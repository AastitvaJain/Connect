import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import TransactionPage from './pages/TransactionPage';
import LoginPage from './pages/LoginPage';
import { PropertyProvider } from './context/PropertyContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <PropertyProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/transaction" element={<TransactionPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </Router>
    </PropertyProvider>
  );
}

export default App;