// src/components/files/inventory/purchaseorders/ViewPurchaseOrder.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Edit, Printer, Download, Mail, Share2, MoreVertical, FileText, Truck, Package, DollarSign, Calendar, User, Building, MapPin, CheckCircle, XCircle, Copy, Globe, Phone, Mail as MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { usePOStorage } from '@/hooks/usePOStorage';
import { useToast } from '@/hooks';

const ViewPurchaseOrder = ({ poId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPurchaseOrder } = usePOStorage();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (poId) {
      const purchaseOrder = getPurchaseOrder(poId);
      if (purchaseOrder) {
        setPo(purchaseOrder);
      } else {
        toast({
          title: "Error",
          description: "Purchase order not found",
          variant: "destructive"
        });
        navigate('/purchase-orders');
      }
      setLoading(false);
    }
  }, [poId, getPurchaseOrder, navigate, toast]);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print",
      description: "Opening print dialog..."
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Preparing PDF for download..."
    });
    // In a real app, you would generate and download a PDF here
  };

  const handleSendEmail = () => {
    toast({
      title: "Send Email",
      description: "Opening email composer..."
    });
    // In a real app, you would open email composer with PO details
  };

  const handleDuplicate = () => {
    toast({
      title: "Duplicate",
      description: "Duplicating purchase order..."
    });
    navigate(`/purchase-orders/create?duplicate=${poId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Created": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Approved": return "bg-green-100 text-green-800 border-green-300";
      case "Sent": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Received": return "bg-purple-100 text-purple-800 border-purple-300";
      case "Partially Received": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Closed": return "bg-gray-200 text-gray-800 border-gray-400";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved": return <CheckCircle className="w-4 h-4 mr-2" />;
      case "Cancelled": return <XCircle className="w-4 h-4 mr-2" />;
      default: return <FileText className="w-4 h-4 mr-2" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase order details...</p>
        </div>
      </div>
    );
  }

  if (!po) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{po.subject} - Purchase Order - CloudCRM</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/purchase-orders')}
                  className="h-10 w-10 border-gray-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{po.subject}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">PO Number: {po.orderNumber}</span>
                    <Badge className={`${getStatusColor(po.status)} capitalize border`}>
                      {getStatusIcon(po.status)}
                      {po.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/purchase-orders/edit/${po.id}`)}
                  className="border-gray-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="border-gray-300"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="border-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendEmail}
                  className="border-gray-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-300">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSendEmail}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({
                      title: "Archive",
                      description: "Archiving purchase order..."
                    })}>
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Purchase Order Details Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-3">Purchase Order Details</h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm text-gray-500">PO Owner</div>
                                <div className="font-medium">{po.poOwner}</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm text-gray-500">Requisition Number</div>
                                <div className="font-medium">{po.requisitionNumber || 'Not specified'}</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm text-gray-500">Contact Name</div>
                                <div className="font-medium">{po.contactName || 'Not specified'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-3">Dates & Shipping</h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm text-gray-500">PO Date</div>
                                <div className="font-medium">{formatDate(po.poDate)}</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-sm text-gray-500">Due Date</div>
                                <div className={`font-medium ${new Date(po.dueDate) < new Date() && !['Received', 'Closed', 'Cancelled'].includes(po.status) ? 'text-red-600' : ''}`}>
                                  {formatDate(po.dueDate)}
                                  {new Date(po.dueDate) < new Date() && !['Received', 'Closed', 'Cancelled'].includes(po.status) && (
                                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Overdue</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {po.carrier && (
                              <div className="flex items-start">
                                <Truck className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-sm text-gray-500">Carrier</div>
                                  <div className="font-medium">{po.carrier}</div>
                                </div>
                              </div>
                            )}
                            {po.trackingNumber && (
                              <div className="flex items-start">
                                <Package className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-sm text-gray-500">Tracking Number</div>
                                  <div className="font-medium">{po.trackingNumber}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vendor Information Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Vendor Information</h3>
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-lg mb-1">{po.vendorName}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {po.billingStreet && <div>{po.billingStreet}</div>}
                          {(po.billingCity || po.billingState || po.billingCode) && (
                            <div>
                              {po.billingCity && `${po.billingCity}, `}
                              {po.billingState && `${po.billingState} `}
                              {po.billingCode && po.billingCode}
                            </div>
                          )}
                          {po.billingCountry && <div>{po.billingCountry}</div>}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          {po.contactName && (
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="w-4 h-4 mr-2" />
                              {po.contactName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Purchase Items Card */}
                <Card>
                  <CardContent className="p-0">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Purchase Items</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16 bg-gray-50">S.NO</TableHead>
                            <TableHead className="bg-gray-50">Product Name</TableHead>
                            <TableHead className="w-32 bg-gray-50 text-right">Quantity</TableHead>
                            <TableHead className="w-40 bg-gray-50 text-right">List Price (₹)</TableHead>
                            <TableHead className="w-40 bg-gray-50 text-right">Amount (₹)</TableHead>
                            <TableHead className="w-40 bg-gray-50 text-right">Discount (%)</TableHead>
                            <TableHead className="w-40 bg-gray-50 text-right">Tax (₹)</TableHead>
                            <TableHead className="w-40 bg-gray-50 text-right">Total (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {po.items?.map((item, index) => (
                            <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell className="font-medium">{item.productName}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{item.listPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{item.discount.toFixed(2)}%</TableCell>
                              <TableCell className="text-right">{item.tax.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-semibold text-green-600">
                                {item.total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Totals */}
                    {po.totals && (
                      <div className="p-6 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">Subtotal</div>
                            <div className="text-lg font-semibold">{formatCurrency(po.totals.amount)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">Discount</div>
                            <div className="text-lg font-semibold text-red-600">
                              - {formatCurrency(po.totals.discount)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">Tax</div>
                            <div className="text-lg font-semibold">{formatCurrency(po.totals.tax)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">Total Amount</div>
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(po.totals.total)}
                            </div>
                          </div>
                        </div>

                        {/* Additional Charges */}
                        {(po.exciseDuty || po.salesCommission) && (
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">Additional Charges</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {po.exciseDuty && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Excise Duty</span>
                                  <span className="font-medium">{formatCurrency(parseFloat(po.exciseDuty))}</span>
                                </div>
                              )}
                              {po.salesCommission && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Sales Commission</span>
                                  <span className="font-medium">{formatCurrency(parseFloat(po.salesCommission))}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Grand Total */}
                        <div className="mt-6 pt-6 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-medium text-gray-900">Grand Total</div>
                            <div className="text-3xl font-bold text-green-600">
                              {formatCurrency(
                                po.totals.total + 
                                parseFloat(po.exciseDuty || 0) + 
                                parseFloat(po.salesCommission || 0)
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Financial Summary Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(po.totals?.amount || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-red-600">- {formatCurrency(po.totals?.discount || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">{formatCurrency(po.totals?.tax || 0)}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Net Total</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(po.totals?.total || 0)}
                        </span>
                      </div>
                      {(po.exciseDuty || po.salesCommission) && (
                        <>
                          <Separator />
                          {po.exciseDuty && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Excise Duty</span>
                              <span className="font-medium">{formatCurrency(parseFloat(po.exciseDuty))}</span>
                            </div>
                          )}
                          {po.salesCommission && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Sales Commission</span>
                              <span className="font-medium">{formatCurrency(parseFloat(po.salesCommission))}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-semibold">Grand Total</span>
                            <span className="text-xl font-bold text-green-600">
                              {formatCurrency(
                                (po.totals?.total || 0) + 
                                parseFloat(po.exciseDuty || 0) + 
                                parseFloat(po.salesCommission || 0)
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                    <div className="space-y-4">
                      {po.billingStreet && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Billing Address
                          </h4>
                          <div className="text-sm space-y-1">
                            <p className="font-medium">{po.billingStreet}</p>
                            {po.billingCity && <p>{po.billingCity}</p>}
                            {po.billingState && <p>{po.billingState} {po.billingCode}</p>}
                            {po.billingCountry && <p>{po.billingCountry}</p>}
                          </div>
                        </div>
                      )}
                      {po.shippingStreet && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Shipping Address
                          </h4>
                          <div className="text-sm space-y-1">
                            <p className="font-medium">{po.shippingStreet}</p>
                            {po.shippingCity && <p>{po.shippingCity}</p>}
                            {po.shippingState && <p>{po.shippingState} {po.shippingCode}</p>}
                            {po.shippingCountry && <p>{po.shippingCountry}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-300"
                        onClick={() => navigate(`/purchase-orders/edit/${po.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Purchase Order
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-300"
                        onClick={handlePrint}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-300"
                        onClick={handleDownloadPDF}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download as PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-300"
                        onClick={handleSendEmail}
                      >
                        <MailIcon className="w-4 h-4 mr-2" />
                        Send via Email
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-gray-300"
                        onClick={handleDuplicate}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate PO
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Metadata Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Purchase Order Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Created</span>
                        <span className="font-medium">{formatDate(po.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Last Updated</span>
                        <span className="font-medium">{formatDate(po.updatedAt || po.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Total Items</span>
                        <span className="font-medium">{po.items?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status</span>
                        <Badge className={`${getStatusColor(po.status)} capitalize`}>
                          {po.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Payment Status</span>
                        <Badge variant="outline" className="border-gray-300">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// DropdownMenu component (since it's used in ViewPurchaseOrder)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default ViewPurchaseOrder;