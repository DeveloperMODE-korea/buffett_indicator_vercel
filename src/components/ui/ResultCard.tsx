'use client';

import { formatKoreanCurrency, formatCurrency } from '@/lib/calculator-utils';

interface ResultCardProps {
  title: string;
  value: number;
  type?: 'currency' | 'percentage';
  change?: number;
  changeType?: 'increase' | 'decrease';
  description?: string;
  highlight?: boolean;
  icon?: string;
}

export default function ResultCard({
  title,
  value,
  type = 'currency',
  change,
  changeType,
  description,
  highlight = false,
  icon,
}: ResultCardProps) {
  const formatValue = (val: number): string => {
    switch (type) {
      case 'currency':
        return formatKoreanCurrency(val);
      case 'percentage':
        return `${val.toFixed(2)}%`;
      default:
        return formatCurrency(val);
    }
  };

  const getChangeColor = () => {
    if (!change || !changeType) return '';
    return changeType === 'increase'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  const getChangeIcon = () => {
    if (!changeType) return '';
    return changeType === 'increase' ? '↗' : '↘';
  };

  return (
    <div
      className={`card p-6 transition-all duration-200 ${
        highlight
          ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700'
          : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
        {change && (
          <span
            className={`text-sm font-medium ${getChangeColor()} transition-colors`}
          >
            {getChangeIcon()} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="mb-2">
        <div
          className={`text-2xl font-bold transition-colors ${
            highlight
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {formatValue(value)}
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
          {description}
        </p>
      )}
    </div>
  );
}
