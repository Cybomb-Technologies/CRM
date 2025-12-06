import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download, FileText, Printer, Mail, Copy, CheckCircle, XCircle, Clock, Package, Truck, DollarSign } from 'lucide-react';
import CreateSalesOrderDialog from '@/components/files/inventory/salesorders/CreateSalesOrderDialog';
import ViewSalesOrderDialog from '@/components/files/inventory/salesorders/ViewSalesOrderDialog';
import EditSalesOrderDialog from '@/components/files/inventory/salesorders/EditSalesOrderDialog';
import SalesOrdersTable from '@/components/files/inventory/salesorders/SalesOrdersTable';
import SalesOrdersFilters from '@/components/files/inventory/salesorders/SalesOrdersFilters';
import SalesOrdersViewFilters from '@/components/files/inventory/salesorders/SalesOrdersViewFilters';
import SalesOrdersBulkActions from '@/components/files/inventory/salesorders/SalesOrdersBulkActions';
import { useToast } from '@/components/ui/use-toast';

// Mock data - Replace with actual API calls
const mockSalesOrders = [
  {
    id: 'SO-1001',
    orderNumber: 'SO-1001',
    orderDate: '2024-01-15',
    dueDate: '2024-02-15',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    customerEmail: 'purchase@acme.com',
    customerPhone: '+1 (555) 123-4567',
    status: 'Approved',
    paymentStatus: 'Paid',
    orderType: 'Standard',
    salesPersonId: 'SP-001',
    salesPersonName: 'John Smith',
    poNumber: 'PO-ACME-2024-001',
    shippingAddress: '123 Main St, New York, NY 10001',
    billingAddress: '123 Main St, New York, NY 10001',
    shippingMethod: 'FedEx Ground',
    notes: 'Priority shipping requested',
    subtotal: 4500.00,
    tax: 360.00,
    shippingCost: 120.00,
    discount: 200.00,
    totalAmount: 4780.00,
    currency: 'USD',
    lineItems: [
      { id: 1, productId: 'P-001', productName: 'Laptop Pro', quantity: 5, unitPrice: 800.00, total: 4000.00 },
      { id: 2, productId: 'P-002', productName: 'Wireless Mouse', quantity: 10, unitPrice: 50.00, total: 500.00 }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    isUrgent: true,
    tags: ['corporate', 'repeat-customer']
  },
  {
    id: 'SO-1002',
    orderNumber: 'SO-1002',
    orderDate: '2024-01-16',
    dueDate: '2024-01-30',
    customerId: 'CUST-002',
    customerName: 'Tech Solutions Inc.',
    customerEmail: 'orders@techsolutions.com',
    customerPhone: '+1 (555) 987-6543',
    status: 'In Progress',
    paymentStatus: 'Partial',
    orderType: 'Express',
    salesPersonId: 'SP-002',
    salesPersonName: 'Sarah Johnson',
    poNumber: 'PO-TECH-2024-015',
    shippingAddress: '456 Tech Ave, San Francisco, CA 94107',
    billingAddress: '456 Tech Ave, San Francisco, CA 94107',
    shippingMethod: 'UPS Next Day Air',
    notes: 'Fragile items - handle with care',
    subtotal: 3200.00,
    tax: 256.00,
    shippingCost: 85.00,
    discount: 150.00,
    totalAmount: 3391.00,
    currency: 'USD',
    lineItems: [
      { id: 1, productId: 'P-003', productName: 'Server Rack', quantity: 2, unitPrice: 1500.00, total: 3000.00 },
      { id: 2, productId: 'P-004', productName: 'Network Switch', quantity: 1, unitPrice: 200.00, total: 200.00 }
    ],
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    isUrgent: false,
    tags: ['enterprise', 'new-customer']
  },
  {
    id: 'SO-1003',
    orderNumber: 'SO-1003',
    orderDate: '2024-01-14',
    dueDate: '2024-01-20',
    customerId: 'CUST-003',
    customerName: 'Global Retail Ltd',
    customerEmail: 'procurement@globalretail.com',
    customerPhone: '+1 (555) 456-7890',
    status: 'Shipped',
    paymentStatus: 'Pending',
    orderType: 'Standard',
    salesPersonId: 'SP-001',
    salesPersonName: 'John Smith',
    poNumber: 'PO-GLOBAL-2024-008',
    shippingAddress: '789 Market St, Chicago, IL 60606',
    billingAddress: '789 Market St, Chicago, IL 60606',
    shippingMethod: 'FedEx 2Day',
    notes: 'Customer requested signature on delivery',
    subtotal: 12500.00,
    tax: 1000.00,
    shippingCost: 250.00,
    discount: 500.00,
    totalAmount: 13250.00,
    currency: 'USD',
    lineItems: [
      { id: 1, productId: 'P-005', productName: 'POS System', quantity: 25, unitPrice: 500.00, total: 12500.00 }
    ],
    createdAt: '2024-01-14T14:45:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    isUrgent: false,
    tags: ['retail', 'bulk-order']
  },
  {
    id: 'SO-1004',
    orderNumber: 'SO-1004',
    orderDate: '2024-01-10',
    dueDate: '2024-01-25',
    customerId: 'CUST-004',
    customerName: 'Startup Innovations',
    customerEmail: 'billing@startupinnovations.com',
    customerPhone: '+1 (555) 234-5678',
    status: 'Draft',
    paymentStatus: 'Unpaid',
    orderType: 'Custom',
    salesPersonId: 'SP-003',
    salesPersonName: 'Mike Chen',
    poNumber: 'PO-STARTUP-2024-003',
    shippingAddress: '101 Innovation Dr, Austin, TX 73301',
    billingAddress: '101 Innovation Dr, Austin, TX 73301',
    shippingMethod: 'USPS Priority',
    notes: 'Quote #QT-2024-0015',
    subtotal: 1800.00,
    tax: 144.00,
    shippingCost: 45.00,
    discount: 0.00,
    totalAmount: 1989.00,
    currency: 'USD',
    lineItems: [
      { id: 1, productId: 'P-006', productName: 'Software License', quantity: 3, unitPrice: 600.00, total: 1800.00 }
    ],
    createdAt: '2024-01-10T16:20:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    isUrgent: true,
    tags: ['startup', 'saas']
  },
  {
    id: 'SO-1005',
    orderNumber: 'SO-1005',
    orderDate: '2024-01-05',
    dueDate: '2024-01-10',
    customerId: 'CUST-005',
    customerName: 'Manufacturing Co',
    customerEmail: 'accounts@manufacturingco.com',
    customerPhone: '+1 (555) 876-5432',
    status: 'Completed',
    paymentStatus: 'Paid',
    orderType: 'Standard',
    salesPersonId: 'SP-002',
    salesPersonName: 'Sarah Johnson',
    poNumber: 'PO-MFG-2024-022',
    shippingAddress: '555 Industrial Way, Detroit, MI 48201',
    billingAddress: '555 Industrial Way, Detroit, MI 48201',
    shippingMethod: 'LTL Freight',
    notes: 'Palletized shipment',
    subtotal: 8500.00,
    tax: 680.00,
    shippingCost: 320.00,
    discount: 300.00,
    totalAmount: 9200.00,
    currency: 'USD',
    lineItems: [
      { id: 1, productId: 'P-007', productName: 'Industrial Printer', quantity: 4, unitPrice: 2000.00, total: 8000.00 },
      { id: 2, productId: 'P-008', productName: 'Replacement Parts', quantity: 10, unitPrice: 50.00, total: 500.00 }
    ],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-11T15:45:00Z',
    isUrgent: false,
    tags: ['manufacturing', 'equipment']
  }
];

const SalesOrdersPageContent = () => {
  const { toast } = useToast();
  
  // State management
  const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);
  const [selectedSalesOrders, setSelectedSalesOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    status: '', 
    customer: '', 
    salesPerson: '',
    dateRange: '',
    paymentStatus: '',
    orderType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Simulate API call
  const fetchSalesOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real app: const response = await fetch('/api/sales-orders');
      // setSalesOrders(await response.json());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales orders",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { 
    fetchSalesOrders(); 
  }, [fetchSalesOrders]);

  // Filter logic
  const filteredSalesOrders = useMemo(() => {
    if (!salesOrders || !Array.isArray(salesOrders)) return [];
    
    let filtered = [...salesOrders];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'draft':
        filtered = filtered.filter(order => order.status === 'Draft');
        break;
      case 'pending-approval':
        filtered = filtered.filter(order => order.status === 'Pending Approval');
        break;
      case 'approved':
        filtered = filtered.filter(order => order.status === 'Approved');
        break;
      case 'in-progress':
        filtered = filtered.filter(order => order.status === 'In Progress');
        break;
      case 'shipped':
        filtered = filtered.filter(order => order.status === 'Shipped');
        break;
      case 'completed':
        filtered = filtered.filter(order => order.status === 'Completed');
        break;
      case 'cancelled':
        filtered = filtered.filter(order => order.status === 'Cancelled');
        break;
      case 'on-hold':
        filtered = filtered.filter(order => order.status === 'On Hold');
        break;
      case 'overdue':
        const today = new Date();
        filtered = filtered.filter(order => {
          if (!order.dueDate) return false;
          const dueDate = new Date(order.dueDate);
          return dueDate < today && 
                 !['Completed', 'Cancelled', 'Shipped'].includes(order.status);
        });
        break;
      case 'urgent':
        filtered = filtered.filter(order => order.isUrgent);
        break;
      case 'high-value':
        filtered = filtered.filter(order => order.totalAmount && order.totalAmount > 5000);
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(order => 
          order.createdAt && new Date(order.createdAt) > oneWeekAgo
        );
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }
    if (filters.paymentStatus) {
      filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
    }
    if (filters.orderType) {
      filtered = filtered.filter(order => order.orderType === filters.orderType);
    }
    if (filters.dateRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(order => 
            order.orderDate && new Date(order.orderDate) >= startDate
          );
          break;
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
          filtered = filtered.filter(order => {
            const orderDate = order.orderDate && new Date(order.orderDate);
            return orderDate && orderDate >= startDate && orderDate < endDate;
          });
          break;
        case 'this-week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => 
            order.orderDate && new Date(order.orderDate) >= startDate
          );
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(order => 
            order.orderDate && new Date(order.orderDate) >= startDate
          );
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          filtered = filtered.filter(order => {
            const orderDate = order.orderDate && new Date(order.orderDate);
            return orderDate && orderDate >= startDate && orderDate <= monthEnd;
          });
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        if (!order) return false;
        return (
          (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
          (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower)) ||
          (order.poNumber && order.poNumber.toLowerCase().includes(searchLower)) ||
          (order.salesPersonName && order.salesPersonName.toLowerCase().includes(searchLower)) ||
          (order.tags && order.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    return filtered;
  }, [salesOrders, currentView, filters, searchTerm]);

  // Event handlers
  const handleSalesOrderCreated = useCallback((newSalesOrder) => {
    // Generate new order number
    const lastOrderNum = Math.max(...salesOrders.map(o => parseInt(o.orderNumber.split('-')[1]) || 0));
    const newOrder = {
      ...newSalesOrder,
      id: `SO-${lastOrderNum + 1}`,
      orderNumber: `SO-${lastOrderNum + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSalesOrders(prev => [newOrder, ...prev]);
    toast({ 
      title: "Sales Order Created", 
      description: `Sales Order ${newOrder.orderNumber} has been created successfully.` 
    });
    setCreateDialogOpen(false);
  }, [salesOrders, toast]);

  const handleSalesOrderUpdated = useCallback((updatedSalesOrder) => {
    setSalesOrders(prev => 
      prev.map(order => 
        order.id === updatedSalesOrder.id 
          ? { ...updatedSalesOrder, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast({ 
      title: "Sales Order Updated", 
      description: `Sales Order ${updatedSalesOrder.orderNumber} has been updated successfully.` 
    });
    setEditDialogOpen(false);
    setSelectedSalesOrder(null);
  }, [toast]);

  const handleSalesOrderEdit = useCallback((salesOrder) => { 
    setSelectedSalesOrder(salesOrder); 
    setEditDialogOpen(true); 
  }, []);

  const handleSalesOrderDelete = useCallback((salesOrder) => {
    if (window.confirm(`Delete Sales Order ${salesOrder.orderNumber}? This action cannot be undone.`)) {
      setSalesOrders(prev => prev.filter(order => order.id !== salesOrder.id));
      setSelectedSalesOrders(prev => prev.filter(id => id !== salesOrder.id));
      toast({ 
        title: "Sales Order Deleted", 
        description: `Sales Order ${salesOrder.orderNumber} has been deleted.`,
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleViewSalesOrder = useCallback((salesOrder) => { 
    setSelectedSalesOrder(salesOrder); 
    setViewDialogOpen(true); 
  }, []);

  const handleGeneratePDF = useCallback((salesOrder) => {
    // Simulate PDF generation
    console.log('Generating PDF for sales order:', salesOrder.id);
    toast({
      title: "PDF Generated",
      description: `PDF for Sales Order ${salesOrder.orderNumber} has been generated.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => window.open(`/sales-orders/${salesOrder.id}/pdf`, '_blank')}>
          Download
        </Button>
      )
    });
  }, [toast]);

  const handleUpdateStatus = useCallback((salesOrder, newStatus) => {
    setSalesOrders(prev => 
      prev.map(order => 
        order.id === salesOrder.id 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast({
      title: "Status Updated",
      description: `Sales Order ${salesOrder.orderNumber} status changed to ${newStatus}.`
    });
  }, [toast]);

  const handleCreateInvoice = useCallback((salesOrder) => {
    toast({
      title: "Invoice Created",
      description: `Invoice #INV-${salesOrder.orderNumber.split('-')[1]} created from Sales Order.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => window.open(`/invoices/create?so=${salesOrder.id}`, '_blank')}>
          View Invoice
        </Button>
      )
    });
  }, [toast]);

  const handleDuplicateOrder = useCallback((salesOrder) => {
    const lastOrderNum = Math.max(...salesOrders.map(o => parseInt(o.orderNumber.split('-')[1]) || 0));
    const duplicatedOrder = {
      ...salesOrder,
      id: `SO-${lastOrderNum + 1}`,
      orderNumber: `SO-${lastOrderNum + 1}`,
      status: 'Draft',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUrgent: false
    };
    
    setSalesOrders(prev => [duplicatedOrder, ...prev]);
    toast({
      title: "Order Duplicated",
      description: `Sales Order ${duplicatedOrder.orderNumber} created from ${salesOrder.orderNumber}.`
    });
  }, [salesOrders, toast]);

  const handleSendEmail = useCallback((salesOrder) => {
    toast({
      title: "Email Sent",
      description: `Sales Order ${salesOrder.orderNumber} sent to ${salesOrder.customerEmail}.`
    });
  }, [toast]);

  // Bulk action handlers
  const handleBulkUpdate = useCallback((salesOrderIds, updates) => {
    setSalesOrders(prev => 
      prev.map(order => 
        salesOrderIds.includes(order.id) 
          ? { ...order, ...updates, updatedAt: new Date().toISOString() }
          : order
      )
    );
    setSelectedSalesOrders([]);
    toast({
      title: "Success",
      description: `${salesOrderIds.length} sales orders updated successfully.`
    });
  }, [toast]);

  const handleBulkDelete = useCallback((salesOrderIds) => {
    if (confirm(`Are you sure you want to delete ${salesOrderIds.length} sales orders? This action cannot be undone.`)) {
      setSalesOrders(prev => prev.filter(order => !salesOrderIds.includes(order.id)));
      setSelectedSalesOrders([]);
      toast({
        title: "Success",
        description: `${salesOrderIds.length} sales orders deleted successfully.`,
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleBulkStatusUpdate = useCallback((salesOrderIds, newStatus) => {
    handleBulkUpdate(salesOrderIds, { status: newStatus });
  }, [handleBulkUpdate]);

  const handleBulkGeneratePDF = useCallback((salesOrderIds) => {
    // Simulate bulk PDF generation
    console.log('Generating PDFs for:', salesOrderIds);
    toast({
      title: "Bulk PDF Generation",
      description: `PDFs generated for ${salesOrderIds.length} sales orders. Starting download...`,
      action: (
        <Button variant="outline" size="sm" onClick={() => {
          // Create a zip file of all PDFs
          console.log('Creating zip file...');
        }}>
          Download All
        </Button>
      )
    });
  }, [toast]);

  const handleBulkCreateInvoices = useCallback((salesOrderIds) => {
    toast({
      title: "Bulk Invoice Creation",
      description: `Invoices created for ${salesOrderIds.length} sales orders.`
    });
  }, [toast]);

  const handleExport = useCallback((salesOrderIds) => {
    const ordersToExport = salesOrderIds.length > 0 
      ? salesOrders.filter(order => salesOrderIds.includes(order.id))
      : filteredSalesOrders;
    
    const csvContent = ordersToExport.map(order => {
      return `"${order.orderNumber || ''}","${order.customerName || ''}","${order.orderDate || ''}","${order.dueDate || ''}","${order.status || ''}","${order.totalAmount || ''}","${order.paymentStatus || ''}","${order.salesPersonName || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`Order Number,Customer,Order Date,Due Date,Status,Total Amount,Payment Status,Sales Person\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Completed",
      description: `${ordersToExport.length} sales orders exported successfully.`
    });
  }, [salesOrders, filteredSalesOrders, toast]);

  const handlePrintLabels = useCallback((salesOrderIds) => {
    toast({
      title: "Print Labels",
      description: `Shipping labels prepared for ${salesOrderIds.length} sales orders. Opening print dialog...`
    });
    // Simulate print dialog
    setTimeout(() => window.print(), 1000);
  }, [toast]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }, []);

  // Get status color
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'In Progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Shipped': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'On Hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }, []);

  // Get payment status color
  const getPaymentStatusColor = useCallback((status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Unpaid': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }, []);

  // Calculate totals
  const calculateTotals = useMemo(() => {
    const totals = {
      count: filteredSalesOrders.length,
      totalAmount: 0,
      averageAmount: 0,
      pendingAmount: 0,
      overdueCount: 0
    };

    const today = new Date();
    filteredSalesOrders.forEach(order => {
      totals.totalAmount += order.totalAmount || 0;
      
      if (order.paymentStatus === 'Pending' || order.paymentStatus === 'Partial') {
        totals.pendingAmount += order.totalAmount || 0;
      }
      
      if (order.dueDate && new Date(order.dueDate) < today && 
          !['Completed', 'Cancelled', 'Shipped'].includes(order.status)) {
        totals.overdueCount++;
      }
    });

    totals.averageAmount = totals.count > 0 ? totals.totalAmount / totals.count : 0;

    return totals;
  }, [filteredSalesOrders]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={() => handleExport([])}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export All
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Order
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateTotals.count}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(calculateTotals.totalAmount)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Avg: {formatCurrency(calculateTotals.averageAmount)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payment</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(calculateTotals.pendingAmount)}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Waiting for payment</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Orders</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{calculateTotals.overdueCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Require attention</p>
        </div>
      </div>

      {/* View Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <SalesOrdersViewFilters 
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
              placeholder="Search by order number, customer, PO number, or tags..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilters({});
              setCurrentView('all');
            }} 
            className="flex items-center gap-2"
          >
            Clear All
          </Button>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <SalesOrdersFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedSalesOrders.length > 0 && (
        <SalesOrdersBulkActions
          selectedSalesOrders={selectedSalesOrders}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onBulkGeneratePDF={handleBulkGeneratePDF}
          onBulkCreateInvoices={handleBulkCreateInvoices}
          onExport={handleExport}
          onPrintLabels={handlePrintLabels}
        />
      )}

      {/* Sales Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SalesOrdersTable 
          salesOrders={filteredSalesOrders} 
          loading={loading} 
          selectedSalesOrders={selectedSalesOrders}
          onSalesOrderSelect={setSelectedSalesOrders}
          onSalesOrderEdit={handleSalesOrderEdit} 
          onSalesOrderDelete={handleSalesOrderDelete} 
          onSalesOrderView={handleViewSalesOrder}
          onGeneratePDF={handleGeneratePDF}
          onUpdateStatus={handleUpdateStatus}
          onCreateInvoice={handleCreateInvoice}
          onDuplicateOrder={handleDuplicateOrder}
          onSendEmail={handleSendEmail}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
          getPaymentStatusColor={getPaymentStatusColor}
        />
      </div>

      {/* No Results */}
      {!loading && filteredSalesOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales orders found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || Object.values(filters).some(f => f) 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first sales order'}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Sales Order
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateSalesOrderDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSalesOrderCreated={handleSalesOrderCreated} 
      />
      
      <ViewSalesOrderDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
        salesOrder={selectedSalesOrder}
        formatCurrency={formatCurrency}
        getStatusColor={getStatusColor}
        getPaymentStatusColor={getPaymentStatusColor}
        onGeneratePDF={handleGeneratePDF}
        onCreateInvoice={handleCreateInvoice}
        onSendEmail={handleSendEmail}
        onDuplicateOrder={handleDuplicateOrder}
      />
      
      <EditSalesOrderDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        onSalesOrderUpdated={handleSalesOrderUpdated} 
        initialData={selectedSalesOrder} 
      />
    </div>
  );
};

export default SalesOrdersPageContent;