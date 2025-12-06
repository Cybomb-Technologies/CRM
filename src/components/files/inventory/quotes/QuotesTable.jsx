import React, { useState } from 'react';
import { Eye, Edit, Trash2, MoreVertical, Download, Copy, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks';

const QuotesTable = ({ quotes, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedQuotes, setSelectedQuotes] = useState([]);

  const handleView = (quoteId) => {
    navigate(`/quotes/view/${quoteId}`);
  };

  const handleEdit = (quoteId) => {
    navigate(`/quotes/edit/${quoteId}`);
  };

  const handleDelete = (quoteId) => {
    if (onDelete) {
      onDelete(quoteId);
    }
    toast({
      title: "Quote Deleted",
      description: "The quote has been removed successfully."
    });
  };

  const handleDuplicate = (quote) => {
    toast({
      title: "Quote Duplicated",
      description: `A copy of quote ${quote.quoteNumber} has been created.`
    });
  };

  const handleSend = (quote) => {
    toast({
      title: "Quote Sent",
      description: `Quote ${quote.quoteNumber} has been sent to ${quote.email}.`
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedQuotes(quotes.map(q => q.id.toString()));
    } else {
      setSelectedQuotes([]);
    }
  };

  const handleSelectQuote = (quoteId, checked) => {
    if (checked) {
      setSelectedQuotes([...selectedQuotes, quoteId.toString()]);
    } else {
      setSelectedQuotes(selectedQuotes.filter(id => id !== quoteId.toString()));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'sent':
        return "bg-green-100 text-green-800";
      case 'draft':
        return "bg-gray-100 text-gray-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'expired':
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (!quotes || quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quotes Found</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first quote.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedQuotes.length === quotes.length && quotes.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold">Quote #</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Flags</TableHead>
              <TableHead className="font-semibold">Total Amount</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedQuotes.includes(quote.id.toString())}
                    onCheckedChange={(checked) => handleSelectQuote(quote.id, checked)}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {quote.quoteNumber}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">
                    {quote.subject}
                    <div className="text-sm text-muted-foreground">
                      {quote.accountName}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{quote.company}</TableCell>
                <TableCell className="text-muted-foreground">{quote.email}</TableCell>
                <TableCell className="text-muted-foreground">{quote.phone}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(quote.status)} capitalize`}>
                    {quote.status || 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{quote.source || 'Manual'}</span>
                </TableCell>
                <TableCell>
                  {quote.flags && (
                    <Badge variant="outline" className="text-xs">
                      {quote.flags}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  ${parseFloat(quote.totalAmount || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(quote.id)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(quote.id)}
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
                        <DropdownMenuItem onClick={() => handleView(quote.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(quote.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(quote)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSend(quote)}>
                          <Send className="w-4 h-4 mr-2" />
                          Send to Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(quote.id)}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuotesTable;