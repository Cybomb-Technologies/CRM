import React from 'react';
import { Download, Printer, Mail, FileText, Calendar, User, Building, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Quote = ({ quote }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'sent':
        return "bg-green-100 text-green-800";
      case 'draft':
        return "bg-gray-100 text-gray-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'closed won':
        return "bg-blue-100 text-blue-800";
      case 'closed lost':
      case 'expired':
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    alert('PDF download functionality would be implemented here');
  };

  const handleEmail = () => {
    // Implement email functionality
    alert(`Email quote to ${quote.email}`);
  };

  if (!quote) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quote Selected</h3>
          <p className="text-gray-600">Please select a quote to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote #{quote.quoteNumber}</h1>
          <p className="text-gray-600">{quote.subject}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email Quote
          </Button>
        </div>
      </div>

      {/* Quote Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quote Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">Customer</span>
                  </div>
                  <p className="font-medium">{quote.customerName}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="text-sm">Company</span>
                  </div>
                  <p className="font-medium">{quote.company}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Email</div>
                  <p className="font-medium">{quote.email}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Phone</div>
                  <p className="font-medium">{quote.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quote.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${(item.unitPrice || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.amount || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Terms & Notes */}
          {(quote.terms || quote.notes) && (
            <Card>
              <CardHeader>
                <CardTitle>Terms & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.terms && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Terms & Conditions</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{quote.terms}</p>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Additional Notes</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary & Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className={`${getStatusColor(quote.status)} capitalize`}>
                  {quote.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quote Date</span>
                <span className="font-medium">
                  {new Date(quote.quoteDate).toLocaleDateString()}
                </span>
              </div>
              {quote.expiryDate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expiry Date</span>
                  <span className="font-medium">
                    {new Date(quote.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Totals Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${(quote.subtotal || 0).toFixed(2)}</span>
              </div>
              {quote.discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount ({quote.discount}%)</span>
                  <span>-${(quote.discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-blue-500">
                <span>Tax ({quote.taxRate}%)</span>
                <span>${(quote.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>${(quote.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Duplicate Quote
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quote;