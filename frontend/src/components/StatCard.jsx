import React from 'react';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <Icon className="text-blue-500" size={24} />
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

export default StatCard;