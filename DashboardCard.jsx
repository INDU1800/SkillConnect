import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, onClick }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'hover:border-indigo-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'hover:border-purple-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'hover:border-amber-200',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'hover:border-emerald-200',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition duration-150 ${
        onClick ? `cursor-pointer ${scheme.border} hover:shadow-sm` : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl ${scheme.bg} ${scheme.text} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
