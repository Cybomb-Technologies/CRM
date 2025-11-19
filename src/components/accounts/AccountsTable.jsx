// src/components/accounts/AccountsTable.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Eye, MoreVertical, Users, Globe, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AccountsTable = ({ 
  accounts, 
  loading, 
  selectedAccounts,
  onAccountSelect,
  onAccountEdit, 
  onAccountDelete, 
  onAccountView
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading accounts...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No accounts found. Create your first account to get started.</p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Customer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Partner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vendor': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Prospect': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onAccountSelect(accounts.map(account => account.id));
    } else {
      onAccountSelect([]);
    }
  };

  const handleSelectAccount = (accountId, checked) => {
    if (checked) {
      onAccountSelect([...selectedAccounts, accountId]);
    } else {
      onAccountSelect(selectedAccounts.filter(id => id !== accountId));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              <Checkbox
                checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Account Name</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Website</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Phone</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Industry</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Type</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Contacts</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Revenue</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Created</th>
            <th className="text-right p-4 font-medium text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-4">
                <Checkbox
                  checked={selectedAccounts.includes(account.id)}
                  onCheckedChange={(checked) => handleSelectAccount(account.id, checked)}
                />
              </td>
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  {account.name}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {account.website ? (
                  <a href={account.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Globe className="w-4 h-4" />
                    {account.website}
                  </a>
                ) : '-'}
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {account.phone ? (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {account.phone}
                  </div>
                ) : '-'}
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{account.industry || '-'}</td>
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(account.type)}`}>
                  {account.type || 'Other'}
                </span>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {account.contacts || 0}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {account.annualRevenue ? `$${(account.annualRevenue / 1000000).toFixed(1)}M` : '-'}
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {new Date(account.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAccountView && onAccountView(account)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAccountEdit && onAccountEdit(account)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onAccountDelete && onAccountDelete(account)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;