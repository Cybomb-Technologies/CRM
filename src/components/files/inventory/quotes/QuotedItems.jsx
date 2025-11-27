import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const QuotedItems = ({ items, totals, onItemChange, onAddItem, onRemoveItem }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quoted Items</h2>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">S.NO</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product Name *</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity *</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">List Price (Rs.) *</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount (Rs.)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Discount (Rs.)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tax (Rs.)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total (Rs.)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      required
                      value={item.productName}
                      onChange={(e) => onItemChange(item.id, 'productName', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Product name"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      required
                      value={item.quantity}
                      onChange={(e) => onItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      required
                      value={item.listPrice}
                      onChange={(e) => onItemChange(item.id, 'listPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3">{item.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => onItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.tax}
                      onChange={(e) => onItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{item.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={onAddItem}
          className="mt-4 flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add row
        </button>

        {/* Totals Section */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl ml-auto">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">Sub Total (Rs.)</div>
            <div className="text-lg font-semibold">{totals.subtotal.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">Discount (Rs.)</div>
            <div className="text-lg font-semibold">{totals.totalDiscount.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">Tax (Rs.)</div>
            <div className="text-lg font-semibold">{totals.totalTax.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">Grand Total (Rs.)</div>
            <div className="text-2xl font-bold text-blue-600">{totals.grandTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotedItems;