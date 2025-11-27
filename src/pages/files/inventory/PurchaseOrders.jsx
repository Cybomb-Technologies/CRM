import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePOStorage } from '../../../hooks/usePOStorage';
// import SearchFilters from '../components/common/SearchFilters';
import POTable from '../../../components/files/inventory/purchaseorders/POTable';

const PurchaseOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const navigate = useNavigate();
  const { getPurchaseOrders } = usePOStorage();

  useEffect(() => {
    const savedPOs = getPurchaseOrders();
    setPurchaseOrders(savedPOs);
  }, [getPurchaseOrders]);

  const handleCreatePurchaseOrder = () => {
    navigate('/create-purchase-order');
  };

  const filteredPOs = purchaseOrders.filter(po =>
    po.formData?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.formData?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
              <p className="text-gray-600 mt-1 max-w-3xl">
                Purchase Orders are legal documents for placing orders to secure products and services from vendors.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreatePurchaseOrder}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Information Banner */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Manage Purchase Orders</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Track your procurement process efficiently. Monitor order status, delivery timelines, and vendor communications.
                </p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Learn more about Purchase Orders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ml-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <SearchFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search purchase orders..."
          />

          <POTable purchaseOrders={filteredPOs} />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;