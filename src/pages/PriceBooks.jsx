// src/pages/PriceBooks.jsx
import React, { useState, useRef } from 'react';
import { Plus, Download, Search, Filter, MoreVertical, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PriceBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Mock data for price books
  const priceBooks = [
    { id: 1, name: 'Standard Price Book', description: 'Default pricing for all products', products: 45, active: true },
    { id: 2, name: 'Enterprise Pricing', description: 'Corporate client pricing', products: 32, active: true },
    { id: 3, name: 'Retail Pricing', description: 'Retail customer pricing', products: 28, active: false },
    { id: 4, name: 'Wholesale 2024', description: 'Wholesale distributor pricing', products: 56, active: true },
  ];

  const handleCreatePriceBook = () => {
    navigate('/create-price-book');
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['.csv', 'text/csv', 'application/vnd.ms-excel'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(`.${fileExtension}`) && !validTypes.includes(file.type)) {
        alert('Please select a CSV file');
        return;
      }
      
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }

    // Simulate import process
    setImportProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setImportProgress(100);
      
      // Simulate successful import
      setTimeout(() => {
        alert('Price books imported successfully!');
        setShowImportModal(false);
        setImportFile(null);
        setImportProgress(0);
        // In real app, you would refresh the price books list here
      }, 500);
    }, 2000);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const template = `Price Book Name,Description,Pricing Model,Active,Currency
Standard Pricing,Default pricing for all products,None,true,USD
Enterprise Pricing,Corporate client pricing,Tiered,true,USD
Retail Pricing,Retail customer pricing,Volume,true,USD`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_books_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Price Books</h1>
              <p className="text-gray-600 mt-1">
                Price Books refer to the goods or procured by an organization.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreatePriceBook}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Price Book
              </button>
              <button 
                onClick={handleImportClick}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Import Price Books
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search price books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filter Button */}
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
            
            {/* View Options */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded">List</button>
              <button className="p-2 hover:bg-gray-100 rounded">Grid</button>
            </div>
          </div>
        </div>

        {/* Price Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {priceBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{book.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{book.description}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{book.products} products</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {book.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create New Card */}
          <div 
            onClick={handleCreatePriceBook}
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
          >
            <div className="p-6 flex flex-col items-center justify-center h-full min-h-[160px] text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Create Price Book</h3>
              <p className="text-gray-600 text-sm">Add a new price book</p>
            </div>
          </div>
        </div>

        {/* Empty State (for when no price books exist) */}
        {priceBooks.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Price Books Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first price book.</p>
            <button 
              onClick={handleCreatePriceBook}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Price Book
            </button>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Import Price Books</h2>
              <button 
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportProgress(0);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Upload CSV File</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Import price books from a CSV file. Download the template to ensure proper formatting.
                </p>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {importFile ? importFile.name : 'Click to select CSV file'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports .csv files only
                  </p>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".csv"
                  className="hidden"
                />
              </div>

              {importProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Download Template
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setImportFile(null);
                      setImportProgress(0);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importFile || importProgress > 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importProgress > 0 ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceBooks;