// src/components/files/inventory/purchaseorders/PurchaseOrdersPageContent.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks';
import { usePOStorage } from '@/hooks/usePOStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Plus, Search, Filter, Download, MoreVertical, Eye, Edit, Trash2,
  ChevronDown, Upload, Copy, FileText, CheckCircle, XCircle, Clock,
  Package, Truck, DollarSign, Calendar, User, Building, FileCheck, AlertCircle,
  ArrowRight, FileSpreadsheet
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PurchaseOrdersPageContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPurchaseOrders, deletePurchaseOrder } = usePOStorage();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPOs, setSelectedPOs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    status: '', 
    vendor: '', 
    carrier: '',
    dateRange: ''
  });
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load purchase orders
  useEffect(() => {
    const loadPurchaseOrders = () => {
      const orders = getPurchaseOrders();
      setPurchaseOrders(orders || getDefaultPurchaseOrders());
      setLoading(false);
    };
    
    loadPurchaseOrders();
  }, [getPurchaseOrders]);

  const getDefaultPurchaseOrders = () => [
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      subject: 'Office Supplies Order',
      vendorName: 'Office Depot',
      status: 'Approved',
      poDate: '2024-01-15',
      dueDate: '2024-02-01',
      totals: {
        amount: 5000,
        discount: 500,
        tax: 810,
        total: 5310
      },
      items: [
        { productName: 'Printer Paper', quantity: 10, listPrice: 300, amount: 3000, discount: 10, tax: 486, total: 3486 },
        { productName: 'Pens', quantity: 50, listPrice: 20, amount: 1000, discount: 10, tax: 162, total: 1162 },
        { productName: 'Staplers', quantity: 5, listPrice: 200, amount: 1000, discount: 10, tax: 162, total: 1162 }
      ],
      poOwner: 'SANTHOSH KRISHNAMOORTHI',
      requisitionNumber: 'REQ-001',
      contactName: 'John Smith',
      trackingNumber: 'TRK-789456',
      carrier: 'FedEX',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      orderNumber: 'PO-2024-002',
      subject: 'IT Equipment Purchase',
      vendorName: 'Tech Corp',
      status: 'Sent',
      poDate: '2024-01-18',
      dueDate: '2024-02-15',
      totals: {
        amount: 15000,
        discount: 1500,
        tax: 2430,
        total: 15930
      },
      items: [
        { productName: 'Laptops', quantity: 5, listPrice: 2000, amount: 10000, discount: 10, tax: 1620, total: 11620 },
        { productName: 'Monitors', quantity: 5, listPrice: 1000, amount: 5000, discount: 10, tax: 810, total: 5810 }
      ],
      poOwner: 'SANTHOSH KRISHNAMOORTHI',
      requisitionNumber: 'REQ-002',
      contactName: 'Sarah Johnson',
      trackingNumber: 'TRK-123456',
      carrier: 'UPS',
      createdAt: '2024-01-18T14:45:00Z',
      updatedAt: '2024-01-18T14:45:00Z'
    },
    {
      id: '3',
      orderNumber: 'PO-2024-003',
      subject: 'Furniture Order',
      vendorName: 'Office Furniture Inc',
      status: 'Received',
      poDate: '2024-01-10',
      dueDate: '2024-01-25',
      totals: {
        amount: 30000,
        discount: 3000,
        tax: 4860,
        total: 31860
      },
      items: [
        { productName: 'Office Chairs', quantity: 10, listPrice: 1500, amount: 15000, discount: 10, tax: 2430, total: 17430 },
        { productName: 'Desks', quantity: 5, listPrice: 3000, amount: 15000, discount: 10, tax: 2430, total: 17430 }
      ],
      poOwner: 'SANTHOSH KRISHNAMOORTHI',
      requisitionNumber: 'REQ-003',
      contactName: 'Mike Wilson',
      trackingNumber: 'TRK-654321',
      carrier: 'DHL',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z'
    }
  ];

  // Filter logic
  const filteredPOs = useMemo(() => {
    let filtered = [...purchaseOrders];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'created':
        filtered = filtered.filter(po => po.status === 'Created');
        break;
      case 'approved':
        filtered = filtered.filter(po => po.status === 'Approved');
        break;
      case 'sent':
        filtered = filtered.filter(po => po.status === 'Sent');
        break;
      case 'received':
        filtered = filtered.filter(po => po.status === 'Received');
        break;
      case 'partial':
        filtered = filtered.filter(po => po.status === 'Partially Received');
        break;
      case 'overdue':
        filtered = filtered.filter(po => 
          po.dueDate && new Date(po.dueDate) < new Date() && 
          !['Received', 'Closed', 'Cancelled'].includes(po.status)
        );
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(po => 
          po.createdAt && new Date(po.createdAt) > oneWeekAgo
        );
        break;
      case 'high-value':
        filtered = filtered.filter(po => po.totals?.total > 10000);
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status) {
      filtered = filtered.filter(po => po.status === filters.status);
    }
    if (filters.vendor) {
      filtered = filtered.filter(po => po.vendorName?.toLowerCase().includes(filters.vendor.toLowerCase()));
    }
    if (filters.carrier) {
      filtered = filtered.filter(po => po.carrier === filters.carrier);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(po => {
        if (!po) return false;
        return (
          (po.subject && po.subject.toLowerCase().includes(searchLower)) ||
          (po.orderNumber && po.orderNumber.toLowerCase().includes(searchLower)) ||
          (po.vendorName && po.vendorName.toLowerCase().includes(searchLower)) ||
          (po.requisitionNumber && po.requisitionNumber.toLowerCase().includes(searchLower)) ||
          (po.contactName && po.contactName.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [purchaseOrders, currentView, filters, searchTerm]);

  // Event handlers
  const handleCreatePO = useCallback(() => {
    navigate('/create-purchase-order');
  }, [navigate]);

  const handleEditPO = useCallback((po) => {
    navigate(`/purchase-orders/edit/${po.id}`);
  }, [navigate]);

  const handleViewPO = useCallback((po) => {
    navigate(`/purchase-orders/view/${po.id}`);
  }, [navigate]);

  const handleDeletePO = useCallback((po) => {
    if (window.confirm(`Delete purchase order "${po.subject}"?`)) {
      deletePurchaseOrder(po.id);
      setPurchaseOrders(prev => prev.filter(p => p.id !== po.id));
      toast({ 
        title: "Purchase Order Deleted", 
        description: `${po.subject} has been deleted.` 
      });
    }
  }, [deletePurchaseOrder, toast]);

  const handleBulkDelete = useCallback(() => {
    if (selectedPOs.length === 0) {
      toast({
        title: "No selection",
        description: "Please select purchase orders to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Delete ${selectedPOs.length} purchase orders?`)) {
      selectedPOs.forEach(id => {
        deletePurchaseOrder(id);
      });
      setPurchaseOrders(prev => prev.filter(po => !selectedPOs.includes(po.id)));
      setSelectedPOs([]);
      
      toast({
        title: "Bulk Delete Successful",
        description: `${selectedPOs.length} purchase orders have been deleted.`
      });
    }
  }, [selectedPOs, deletePurchaseOrder, toast]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Created": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Sent": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Received": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Partially Received": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Closed": return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = filteredPOs.map(po => {
      return `"${po.subject || ''}","${po.orderNumber || ''}","${po.vendorName || ''}","${po.status || ''}","${po.poDate || ''}","${po.dueDate || ''}","${po.totals?.total || 0}"`;
    }).join('\n');
    
    const blob = new Blob([`Subject,PO Number,Vendor,Status,PO Date,Due Date,Total\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase-orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Completed",
      description: `${filteredPOs.length} purchase orders exported successfully.`
    });
  }, [filteredPOs, toast]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPOs(filteredPOs.map(po => po.id));
    } else {
      setSelectedPOs([]);
    }
  };

  const handleSelectPO = (poId, checked) => {
    if (checked) {
      setSelectedPOs([...selectedPOs, poId]);
    } else {
      setSelectedPOs(selectedPOs.filter(id => id !== poId));
    }
  };

  const handleDuplicatePO = (po) => {
    const duplicated = {
      ...po,
      id: Date.now().toString(),
      orderNumber: `PO-${Date.now().toString().slice(-6)}`,
      subject: `${po.subject} (Copy)`,
      status: 'Created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const { savePurchaseOrder } = usePOStorage();
    savePurchaseOrder(duplicated);
    setPurchaseOrders(prev => [...prev, duplicated]);
    
    toast({
      title: "Purchase Order Duplicated",
      description: `${duplicated.subject} has been created.`
    });
  };

  // View filter options
  const viewOptions = [
    { id: 'all', label: 'All Purchase Orders', icon: FileText },
    { id: 'created', label: 'Created', icon: FileText },
    { id: 'approved', label: 'Approved', icon: CheckCircle },
    { id: 'sent', label: 'Sent', icon: Truck },
    { id: 'received', label: 'Received', icon: Package },
    { id: 'partial', label: 'Partially Received', icon: AlertCircle },
    { id: 'overdue', label: 'Overdue', icon: Clock },
    { id: 'recent', label: 'Recently Added', icon: Calendar },
    { id: 'high-value', label: 'High Value (>10k)', icon: DollarSign },
  ];

  // Filter component
  const FiltersComponent = () => (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Created">Created</option>
            <option value="Approved">Approved</option>
            <option value="Sent">Sent</option>
            <option value="Received">Received</option>
            <option value="Partially Received">Partially Received</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Vendor</label>
          <Input 
            placeholder="Search vendor..."
            value={filters.vendor}
            onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value }))}
          />
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
            <option value="BlueDart">BlueDart</option>
            <option value="DTDC">DTDC</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilters({ status: '', vendor: '', carrier: '', dateRange: '' })}
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
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium text-blue-900">
            {selectedPOs.length} purchase order{selectedPOs.length !== 1 ? 's' : ''} selected
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
            Export Selected
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );

  // Information Banner
  const InfoBanner = () => (
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
          <button 
            onClick={() => toast({
              title: "Documentation",
              description: "Purchase order documentation will open in a new window."
            })}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            Learn more about Purchase Orders
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ml-6">
          <FileSpreadsheet className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Purchase Orders - CloudCRM</title>
        <meta name="description" content="Manage your purchase orders" />
      </Helmet>
      
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
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => toast({
                    title: "Import",
                    description: "Import functionality coming soon!"
                  })}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button 
                  onClick={handleCreatePO} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Purchase Order
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Information Banner */}
            <InfoBanner />

            {/* View Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {viewOptions.map((view) => {
                    const Icon = view.icon || FileText;
                    return (
                      <Button
                        key={view.id}
                        variant={currentView === view.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentView(view.id)}
                        className={`flex items-center ${currentView === view.id ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {view.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters Section */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      placeholder="Search purchase orders by subject, PO number, vendor..." 
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
                        <DropdownMenuItem onClick={() => toast({
                          title: "Report",
                          description: "Report generation coming soon!"
                        })}>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSearchTerm('');
                          setFilters({ status: '', vendor: '', carrier: '', dateRange: '' });
                          setCurrentView('all');
                          toast({
                            title: "Refreshed",
                            description: "Purchase orders list refreshed."
                          });
                        }}>
                          Refresh Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Advanced Filters */}
                {showFilters && <FiltersComponent />}
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedPOs.length > 0 && <BulkActionsComponent />}

            {/* Purchase Orders Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedPOs.length === filteredPOs.length && filteredPOs.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">PO Number</TableHead>
                        <TableHead className="font-semibold">Subject</TableHead>
                        <TableHead className="font-semibold">Vendor</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">PO Date</TableHead>
                        <TableHead className="font-semibold">Due Date</TableHead>
                        <TableHead className="font-semibold">Total Amount</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPOs.length > 0 ? (
                        filteredPOs.map((po) => (
                          <TableRow key={po.id} className="hover:bg-gray-50">
                            <TableCell>
                              <Checkbox 
                                checked={selectedPOs.includes(po.id)}
                                onCheckedChange={(checked) => handleSelectPO(po.id, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">
                                {po.orderNumber}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div 
                                className="font-medium text-foreground cursor-pointer hover:text-blue-600"
                                onClick={() => handleViewPO(po)}
                              >
                                {po.subject}
                                {po.requisitionNumber && (
                                  <div className="text-sm text-muted-foreground">
                                    Req: {po.requisitionNumber}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>{po.vendorName}</div>
                              {po.contactName && (
                                <div className="text-sm text-muted-foreground">
                                  {po.contactName}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(po.status)} capitalize`}>
                                {po.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {new Date(po.poDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm ${new Date(po.dueDate) < new Date() && !['Received', 'Closed', 'Cancelled'].includes(po.status) ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                {new Date(po.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-green-600">
                                Rs. {(po.totals?.total || 0).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewPO(po)}
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditPO(po)}
                                  className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeletePO(po)}
                                  className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 hover:bg-gray-100"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => handleViewPO(po)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditPO(po)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicatePO(po)}>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeletePO(po)}
                                      className="text-red-600 focus:text-red-600"
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
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center">
                              <Search className="h-16 w-16 text-gray-300 mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm || filters.status || filters.vendor || filters.carrier 
                                  ? "No matching purchase orders found" 
                                  : "No purchase orders yet"}
                              </h3>
                              <p className="text-gray-600 mb-6 max-w-md text-center">
                                {searchTerm || filters.status || filters.vendor || filters.carrier
                                  ? "Try adjusting your search or filters to find what you're looking for."
                                  : "Get started by creating your first purchase order to manage your procurement process."}
                              </p>
                              {(!searchTerm && !filters.status && !filters.vendor && !filters.carrier) && (
                                <Button 
                                  onClick={handleCreatePO} 
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Your First Purchase Order
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
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground mt-6 pt-6 border-t border-gray-200">
              <div className="mb-4 sm:mb-0">
                Showing <span className="font-semibold">{filteredPOs.length}</span> of{' '}
                <span className="font-semibold">{purchaseOrders.length}</span> purchase orders
                {selectedPOs.length > 0 && (
                  <span className="ml-2">
                    • <span className="font-semibold text-blue-600">{selectedPOs.length}</span> selected
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Sent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrdersPageContent;