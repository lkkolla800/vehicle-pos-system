import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Receipt, Calendar, DollarSign } from 'lucide-react';

const ExpenseForm = ({ vehicles, expenses, onAddExpense }) => {
  const [expenseForm, setExpenseForm] = useState({
    vehicleId: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  const [showForm, setShowForm] = useState(false);

  const expenseCategories = [
    'Fuel', 'Maintenance', 'Insurance', 'Repairs', 
    'Parking', 'Tolls', 'Registration', 'Parts', 
    'Cleaning', 'Driver Salary', 'Other'
  ];

  const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Check'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expenseForm.vehicleId && expenseForm.amount && expenseForm.category) {
      const newExpense = {
        ...expenseForm,
        id: Date.now(),
        amount: parseFloat(expenseForm.amount),
        createdAt: new Date().toISOString()
      };
      
      onAddExpense(newExpense);
      
      // Reset form
      setExpenseForm({
        vehicleId: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash'
      });
      
      setShowForm(false);
    }
  };

  // Calculate total expenses for today
  const todayExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date).toDateString();
    const today = new Date().toDateString();
    return expenseDate === today;
  }).reduce((total, expense) => total + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

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
      className="space-y-6"
    >
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Today's Expenses</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(todayExpenses)}</p>
            </div>
            <Receipt className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(expenses.reduce((total, expense) => total + expense.amount, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Avg per Vehicle</p>
              <p className="text-2xl font-bold text-green-800">
                {vehicles.length > 0 ? formatCurrency(expenses.reduce((total, expense) => total + expense.amount, 0) / vehicles.length) : formatCurrency(0)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track all vehicle-related expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  value={expenseForm.vehicleId}
                  onChange={(e) => setExpenseForm({...expenseForm, vehicleId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber} - {vehicle.vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (LKR)
                </label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({...expenseForm, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method.toLowerCase()}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  placeholder="Optional description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                Add Expense
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

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No expenses recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice(0, 10).reverse().map((expense, index) => {
              const vehicle = vehicles.find(v => v.id == expense.vehicleId);
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {vehicle?.vehicleNumber || 'Unknown Vehicle'} - {expense.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        {expense.description || 'No description'} • {expense.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                    <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expense Categories Summary */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{category}</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExpenseForm;