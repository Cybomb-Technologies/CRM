// src/components/files/inventory/pricebooks/PriceBooksPageContent.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Filter, Download, Upload, Loader2, X } from 'lucide-react';
import PriceBooksTable from '@/components/files/inventory/pricebooks/PriceBooksTable';
import PriceBooksFilters from '@/components/files/inventory/pricebooks/PriceBooksFilters';
import PriceBooksViewFilters from '@/components/files/inventory/pricebooks/PriceBooksViewFilters';
import PriceBooksBulkActions from '@/components/files/inventory/pricebooks/PriceBooksBulkActions';
import CreatePriceBookDialog from '@/components/files/inventory/pricebooks/CreatePriceBookDialog';
import ViewPriceBookDialog from '@/components/files/inventory/pricebooks/ViewPriceBookDialog';
import EditPriceBookDialog from '@/components/files/inventory/pricebooks/EditPriceBookDialog';
import { useToast } from '@/hooks';
import api from '@/lib/axios';

const PriceBooksPageContent = () => {
  const { toast } = useToast();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceBooks, setSelectedPriceBooks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({
    status: 'Active',
    category: 'All Categories',
    source: 'All Sources',
    flags: 'All Flags',
    dateRange: ''
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPriceBook, setSelectedPriceBook] = useState(null);
  const [priceBooks, setPriceBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Phone validation helper function
  const validatePhoneNumber = (phone) => {
    if (!phone) return { isValid: true, message: '' };

    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');

    // Check if it's exactly 10 digits
    if (cleanPhone.length !== 10) {
      return {
        isValid: false,
        message: 'Phone number must be exactly 10 digits'
      };
    }

    // Optional: Check if it starts with valid digits (6-9 for Indian numbers)
    if (!/^[6-9]/.test(cleanPhone)) {
      return {
        isValid: false,
        message: 'Phone number should start with 6, 7, 8, or 9'
      };
    }

    return { isValid: true, message: '' };
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6, 10)}`;
    }

    return phone;
  };

  // Fetch price books from API
  useEffect(() => {
    fetchPriceBooks();
  }, []);

  const fetchPriceBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/price-books');
      const books = response.data.data || [];

      // Format phone numbers for display
      const formattedBooks = books.map(book => ({
        ...book,
        displayPhone: formatPhoneNumber(book.phone)
      }));

      setPriceBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching price books:', error);
      toast({
        title: "Error",
        description: "Failed to load price books from server",
        variant: "destructive"
      });
      // Fallback to sample data
      setPriceBooks([
        {
          _id: '1',
          name: 'Standard Price Book',
          company: 'Tech Corp',
          email: 'sarah@techcorp.com',
          phone: '1234567890',
          displayPhone: '(123) 456-7890',
          description: 'Default pricing for all products',
          products: 45,
          status: 'Active',
          source: 'Website',
          flags: 'Default',
          category: 'Enterprise',
          created: '2024-01-15',
          active: true
        },
        {
          _id: '2',
          name: 'Enterprise Pricing',
          company: 'Innovation Labs',
          email: 'michael@innovationlabs.com',
          phone: '9876543210',
          displayPhone: '(987) 654-3210',
          description: 'Corporate client pricing',
          products: 32,
          status: 'Active',
          source: 'Partner',
          flags: 'Premium',
          category: 'Retail',
          created: '2024-01-10',
          active: true
        },
        {
          _id: '3',
          name: 'Retail Pricing',
          company: 'Global Retail',
          email: 'john@globalretail.com',
          phone: '5551234567',
          displayPhone: '(555) 123-4567',
          description: 'Standard retail pricing',
          products: 28,
          status: 'Inactive',
          source: 'Direct',
          flags: 'Standard',
          category: 'Retail',
          created: '2024-01-05',
          active: false
        },
        {
          _id: '4',
          name: 'Wholesale Pricing',
          company: 'Bulk Distributors',
          email: 'lisa@bulkdist.com',
          phone: '4449876543',
          displayPhone: '(444) 987-6543',
          description: 'Wholesale bulk pricing',
          products: 52,
          status: 'Pending',
          source: 'Partner',
          flags: 'Premium',
          category: 'Wholesale',
          created: '2024-01-20',
          active: true
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredPriceBooks = useMemo(() => {
    let filtered = [...priceBooks];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'active':
        filtered = filtered.filter(book => book.status === 'Active');
        break;
      case 'inactive':
        filtered = filtered.filter(book => book.status === 'Inactive');
        break;
      case 'pending':
        filtered = filtered.filter(book => book.status === 'Pending');
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(book =>
          book.created && new Date(book.created) > oneWeekAgo
        );
        break;
      case 'default':
        filtered = filtered.filter(book => book.flags === 'Default');
        break;
      case 'premium':
        filtered = filtered.filter(book => book.flags === 'Premium');
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(book => book.status === filters.status);
    }
    if (filters.category && filters.category !== 'All Categories') {
      filtered = filtered.filter(book => book.category === filters.category);
    }
    if (filters.source && filters.source !== 'All Sources') {
      filtered = filtered.filter(book => book.source === filters.source);
    }
    if (filters.flags && filters.flags !== 'All Flags') {
      filtered = filtered.filter(book => book.flags === filters.flags);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(book => {
        if (!book) return false;

        // Search in phone number (both formatted and raw)
        const phoneMatch = book.phone && book.phone.toLowerCase().includes(searchLower);
        const displayPhoneMatch = book.displayPhone && book.displayPhone.toLowerCase().includes(searchLower);

        return (
          (book.name && book.name.toLowerCase().includes(searchLower)) ||
          (book.company && book.company.toLowerCase().includes(searchLower)) ||
          (book.description && book.description.toLowerCase().includes(searchLower)) ||
          (book.email && book.email.toLowerCase().includes(searchLower)) ||
          (book.flags && book.flags.toLowerCase().includes(searchLower)) ||
          (book.category && book.category.toLowerCase().includes(searchLower)) ||
          phoneMatch ||
          displayPhoneMatch
        );
      });
    }

    return filtered;
  }, [priceBooks, currentView, filters, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'All',
      category: 'All Categories',
      source: 'All Sources',
      flags: 'All Flags',
      dateRange: ''
    });
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.status !== 'All' ||
      filters.category !== 'All Categories' ||
      filters.source !== 'All Sources' ||
      filters.flags !== 'All Flags' ||
      searchTerm.trim() !== '';
  };

  // Event handlers
  const handleCreatePriceBook = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleEditPriceBook = useCallback((priceBook) => {
    setSelectedPriceBook(priceBook);
    setEditDialogOpen(true);
  }, []);

  const handleViewPriceBook = useCallback((priceBook) => {
    setSelectedPriceBook(priceBook);
    setViewDialogOpen(true);
  }, []);

  const handleDeletePriceBook = useCallback(async (priceBook) => {
    if (window.confirm(`Delete price book "${priceBook.name}"?`)) {
      try {
        await api.delete(`/price-books/${priceBook._id || priceBook.id}`);

        // Update local state
        setPriceBooks(prev => prev.filter(p => p._id !== priceBook._id && p.id !== priceBook.id));

        toast({
          title: "Price Book Deleted",
          description: `${priceBook.name} has been deleted.`
        });
      } catch (error) {
        console.error('Error deleting price book:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete price book",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handlePriceBookCreated = useCallback(async (newPriceBook) => {
    try {
      // Validate phone number before sending
      if (newPriceBook.phone) {
        const phoneValidation = validatePhoneNumber(newPriceBook.phone);
        if (!phoneValidation.isValid) {
          toast({
            title: "Validation Error",
            description: phoneValidation.message,
            variant: "destructive"
          });
          return;
        }

        // Clean phone number (remove formatting)
        newPriceBook.phone = newPriceBook.phone.replace(/\D/g, '');
      }

      const response = await api.post('/price-books', newPriceBook);
      const createdPriceBook = response.data.data;

      // Format phone for display
      const formattedBook = {
        ...createdPriceBook,
        displayPhone: formatPhoneNumber(createdPriceBook.phone)
      };

      // Update local state
      setPriceBooks(prev => [...prev, formattedBook]);

      setCreateDialogOpen(false);
      toast({
        title: "Price Book Created",
        description: `${createdPriceBook.name} has been created successfully.`
      });
    } catch (error) {
      console.error('Error creating price book:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create price book",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handlePriceBookUpdated = useCallback(async (updatedPriceBook) => {
    try {
      const priceBookId = updatedPriceBook._id || updatedPriceBook.id;

      // Validate phone number before sending
      if (updatedPriceBook.phone) {
        const phoneValidation = validatePhoneNumber(updatedPriceBook.phone);
        if (!phoneValidation.isValid) {
          toast({
            title: "Validation Error",
            description: phoneValidation.message,
            variant: "destructive"
          });
          return;
        }

        // Clean phone number (remove formatting)
        updatedPriceBook.phone = updatedPriceBook.phone.replace(/\D/g, '');
      }

      const response = await api.put(`/price-books/${priceBookId}`, updatedPriceBook);
      const updatedBook = response.data.data;

      // Format phone for display
      const formattedBook = {
        ...updatedBook,
        displayPhone: formatPhoneNumber(updatedBook.phone)
      };

      // Update local state
      setPriceBooks(prev => prev.map(p =>
        (p._id === priceBookId || p.id === priceBookId) ? formattedBook : p
      ));

      setEditDialogOpen(false);
      setSelectedPriceBook(null);
      toast({
        title: "Price Book Updated",
        description: `${updatedBook.name} has been updated successfully.`
      });
    } catch (error) {
      console.error('Error updating price book:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update price book",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedPriceBooks.length === 0) {
      toast({
        title: "No selection",
        description: "Please select price books to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Delete ${selectedPriceBooks.length} price books?`)) {
      try {
        await api.delete('/price-books/bulk/delete', {
          data: { ids: selectedPriceBooks }
        });

        // Update local state
        setPriceBooks(prev => prev.filter(p => !selectedPriceBooks.includes(p._id || p.id)));
        setSelectedPriceBooks([]);

        toast({
          title: "Bulk Delete Successful",
          description: `${selectedPriceBooks.length} price books have been deleted.`
        });
      } catch (error) {
        console.error('Error bulk deleting price books:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete price books",
          variant: "destructive"
        });
      }
    }
  }, [selectedPriceBooks, toast]);

  const handleBulkUpdate = useCallback(async (updates) => {
    if (selectedPriceBooks.length === 0) {
      toast({
        title: "No selection",
        description: "Please select price books to update",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number in updates
    if (updates.phone) {
      const phoneValidation = validatePhoneNumber(updates.phone);
      if (!phoneValidation.isValid) {
        toast({
          title: "Validation Error",
          description: phoneValidation.message,
          variant: "destructive"
        });
        return;
      }

      // Clean phone number (remove formatting)
      updates.phone = updates.phone.replace(/\D/g, '');
    }

    try {
      await api.put('/price-books/bulk/update', {
        ids: selectedPriceBooks,
        updates
      });

      // Update local state with formatted phone
      setPriceBooks(prev => prev.map(p => {
        if (selectedPriceBooks.includes(p._id || p.id)) {
          const updatedBook = { ...p, ...updates };
          return {
            ...updatedBook,
            displayPhone: updates.phone ? formatPhoneNumber(updates.phone) : p.displayPhone
          };
        }
        return p;
      }));

      setSelectedPriceBooks([]);
      toast({
        title: "Bulk Update Successful",
        description: `${selectedPriceBooks.length} price books have been updated.`
      });
    } catch (error) {
      console.error('Error bulk updating price books:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update price books",
        variant: "destructive"
      });
    }
  }, [selectedPriceBooks, toast]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      const response = await api.get('/price-books/export/csv', {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `price-books-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Completed",
        description: `${filteredPriceBooks.length} price books exported successfully.`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.response?.data?.message || "Failed to export price books",
        variant: "destructive"
      });

      // Fallback to local export if API fails
      const csvContent = filteredPriceBooks.map(book => {
        return `"${book.name || ''}","${book.company || ''}","${book.email || ''}","${book.phone || ''}","${book.description || ''}","${book.status || ''}","${book.source || ''}","${book.flags || ''}","${book.products || 0}","${book.created || ''}"`;
      }).join('\n');

      const blob = new Blob([`Name,Company,Email,Phone,Description,Status,Source,Flags,Products,Created\n${csvContent}`], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'price-books-export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [filteredPriceBooks, toast]);

  const handleImport = useCallback(async () => {
    // Create CSV content from existing products (for demo)
    const headers = [
      'Name', 'Company', 'Email', 'Phone', 'Status', 'Source', 'Flags',
      'Created', 'Description', 'Price Book Owner', 'Products'
    ];

    const csvRows = [
      headers.join(','),
      ...priceBooks.map(book => [
        `"${book.name || ''}"`,
        `"${book.company || ''}"`,
        `"${book.email || ''}"`,
        `"${book.phone || ''}"`,
        `"${book.status || ''}"`,
        `"${book.source || ''}"`,
        `"${book.flags || ''}"`,
        `"${book.created || ''}"`,
        `"${book.description || ''}"`,
        `"${book.priceBookOwner || 'DEVASHREE SALUNKE'}"`,
        `"${book.products || 0}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `price-books-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Download Started",
      description: `Downloading ${priceBooks.length} price books as CSV`
    });
  }, [priceBooks, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading price books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Price Books</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage pricing strategies for different customer segments</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleImport}
            className="flex items-center"
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Export
          </Button>
          <Button
            onClick={handleCreatePriceBook}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Price Book
          </Button>
        </div>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <PriceBooksViewFilters
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products by name, SKU, company, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Advanced Filters - Similar to image */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Retail">Retail</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Education">Education</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source
                  </label>
                  <div className="relative">
                    <select
                      value={filters.source}
                      onChange={(e) => handleFilterChange('source', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All Sources">All Sources</option>
                      <option value="Website">Website</option>
                      <option value="Partner">Partner</option>
                      <option value="Direct">Direct</option>
                      <option value="API">API</option>
                      <option value="Import">Import</option>
                    </select>
                  </div>
                </div>

                {/* Flags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Flags
                  </label>
                  <div className="relative">
                    <select
                      value={filters.flags}
                      onChange={(e) => handleFilterChange('flags', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All Flags">All Flags</option>
                      <option value="Default">Default</option>
                      <option value="Premium">Premium</option>
                      <option value="Standard">Standard</option>
                      <option value="Custom">Custom</option>
                      <option value="Legacy">Legacy</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {hasActiveFilters() ? (
                    <span>Filters applied: {Object.values(filters).filter(val => val && val !== 'All' && val !== 'All Categories' && val !== 'All Sources' && val !== 'All Flags').length}</span>
                  ) : (
                    <span>No filters applied</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* <Button
                    variant="outline"
                    onClick={clearFilters}
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={!hasActiveFilters()}
                  >
                    <X className="w-3 h-3" />
                    Clear Filters
                  </Button> */}
                  <Button
                    onClick={() => setShowFilters(false)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status !== 'All' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', 'All')}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.category !== 'All Categories' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', 'All Categories')}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.source !== 'All Sources' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                Source: {filters.source}
                <button
                  onClick={() => handleFilterChange('source', 'All Sources')}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.flags !== 'All Flags' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                Flags: {filters.flags}
                <button
                  onClick={() => handleFilterChange('flags', 'All Flags')}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {searchTerm && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedPriceBooks.length > 0 && (
        <PriceBooksBulkActions
          selectedPriceBooks={selectedPriceBooks}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onExport={handleExport}
        />
      )}

      {/* Price Books Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <PriceBooksTable
          priceBooks={filteredPriceBooks}
          selectedPriceBooks={selectedPriceBooks}
          onPriceBookSelect={setSelectedPriceBooks}
          onPriceBookEdit={handleEditPriceBook}
          onPriceBookDelete={handleDeletePriceBook}
          onPriceBookView={handleViewPriceBook}
          getStatusColor={getStatusColor}
          loading={loading}
        />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {filteredPriceBooks.length} of {priceBooks.length} price books
          {selectedPriceBooks.length > 0 && ` • ${selectedPriceBooks.length} selected`}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Inactive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreatePriceBookDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPriceBookCreated={handlePriceBookCreated}
      />

      <ViewPriceBookDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        priceBook={selectedPriceBook}
      />

      <EditPriceBookDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPriceBookUpdated={handlePriceBookUpdated}
        initialData={selectedPriceBook}
      />
    </div>
  );
};

export default PriceBooksPageContent;