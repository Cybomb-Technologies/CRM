// src/components/contacts/ViewContactDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Building, Mail, Phone, MapPin, Calendar, UserCheck } from 'lucide-react';

const ViewContactDialog = ({ open, onOpenChange, contact }) => {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Contact Details</span>
            {contact.convertedFromLead && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <UserCheck className="w-4 h-4" />
                Converted from Lead
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4 pb-6 border-b">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="text-gray-600">{contact.title}</p>
              <p className="text-gray-600">{contact.accountName}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
                {contact.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Mobile: {contact.mobile}</span>
                  </div>
                )}
                <div>
                  <strong>Department:</strong> {contact.department || 'Not specified'}
                </div>
                <div>
                  <strong>Lead Source:</strong> {contact.leadSource || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <strong>Account:</strong> {contact.accountName || 'No Account'}
                </div>
                <div>
                  <strong>Reports To:</strong> {contact.reportsTo || 'Not specified'}
                </div>
                <div>
                  <strong>Assistant:</strong> {contact.assistant || 'Not specified'}
                </div>
                {contact.assistantPhone && (
                  <div>
                    <strong>Assistant Phone:</strong> {contact.assistantPhone}
                  </div>
                )}
                <div>
                  <strong>Email Opt Out:</strong> {contact.emailOptOut ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {contact.mailingAddress && contact.mailingAddress.street && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Mailing Address
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Street:</strong> {contact.mailingAddress.street}</div>
                <div><strong>City:</strong> {contact.mailingAddress.city}</div>
                <div><strong>State:</strong> {contact.mailingAddress.state}</div>
                <div><strong>Zip Code:</strong> {contact.mailingAddress.zipCode}</div>
                <div><strong>Country:</strong> {contact.mailingAddress.country}</div>
              </div>
            </div>
          )}

          {/* Description */}
          {contact.description && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{contact.description}</p>
            </div>
          )}

          {/* Lead Origin Information */}
          {contact.convertedFromLead && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Lead Origin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Converted from Lead:</strong> Yes
                </div>
                <div>
                  <strong>Conversion Date:</strong> {new Date(contact.leadConversionDate).toLocaleString()}
                </div>
                <div className="md:col-span-2">
                  <strong>Original Lead ID:</strong> {contact.convertedFromLead}
                </div>
                {contact.lastSyncedFromLead && (
                  <div className="md:col-span-2">
                    <strong>Last Synced:</strong> {new Date(contact.lastSyncedFromLead).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> This contact was created from a lead. Changes to the original lead will not affect this contact. 
                  To update this contact with the latest lead data, use the "Sync to Contact" button in the lead view.
                </p>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                System Information
              </h4>
              <div><strong>Created:</strong> {new Date(contact.createdAt).toLocaleString()}</div>
              <div><strong>Last Updated:</strong> {new Date(contact.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContactDialog;