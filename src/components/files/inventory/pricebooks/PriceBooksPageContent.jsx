// src/components/files/inventory/pricebooks/PriceBooksPageContent.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import PriceBooksTable from '@/components/files/inventory/pricebooks/PriceBooksTable';
import PriceBooksFilters from '@/components/files/inventory/pricebooks/PriceBooksFilters';
import PriceBooksViewFilters from '@/components/files/inventory/pricebooks/PriceBooksViewFilters';
import PriceBooksBulkActions from '@/components/files/inventory/pricebooks/PriceBooksBulkActions';
import CreatePriceBookDialog from '@/components/files/inventory/pricebooks/CreatePriceBookDialog';
import ViewPriceBookDialog from '@/components/files/inventory/pricebooks/ViewPriceBookDialog';
import EditPriceBookDialog from '@/components/files/inventory/pricebooks/EditPriceBookDialog';
import { useData, useToast } from '@/hooks';

const PriceBooksPageContent = () => {
  const { data, updateData } = useData();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceBooks, setSelectedPriceBooks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    status: '', 
    source: '', 
    flags: '',
    dateRange: '' 
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPriceBook, setSelectedPriceBook] = useState(null);

  // Mock data - in real app, this would come from your data context
  const priceBooks = data.priceBooks || [
    { 
      id: '1', 
      name: 'Standard Price Book', 
      company: 'Tech Corp',
      email: 'sarah@techcorp.com',
      phone: '+1 234 567 8900',
      description: 'Default pricing for all products', 
      products: 45, 
      status: 'Active',
      source: 'Website',
      flags: 'Default',
      created: '2024-01-15',
      active: true 
    },
    { 
      id: '2', 
      name: 'Enterprise Pricing', 
      company: 'Innovation Labs',
      email: 'michael@innovationlabs.com',
      phone: '+1 234 567 8901',
      description: 'Corporate client pricing', 
      products: 32, 
      status: 'Active',
      source: 'Partner',
      flags: 'Premium',
      created: '2024-01-10',
      active: true 
    },
    { 
      id: '3', 
      name: 'Retail Pricing', 
      company: 'Growth Solutions',
      email: 'emily@growthsolutions.com',
      phone: '+1 234 567 8902',
      description: 'Retail customer pricing', 
      products: 28, 
      status: 'Inactive',
      source: 'Direct',
      flags: 'Standard',
      created: '2024-01-05',
      active: false 
    },
    { 
      id: '4', 
      name: 'Wholesale 2024', 
      company: 'Data Systems Inc',
      email: 'john@datasystems.com',
      phone: '+1 234 567 8903',
      description: 'Wholesale distributor pricing', 
      products: 56, 
      status: 'Active',
      source: 'Reseller',
      flags: 'Volume',
      created: '2024-01-12',
      active: true 
    },
    { 
      id: '5', 
      name: 'Educational Pricing', 
      company: 'Education First',
      email: 'lisa@edu-first.com',
      phone: '+1 234 567 8904',
      description: 'Educational institution pricing', 
      products: 23, 
      status: 'Active',
      source: 'Direct',
      flags: 'Special',
      created: '2024-01-08',
      active: true 
    },
    { 
      id: '6', 
      name: 'Government Pricing', 
      company: 'Public Sector Inc',
      email: 'robert@publicsector.com',
      phone: '+1 234 567 8905',
      description: 'Government contract pricing', 
      products: 18, 
      status: 'Pending',
      source: 'Government',
      flags: 'Restricted',
      created: '2024-01-03',
      active: false 
    }
  ];

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
    if (filters.status) {
      filtered = filtered.filter(book => book.status === filters.status);
    }
    if (filters.source) {
      filtered = filtered.filter(book => book.source === filters.source);
    }
    if (filters.flags) {
      filtered = filtered.filter(book => book.flags === filters.flags);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(book => {
        if (!book) return false;
        return (
          (book.name && book.name.toLowerCase().includes(searchLower)) ||
          (book.company && book.company.toLowerCase().includes(searchLower)) ||
          (book.description && book.description.toLowerCase().includes(searchLower)) ||
          (book.email && book.email.toLowerCase().includes(searchLower)) ||
          (book.flags && book.flags.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [priceBooks, currentView, filters, searchTerm]);

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

  const handleDeletePriceBook = useCallback((priceBook) => {
    if (window.confirm(`Delete price book "${priceBook.name}"?`)) {
      const updatedPriceBooks = priceBooks.filter(p => p.id !== priceBook.id);
      updateData("priceBooks", updatedPriceBooks);
      toast({ 
        title: "Price Book Deleted", 
        description: `${priceBook.name} has been deleted.` 
      });
    }
  }, [priceBooks, updateData, toast]);

  const handlePriceBookCreated = useCallback((newPriceBook) => {
    const updatedPriceBooks = [...priceBooks, newPriceBook];
    updateData("priceBooks", updatedPriceBooks);
    setCreateDialogOpen(false);
    toast({
      title: "Price Book Created",
      description: `${newPriceBook.name} has been created successfully.`
    });
  }, [priceBooks, updateData, toast]);

  const handlePriceBookUpdated = useCallback((updatedPriceBook) => {
    const updatedPriceBooks = priceBooks.map(p => 
      p.id === updatedPriceBook.id ? updatedPriceBook : p
    );
    updateData("priceBooks", updatedPriceBooks);
    setEditDialogOpen(false);
    setSelectedPriceBook(null);
    toast({
      title: "Price Book Updated",
      description: `${updatedPriceBook.name} has been updated successfully.`
    });
  }, [priceBooks, updateData, toast]);

  const handleBulkDelete = useCallback(() => {
    if (selectedPriceBooks.length === 0) {
      toast({
        title: "No selection",
        description: "Please select price books to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Delete ${selectedPriceBooks.length} price books?`)) {
      const updatedPriceBooks = priceBooks.filter(p => !selectedPriceBooks.includes(p.id));
      updateData("priceBooks", updatedPriceBooks);
      setSelectedPriceBooks([]);
      
      toast({
        title: "Bulk Delete Successful",
        description: `${selectedPriceBooks.length} price books have been deleted.`
      });
    }
  }, [selectedPriceBooks, priceBooks, updateData, toast]);

  const handleBulkUpdate = useCallback((updates) => {
    const updatedPriceBooks = priceBooks.map(p => 
      selectedPriceBooks.includes(p.id) ? { ...p, ...updates } : p
    );
    updateData("priceBooks", updatedPriceBooks);
    setSelectedPriceBooks([]);
    toast({
      title: "Bulk Update Successful",
      description: `${selectedPriceBooks.length} price books have been updated.`
    });
  }, [selectedPriceBooks, priceBooks, updateData, toast]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  }, []);

  const handleExport = useCallback(() => {
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
    
    toast({
      title: "Export Completed",
      description: `${filteredPriceBooks.length} price books exported successfully.`
    });
  }, [filteredPriceBooks, toast]);

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
              placeholder="Search price books by name, company, email..." 
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
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <PriceBooksFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
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