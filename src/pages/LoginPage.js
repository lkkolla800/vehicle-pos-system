import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, User, Lock, Eye, EyeOff, Shield, LogIn } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Demo users for testing
  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { username: 'user', password: 'user123', role: 'user', name: 'Regular User' },
    { username: 'manager', password: 'manager123', role: 'admin', name: 'Fleet Manager' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check credentials
    const user = demoUsers.find(u => 
      u.username === loginForm.username && u.password === loginForm.password
    );

    if (user) {
      // Store user info
      const userData = {
        username: user.username,
        name: user.name,
        role: user.role,
        email: `${user.username}@vehiclepos.com`,
        loginTime: new Date().toISOString()
      };

      if (loginForm.rememberMe) {
        localStorage.setItem('vehiclePosUser', JSON.stringify(userData));
      }

      onLogin(userData);
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  const handleDemoLogin = (userType) => {
    const user = demoUsers.find(u => u.username === userType);
    setLoginForm({
      username: user.username,
      password: user.password,
      rememberMe: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4"
          >
            <Car className="h-10 w-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl font-bold text-white mb-2"
          >
            VehiclePOS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-blue-200"
          >
            Vehicle Management System
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-400"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-white">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
              } text-white shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-sm text-blue-200 mb-4">Demo Accounts:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center justify-between p-3 bg-purple-600/30 hover:bg-purple-600/40 rounded-lg transition-colors border border-purple-400/30"
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-purple-300 mr-2" />
                  <span className="text-white text-sm">Administrator</span>
                </div>
                <span className="text-purple-200 text-xs">admin / admin123</span>
              </button>
              <button
                onClick={() => handleDemoLogin('user')}
                className="flex items-center justify-between p-3 bg-green-600/30 hover:bg-green-600/40 rounded-lg transition-colors border border-green-400/30"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 text-green-300 mr-2" />
                  <span className="text-white text-sm">Regular User</span>
                </div>
                <span className="text-green-200 text-xs">user / user123</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8 text-blue-200 text-sm"
        >
          <p>© 2025 VehiclePOS. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;