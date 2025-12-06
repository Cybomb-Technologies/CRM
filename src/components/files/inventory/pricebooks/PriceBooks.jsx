// src/pages/PriceBooks.jsx
import React, { useState, useRef } from 'react';
import { Plus, Download, Search, Filter, MoreVertical, Upload, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData, useToast } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

const PriceBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedPriceBooks, setSelectedPriceBooks] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { data, updateData } = useData();
  const { toast } = useToast();

  // Use data from context or mock data as fallback
  const priceBooks = data.priceBooks || [
    { 
      id: 1, 
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
      id: 2, 
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
      id: 3, 
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
      id: 4, 
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
      id: 5, 
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
      id: 6, 
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

  const handleCreatePriceBook = () => {
    navigate('/price-books/create');
  };

  const handleEditPriceBook = (priceBookId) => {
    navigate(`/price-books/edit/${priceBookId}`);
  };

  const handleViewDetails = (priceBookId) => {
    navigate(`/price-books/${priceBookId}`);
  };

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
          description: "Price books imported successfully!"
        });
        setShowImportModal(false);
        setImportFile(null);
        setImportProgress(0);
      }, 500);
    }, 2000);
  };

  const downloadTemplate = () => {
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

  const handleDelete = (priceBookId) => {
    const updatedPriceBooks = priceBooks.filter((p) => p.id !== priceBookId);
    updateData("priceBooks", updatedPriceBooks);
    toast({ title: "Price Book Deleted", description: "The price book has been removed." });
  };

  const handleBulkDelete = () => {
    if (selectedPriceBooks.length === 0) {
      toast({
        title: "No selection",
        description: "Please select price books to delete",
        variant: "destructive"
      });
      return;
    }

    const updatedPriceBooks = priceBooks.filter(p => !selectedPriceBooks.includes(p.id.toString()));
    updateData("priceBooks", updatedPriceBooks);
    setSelectedPriceBooks([]);
    
    toast({
      title: "Bulk Delete Successful",
      description: `${selectedPriceBooks.length} price books have been deleted.`
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPriceBooks(filteredPriceBooks.map(p => p.id.toString()));
    } else {
      setSelectedPriceBooks([]);
    }
  };

  const handleSelectPriceBook = (priceBookId, checked) => {
    if (checked) {
      setSelectedPriceBooks([...selectedPriceBooks, priceBookId.toString()]);
    } else {
      setSelectedPriceBooks(selectedPriceBooks.filter(id => id !== priceBookId.toString()));
    }
  };

  const filteredPriceBooks = priceBooks.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
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
              {selectedPriceBooks.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedPriceBooks.length})
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleImportClick}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button 
                onClick={handleCreatePriceBook} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Price Book
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search price books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex-1 md:flex-none">
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
                    <DropdownMenuItem>Export All</DropdownMenuItem>
                    <DropdownMenuItem>Customize Columns</DropdownMenuItem>
                    <DropdownMenuItem>Refresh Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Books Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedPriceBooks.length === filteredPriceBooks.length && filteredPriceBooks.length > 0}
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
                    <TableHead className="font-semibold">Products</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPriceBooks.length > 0 ? (
                    filteredPriceBooks.map((book) => (
                      <TableRow key={book.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedPriceBooks.includes(book.id.toString())}
                            onCheckedChange={(checked) => handleSelectPriceBook(book.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">
                            {book.name}
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {book.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{book.company}</TableCell>
                        <TableCell className="text-muted-foreground">{book.email}</TableCell>
                        <TableCell className="text-muted-foreground">{book.phone}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(book.status)} capitalize`}>
                            {book.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{book.source}</span>
                        </TableCell>
                        <TableCell>
                          {book.flags && (
                            <Badge variant="outline" className="text-xs">
                              {book.flags}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{book.products}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(book.created).toLocaleDateString('en-US', {
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
                              onClick={() => handleViewDetails(book.id)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPriceBook(book.id)}
                              className="h-8 w-8 text-green-600 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(book.id)}
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
                                <DropdownMenuItem onClick={() => handleViewDetails(book.id)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditPriceBook(book.id)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(book.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Manage Products
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
                            {searchTerm ? "No matching price books" : "No price books found"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {searchTerm 
                              ? "Try adjusting your search or filters"
                              : "Get started by creating your first price book"
                            }
                          </p>
                          {!searchTerm && (
                            <Button onClick={handleCreatePriceBook} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Create Price Book
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
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
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