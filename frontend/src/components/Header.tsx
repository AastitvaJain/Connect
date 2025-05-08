import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import m3mLogo from '../assets/m3m-logo.png';
import smartworldLogo from '../assets/smartworld.png';
import { logout } from '../core/services/LoginService';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const userEmail = localStorage.getItem('user_email') || '';
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={m3mLogo} alt="M3M Logo" className="h-10" />
          <img src={smartworldLogo} alt="Smartworld Logo" className="h-10 ml-2" />
        </Link>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
            onClick={() => setShowDropdown((v) => !v)}
          >
            <span className="font-medium text-gray-700">{userEmail}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;