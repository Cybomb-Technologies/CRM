// src/components/files/inventory/products/ProductsPageContent.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useData, useToast } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Plus, Search, Filter, Download, MoreVertical, Eye, Edit, Trash2,
  ChevronDown, Upload, X, Copy, FileText, Tag, CheckCircle, XCircle, Clock,
  Box, DollarSign, Layers, Calendar, Building, Mail, Phone
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateProductForm from '@/components/files/inventory/products/CreateProductForm';

const ProductsPageContent = () => {
  const navigate = useNavigate();
  const { data, updateData } = useData();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({ 
    status: '', 
    category: '', 
    source: '',
    flags: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  
  const fileInputRef = React.useRef(null);

  // Products data
  const products = data.products || [
    {
      id: '1',
      name: 'Laptop Pro X1',
      company: 'Tech Corp',
      email: 'sarah@techcorp.com',
      phone: '+1 234 567 8900',
      status: 'Active',
      source: 'Website',
      flags: 'Featured',
      created: '2024-01-15',
      sku: 'LAP-PRO-X1',
      price: 1299.99,
      category: 'Electronics',
      stock: 45,
      description: 'High-performance laptop for professionals',
      productOwner: 'DEVASHREE SALUNKE',
      vendorName: 'Tech Corp Suppliers',
      manufacturer: 'Tech Corp',
      unitPrice: 1299.99,
      quantityInStock: 45,
      qtyOrdered: 10,
      reorderLevel: 20,
      quantityInDemand: 15
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      company: 'Innovation Labs',
      email: 'michael@innovationlabs.com',
      phone: '+1 234 567 8901',
      status: 'Active',
      source: 'Partner',
      flags: 'New',
      created: '2024-01-10',
      sku: 'WH-2024',
      price: 199.99,
      category: 'Audio',
      stock: 120,
      description: 'Premium wireless headphones with noise cancellation',
      productOwner: 'DEVASHREE SALUNKE',
      vendorName: 'Audio Solutions',
      manufacturer: 'Innovation Labs',
      unitPrice: 199.99,
      quantityInStock: 120,
      qtyOrdered: 25,
      reorderLevel: 50,
      quantityInDemand: 45
    },
    {
      id: '3',
      name: 'Smart Watch Series 5',
      company: 'Growth Solutions',
      email: 'emily@growthsolutions.com',
      phone: '+1 234 567 8902',
      status: 'Inactive',
      source: 'Direct',
      flags: 'Sale',
      created: '2024-01-05',
      sku: 'SW-S5',
      price: 349.99,
      category: 'Wearables',
      stock: 25,
      description: 'Advanced smartwatch with health monitoring',
      productOwner: 'DEVASHREE SALUNKE',
      vendorName: 'Wearable Tech',
      manufacturer: 'Growth Solutions',
      unitPrice: 349.99,
      quantityInStock: 25,
      qtyOrdered: 5,
      reorderLevel: 10,
      quantityInDemand: 8
    },
    {
      id: '4',
      name: 'External SSD 1TB',
      company: 'Data Systems Inc',
      email: 'john@datasystems.com',
      phone: '+1 234 567 8903',
      status: 'Active',
      source: 'Website',
      flags: 'Best Seller',
      created: '2024-01-12',
      sku: 'SSD-1TB-EXT',
      price: 129.99,
      category: 'Storage',
      stock: 78,
      description: 'High-speed external solid state drive',
      productOwner: 'DEVASHREE SALUNKE',
      vendorName: 'Data Storage Co',
      manufacturer: 'Data Systems Inc',
      unitPrice: 129.99,
      quantityInStock: 78,
      qtyOrdered: 12,
      reorderLevel: 25,
      quantityInDemand: 20
    },
    {
      id: '5',
      name: 'Bluetooth Speaker',
      company: 'Audio Masters',
      email: 'lisa@audiomasters.com',
      phone: '+1 234 567 8904',
      status: 'Active',
      source: 'Reseller',
      flags: '',
      created: '2024-01-08',
      sku: 'BT-SP-MAX',
      price: 89.99,
      category: 'Audio',
      stock: 156,
      description: 'Portable Bluetooth speaker with premium sound',
      productOwner: 'DEVASHREE SALUNKE',
      vendorName: 'Audio Distributors',
      manufacturer: 'Audio Masters',
      unitPrice: 89.99,
      quantityInStock: 156,
      qtyOrdered: 30,
      reorderLevel: 40,
      quantityInDemand: 35
    },
    {
      id: '6',
      name: '4K Webcam',
      company: 'Vision Tech',
      email: 'robert@visiontech.com',
      phone: '+1 234 567 8905',
      status: 'Pending',
      source: 'Website',
      flags: 'Limited Stock',
      created: '2024-01-03',
      sku: '4K-WEB-PRO',
      price: 159.99,
      category: 'Accessories',
      stock: 12,
      description: 'Professional 4K webcam for video conferencing',
      productOwner: 'DEVASHREE SALUNKE',
      vendorName: 'Vision Accessories',
      manufacturer: 'Vision Tech',
      unitPrice: 159.99,
      quantityInStock: 12,
      qtyOrdered: 3,
      reorderLevel: 5,
      quantityInDemand: 10
    }
  ];

  // Filter logic
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply view filters
    switch (currentView) {
      case 'all':
        break;
      case 'active':
        filtered = filtered.filter(product => product.status === 'Active');
        break;
      case 'inactive':
        filtered = filtered.filter(product => product.status === 'Inactive');
        break;
      case 'pending':
        filtered = filtered.filter(product => product.status === 'Pending');
        break;
      case 'low-stock':
        filtered = filtered.filter(product => product.stock < 20);
        break;
      case 'best-sellers':
        filtered = filtered.filter(product => product.flags === 'Best Seller');
        break;
      case 'featured':
        filtered = filtered.filter(product => product.flags === 'Featured');
        break;
      case 'new':
        filtered = filtered.filter(product => product.flags === 'New');
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(product => 
          product.created && new Date(product.created) > oneWeekAgo
        );
        break;
      default:
        break;
    }

    // Apply custom filters
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    if (filters.source) {
      filtered = filtered.filter(product => product.source === filters.source);
    }
    if (filters.flags) {
      filtered = filtered.filter(product => product.flags === filters.flags);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        if (!product) return false;
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
          (product.company && product.company.toLowerCase().includes(searchLower)) ||
          (product.category && product.category.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [products, currentView, filters, searchTerm]);

  // Event handlers
  const handleCreateProduct = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleEditProduct = useCallback((product) => {
    setEditingProduct(product);
    setShowCreateForm(true);
  }, []);

  const handleViewProduct = useCallback((product) => {
    setViewingProduct(product);
  }, []);

  const handleDeleteProduct = useCallback((product) => {
    if (window.confirm(`Delete product "${product.name}"?`)) {
      const updatedProducts = products.filter(p => p.id !== product.id);
      updateData("products", updatedProducts);
      toast({ 
        title: "Product Deleted", 
        description: `${product.name} has been deleted.` 
      });
    }
  }, [products, updateData, toast]);

  const handleProductCreated = useCallback((newProduct) => {
    const updatedProducts = [...products, newProduct];
    updateData("products", updatedProducts);
    setShowCreateForm(false);
    setEditingProduct(null);
    toast({
      title: "Product Created",
      description: `${newProduct.name} has been created successfully.`
    });
  }, [products, updateData, toast]);

  const handleProductUpdated = useCallback((updatedProduct) => {
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    updateData("products", updatedProducts);
    setShowCreateForm(false);
    setEditingProduct(null);
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated successfully.`
    });
  }, [products, updateData, toast]);

  const handleBulkDelete = useCallback(() => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No selection",
        description: "Please select products to delete",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
      const updatedProducts = products.filter(p => !selectedProducts.includes(p.id));
      updateData("products", updatedProducts);
      setSelectedProducts([]);
      
      toast({
        title: "Bulk Delete Successful",
        description: `${selectedProducts.length} products have been deleted.`
      });
    }
  }, [selectedProducts, products, updateData, toast]);

  const handleBulkUpdate = useCallback((updates) => {
    const updatedProducts = products.map(p => 
      selectedProducts.includes(p.id) ? { ...p, ...updates } : p
    );
    updateData("products", updatedProducts);
    setSelectedProducts([]);
    toast({
      title: "Bulk Update Successful",
      description: `${selectedProducts.length} products have been updated.`
    });
  }, [selectedProducts, products, updateData, toast]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = filteredProducts.map(product => {
      return `"${product.name || ''}","${product.sku || ''}","${product.company || ''}","${product.category || ''}","${product.price || 0}","${product.stock || 0}","${product.status || ''}","${product.source || ''}","${product.flags || ''}","${product.created || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`Name,SKU,Company,Category,Price,Stock,Status,Source,Flags,Created\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Completed",
      description: `${filteredProducts.length} products exported successfully.`
    });
  }, [filteredProducts, toast]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleDuplicateProduct = (product) => {
    const duplicated = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      created: new Date().toISOString().split('T')[0]
    };
    
    const updatedProducts = [...products, duplicated];
    updateData("products", updatedProducts);
    
    toast({
      title: "Product Duplicated",
      description: `${duplicated.name} has been created.`
    });
  };

  // View filter options
  const viewOptions = [
    { id: 'all', label: 'All Products' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'pending', label: 'Pending' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'featured', label: 'Featured' },
    { id: 'new', label: 'New' },
    { id: 'recent', label: 'Recently Added' },
  ];

  // Import functionality
  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['.csv', 'text/csv', 'application/vnd.ms-excel'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(`.${fileExtension}`) && !validTypes.includes(file.type)) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file",
          variant: "destructive"
        });
        return;
      }
      
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import",
        variant: "destructive"
      });
      return;
    }

    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setImportProgress(100);
      
      setTimeout(() => {
        toast({
          title: "Import Successful",
          description: "Products imported successfully!"
        });
        setShowImportModal(false);
        setImportFile(null);
        setImportProgress(0);
      }, 500);
    }, 2000);
  };

  const downloadTemplate = () => {
    const template = `Name,SKU,Company,Category,Price,Stock,Status,Source,Flags,Description
Laptop Pro X1,LAP-PRO-X1,Tech Corp,Electronics,1299.99,45,Active,Website,Featured,High-performance laptop
Wireless Headphones,WH-2024,Innovation Labs,Audio,199.99,120,Active,Partner,New,Premium wireless headphones`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // View Product Modal
  const ViewProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-semibold">{product.name}</h2>
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
                <h3 className="text-sm font-medium text-gray-500 mb-2">Product Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Box className="w-4 h-4" />
                      <span>SKU</span>
                    </div>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Tag className="w-4 h-4" />
                      <span>Category</span>
                    </div>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <DollarSign className="w-4 h-4" />
                      <span>Price</span>
                    </div>
                    <p className="font-medium">${product.price}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Layers className="w-4 h-4" />
                      <span>Stock</span>
                    </div>
                    <p className="font-medium">{product.stock} units</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Building className="w-4 h-4" />
                      <span>Company</span>
                    </div>
                    <p className="font-medium">{product.company}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                    <p className="font-medium">{product.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                    <p className="font-medium">{product.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <Badge className={`${getStatusColor(product.status)} capitalize`}>
                  {product.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Source</h3>
                <p className="font-medium">{product.source}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Flags</h3>
                {product.flags && (
                  <Badge variant="outline" className="text-xs">
                    {product.flags}
                  </Badge>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                  {product.description}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
              <p className="font-medium">
                {new Date(product.created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => {
                onClose();
                handleEditProduct(product);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Audio">Audio</option>
            <option value="Wearables">Wearables</option>
            <option value="Storage">Storage</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Source</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Partner">Partner</option>
            <option value="Direct">Direct</option>
            <option value="Reseller">Reseller</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Flags</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.flags}
            onChange={(e) => setFilters(prev => ({ ...prev, flags: e.target.value }))}
          >
            <option value="">All Flags</option>
            <option value="Featured">Featured</option>
            <option value="New">New</option>
            <option value="Sale">Sale</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Limited Stock">Limited Stock</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFilters({ status: '', category: '', source: '', flags: '' })}
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
            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                <CheckCircle className="w-4 h-4 mr-2" />
                Set Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkUpdate({ status: 'Active' })}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkUpdate({ status: 'Inactive' })}>
                <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkUpdate({ status: 'Pending' })}>
                <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
      <CreateProductForm 
        initialData={editingProduct}
        onProductCreated={editingProduct ? handleProductUpdated : handleProductCreated}
        onCancel={() => {
          setShowCreateForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Products - CloudCRM</title>
        <meta name="description" content="Manage your product catalog" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog and inventory</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleImportClick}
              className="flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button 
              onClick={handleCreateProduct} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Product
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
                  placeholder="Search products by name, SKU, company, or category..." 
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
        {selectedProducts.length > 0 && <BulkActionsComponent />}

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold">Flags</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground cursor-pointer hover:text-blue-600"
                               onClick={() => handleViewProduct(product)}>
                            {product.name}
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku} | ${product.price}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.company}</TableCell>
                        <TableCell className="text-muted-foreground">{product.email}</TableCell>
                        <TableCell className="text-muted-foreground">{product.phone}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(product.status)} capitalize`}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{product.source}</span>
                        </TableCell>
                        <TableCell>
                          {product.flags && (
                            <Badge variant="outline" className="text-xs">
                              {product.flags}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(product.created).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewProduct(product)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                              className="h-8 w-8 text-green-600 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product)}
                              className="h-8 w-8 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Manage Inventory
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteProduct(product)}
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
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="text-center">
                          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchTerm ? "No matching products" : "No products found"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {searchTerm 
                              ? "Try adjusting your search or filters"
                              : "Get started by creating your first product"
                            }
                          </p>
                          {!searchTerm && (
                            <Button onClick={handleCreateProduct} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Create Product
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
            {filteredProducts.length} of {products.length} products
            {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
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

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Import Products</h2>
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
                    Import products from a CSV file. Download the template to ensure proper formatting.
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

        {/* View Product Modal */}
        {viewingProduct && (
          <ViewProductModal 
            product={viewingProduct}
            onClose={() => setViewingProduct(null)}
          />
        )}
      </div>
    </>
  );
};

export default ProductsPageContent;