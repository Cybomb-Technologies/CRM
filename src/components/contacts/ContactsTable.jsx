// src/components/contacts/ContactsTable.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Eye, MoreVertical, Mail, User, Building } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ContactsTable = ({ 
  contacts, 
  loading, 
  selectedContacts,
  onContactSelect,
  onContactEdit, 
  onContactDelete, 
  onContactView,
  onContactEmail 
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No contacts found. Create your first contact to get started.</p>
      </div>
    );
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      onContactSelect(contacts.map(contact => contact.id));
    } else {
      onContactSelect([]);
    }
  };

  const handleSelectContact = (contactId, checked) => {
    if (checked) {
      onContactSelect([...selectedContacts, contactId]);
    } else {
      onContactSelect(selectedContacts.filter(id => id !== contactId));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              <Checkbox
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Name</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Account</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Email</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Phone</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Title</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Department</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Source</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Created</th>
            <th className="text-right p-4 font-medium text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-4">
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={(checked) => handleSelectContact(contact.id, checked)}
                />
              </td>
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {contact.firstName} {contact.lastName}
                  {contact.convertedFromLead && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Converted
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  {contact.accountName || 'No Account'}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{contact.email}</td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{contact.phone}</td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{contact.title || '-'}</td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{contact.department || '-'}</td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {contact.leadSource || 'Unknown'}
                </span>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {new Date(contact.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onContactView && onContactView(contact)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onContactEdit && onContactEdit(contact)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onContactEmail && onContactEmail(contact)}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onContactDelete && onContactDelete(contact)}
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

export default ContactsTable;