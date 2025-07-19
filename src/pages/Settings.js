import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, LogOut } from 'lucide-react';

const Settings = ({ role, onRoleChange, onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-6 w-6 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Current Role</h3>
              <p className="text-sm text-gray-600">Your access level in the system</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {role === 'admin' ? 'Administrator' : 'User'}
              </span>
              <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-800">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Change Password</h3>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Session Management</h3>
            <p className="text-sm text-gray-600">Log out of your current session</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings; 
