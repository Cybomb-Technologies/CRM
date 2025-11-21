// src/components/deals/ViewDealDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  IndianRupee, 
  Target, 
  Calendar, 
  User, 
  Building, 
  Mail,
  Phone,
  Globe,
  FileText,
  TrendingUp,
  Plus,
  Users,
  Edit
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import DealStageBadge from './DealStageBadge';

const ViewDealDialog = ({ open, onOpenChange, deal, onEditDeal }) => {
  const { getDealStages, data } = useData();
  const { toast } = useToast();
  const dealStages = getDealStages();

  if (!deal) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return 'bg-green-100 text-green-800';
    if (probability >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const calculateWeightedValue = () => {
    return (deal.value || 0) * (deal.probability || 0) / 100;
  };

  const getDaysUntilClose = () => {
    if (!deal.closeDate) return null;
    const closeDate = new Date(deal.closeDate);
    const today = new Date();
    const diffTime = closeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handler functions
  const handleAddActivity = () => {
    toast({
      title: "Add Activity",
      description: "Opening activity creation form...",
    });
    // In a real app, you would open an activity creation modal
    console.log('Add activity for deal:', deal.id);
  };

  const handleViewRelatedContacts = () => {
    if (deal.contactId) {
      toast({
        title: "Related Contacts",
        description: `Showing contacts related to ${deal.company}`,
      });
      // In a real app, you would navigate to contacts page with filter
      console.log('View contacts for deal:', deal.id);
    } else {
      toast({
        title: "No Contacts",
        description: "No contacts are associated with this deal.",
        variant: "destructive"
      });
    }
  };

  const handleEditDeal = () => {
    if (onEditDeal) {
      onEditDeal(deal);
      onOpenChange(false);
    } else {
      toast({
        title: "Edit Deal",
        description: "Opening deal editor...",
      });
      console.log('Edit deal:', deal.id);
    }
  };

  const getRelatedContacts = () => {
    if (!deal.contactId) return [];
    return data.contacts?.filter(contact => 
      contact.accountId === deal.accountId || contact.id === deal.contactId
    ) || [];
  };

  const getRelatedActivities = () => {
    return data.activities?.filter(activity => 
      activity.relatedTo?.includes(`Deal: ${deal.id}`) || 
      activity.relatedTo?.includes(deal.id)
    ) || [];
  };

  const daysUntilClose = getDaysUntilClose();
  const relatedContacts = getRelatedContacts();
  const relatedActivities = getRelatedActivities();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Deal Details</span>
            <div className="flex items-center gap-2">
              <DealStageBadge stage={deal.stage} />
              {deal.sourceLeadId && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  From Lead
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="pb-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {deal.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{deal.company}</span>
              </div>
              {deal.contactName && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{deal.contactName}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Owner: {deal.owner}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">Deal Value</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(deal.value || 0)}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-900">Probability</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {deal.probability || 0}%
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-orange-900">Weighted Value</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {formatCurrency(calculateWeightedValue())}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-900">Close Date</span>
              </div>
              <div className="text-lg font-bold text-purple-900">
                {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : 'Not set'}
              </div>
              {daysUntilClose !== null && (
                <div className={`text-sm ${daysUntilClose < 0 ? 'text-red-600' : daysUntilClose < 7 ? 'text-orange-600' : 'text-green-600'}`}>
                  {daysUntilClose < 0 ? `${Math.abs(daysUntilClose)} days overdue` : 
                   daysUntilClose === 0 ? 'Today' : 
                   `${daysUntilClose} days left`}
                </div>
              )}
            </div>
          </div>

          {/* Probability Bar */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Win Probability</span>
              <Badge className={getProbabilityColor(deal.probability || 0)}>
                {deal.probability || 0}%
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${deal.probability || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Deal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Stage Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Stage Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stage:</span>
                    <DealStageBadge stage={deal.stage} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pipeline:</span>
                    <span className="font-medium">Standard Sales Pipeline</span>
                  </div>
                  {deal.leadSource && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead Source:</span>
                      <span className="font-medium">{deal.leadSource}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {deal.contactName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{deal.contactName}</span>
                    </div>
                    {deal.accountName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account:</span>
                        <span className="font-medium">{deal.accountName}</span>
                      </div>
                    )}
                    {deal.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{deal.email}</span>
                      </div>
                    )}
                    {deal.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{deal.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Tags */}
              {deal.tags && deal.tags.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {deal.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Contacts */}
              {relatedContacts.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Related Contacts ({relatedContacts.length})
                  </h3>
                  <div className="space-y-2">
                    {relatedContacts.slice(0, 3).map(contact => (
                      <div key={contact.id} className="flex justify-between items-center">
                        <span className="text-gray-600">{contact.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {contact.title || 'Contact'}
                        </Badge>
                      </div>
                    ))}
                    {relatedContacts.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{relatedContacts.length - 3} more contacts
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activities */}
              {relatedActivities.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
                  <div className="space-y-2">
                    {relatedActivities.slice(0, 3).map(activity => (
                      <div key={activity.id} className="flex justify-between items-center">
                        <span className="text-gray-600">{activity.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(deal.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{new Date(deal.updatedAt).toLocaleString()}</span>
                  </div>
                  {deal.sourceLeadId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Converted from Lead:</span>
                      <span className="font-medium">Yes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {deal.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{deal.description}</p>
            </div>
          )}

          {/* Next Steps / Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleAddActivity}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewRelatedContacts}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              View Related Contacts
            </Button>
            <Button 
              onClick={handleEditDeal}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Deal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDealDialog;