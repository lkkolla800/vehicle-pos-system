import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, Calendar, CheckCircle, XCircle, Timer, User } from 'lucide-react';

const EnhancedAttendanceSystem = ({ employees, attendanceRecords, onMarkAttendance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceType, setAttendanceType] = useState('checkin');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState('');

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  // Filter employees based on search
  const filteredEmployees = activeEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get today's attendance for an employee
  const getTodayAttendance = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.filter(record => 
      record.employeeId == employeeId && record.date === today
    );
  };

  // Calculate working hours
  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  };

  // Get employee's latest attendance status
  const getEmployeeStatus = (employeeId) => {
    const todayRecords = getTodayAttendance(employeeId);
    if (todayRecords.length === 0) return 'not_marked';
    
    const latestRecord = todayRecords[todayRecords.length - 1];
    return latestRecord.type;
  };

  const handleMarkAttendance = () => {
    if (!selectedEmployee) {
      alert('Please select an employee!');
      return;
    }

    const attendanceData = {
      id: Date.now(),
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      date: selectedDate,
      time: customTime,
      type: attendanceType,
      notes: notes,
      timestamp: new Date().toISOString()
    };

    // Auto-calculate working hours if this is checkout
    if (attendanceType === 'checkout') {
      const todayRecords = getTodayAttendance(selectedEmployee.id);
      const checkInRecord = todayRecords.find(r => r.type === 'checkin');
      
      if (checkInRecord) {
        const workingHours = calculateWorkingHours(checkInRecord.time, customTime);
        attendanceData.workingHours = workingHours.toFixed(2);
        
        // Calculate overtime (assuming 8-hour workday)
        const overtime = Math.max(0, workingHours - 8);
        attendanceData.overtime = overtime.toFixed(2);
      }
    }

    onMarkAttendance(attendanceData);
    
    alert(`${attendanceType === 'checkin' ? 'Check-in' : 'Check-out'} recorded successfully!`);
    
    // Reset form
    setNotes('');
    setCustomTime(new Date().toTimeString().slice(0, 5));
  };

  return (
    <div className="space-y-6">
      {/* Quick Mark Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Quick Attendance Marking
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Employee
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, position, or NIC..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Employee
              </label>
              <select
                value={selectedEmployee?.id || ''}
                onChange={(e) => {
                  const emp = activeEmployees.find(emp => emp.id == e.target.value);
                  setSelectedEmployee(emp || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose employee...</option>
                {filteredEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time & Type Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Type
              </label>
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
                  <XCircle className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Check Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Selected Employee Info */}
        {selectedEmployee && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">{selectedEmployee.name}</h4>
                <p className="text-sm text-gray-600">{selectedEmployee.position} • NIC: {selectedEmployee.nic}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Today's Status:</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  getEmployeeStatus(selectedEmployee.id) === 'checkin' 
                    ? 'bg-green-100 text-green-800' 
                    : getEmployeeStatus(selectedEmployee.id) === 'checkout'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getEmployeeStatus(selectedEmployee.id) === 'checkin' && 'Checked In'}
                  {getEmployeeStatus(selectedEmployee.id) === 'checkout' && 'Checked Out'}
                  {getEmployeeStatus(selectedEmployee.id) === 'not_marked' && 'Not Marked'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleMarkAttendance}
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
      </div>

      {/* Today's Attendance Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Today's Attendance Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-800">
                  {activeEmployees.filter(emp => getEmployeeStatus(emp.id) === 'checkin').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Checked Out</p>
                <p className="text-2xl font-bold text-red-800">
                  {activeEmployees.filter(emp => getEmployeeStatus(emp.id) === 'checkout').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Not Marked</p>
                <p className="text-2xl font-bold text-gray-800">
                  {activeEmployees.filter(emp => getEmployeeStatus(emp.id) === 'not_marked').length}
                </p>
              </div>
              <Timer className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Employee List with Status */}
        <div className="space-y-2">
          {activeEmployees.map((employee, index) => {
            const status = getEmployeeStatus(employee.id);
            const todayRecords = getTodayAttendance(employee.id);
            const checkInRecord = todayRecords.find(r => r.type === 'checkin');
            const checkOutRecord = todayRecords.find(r => r.type === 'checkout');
            
            let workingHours = 0;
            if (checkInRecord && checkOutRecord) {
              workingHours = calculateWorkingHours(checkInRecord.time, checkOutRecord.time);
            }

            return (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {checkInRecord && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">In</p>
                      <p className="text-sm font-medium text-green-600">{checkInRecord.time}</p>
                    </div>
                  )}
                  
                  {checkOutRecord && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Out</p>
                      <p className="text-sm font-medium text-red-600">{checkOutRecord.time}</p>
                    </div>
                  )}

                  {workingHours > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Hours</p>
                      <p className="text-sm font-medium text-blue-600">{workingHours.toFixed(1)}h</p>
                    </div>
                  )}

                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'checkin' 
                      ? 'bg-green-100 text-green-800' 
                      : status === 'checkout'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {status === 'checkin' && 'Present'}
                    {status === 'checkout' && 'Left'}
                    {status === 'not_marked' && 'Absent'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAttendanceSystem;