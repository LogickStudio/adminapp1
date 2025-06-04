
import React from 'react';
import type { StatCardData } from '../types.js';

const StatCard: React.FC<StatCardData> = ({ title, value, icon, change, changeType }) => {
  const changeColor = changeType === 'positive' ? 'text-green-500 dark:text-green-400' : changeType === 'negative' ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400';
  return (
    <div className="bg-cardLight dark:bg-cardDark p-6 rounded-xl shadow-lg hover:shadow-primary-dark/20 dark:hover:shadow-primary-light/20 transition-shadow duration-300 border border-borderLight dark:border-borderDark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-textLight dark:text-textDark mt-1">{value}</p>
        </div>
        <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-full">
          {icon} {/* Icon color should be handled by its own class or be currentColor */}
        </div>
      </div>
      {change && (
        <p className={`text-xs mt-3 ${changeColor}`}>
          {change}
        </p>
      )}
    </div>
  );
};

export default StatCard;