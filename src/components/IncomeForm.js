import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, TrendingUp, User } from 'lucide-react';

const IncomeForm = ({ vehicles, incomes, onAddIncome }) => {
  const [incomeForm, setIncomeForm] = useState({
    vehicleId: '',
    amount: '',
    serviceType: '',
    customerName: '',
    customerPhone: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  const [showForm, setShowForm] = useState(false);

  const serviceTypes = [
    'Taxi Service', 'Delivery', 'Rental', 'Tours', 
    'Airport Transfer', 'School Transport', 'Goods Transport',
    'Wedding Service', 'Corporate Service', 'Other'
  ];

  const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Digital Wallet'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (incomeForm.vehicleId && incomeForm.amount && incomeForm.serviceType) {
      const newIncome = {
        ...incomeForm,
        id: Date.now(),
        amount: parseFloat(incomeForm.amount),
        createdAt: new Date().toISOString()
      };
      
      onAddIncome(newIncome);
      
      // Reset form
      setIncomeForm({
        vehicleId: '',
        amount: '',
        serviceType: '',
        customerName: '',
        customerPhone: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash'
      });
      
      setShowForm(false);
    }
  };

  // Calculate statistics
  const todayIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date).toDateString();
    const today = new Date().toDateString();
    return incomeDate === today;
  }).reduce((total, income) => total + income.amount, 0);

  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

  const incomesByService = incomes.reduce((acc, income) => {
    acc[income.serviceType] = (acc[income.serviceType] || 0) + income.amount;
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
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Today's Income</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(todayIncomes)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg per Vehicle</p>
              <p className="text-2xl font-bold text-purple-800">
                {vehicles.length > 0 ? formatCurrency(totalIncome / vehicles.length) : formatCurrency(0)}
              </p>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
          <p className="text-gray-600">Track all vehicle revenue and services</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Income
        </button>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Record New Income</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  value={incomeForm.vehicleId}
                  onChange={(e) => setIncomeForm({...incomeForm, vehicleId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  Service Type
                </label>
                <select
                  value={incomeForm.serviceType}
                  onChange={(e) => setIncomeForm({...incomeForm, serviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Service</option>
                  {serviceTypes.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (LKR)
                </label>
                <input
                  type="number"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={incomeForm.customerName}
                  onChange={(e) => setIncomeForm({...incomeForm, customerName: e.target.value})}
                  placeholder="Customer name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={incomeForm.customerPhone}
                  onChange={(e) => setIncomeForm({...incomeForm, customerPhone: e.target.value})}
                  placeholder="Phone number (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={incomeForm.date}
                  onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={incomeForm.paymentMethod}
                  onChange={(e) => setIncomeForm({...incomeForm, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                  placeholder="Service details (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
              >
                Record Income
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

      {/* Recent Income */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Income</h3>
        {incomes.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No income recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomes.slice(0, 10).reverse().map((income, index) => {
              const vehicle = vehicles.find(v => v.id == income.vehicleId);
              return (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {vehicle?.vehicleNumber || 'Unknown Vehicle'} - {income.serviceType}
                      </p>
                      <p className="text-sm text-gray-600">
                        {income.customerName ? `Customer: ${income.customerName}` : 'No customer info'} • {income.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(income.amount)}</p>
                    <p className="text-sm text-gray-500">{new Date(income.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income by Service Type */}
      {incomes.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Service Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(incomesByService).map(([service, amount]) => (
              <div key={service} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-600">{service}</p>
                <p className="text-lg font-bold text-green-800">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IncomeForm;