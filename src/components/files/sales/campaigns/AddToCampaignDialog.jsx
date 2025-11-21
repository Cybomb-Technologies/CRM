// src/components/campaigns/AddToCampaignDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const AddToCampaignDialog = ({ open, onOpenChange, selectedLeads, onSuccess }) => {
  const { campaigns = [], updateDataItem, leads } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  // Safe filtering with null checks
  const filteredCampaigns = campaigns.filter(campaign => {
    if (!campaign) return false;
    
    const campaignName = campaign.campaignName || '';
    const campaignType = campaign.type || '';
    const campaignStatus = campaign.status || '';
    
    const matchesSearch = 
      campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaignType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaignStatus.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isActive = campaign.status === 'Active' || campaign.status === 'Planning';
    
    return matchesSearch && isActive;
  });

  const handleAddToCampaign = () => {
    if (!selectedCampaign) {
      toast({
        title: "Error",
        description: "Please select a campaign.",
        variant: "destructive"
      });
      return;
    }

    const campaign = campaigns.find(c => c.id === selectedCampaign);
    if (!campaign) {
      toast({
        title: "Error",
        description: "Selected campaign not found.",
        variant: "destructive"
      });
      return;
    }

    // Get current members or initialize empty array
    const currentMembers = Array.isArray(campaign.members) ? campaign.members : [];
    const updatedMembers = [...currentMembers];
    
    // Add selected leads to campaign members
    selectedLeads.forEach(leadId => {
      const lead = leads.find(l => l.id === leadId);
      if (lead && !updatedMembers.find(member => member.id === leadId)) {
        updatedMembers.push({
          id: lead.id,
          name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim(),
          email: lead.email || '',
          type: 'lead',
          company: lead.company || '',
          addedDate: new Date().toISOString(),
          responded: false,
          converted: false
        });
      }
    });

    const updatedCampaign = {
      ...campaign,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };

    updateDataItem('campaigns', campaign.id, updatedCampaign);

    toast({
      title: "Success",
      description: `${selectedLeads.length} leads added to ${campaign.campaignName || 'the campaign'}.`,
    });

    setSelectedCampaign('');
    setSearchTerm('');
    onOpenChange(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Leads to Campaign</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Adding {selectedLeads.length} selected leads to a campaign.
            </p>
            
            <Input
              placeholder="Search active campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            <div className="max-h-60 overflow-y-auto border rounded-md">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedCampaign === campaign.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{campaign.campaignName || 'Unnamed Campaign'}</p>
                        <p className="text-sm text-gray-600">
                          {campaign.type || 'No type'} • {Array.isArray(campaign.members) ? campaign.members.length : 0} members
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'No start date'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {campaign.expectedResponse || 0}% expected response
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No matching campaigns found.' : 'No active campaigns available.'}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddToCampaign}
            disabled={!selectedCampaign}
          >
            Add to Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCampaignDialog;