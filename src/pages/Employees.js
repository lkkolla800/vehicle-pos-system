import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Clock, DollarSign, Phone, Mail, Calendar, Edit, Trash2, Car } from 'lucide-react';
import EnhancedAttendanceSystem from '../components/EnhancedAttendanceSystem';

const Employees = ({ employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee, vehicles, attendanceRecords, onMarkAttendance }) => {
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    nic: '',
    phone: '',
    email: '',
    position: '',
    salary: '',
    vehicleId: '',
    joinDate: new Date().toISOString().split('T')[0],
    address: ''
  });

  const positions = [
    'Driver', 'Assistant Driver', 'Mechanic', 'Cleaner', 
    'Dispatcher', 'Manager', 'Accountant', 'Other'
  ];

  const handleSubmitEmployee = (e) => {
    e.preventDefault();
    if (employeeForm.name && employeeForm.nic && employeeForm.position) {
      const newEmployee = {
        ...employeeForm,
        id: Date.now(),
        salary: parseFloat(employeeForm.salary) || 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      onAddEmployee(newEmployee);
      
      // Reset form
      setEmployeeForm({
        name: '',
        nic: '',
        phone: '',
        email: '',
        position: '',
        salary: '',
        vehicleId: '',
        joinDate: new Date().toISOString().split('T')[0],
        address: ''
      });
      
      setShowForm(false);
    }
  };

  const getEmployeeVehicle = (vehicleId) => {
    return vehicles.find(v => v.id == vehicleId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const totalSalaryExpense = activeEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-blue-800">{activeEmployees.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Monthly Salary</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(totalSalaryExpense)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Salary</p>
              <p className="text-2xl font-bold text-purple-800">
                {activeEmployees.length > 0 ? formatCurrency(totalSalaryExpense / activeEmployees.length) : formatCurrency(0)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage staff, attendance, and payroll</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAttendance(!showAttendance)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Mark Attendance
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Employee</h3>
          <form onSubmit={handleSubmitEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC Number *
                </label>
                <input
                  type="text"
                  value={employeeForm.nic}
                  onChange={(e) => setEmployeeForm({...employeeForm, nic: e.target.value})}
                  placeholder="e.g., 123456789V"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                  placeholder="e.g., 0771234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                  placeholder="employee@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <select
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Salary (LKR)
                </label>
                <input
                  type="number"
                  value={employeeForm.salary}
                  onChange={(e) => setEmployeeForm({...employeeForm, salary: e.target.value})}
                  placeholder="Enter monthly salary"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Vehicle
                </label>
                <select
                  value={employeeForm.vehicleId}
                  onChange={(e) => setEmployeeForm({...employeeForm, vehicleId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Vehicle Assigned</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber} - {vehicle.vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  value={employeeForm.joinDate}
                  onChange={(e) => setEmployeeForm({...employeeForm, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={employeeForm.address}
                  onChange={(e) => setEmployeeForm({...employeeForm, address: e.target.value})}
                  placeholder="Employee address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Employee
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Enhanced Attendance System */}
      {showAttendance && (
        <EnhancedAttendanceSystem
          employees={employees}
          attendanceRecords={attendanceRecords || []}
          onMarkAttendance={onMarkAttendance}
        />
      )}

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Directory</h3>
        {activeEmployees.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No employees added yet.</p>
            <p className="text-sm text-gray-400">Click "Add Employee" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEmployees.map((employee, index) => {
              const assignedVehicle = getEmployeeVehicle(employee.vehicleId);
              return (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-blue-600">{employee.position}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onUpdateEmployee && onUpdateEmployee(employee)}
                        className="p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee && onDeleteEmployee(employee.id)}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
                    </div>
                    {assignedVehicle && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Car className="h-4 w-4" />
                        <span>Vehicle: {assignedVehicle.vehicleNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(employee.salary || 0)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Salary Summary */}
      {activeEmployees.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">By Position</h4>
              <div className="space-y-2">
                {positions.map(position => {
                  const positionEmployees = activeEmployees.filter(emp => emp.position === position);
                  const positionSalary = positionEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
                  
                  if (positionEmployees.length === 0) return null;
                  
                  return (
                    <div key={position} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        {position} ({positionEmployees.length})
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatCurrency(positionSalary)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Total Monthly Cost</h4>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">Total Salaries</span>
                  <span className="text-2xl font-bold text-blue-800">
                    {formatCurrency(totalSalaryExpense)}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Average: {formatCurrency(totalSalaryExpense / activeEmployees.length)} per employee
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Employees;