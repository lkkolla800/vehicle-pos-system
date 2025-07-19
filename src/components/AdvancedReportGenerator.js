import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, Printer, Mail, Share2 } from 'lucide-react';

const AdvancedReportGenerator = ({ vehicles, expenses, incomes, employees, attendanceRecords }) => {
  const [reportConfig, setReportConfig] = useState({
    type: 'financial_summary',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    vehicleFilter: 'all',
    employeeFilter: 'all',
    includeCharts: true,
    includeDetails: true
  });

  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'financial_summary', label: 'Financial Summary', description: 'Income, expenses, and profit analysis' },
    { value: 'vehicle_performance', label: 'Vehicle Performance', description: 'Individual vehicle analysis' },
    { value: 'employee_attendance', label: 'Employee Attendance', description: 'Staff attendance and working hours' },
    { value: 'expense_breakdown', label: 'Expense Breakdown', description: 'Detailed expense categorization' },
    { value: 'income_analysis', label: 'Income Analysis', description: 'Revenue sources and trends' },
    { value: 'complete_overview', label: 'Complete Business Report', description: 'Comprehensive business analysis' }
  ];

  // Filter data based on date range
  const getFilteredData = () => {
    const startDate = new Date(reportConfig.startDate);
    const endDate = new Date(reportConfig.endDate);
    endDate.setHours(23, 59, 59, 999); // Include full end date

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const vehicleMatch = reportConfig.vehicleFilter === 'all' || expense.vehicleId == reportConfig.vehicleFilter;
      return expenseDate >= startDate && expenseDate <= endDate && vehicleMatch;
    });

    const filteredIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      const vehicleMatch = reportConfig.vehicleFilter === 'all' || income.vehicleId == reportConfig.vehicleFilter;
      return incomeDate >= startDate && incomeDate <= endDate && vehicleMatch;
    });

    const filteredAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const employeeMatch = reportConfig.employeeFilter === 'all' || record.employeeId == reportConfig.employeeFilter;
      return recordDate >= startDate && recordDate <= endDate && employeeMatch;
    });

    return { filteredExpenses, filteredIncomes, filteredAttendance };
  };

  // Generate report data
  const generateReportData = () => {
    const { filteredExpenses, filteredIncomes, filteredAttendance } = getFilteredData();
    
    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    // Vehicle performance
    const vehiclePerformance = vehicles.map(vehicle => {
      const vehicleIncomes = filteredIncomes.filter(i => i.vehicleId == vehicle.id);
      const vehicleExpenses = filteredExpenses.filter(e => e.vehicleId == vehicle.id);
      const income = vehicleIncomes.reduce((sum, i) => sum + i.amount, 0);
      const expenses = vehicleExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        ...vehicle,
        income,
        expenses,
        profit: income - expenses,
        trips: vehicleIncomes.length,
        profitMargin: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.profit - a.profit);

    // Expense breakdown
    const expensesByCategory = {};
    filteredExpenses.forEach(expense => {
      expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    // Income breakdown
    const incomesByService = {};
    filteredIncomes.forEach(income => {
      incomesByService[income.serviceType] = (incomesByService[income.serviceType] || 0) + income.amount;
    });

    // Employee performance
    const employeePerformance = employees.map(employee => {
      const employeeAttendance = filteredAttendance.filter(a => a.employeeId == employee.id);
      const workDays = employeeAttendance.filter(a => a.type === 'checkin').length;
      const totalHours = employeeAttendance.reduce((sum, a) => sum + (parseFloat(a.workingHours) || 0), 0);
      
      return {
        ...employee,
        workDays,
        totalHours: totalHours.toFixed(1),
        averageHours: workDays > 0 ? (totalHours / workDays).toFixed(1) : 0
      };
    });

    return {
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        reportPeriod: {
          start: reportConfig.startDate,
          end: reportConfig.endDate
        }
      },
      vehiclePerformance,
      expensesByCategory,
      incomesByService,
      employeePerformance,
      transactions: {
        incomes: filteredIncomes,
        expenses: filteredExpenses,
        attendance: filteredAttendance
      }
    };
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = generateReportData();
    setGeneratedReport({
      ...reportData,
      config: reportConfig,
      generatedAt: new Date().toISOString(),
      reportId: `RPT-${Date.now()}`
    });
    
    setIsGenerating(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = (format) => {
    if (!generatedReport) return;

    if (format === 'json') {
      const dataStr = JSON.stringify(generatedReport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vehicle-pos-report-${generatedReport.reportId}.json`;
      link.click();
    } else if (format === 'print') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Report Generator</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Type */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportConfig.type}
                onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {reportTypes.find(t => t.value === reportConfig.type)?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) => setReportConfig({...reportConfig, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) => setReportConfig({...reportConfig, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Filter
              </label>
              <select
                value={reportConfig.vehicleFilter}
                onChange={(e) => setReportConfig({...reportConfig, vehicleFilter: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Vehicles</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} - {vehicle.vehicleType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Filter
              </label>
              <select
                value={reportConfig.employeeFilter}
                onChange={(e) => setReportConfig({...reportConfig, employeeFilter: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeCharts}
                  onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Charts & Graphs</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDetails}
                  onChange={(e) => setReportConfig({...reportConfig, includeDetails: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Detailed Transactions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            } text-white shadow-lg`}
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating Report...
              </div>
            ) : (
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Generate Report
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Generated Report Display */}
      {generatedReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          id="report-content"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {reportTypes.find(t => t.value === generatedReport.config.type)?.label}
                </h1>
                <p className="text-blue-100">
                  Period: {new Date(generatedReport.config.startDate).toLocaleDateString()} - {new Date(generatedReport.config.endDate).toLocaleDateString()}
                </p>
                <p className="text-blue-100 text-sm">
                  Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Report ID</p>
                <p className="font-mono text-lg">{generatedReport.reportId}</p>
              </div>
            </div>
          </div>

          {/* Report Actions */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex gap-2">
              <button
                onClick={() => exportReport('print')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={() => exportReport('json')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </button>
              <button
                onClick={() => alert('Email feature coming soon!')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                onClick={() => alert('Share feature coming soon!')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6 space-y-8">
            {/* Executive Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Executive Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Total Income</p>
                  <p className="text-2xl font-bold text-green-800">{formatCurrency(generatedReport.summary.totalIncome)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-800">{formatCurrency(generatedReport.summary.totalExpenses)}</p>
                </div>
                <div className={`rounded-lg p-4 border ${generatedReport.summary.netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                  <p className={`text-sm font-medium ${generatedReport.summary.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    Net {generatedReport.summary.netProfit >= 0 ? 'Profit' : 'Loss'}
                  </p>
                  <p className={`text-2xl font-bold ${generatedReport.summary.netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                    {formatCurrency(Math.abs(generatedReport.summary.netProfit))}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">Profit Margin</p>
                  <p className="text-2xl font-bold text-purple-800">{generatedReport.summary.profitMargin.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Vehicle Performance */}
            {(reportConfig.type === 'vehicle_performance' || reportConfig.type === 'complete_overview') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Performance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Income</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Expenses</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Profit</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Margin</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Trips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.vehiclePerformance.map((vehicle, index) => (
                        <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-3 text-sm">
                            <div>
                              <p className="font-medium">{vehicle.vehicleNumber}</p>
                              <p className="text-gray-500">{vehicle.vehicleType}</p>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-green-600 font-medium">
                            {formatCurrency(vehicle.income)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-red-600 font-medium">
                            {formatCurrency(vehicle.expenses)}
                          </td>
                          <td className={`border border-gray-300 px-4 py-3 text-right text-sm font-medium ${vehicle.profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {formatCurrency(vehicle.profit)}
                          </td>
                          <td className={`border border-gray-300 px-4 py-3 text-right text-sm font-medium ${parseFloat(vehicle.profitMargin) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {vehicle.profitMargin}%
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-600">
                            {vehicle.trips}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Expense Breakdown */}
            {(reportConfig.type === 'expense_breakdown' || reportConfig.type === 'complete_overview') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(generatedReport.expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-red-600 font-medium">{category}</p>
                      <p className="text-xl font-bold text-red-800">{formatCurrency(amount)}</p>
                      <p className="text-xs text-red-500">
                        {((amount / generatedReport.summary.totalExpenses) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Income Analysis */}
            {(reportConfig.type === 'income_analysis' || reportConfig.type === 'complete_overview') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Income by Service Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(generatedReport.incomesByService).map(([service, amount]) => (
                    <div key={service} className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-medium">{service}</p>
                      <p className="text-xl font-bold text-green-800">{formatCurrency(amount)}</p>
                      <p className="text-xs text-green-500">
                        {((amount / generatedReport.summary.totalIncome) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employee Performance */}
            {(reportConfig.type === 'employee_attendance' || reportConfig.type === 'complete_overview') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Performance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Position</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Work Days</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Total Hours</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Avg Hours/Day</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700">Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.employeePerformance.map((employee, index) => (
                        <tr key={employee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{employee.name}</td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{employee.position}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm">{employee.workDays}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm">{employee.totalHours}h</td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm">{employee.averageHours}h</td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm font-medium">{formatCurrency(employee.salary || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">Top Performers</h3>
                  {generatedReport.vehiclePerformance.slice(0, 3).map((vehicle, index) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-800">#{index + 1} {vehicle.vehicleNumber}</p>
                        <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(vehicle.profit)}</p>
                        <p className="text-sm text-green-500">{vehicle.profitMargin}% margin</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">Recommendations</h3>
                  <div className="space-y-2">
                    {generatedReport.summary.profitMargin < 10 && (
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800">⚠️ Low profit margin. Consider reducing expenses or increasing service rates.</p>
                      </div>
                    )}
                    {generatedReport.vehiclePerformance.some(v => v.profit < 0) && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">🚨 Some vehicles are operating at a loss. Review their usage and costs.</p>
                      </div>
                    )}
                    {generatedReport.summary.netProfit > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">✅ Business is profitable. Consider expansion opportunities.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Footer */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>Generated by VehiclePOS Report System</p>
                <p>Report ID: {generatedReport.reportId}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedReportGenerator;