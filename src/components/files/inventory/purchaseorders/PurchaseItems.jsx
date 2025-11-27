import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const PurchaseItems = ({ items, totals, onItemChange, onAddItem, onRemoveItem }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Purchase Items</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">List Price (Rs.)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (Rs.)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discount (Rs.)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax (Rs.)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total (Rs.)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => onItemChange(index, 'productName', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.listPrice}
                      onChange={(e) => onItemChange(index, 'listPrice', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => onItemChange(index, 'discount', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.tax}
                      onChange={(e) => onItemChange(index, 'tax', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.total}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => onItemChange(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-600 hover:text-red-700"
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
          onClick={onAddItem}
          className="mt-4 flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add row
        </button>

        {/* Totals */}
        <div className="mt-6 grid grid-cols-4 gap-4 max-w-2xl ml-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Total (Rs.)</label>
            <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50">
              {totals.subTotal}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Rs.)</label>
            <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50">
              {totals.totalDiscount}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax (Rs.)</label>
            <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50">
              {totals.totalTax}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grand Total (Rs.)</label>
            <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 font-semibold">
              {totals.grandTotal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseItems;