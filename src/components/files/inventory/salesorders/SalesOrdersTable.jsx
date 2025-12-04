import React, { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  Mail, 
  Copy,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton'; // Make sure this file exists
const SalesOrdersTable = ({
  salesOrders = [],
  loading = false,
  selectedSalesOrders = [],
  onSalesOrderSelect,
  onSalesOrderEdit,
  onSalesOrderDelete,
  onSalesOrderView,
  onGeneratePDF,
  onUpdateStatus,
  onCreateInvoice,
  onDuplicateOrder,
  onSendEmail,
  formatCurrency,
  getStatusColor,
  getPaymentStatusColor
}) => {
  const allSelected = useMemo(() => {
    return salesOrders.length > 0 && selectedSalesOrders.length === salesOrders.length;
  }, [salesOrders, selectedSalesOrders]);

  const indeterminate = useMemo(() => {
    return selectedSalesOrders.length > 0 && selectedSalesOrders.length < salesOrders.length;
  }, [salesOrders, selectedSalesOrders]);

  const handleSelectAll = () => {
    if (allSelected) {
      onSalesOrderSelect([]);
    } else {
      onSalesOrderSelect(salesOrders.map(order => order.id));
    }
  };

  const handleSelectOrder = (orderId) => {
    if (selectedSalesOrders.includes(orderId)) {
      onSalesOrderSelect(selectedSalesOrders.filter(id => id !== orderId));
    } else {
      onSalesOrderSelect([...selectedSalesOrders, orderId]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Draft': return <FileText className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      case 'On Hold': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (salesOrders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No sales orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
              <Checkbox
                checked={allSelected}
                indeterminate={indeterminate}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Order #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Order Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {salesOrders.map((order) => (
            <tr 
              key={order.id} 
              className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                order.isUrgent ? 'bg-red-50 dark:bg-red-900/20' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Checkbox
                  checked={selectedSalesOrders.includes(order.id)}
                  onCheckedChange={() => handleSelectOrder(order.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {order.isUrgent && (
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      PO: {order.poNumber || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {order.customerName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {order.customerEmail}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${
                  new Date(order.dueDate) < new Date() && 
                  !['Completed', 'Cancelled', 'Shipped'].includes(order.status)
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {new Date(order.dueDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={`inline-flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {order.salesPersonName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSalesOrderView(order)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSalesOrderView(order)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSalesOrderEdit(order)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onGeneratePDF(order)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCreateInvoice(order)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Create Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSendEmail(order)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicateOrder(order)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onSalesOrderDelete(order)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesOrdersTable;