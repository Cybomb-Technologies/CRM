import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuoteStorage } from '../../../hooks/useQuoteStorage';
import CPQBanner from "../../../components/files/inventory/quotes/CPQBanner";
import QuotesTable from "../../../components/files/inventory/quotes/QuotesTable";
// import SearchFilters from "../../../components/files/common/SearchFilters";



const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();
  const { getQuotes } = useQuoteStorage();

  useEffect(() => {
    const savedQuotes = getQuotes();
    setQuotes(savedQuotes);
  }, [getQuotes]);

  const handleCreateQuote = () => {
    navigate('/create-quote');
  };

  const handleTryCPQ = () => {
    console.log('Navigate to CPQ');
    // Implement CPQ navigation logic
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Manage Customer Quotes</h1>
              <p className="text-gray-600 mt-1 max-w-3xl">
                Quotes are legal agreements between a customer and a vendor to deliver the requested product(s) 
                at the agreed upon price within the specified time period.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreateQuote}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <CPQBanner onTryCPQ={handleTryCPQ} />

          <SearchFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search quotes..."
          />

          <QuotesTable quotes={filteredQuotes} />
        </div>
      </div>
    </div>
  );
};

export default Quotes;