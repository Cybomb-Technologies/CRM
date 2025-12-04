// src/components/files/inventory/pricebooks/PriceBooksTable.jsx
import React, { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Edit, Trash2, Copy, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PriceBooksTable = ({
  priceBooks = [],
  loading = false,
  selectedPriceBooks = [],
  onPriceBookSelect,
  onPriceBookEdit,
  onPriceBookDelete,
  onPriceBookView,
  getStatusColor
}) => {
  const allSelected = useMemo(() => {
    return priceBooks.length > 0 && selectedPriceBooks.length === priceBooks.length;
  }, [priceBooks, selectedPriceBooks]);

  const indeterminate = useMemo(() => {
    return selectedPriceBooks.length > 0 && selectedPriceBooks.length < priceBooks.length;
  }, [priceBooks, selectedPriceBooks]);

  const handleSelectAll = () => {
    if (allSelected) {
      onPriceBookSelect([]);
    } else {
      onPriceBookSelect(priceBooks.map(book => book.id));
    }
  };

  const handleSelectPriceBook = (priceBookId) => {
    if (selectedPriceBooks.includes(priceBookId)) {
      onPriceBookSelect(selectedPriceBooks.filter(id => id !== priceBookId));
    } else {
      onPriceBookSelect([...selectedPriceBooks, priceBookId]);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (priceBooks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No price books found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              indeterminate={indeterminate}
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
        {priceBooks.map((book) => (
          <TableRow key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <TableCell>
              <Checkbox
                checked={selectedPriceBooks.includes(book.id)}
                onCheckedChange={() => handleSelectPriceBook(book.id)}
              />
            </TableCell>
            <TableCell>
              <div className="font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                   onClick={() => onPriceBookView(book)}>
                {book.name}
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {book.description}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium text-gray-900 dark:text-white">
              {book.company}
            </TableCell>
            <TableCell className="text-gray-500 dark:text-gray-400">
              {book.email}
            </TableCell>
            <TableCell className="text-gray-500 dark:text-gray-400">
              {book.phone}
            </TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(book.status)} capitalize`}>
                {book.status}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-500 dark:text-gray-400">{book.source}</span>
            </TableCell>
            <TableCell>
              {book.flags && (
                <Badge variant="outline" className="text-xs">
                  {book.flags}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <span className="font-medium text-gray-900 dark:text-white">{book.products}</span>
            </TableCell>
            <TableCell className="text-gray-500 dark:text-gray-400">
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
                  size="sm"
                  onClick={() => onPriceBookView(book)}
                  className="h-8 w-8 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPriceBookEdit(book)}
                  className="h-8 w-8 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPriceBookView(book)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPriceBookEdit(book)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Products
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onPriceBookDelete(book)}
                      className="text-red-600 dark:text-red-400"
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
  );
};

export default PriceBooksTable;