import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Calendar, Filter, TrendingUp, DollarSign, Receipt, Target } from 'lucide-react';
import AdvancedReportGenerator from '../components/AdvancedReportGenerator';

const Reports = ({ vehicles, expenses, incomes, employees, attendanceRecords }) => {
  const [activeTab, setActiveTab] = useState('advanced');

  const tabs = [
    { id: 'advanced', name: 'Advanced Reports', icon: FileText },
    { id: 'overview', name: 'Quick Overview', icon: TrendingUp }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Helper functions for Quick Overview tab
  const getSummaryStats = () => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin
    };
  };

  const getMonthlyTrendData = () => {
    const monthlyData = {};
    
    incomes.forEach(income => {
      const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      monthlyData[month].income += income.amount;
    });

    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      monthlyData[month].expenses += expense.amount;
    });

    return Object.values(monthlyData)
      .map(month => ({
        ...month,
        profit: month.income - month.expenses
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const getExpenseCategoryData = () => {
    const categoryData = {};
    expenses.forEach(expense => {
      categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });

    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];
    
    return Object.entries(categoryData).map(([category, amount], index) => ({
      name: category,
      value: amount,
      percentage: ((amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1),
      color: colors[index % colors.length]
    }));
  };

  const getVehiclePerformanceData = () => {
    const vehicleData = {};

    vehicles.forEach(vehicle => {
      vehicleData[vehicle.id] = {
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        income: 0,
        expenses: 0,
        trips: 0
      };
    });

    incomes.forEach(income => {
      if (vehicleData[income.vehicleId]) {
        vehicleData[income.vehicleId].income += income.amount;
        vehicleData[income.vehicleId].trips += 1;
      }
    });

    expenses.forEach(expense => {
      if (vehicleData[expense.vehicleId]) {
        vehicleData[expense.vehicleId].expenses += expense.amount;
      }
    });

    return Object.values(vehicleData)
      .map(vehicle => ({
        ...vehicle,
        profit: vehicle.income - vehicle.expenses,
        profitMargin: vehicle.income > 0 ? ((vehicle.profit / vehicle.income) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.profit - a.profit);
  };

  const summaryStats = getSummaryStats();
  const monthlyTrendData = getMonthlyTrendData();
  const expenseCategoryData = getExpenseCategoryData();
  const vehiclePerformanceData = getVehiclePerformanceData();

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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'advanced' ? (
            <AdvancedReportGenerator
              vehicles={vehicles}
              expenses={expenses}
              incomes={incomes}
              employees={employees || []}
              attendanceRecords={attendanceRecords || []}
            />
          ) : (
            <div className="space-y-6">
              {/* Quick Overview Content */}
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Total Income</p>
                      <p className="text-2xl font-bold text-green-800">{formatCurrency(summaryStats.totalIncome)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-800">{formatCurrency(summaryStats.totalExpenses)}</p>
                    </div>
                    <Receipt className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${summaryStats.netProfit >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'} rounded-xl p-6 border ${summaryStats.netProfit >= 0 ? 'border-blue-200' : 'border-orange-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${summaryStats.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        Net {summaryStats.netProfit >= 0 ? 'Profit' : 'Loss'}
                      </p>
                      <p className={`text-2xl font-bold ${summaryStats.netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                        {formatCurrency(Math.abs(summaryStats.netProfit))}
                      </p>
                    </div>
                    <Target className={`h-8 w-8 ${summaryStats.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Profit Margin</p>
                      <p className="text-2xl font-bold text-purple-800">{summaryStats.profitMargin.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trend Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trend</h3>
                  {monthlyTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" strokeWidth={2} />
                        <Line type="monotone" dataKey="profit" stroke="#3B82F6" name="Profit" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      No trend data available
                    </div>
                  )}
                </div>

                {/* Expense Categories */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Categories</h3>
                  {expenseCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expenseCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      No expense data available
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Performance Table */}
              {vehiclePerformanceData.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Income</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Expenses</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Profit</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Margin</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Trips</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {vehiclePerformanceData.map((vehicle, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{vehicle.vehicleType}</td>
                            <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                              {formatCurrency(vehicle.income)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                              {formatCurrency(vehicle.expenses)}
                            </td>
                            <td className={`px-4 py-3 text-sm text-right font-medium ${
                              vehicle.profit >= 0 ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {formatCurrency(vehicle.profit)}
                            </td>
                            <td className={`px-4 py-3 text-sm text-right font-medium ${
                              parseFloat(vehicle.profitMargin) >= 0 ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {vehicle.profitMargin}%
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">{vehicle.trips}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quick Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Top Performer</h4>
                    {vehiclePerformanceData.length > 0 ? (
                      <p className="text-sm text-blue-600">
                        {vehiclePerformanceData[0].vehicleNumber} with {formatCurrency(vehiclePerformanceData[0].profit)} profit
                      </p>
                    ) : (
                      <p className="text-sm text-blue-600">No data available</p>
                    )}
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Average Trip Value</h4>
                    <p className="text-sm text-green-600">
                      {incomes.length > 0 ? formatCurrency(summaryStats.totalIncome / incomes.length) : formatCurrency(0)}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Most Expensive Category</h4>
                    {expenseCategoryData.length > 0 ? (
                      <p className="text-sm text-purple-600">
                        {expenseCategoryData[0].name} - {formatCurrency(expenseCategoryData[0].value)}
                      </p>
                    ) : (
                      <p className="text-sm text-purple-600">No expense data</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;