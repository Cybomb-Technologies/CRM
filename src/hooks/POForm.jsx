import React from 'react';

const POForm = ({
  formData,
  items,
  totals,
  onInputChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onCopyBillingToShipping,
  onClearAddress
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
          <input
            type="text"
            value={formData.vendorName || ''}
            onChange={(e) => onInputChange('vendorName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PO Number</label>
          <input
            type="text"
            value={formData.poNumber || ''}
            onChange={(e) => onInputChange('poNumber', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Billing Address</label>
          <textarea
            value={formData.billingAddress || ''}
            onChange={(e) => onInputChange('billingAddress', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
          <textarea
            value={formData.shippingAddress || ''}
            onChange={(e) => onInputChange('shippingAddress', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="3"
          />
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              onClick={onCopyBillingToShipping}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Copy from Billing
            </button>
            <button
              type="button"
              onClick={() => onClearAddress('shippingAddress')}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Items</h3>
        {items.map((item, index) => (
          <div key={item.id || index} className="flex gap-4 mb-3 items-center">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => onItemChange(index, 'description', e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
              className="w-20 border border-gray-300 rounded-md p-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => onItemChange(index, 'price', parseFloat(e.target.value) || 0)}
              className="w-32 border border-gray-300 rounded-md p-2"
            />
            <div className="w-20 text-right">
              ${(item.quantity * item.price).toFixed(2)}
            </div>
            <button
              onClick={() => onRemoveItem(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={onAddItem}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Item
        </button>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end space-x-4 text-lg font-medium">
          <div>Subtotal: ${totals.subtotal?.toFixed(2)}</div>
          <div>Tax: ${totals.tax?.toFixed(2)}</div>
          <div>Total: ${totals.total?.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default POForm;