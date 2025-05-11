import React, { useState } from 'react';
import m3mLogo from '../assets/m3m-logo.png';
import smartworldLogo from '../assets/smartworld.png';
import Button from '../components/Button';
import { login } from '../core/services/LoginService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('/');
  const navigate = useNavigate();
  const { setConfig } = useConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      setConfig(result.config);
      toast.success('Login successful!');
      navigate(loginAs);
    } catch (err: any) {
      toast.error('Cannot login, some issue occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative">
        {/* Logo and tagline */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center space-x-2 mb-2">
            <img src={m3mLogo} alt="M3M Logo" className="h-12" />
            <img src={smartworldLogo} alt="Smartworld Logo" className="h-12 ml-2" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-8">Login Page</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label htmlFor="loginAs" className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
            <select
              id="loginAs"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={loginAs}
              onChange={e => setLoginAs(e.target.value)}
              required
            >
              <option value="/login">Select Counter</option>
              <option value="/crm">Counter 1</option>
              <option value="/transaction">Counter 2</option>
              <option value="/admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 