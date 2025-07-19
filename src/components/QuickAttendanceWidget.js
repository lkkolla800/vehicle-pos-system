import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, CheckCircle, AlertCircle, Search } from 'lucide-react';

const QuickAttendanceWidget = ({ employees, onMarkAttendance, onNavigateToEmployees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceType, setAttendanceType] = useState('checkin');

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  // Filter employees based on search term
  const filteredEmployees = activeEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickAttendance = () => {
    if (!selectedEmployee) {
      alert('Please select an employee first!');
      return;
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = now.toISOString().split('T')[0];

    const attendanceData = {
      employeeId: selectedEmployee,
      date: currentDate,
      time: currentTime,
      type: attendanceType,
      timestamp: now.toISOString()
    };

    // Call the attendance handler
    onMarkAttendance(attendanceData);
    
    const employee = activeEmployees.find(emp => emp.id == selectedEmployee);
    alert(`${attendanceType === 'checkin' ? 'Check-in' : 'Check-out'} recorded for ${employee.name} at ${currentTime}`);
    
    // Reset form
    setSelectedEmployee('');
    setSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Attendance</h3>
            <p className="text-sm text-gray-600">Mark employee check-in/out</p>
          </div>
        </div>
        <button
          onClick={onNavigateToEmployees}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {/* Employee Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search & Select Employee
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or position..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Employee Dropdown */}
        <div>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Employee</option>
            {filteredEmployees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Type */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAttendanceType('checkin')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              attendanceType === 'checkin'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Check In</span>
          </button>
          <button
            onClick={() => setAttendanceType('checkout')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              attendanceType === 'checkout'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <AlertCircle className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm font-medium">Check Out</span>
          </button>
        </div>

        {/* Current Time Display */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Time:</span>
            <span className="text-lg font-bold text-gray-800">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleQuickAttendance}
          disabled={!selectedEmployee}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            selectedEmployee
              ? `${attendanceType === 'checkin' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
                } text-white`
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Mark {attendanceType === 'checkin' ? 'Check In' : 'Check Out'}
        </button>
      </div>

      {/* Today's Attendance Summary */}
      {activeEmployees.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Today's Status:</span>
            <span className="font-medium text-gray-800">
              {Math.floor(activeEmployees.length * 0.8)} Present • {Math.ceil(activeEmployees.length * 0.2)} Absent
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuickAttendanceWidget;