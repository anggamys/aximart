import React from 'react';
import Link from 'next/link';

export default function DataTable({ columns, data, loading, error, actions, keyField = '_id', loadingMessage = 'Loading...', emptyMessage = 'No data found', truncateIDs = true }) {
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  // Render empty state
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-gray-500">{emptyMessage}</div>;
  }

  // Function to render cell content based on column type
  const renderCell = (item, column) => {
    // Special handling for ID column with truncation
    if (column.field === keyField && truncateIDs && typeof item[column.field] === 'string') {
      return item[column.field].substring(20, 24);
    }

    // If formatter function is provided, use it
    if (column.formatter) {
      return column.formatter(item[column.field], item);
    }

    // Special handling for boolean values
    if (typeof item[column.field] === 'boolean') {
      return item[column.field] ? 'Ya' : 'Tidak';
    }

    // Price formatting
    if (column.isPrice && item[column.field]) {
      return `Rp.${item[column.field].toLocaleString('id-ID')}`;
    }

    // Date formatting
    if (column.isDate && item[column.field]) {
      return new Date(item[column.field]).toLocaleDateString('id-ID');
    }

    // Default
    return item[column.field] || '-';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((column) => (
              <th key={column.field} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
            {actions && <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item[keyField]} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={`${item[keyField]}-${column.field}`} className="px-5 py-4 whitespace-nowrap">
                  {renderCell(item, column)}
                </td>
              ))}
              {actions && (
                <td className="px-5 py-4 whitespace-nowrap space-y-2">
                  {actions.map((action, index) => (
                    <React.Fragment key={index}>
                      {action.type === 'link' ? (
                        <Link href={action.href(item)} legacyBehavior>
                          <a className={`inline-block text-center py-2 px-4 rounded ${action.className || 'primary-button'}`}>{action.label}</a>
                        </Link>
                      ) : (
                        <button onClick={() => action.onClick(item)} className={`block w-full py-2 px-4 rounded ${action.className || 'default-button'}`} disabled={action.disabled}>
                          {action.label}
                        </button>
                      )}
                      {index < actions.length - 1 && <div className="my-1"></div>}
                    </React.Fragment>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
