// src/components/files/inventory/quotes/QuotesPageContent.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useData, useToast } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2,
  ChevronDown, Upload, X, Copy, FileText, Send, Download,Calendar, Building, User, DollarSign, CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FileDownload from "js-file-download";
import CreateQuoteForm from '@/components/files/inventory/quotes/CreateQuoteForm';

const QuotesPageContent = () => {
  const { data, updateData } = useData();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    status: '', 
    stage: '', 
    carrier: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);

  // Quotes data
  const quotes = data.quotes || [
    {
      id: '1',
      quoteNumber: 'QT-2024-001',
      subject: 'Laptop Purchase Quote',
      accountName: 'Tech Corp',
      contactName: 'Sarah Johnson',
      date: '2024-01-15',
      expiryDate: '2024-02-15',
      total: 3899.97,
      status: 'Draft',
      quoteStage: 'Draft',
      carrier: 'FedEX',
      quoteOwner: 'DEVASHREE SALUNKE',
      team: 'Sales Team A',
      dealName: 'Enterprise Laptop Deal',
      validUntil: '2024-02-15',
      items: [
        { productName: 'Laptop Pro X1', quantity: 3, listPrice: 1299.99, amount: 3899.97, discount: 0, tax: 0, total: 3899.97 }
      ],
      subTotal: 3899.97,
      discountTotal: 0,
      taxTotal: 0,
      adjustment: 0,
      grandTotal: 3899.97,
      termsAndConditions: '30 days payment terms',
      description: 'Quote for enterprise laptop purchase'
    },
    {
      id: '2',
      quoteNumber: 'QT-2024-002',
      subject: 'Office Equipment Package',
      accountName: 'Innovation Labs',
      contactName: 'Michael Chen',
      date: '2024-01-10',
      expiryDate: '2024-02-10',
      total: 2499.95,
      status: 'Sent',
      quoteStage: 'Sent',
      carrier: 'UPS',
      quoteOwner: 'DEVASHREE SALUNKE',
      team: 'Sales Team B',
      dealName: 'Office Setup',
      validUntil: '2024-02-10',
      items: [
        { productName: 'Wireless Headphones', quantity: 5, listPrice: 199.99, amount: 999.95, discount: 50, tax: 100, total: 1049.95 },
        { productName: '4K Webcam', quantity: 2, listPrice: 159.99, amount: 319.98, discount: 20, tax: 30, total: 329.98 },
        { productName: 'Bluetooth Speaker', quantity: 4, listPrice: 89.99, amount: 359.96, discount: 40, tax: 50, total: 369.96 }
      ],
      subTotal: 1679.89,
      discountTotal: 110,
      taxTotal: 180,
      adjustment: 750.06,
      grandTotal: 2499.95,
      termsAndConditions: '15 days payment terms',
      description: 'Complete office equipment package'
    },
    {
      id: '3',
      quoteNumber: 'QT-2024-003',
      subject: 'Smart Watch Bulk Order',
      accountName: 'Growth Solutions',
      contactName: 'Emily Wilson',
      date: '2024-01-05',
      expiryDate: '2024-02-05',
      total: 1749.95,
      status: 'Accepted',
      quoteStage: 'Accepted',
      carrier: 'DHL',
      quoteOwner: 'DEVASHREE SALUNKE',
      team: 'Sales Team C',
      dealName: 'Corporate Wellness',
      validUntil: '2024-02-05',
      items: [
        { productName: 'Smart Watch Series 5', quantity: 5, listPrice: 349.99, amount: 1749.95, discount: 0, tax: 0, total: 1749.95 }
      ],
      subTotal: 1749.95,
      discountTotal: 0,
      taxTotal: 0,
      adjustment: 0,
      grandTotal: 1749.95,
      termsAndConditions: 'Net 30',
      description: 'Bulk order for corporate wellness program'
    },
    {
      id: '4',
      quoteNumber: 'QT-2024-004',
      subject: 'Storage Solutions',
      accountName: 'Data Systems Inc',
      contactName: 'John Davis',
      date: '2024-01-12',
      expiryDate: '2024-02-12',
      total: 649.95,
      status: 'Rejected',
      quoteStage: 'Rejected',
      carrier: 'FedEX',
      quoteOwner: 'DEVASHREE SALUNKE',
      team: 'Sales Team A',
      dealName: 'Data Backup Solution',
      validUntil: '2024-02-12',
      items: [
        { productName: 'External SSD 1TB', quantity: 5, listPrice: 129.99, amount: 649.95, discount: 0, tax: 0, total: 649.95 }
      ],
      subTotal: 649.95,
      discountTotal: 0,
      taxTotal: 0,
      adjustment: 0,
      grandTotal: 649.95,
      termsAndConditions: '',
      description: 'External storage for data backup'
    },
    {
      id: '5',
      quoteNumber: 'QT-2024-005',
      subject: 'Audio Equipment Package',
      accountName: 'Audio Masters',
      contactName: 'Lisa Thompson',
      date: '2024-01-08',
      expiryDate: '2024-02-08',
      total: 1079.92,
      status: 'Expired',
      quoteStage: 'Expired',
      carrier: 'USPS',
      quoteOwner: 'DEVASHREE SALUNKE',
      team: 'Sales Team B',
      dealName: 'Studio Setup',
      validUntil: '2024-02-08',
      items: [
        { productName: 'Wireless Headphones', quantity: 3, listPrice: 199.99, amount: 599.97, discount: 30, tax: 60, total: 629.97 },
        { productName: 'Bluetooth Speaker', quantity: 5, listPrice: 89.99, amount: 449.95, discount: 0, tax: 0, total: 449.95 }
      ],
      subTotal: 1049.92,
      discountTotal: 30,
      taxTotal: 60,
      adjustment: 0,
      grandTotal: 1079.92,
      termsAndConditions: 'Immediate payment',
      description: 'Audio equipment for recording studio'
    }
  ];

  // Filter logic
  const filteredQuotes = useMemo(() => {
    let filtered = [...quotes];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'draft':
        filtered = filtered.filter(quote => quote.status === 'Draft');
        break;
      case 'sent':
        filtered = filtered.filter(quote => quote.status === 'Sent');
        break;
      case 'accepted':
        filtered = filtered.filter(quote => quote.status === 'Accepted');
        break;
      case 'rejected':
        filtered = filtered.filter(quote => quote.status === 'Rejected');
        break;
      case 'expired':
        filtered = filtered.filter(quote => quote.status === 'Expired');
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(quote => 
          quote.date && new Date(quote.date) > oneWeekAgo
        );
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status) {
      filtered = filtered.filter(quote => quote.status === filters.status);
    }
    if (filters.stage) {
      filtered = filtered.filter(quote => quote.quoteStage === filters.stage);
    }
    if (filters.carrier) {
      filtered = filtered.filter(quote => quote.carrier === filters.carrier);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(quote => {
        if (!quote) return false;
        return (
          (quote.quoteNumber && quote.quoteNumber.toLowerCase().includes(searchLower)) ||
          (quote.subject && quote.subject.toLowerCase().includes(searchLower)) ||
          (quote.accountName && quote.accountName.toLowerCase().includes(searchLower)) ||
          (quote.contactName && quote.contactName.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [quotes, currentView, filters, searchTerm]);

  // Event handlers
  const handleCreateQuote = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleEditQuote = useCallback((quote) => {
    setEditingQuote(quote);
    setShowCreateForm(true);
  }, []);

  const handleViewQuote = useCallback((quote) => {
    setViewingQuote(quote);
  }, []);

  const handleDeleteQuote = useCallback((quote) => {
    if (window.confirm(`Delete quote "${quote.quoteNumber}"?`)) {
      const updatedQuotes = quotes.filter(q => q.id !== quote.id);
      updateData("quotes", updatedQuotes);
      toast({ 
        title: "Quote Deleted", 
        description: `${quote.quoteNumber} has been deleted.` 
      });
    }
  }, [quotes, updateData, toast]);

  const handleQuoteCreated = useCallback((newQuote) => {
    const updatedQuotes = [...quotes, newQuote];
    updateData("quotes", updatedQuotes);
    setShowCreateForm(false);
    setEditingQuote(null);
    toast({
      title: "Quote Created",
      description: `${newQuote.quoteNumber} has been created successfully.`
    });
  }, [quotes, updateData, toast]);

  const handleQuoteUpdated = useCallback((updatedQuote) => {
    const updatedQuotes = quotes.map(q => 
      q.id === updatedQuote.id ? updatedQuote : q
    );
    updateData("quotes", updatedQuotes);
    setShowCreateForm(false);
    setEditingQuote(null);
    toast({
      title: "Quote Updated",
      description: `${updatedQuote.quoteNumber} has been updated successfully.`
    });
  }, [quotes, updateData, toast]);

  const handleBulkDelete = useCallback(() => {
    if (selectedQuotes.length === 0) {
      toast({
        title: "No selection",
        description: "Please select quotes to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Delete ${selectedQuotes.length} quotes?`)) {
      const updatedQuotes = quotes.filter(q => !selectedQuotes.includes(q.id));
      updateData("quotes", updatedQuotes);
      setSelectedQuotes([]);
      
      toast({
        title: "Bulk Delete Successful",
        description: `${selectedQuotes.length} quotes have been deleted.`
      });
    }
  }, [selectedQuotes, quotes, updateData, toast]);

  const handleSendQuote = useCallback((quote) => {
    // Update quote status to Sent
    const updatedQuote = { ...quote, status: 'Sent', quoteStage: 'Sent' };
    const updatedQuotes = quotes.map(q => 
      q.id === quote.id ? updatedQuote : q
    );
    updateData("quotes", updatedQuotes);
    
    toast({
      title: "Quote Sent",
      description: `${quote.quoteNumber} has been sent to ${quote.accountName}.`
    });
  }, [quotes, updateData, toast]);

  const handleDuplicateQuote = useCallback((quote) => {
    const duplicated = {
      ...quote,
      id: Date.now().toString(),
      quoteNumber: `${quote.quoteNumber}-COPY`,
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      quoteStage: 'Draft'
    };
    
    const updatedQuotes = [...quotes, duplicated];
    updateData("quotes", updatedQuotes);
    
    toast({
      title: "Quote Duplicated",
      description: `${duplicated.quoteNumber} has been created.`
    });
  }, [quotes, updateData, toast]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Sent": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Accepted": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Expired": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = filteredQuotes.map(quote => {
      return `"${quote.quoteNumber || ''}","${quote.subject || ''}","${quote.accountName || ''}","${quote.contactName || ''}","${quote.date || ''}","${quote.expiryDate || ''}","${quote.total || 0}","${quote.status || ''}","${quote.carrier || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`Quote Number,Subject,Account,Contact,Date,Expiry Date,Total,Status,Carrier\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Completed",
      description: `${filteredQuotes.length} quotes exported successfully.`
    });
  }, [filteredQuotes, toast]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedQuotes(filteredQuotes.map(q => q.id));
    } else {
      setSelectedQuotes([]);
    }
  };

  const handleSelectQuote = (quoteId, checked) => {
    if (checked) {
      setSelectedQuotes([...selectedQuotes, quoteId]);
    } else {
      setSelectedQuotes(selectedQuotes.filter(id => id !== quoteId));
    }
  };

  // View filter options
  const viewOptions = [
    { id: 'all', label: 'All Quotes' },
    { id: 'draft', label: 'Draft' },
    { id: 'sent', label: 'Sent' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'expired', label: 'Expired' },
    { id: 'recent', label: 'Recently Created' },
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // View Quote Modal
  const ViewQuoteModal = ({ quote, onClose }) => {
    if (!quote) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <div>
              <h2 className="text-xl font-semibold">{quote.subject}</h2>
              <p className="text-gray-600">{quote.quoteNumber}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Quote Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>Account</span>
                    </div>
                    <p className="font-medium">{quote.accountName}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>Contact</span>
                    </div>
                    <p className="font-medium">{quote.contactName}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                    <p className="font-medium">{formatDate(quote.date)}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Expiry Date</span>
                    </div>
                    <p className="font-medium">{formatDate(quote.expiryDate)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <DollarSign className="w-4 h-4" />
                      <span>Total</span>
                    </div>
                    <p className="font-medium">{formatCurrency(quote.total)}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Status</span>
                    </div>
                    <Badge className={`${getStatusColor(quote.status)} capitalize`}>
                      {quote.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Building className="w-4 h-4" />
                      <span>Carrier</span>
                    </div>
                    <p className="font-medium">{quote.carrier}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>Quote Owner</span>
                    </div>
                    <p className="font-medium">{quote.quoteOwner}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            {quote.items && quote.items.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Quoted Items</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>List Price</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.listPrice)}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{formatCurrency(item.discount)}</TableCell>
                          <TableCell>{formatCurrency(item.tax)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-sm text-gray-500">Sub Total</div>
                <div className="font-medium">{formatCurrency(quote.subTotal)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Discount</div>
                <div className="font-medium">{formatCurrency(quote.discountTotal)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tax</div>
                <div className="font-medium">{formatCurrency(quote.taxTotal)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Adjustment</div>
                <div className="font-medium">{formatCurrency(quote.adjustment)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Grand Total</div>
                <div className="font-bold text-lg">{formatCurrency(quote.grandTotal)}</div>
              </div>
            </div>

            {quote.termsAndConditions && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Terms and Conditions</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                  {quote.termsAndConditions}
                </p>
              </div>
            )}

            {quote.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                  {quote.description}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => {
                onClose();
                handleEditQuote(quote);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Filter component
  const FiltersComponent = () => (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Quote Stage</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.stage}
            onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
          >
            <option value="">All Stages</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Carrier</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.carrier}
            onChange={(e) => setFilters(prev => ({ ...prev, carrier: e.target.value }))}
          >
            <option value="">All Carriers</option>
            <option value="FedEX">FedEX</option>
            <option value="UPS">UPS</option>
            <option value="DHL">DHL</option>
            <option value="USPS">USPS</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilters({ status: '', stage: '', carrier: '' })}
        >
          Clear Filters
        </Button>
        <Button 
          size="sm"
          onClick={() => setShowFilters(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  // Bulk Actions Component
  const BulkActionsComponent = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Eye className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium text-blue-900">
            {selectedQuotes.length} quote{selectedQuotes.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  if (showCreateForm) {
    return (
      <CreateQuoteForm 
        initialData={editingQuote}
        onQuoteCreated={editingQuote ? handleQuoteUpdated : handleQuoteCreated}
        onCancel={() => {
          setShowCreateForm(false);
          setEditingQuote(null);
        }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Quotes - CloudCRM</title>
        <meta name="description" content="Manage your quotes" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
            <p className="text-gray-600">Manage and track your quotes</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateQuote} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quote
            </Button>
          </div>
        </div>

        {/* View Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {viewOptions.map((view) => (
                <Button
                  key={view.id}
                  variant={currentView === view.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView(view.id)}
                  className={currentView === view.id ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {view.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search quotes by number, subject, account, or contact..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 md:flex-none"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExport}>
                      <Download className="w-4 h-4 mr-2" />
                      Export All
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </DropdownMenuItem>
                    <DropdownMenuItem>Refresh Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && <FiltersComponent />}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedQuotes.length > 0 && <BulkActionsComponent />}

        {/* Quotes Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Quote #</TableHead>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Account</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Expiry Date</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Carrier</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.length > 0 ? (
                    filteredQuotes.map((quote) => (
                      <TableRow key={quote.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedQuotes.includes(quote.id)}
                            onCheckedChange={(checked) => handleSelectQuote(quote.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground cursor-pointer hover:text-blue-600"
                               onClick={() => handleViewQuote(quote)}>
                            {quote.quoteNumber}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{quote.subject}</TableCell>
                        <TableCell>{quote.accountName}</TableCell>
                        <TableCell>{quote.contactName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(quote.date)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(quote.expiryDate)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(quote.total)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(quote.status)} capitalize`}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{quote.carrier}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewQuote(quote)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditQuote(quote)}
                              className="h-8 w-8 text-green-600 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewQuote(quote)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {quote.status === 'Draft' && (
                                  <DropdownMenuItem onClick={() => handleSendQuote(quote)}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Quote
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDuplicateQuote(quote)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileDownload className="w-4 h-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteQuote(quote)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8">
                        <div className="text-center">
                          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchTerm ? "No matching quotes" : "No quotes found"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {searchTerm 
                              ? "Try adjusting your search or filters"
                              : "Get started by creating your first quote"
                            }
                          </p>
                          {!searchTerm && (
                            <Button onClick={handleCreateQuote} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Create Quote
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {filteredQuotes.length} of {quotes.length} quotes
            {selectedQuotes.length > 0 && ` • ${selectedQuotes.length} selected`}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Draft</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Sent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Accepted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Rejected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Expired</span>
            </div>
          </div>
        </div>

        {/* View Quote Modal */}
        {viewingQuote && (
          <ViewQuoteModal 
            quote={viewingQuote}
            onClose={() => setViewingQuote(null)}
          />
        )}
      </div>
    </>
  );
};

export default QuotesPageContent;