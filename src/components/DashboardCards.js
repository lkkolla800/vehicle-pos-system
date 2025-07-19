 
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCards = ({ selectedRange }) => {
  // Sample data - මීට පස්සේ API එකෙන් data load කරන්න පුළුවන්
  const dashboardData = {
    revenue: 125000,
    expenses: 78000,
    profit: 47000,
    growth: 12.5
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Revenue',
      value: dashboardData.revenue,
      icon: DollarSign,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Expenses',
      value: dashboardData.expenses,
      icon: TrendingDown,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Profit',
      value: dashboardData.profit,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {formatCurrency(card.value)}
              </p>
            </div>
            <div className={`${card.color} p-3 rounded-full`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Growth indicator */}
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">
              +{dashboardData.growth}%
            </span>
            <span className="text-gray-500 ml-2">vs last {selectedRange.toLowerCase()}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;