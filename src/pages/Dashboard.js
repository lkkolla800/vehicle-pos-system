import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardCards from '../components/DashboardCards';
import Chart from '../components/Chart';
import QuickAttendanceWidget from '../components/QuickAttendanceWidget';
import { Calendar, TrendingUp, Activity, DollarSign, Receipt, Target } from 'lucide-react';

const Dashboard = ({ vehicles, expenses = [], incomes = [], employees = [], onMarkAttendance, onNavigateToEmployees }) => {
  const [selectedRange, setSelectedRange] = useState('Today');

  const ranges = ['Today', 'This Week', 'This Month'];

  const getQuickStats = () => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalProfit = totalIncome - totalExpenses;

    return {
      totalVehicles: vehicles.length,
      totalIncome,
      totalExpenses,
      totalProfit,
      recentlyAdded: vehicles.filter(v => {
        const addedDate = new Date(v.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - addedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length,
      activeServices: Math.floor(vehicles.length * 0.7)
    };
  };

  const stats = getQuickStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your vehicle business performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ranges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Attendance Widget */}
      {employees.length > 0 && (
        <QuickAttendanceWidget 
          employees={employees || []} 
          onMarkAttendance={onMarkAttendance}
          onNavigateToEmployees={onNavigateToEmployees}
        />
      )}

      {/* Enhanced Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(stats.totalIncome)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(stats.totalExpenses)}</p>
            </div>
            <Receipt className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-r ${stats.totalProfit >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'} rounded-xl p-4 border ${stats.totalProfit >= 0 ? 'border-blue-200' : 'border-orange-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stats.totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {stats.totalProfit >= 0 ? 'Net Profit' : 'Net Loss'}
              </p>
              <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                {formatCurrency(Math.abs(stats.totalProfit))}
              </p>
            </div>
            <Target className={`h-8 w-8 ${stats.totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Vehicles</p>
              <p className="text-2xl font-bold text-purple-800">{stats.totalVehicles}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Profit Margin Indicator */}
      {stats.totalIncome > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Margin Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                stats.totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {((stats.totalProfit / stats.totalIncome) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Profit Margin</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">
                  {vehicles.length > 0 ? (stats.totalIncome / vehicles.length).toFixed(0) : '0'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Avg Income/Vehicle</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold text-orange-600">
                  {vehicles.length > 0 ? (stats.totalExpenses / vehicles.length).toFixed(0) : '0'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Avg Expense/Vehicle</p>
            </div>
          </div>
        </div>
      )}

      {/* Original Dashboard Cards */}
      <DashboardCards selectedRange={selectedRange} />

      {/* Chart */}
      <Chart selectedRange={selectedRange} />

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {/* Recent Income */}
          {incomes.slice(0, 3).reverse().map((income, index) => {
            const vehicle = vehicles.find(v => v.id == income.vehicleId);
            return (
              <motion.div
                key={`income-${income.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Income: {vehicle?.vehicleNumber || 'Unknown'} - {income.serviceType}
                    </p>
                    <p className="text-sm text-gray-600">
                      {income.customerName ? `Customer: ${income.customerName}` : 'Service completed'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">+{formatCurrency(income.amount)}</span>
                  <p className="text-xs text-gray-500">{new Date(income.date).toLocaleDateString()}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Recent Expenses */}
          {expenses.slice(0, 3).reverse().map((expense, index) => {
            const vehicle = vehicles.find(v => v.id == expense.vehicleId);
            return (
              <motion.div
                key={`expense-${expense.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 3) * 0.1 }}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Expense: {vehicle?.vehicleNumber || 'Unknown'} - {expense.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      {expense.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600">-{formatCurrency(expense.amount)}</span>
                  <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Vehicle Activity */}
          {vehicles.slice(0, 2).map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 6) * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-800">
                    Vehicle {vehicle.vehicleNumber} added
                  </p>
                  <p className="text-sm text-gray-600">
                    Owner: {vehicle.ownerNIC} • {vehicle.vehicleType}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
          
          {vehicles.length === 0 && incomes.length === 0 && expenses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity to show</p>
              <p className="text-sm text-gray-400">Start by adding vehicles, income, or expenses</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;