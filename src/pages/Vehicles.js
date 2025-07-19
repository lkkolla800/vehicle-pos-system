import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Car } from 'lucide-react';

const Vehicles = ({ vehicles, onAddVehicle, onUpdateVehicle, onDeleteVehicle }) => {
  const [showForm, setShowForm] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: '',
    ownerNIC: '',
    vehicleType: '',
    registerDate: new Date().toISOString().split('T')[0]
  });

  const vehicleTypes = [
    'Car', 'Van', 'Truck', 'Bus', 'Three Wheeler', 'Motorcycle', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (vehicleForm.vehicleNumber && vehicleForm.ownerNIC && vehicleForm.vehicleType) {
      onAddVehicle({
        ...vehicleForm,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      setVehicleForm({
        vehicleNumber: '',
        ownerNIC: '',
        vehicleType: '',
        registerDate: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600">Manage your vehicle database</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Vehicle</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={vehicleForm.vehicleNumber}
                  onChange={(e) => setVehicleForm({...vehicleForm, vehicleNumber: e.target.value})}
                  placeholder="e.g., WP-1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner NIC
                </label>
                <input
                  type="text"
                  value={vehicleForm.ownerNIC}
                  onChange={(e) => setVehicleForm({...vehicleForm, ownerNIC: e.target.value})}
                  placeholder="e.g., 123456789V"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={vehicleForm.vehicleType}
                  onChange={(e) => setVehicleForm({...vehicleForm, vehicleType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Register Date
                </label>
                <input
                  type="date"
                  value={vehicleForm.registerDate}
                  onChange={(e) => setVehicleForm({...vehicleForm, registerDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Vehicle
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle List</h3>
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No vehicles added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Car className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-gray-900">
                    {vehicle.vehicleNumber}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Owner: {vehicle.ownerNIC}
                  </div>
                  <div className="text-sm text-gray-600">
                    Type: {vehicle.vehicleType}
                  </div>
                  <div className="text-sm text-gray-600">
                    Registered: {new Date(vehicle.registerDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Vehicles; 
