import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { 
  LayoutDashboard, 
  Car, 
  Settings as SettingsIcon, 
  Menu, 
  X,
  User,
  Receipt,
  DollarSign,
  BarChart,
  Users
} from 'lucide-react';

// Import Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Application State
  const [activePage, setActivePage] = useState('dashboard');
  const [role, setRole] = useState('user');
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check for saved login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vehiclePosUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        setRole(userData.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('vehiclePosUser');
      }
    }
  }, []);

  // Load data from localStorage on mount (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const savedVehicles = localStorage.getItem('posVehicles');
    const savedExpenses = localStorage.getItem('posExpenses');
    const savedIncomes = localStorage.getItem('posIncomes');
    const savedEmployees = localStorage.getItem('posEmployees');
    const savedAttendance = localStorage.getItem('posAttendance');
    
    if (savedVehicles) {
      try {
        setVehicles(JSON.parse(savedVehicles));
      } catch (error) {
        console.error('Error loading vehicles:', error);
      }
    }
    
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('Error loading expenses:', error);
      }
    }
    
    if (savedIncomes) {
      try {
        setIncomes(JSON.parse(savedIncomes));
      } catch (error) {
        console.error('Error loading incomes:', error);
      }
    }
    
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    }
    
    if (savedAttendance) {
      try {
        setAttendanceRecords(JSON.parse(savedAttendance));
      } catch (error) {
        console.error('Error loading attendance:', error);
      }
    }
  }, [isAuthenticated]);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('posVehicles', JSON.stringify(vehicles));
  }, [vehicles, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('posExpenses', JSON.stringify(expenses));
  }, [expenses, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('posIncomes', JSON.stringify(incomes));
  }, [incomes, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('posEmployees', JSON.stringify(employees));
  }, [employees, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('posAttendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords, isAuthenticated]);

  // Authentication Functions
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('vehiclePosUser');
      setCurrentUser(null);
      setRole('user');
      setIsAuthenticated(false);
      setActivePage('dashboard');
      
      // Optionally clear data
      // setVehicles([]);
      // setExpenses([]);
      // setIncomes([]);
      // setEmployees([]);
      // setAttendanceRecords([]);
    }
  };

  // Vehicle Management Functions
  const handleAddVehicle = (vehicleData) => {
    const newVehicle = {
      ...vehicleData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
  };

  // Expense Management Functions
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  // Income Management Functions
  const handleAddIncome = (incomeData) => {
    const newIncome = {
      ...incomeData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setIncomes(prev => [...prev, newIncome]);
  };

  // Employee Management Functions
  const handleAddEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prev => 
      prev.map(employee => 
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(employee => employee.id !== employeeId));
    }
  };

  // Attendance Management Functions
  const handleMarkAttendance = (attendanceData) => {
    setAttendanceRecords(prev => [...prev, attendanceData]);
  };

  // User Management Functions
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem('vehiclePosUser', JSON.stringify(updatedUser));
    }
  };

  // Check if user has permission for a page
  const hasPermission = (pageId) => {
    if (role === 'admin') return true;
    
    // User permissions (limited access)
    const userAllowedPages = ['dashboard', 'vehicles', 'expenses', 'income', 'settings'];
    return userAllowedPages.includes(pageId);
  };

  // Navigation items with permission check
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics',
      permission: true
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      icon: Car,
      description: 'Manage Fleet',
      permission: true
    },
    {
      id: 'expenses',
      name: 'Expenses',
      icon: Receipt,
      description: 'Track Costs',
      permission: true
    },
    {
      id: 'income',
      name: 'Income',
      icon: DollarSign,
      description: 'Revenue Tracking',
      permission: true
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart,
      description: 'Analytics & Insights',
      permission: role === 'admin'
    },
    {
      id: 'employees',
      name: 'Employees',
      icon: Users,
      description: 'Staff Management',
      permission: role === 'admin'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: SettingsIcon,
      description: 'Account & Preferences',
      permission: true
    }
  ].filter(item => item.permission);

  // Render active page
  const renderActivePage = () => {
    if (!hasPermission(activePage)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <button
              onClick={() => setActivePage('dashboard')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            vehicles={vehicles} 
            expenses={expenses} 
            incomes={incomes} 
            employees={employees}
            onMarkAttendance={handleMarkAttendance}
            onNavigateToEmployees={() => setActivePage('employees')}
          />
        );
      case 'vehicles':
        return (
          <Vehicles
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        );
      case 'expenses':
        return (
          <ExpenseForm
            vehicles={vehicles}
            expenses={expenses}
            onAddExpense={handleAddExpense}
          />
        );
      case 'income':
        return (
          <IncomeForm
            vehicles={vehicles}
            incomes={incomes}
            onAddIncome={handleAddIncome}
          />
        );
      case 'reports':
        return (
          <Reports 
            vehicles={vehicles} 
            expenses={expenses} 
            incomes={incomes}
            employees={employees}
            attendanceRecords={attendanceRecords}
          />
        );
      case 'employees':
        return (
          <Employees
            employees={employees}
            vehicles={vehicles}
            attendanceRecords={attendanceRecords}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onMarkAttendance={handleMarkAttendance}
          />
        );
      case 'settings':
        return (
          <Settings
            role={role}
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <Dashboard 
            vehicles={vehicles} 
            expenses={expenses} 
            incomes={incomes} 
            employees={employees}
            onMarkAttendance={handleMarkAttendance}
            onNavigateToEmployees={() => setActivePage('employees')}
          />
        );
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Calculate quick stats for header
  const todayExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date).toDateString();
    const today = new Date().toDateString();
    return expenseDate === today;
  }).reduce((total, expense) => total + expense.amount, 0);

  const todayIncome = incomes.filter(income => {
    const incomeDate = new Date(income.date).toDateString();
    const today = new Date().toDateString();
    return incomeDate === today;
  }).reduce((total, income) => total + income.amount, 0);

  const todayProfit = todayIncome - todayExpenses;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">VehiclePOS</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {role}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activePage === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              VehiclePOS v3.0.0
              <br />
              © 2025 Your Company
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-800 capitalize">
                {activePage}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                {activePage === 'dashboard' && 'Welcome to your vehicle management dashboard'}
                {activePage === 'vehicles' && `Managing ${vehicles.length} vehicles`}
                {activePage === 'expenses' && `Total expenses: LKR ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`}
                {activePage === 'income' && `Total income: LKR ${incomes.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}`}
                {activePage === 'reports' && 'Business analytics and insights'}
                {activePage === 'employees' && `Managing ${employees.filter(e => e.status === 'active').length} employees`}
                {activePage === 'settings' && 'Configure your preferences'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Today: +LKR {todayIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">
                  -LKR {todayExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${todayProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Profit: LKR {todayProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActivePage()}
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;