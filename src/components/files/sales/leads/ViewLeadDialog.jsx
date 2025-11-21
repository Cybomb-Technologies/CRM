// src/components/leads/ViewLeadDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building, Mail, Phone, Globe, MapPin, RefreshCw } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const ViewLeadDialog = ({ open, onOpenChange, lead }) => {
  const { syncLeadToContact } = useData();
  const { toast } = useToast();

  if (!lead) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Unqualified': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSyncToContact = async () => {
    if (!lead.isConverted) {
      toast({
        title: "Cannot Sync",
        description: "Lead must be converted to contact first.",
        variant: "destructive"
      });
      return;
    }

    const result = await syncLeadToContact(lead.id);
    
    if (result.success) {
      toast({
        title: "Sync Successful",
        description: result.message,
      });
    } else {
      toast({
        title: "Sync Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  // Safe image URL handling
  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (image instanceof File || image instanceof Blob) return URL.createObjectURL(image);
    return null;
  };

  const imageUrl = getImageUrl(lead.image);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Lead Details</span>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(lead.leadStatus)}>
                {lead.leadStatus}
              </Badge>
              {lead.isConverted && (
                <Badge className="bg-green-100 text-green-800">
                  Converted
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4 pb-6 border-b">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Lead" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {lead.firstName} {lead.lastName}
              </h2>
              <p className="text-gray-600">{lead.title}</p>
              <p className="text-gray-600">{lead.company}</p>
            </div>
            {lead.isConverted && (
              <Button 
                onClick={handleSyncToContact}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Sync to Contact
              </Button>
            )}
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
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
                {lead.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Mobile: {lead.mobile}</span>
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={lead.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {lead.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Company Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <strong>Industry:</strong> {lead.industry || 'Not specified'}
                </div>
                <div>
                  <strong>Lead Source:</strong> {lead.leadSource || 'Not specified'}
                </div>
                <div>
                  <strong>Employees:</strong> {lead.numberOfEmployees || 'Not specified'}
                </div>
                <div>
                  <strong>Annual Revenue:</strong> {lead.annualRevenue ? `Rs. ${lead.annualRevenue}` : 'Not specified'}
                </div>
                <div>
                  <strong>Rating:</strong> {lead.rating || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {lead.streetAddress && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Address:</strong> {lead.streetAddress}</div>
                <div><strong>City:</strong> {lead.city}</div>
                <div><strong>State:</strong> {lead.state}</div>
                <div><strong>Country:</strong> {lead.country}</div>
                <div><strong>Zip Code:</strong> {lead.zipCode}</div>
              </div>
            </div>
          )}

          {/* Description */}
          {lead.description && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.description}</p>
            </div>
          )}

          {/* Conversion Information */}
          {lead.isConverted && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-green-700">Conversion Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Converted to Contact:</strong> Yes
                </div>
                <div>
                  <strong>Conversion Date:</strong> {new Date(lead.conversionDate).toLocaleString()}
                </div>
                {lead.convertedToContactId && (
                  <div className="md:col-span-2">
                    <strong>Contact ID:</strong> {lead.convertedToContactId}
                  </div>
                )}
                {lead.convertedToAccountId && (
                  <div className="md:col-span-2">
                    <strong>Account ID:</strong> {lead.convertedToAccountId}
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Changes made to this lead will not automatically update the contact. 
                  Use the "Sync to Contact" button above to manually update the contact with the latest lead data.
                </p>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-2">
              <h4 className="font-semibold">Additional Details</h4>
              <div><strong>Skype ID:</strong> {lead.skypeID || 'Not specified'}</div>
              <div><strong>Twitter:</strong> {lead.twitter ? `@${lead.twitter}` : 'Not specified'}</div>
              <div><strong>Secondary Email:</strong> {lead.secondaryEmail || 'Not specified'}</div>
              <div><strong>Email Opt Out:</strong> {lead.emailOptOut ? 'Yes' : 'No'}</div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">System Information</h4>
              <div><strong>Created:</strong> {new Date(lead.createdAt).toLocaleString()}</div>
              <div><strong>Last Updated:</strong> {new Date(lead.updatedAt).toLocaleString()}</div>
              <div><strong>Lead Owner:</strong> {lead.leadOwner || 'Not assigned'}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLeadDialog;