// src/components/leads/LeadsBulkActions.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Send, 
  Download, 
  Printer, 
  Tag,
  CheckCircle,
  Users,
  FileText,
  Code,
  Shield,
  Mail,
  Copy,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const LeadsBulkActions = ({ 
  selectedLeads, 
  onBulkDelete, 
  onBulkUpdate, 
  onBulkConvert,
  onManageTags,
  onMassEmail,
  onExport,
  onAddToCampaign
}) => {
  const { 
    bulkConvertLeads, 
    manageLeadTags, 
    approveLeads, 
    addLeadsToCampaign, 
    createClientScript,
    deduplicateLeads,
    data,
    fetchLeads
  } = useData();
  const { toast } = useToast();
  
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDeduplicateDialog, setShowDeduplicateDialog] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    status: '',
    source: '',
    industry: ''
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    template: ''
  });
  const [tagsData, setTagsData] = useState({
    tagsToAdd: '',
    tagsToRemove: ''
  });
  const [campaignData, setCampaignData] = useState({
    campaignId: ''
  });
  const [deduplicateCriteria, setDeduplicateCriteria] = useState(['email', 'phone']);

  const handleBulkUpdate = () => {
    const updates = {};
    if (updateData.status) updates.leadStatus = updateData.status;
    if (updateData.source) updates.leadSource = updateData.source;
    if (updateData.industry) updates.industry = updateData.industry;
    
    onBulkUpdate(selectedLeads, updates);
    setShowUpdateDialog(false);
    setUpdateData({ status: '', source: '', industry: '' });
  };

  const handleMassEmail = () => {
    onMassEmail(selectedLeads, emailData);
    setShowEmailDialog(false);
    setEmailData({ subject: '', message: '', template: '' });
  };

  const handleBulkConvert = async () => {
    const result = await bulkConvertLeads(selectedLeads);
    toast({
      title: result.success ? "Success" : "Partial Success",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });
    fetchLeads();
  };

  const handleManageTags = async () => {
    const tagsToAdd = tagsData.tagsToAdd.split(',').map(tag => tag.trim()).filter(tag => tag);
    const tagsToRemove = tagsData.tagsToRemove.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const result = await manageLeadTags(selectedLeads, tagsToAdd, tagsToRemove);
    toast({
      title: "Tags Updated",
      description: result.message,
    });
    setShowTagsDialog(false);
    setTagsData({ tagsToAdd: '', tagsToRemove: '' });
    fetchLeads();
  };

  const handleAddToCampaign = async () => {
    const result = await addLeadsToCampaign(selectedLeads, campaignData.campaignId);
    toast({
      title: "Added to Campaign",
      description: result.message,
    });
    setShowCampaignDialog(false);
    setCampaignData({ campaignId: '' });
    fetchLeads();
  };

  const handleCreateClientScript = async () => {
    const result = createClientScript(selectedLeads);
    setShowScriptDialog(true);
    // In a real app, you might want to download the script file
    toast({
      title: "Script Generated",
      description: result.message,
    });
  };

  const handleApproveLeads = async () => {
    const result = await approveLeads(selectedLeads);
    toast({
      title: "Leads Approved",
      description: result.message,
    });
    setShowApproveDialog(false);
    fetchLeads();
  };

  const handleDeduplicateLeads = async () => {
    const result = await deduplicateLeads(deduplicateCriteria);
    toast({
      title: "Deduplication Complete",
      description: result.message,
    });
    setShowDeduplicateDialog(false);
    fetchLeads();
  };

  const handleExportSheetView = () => {
    const csvContent = selectedLeads.map(leadId => {
      const lead = data.leads.find(l => l.id === leadId);
      return `"${lead?.firstName || ''}","${lead?.lastName || ''}","${lead?.company || ''}","${lead?.email || ''}","${lead?.phone || ''}","${lead?.leadStatus || ''}","${lead?.leadSource || ''}","${lead?.industry || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`First Name,Last Name,Company,Email,Phone,Status,Source,Industry\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-sheet-view.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sheet View Exported",
      description: `${selectedLeads.length} leads exported as CSV.`,
    });
  };

  const handlePrintView = () => {
    const printWindow = window.open('', '_blank');
    const leadsToPrint = selectedLeads.map(leadId => data.leads.find(l => l.id === leadId));
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Leads Print View</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Leads Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Total Leads: ${selectedLeads.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${leadsToPrint.map(lead => `
                <tr>
                  <td>${lead.firstName} ${lead.lastName}</td>
                  <td>${lead.company}</td>
                  <td>${lead.email}</td>
                  <td>${lead.phone}</td>
                  <td>${lead.leadStatus}</td>
                  <td>${lead.leadSource}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleToggleCriteria = (criteria) => {
    setDeduplicateCriteria(prev => 
      prev.includes(criteria) 
        ? prev.filter(c => c !== criteria)
        : [...prev, criteria]
    );
  };

  if (selectedLeads.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-800">
          {selectedLeads.length} lead(s) selected
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* Mass Update */}
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Mass Update
            </DropdownMenuItem>

            {/* Mass Convert */}
            <DropdownMenuItem onClick={handleBulkConvert}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mass Convert
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Manage Tags */}
            <DropdownMenuItem onClick={() => setShowTagsDialog(true)}>
              <Tag className="w-4 h-4 mr-2" />
              Manage Tags
            </DropdownMenuItem>

            {/* Mass Email */}
            <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              Mass Email
            </DropdownMenuItem>

            {/* Autoresponders */}
            <DropdownMenuItem onClick={() => toast({ title: "Autoresponders", description: "Autoresponders feature activated" })}>
              <Mail className="w-4 h-4 mr-2" />
              Autoresponders
            </DropdownMenuItem>

            {/* Add to Campaign */}
            <DropdownMenuItem onClick={() => setShowCampaignDialog(true)}>
              <Users className="w-4 h-4 mr-2" />
              Add to Campaigns
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Approve Leads */}
            <DropdownMenuItem onClick={() => setShowApproveDialog(true)}>
              <Shield className="w-4 h-4 mr-2" />
              Approve Leads
            </DropdownMenuItem>

            {/* Deduplicate Leads */}
            <DropdownMenuItem onClick={() => setShowDeduplicateDialog(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Deduplicate Leads
            </DropdownMenuItem>

            {/* Create Client Script */}
            <DropdownMenuItem onClick={handleCreateClientScript}>
              <Code className="w-4 h-4 mr-2" />
              Create Client Script
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Export */}
            <DropdownMenuItem onClick={() => onExport(selectedLeads)}>
              <Download className="w-4 h-4 mr-2" />
              Export Leads
            </DropdownMenuItem>

            {/* Sheet View */}
            <DropdownMenuItem onClick={handleExportSheetView}>
              <FileText className="w-4 h-4 mr-2" />
              Sheet View
            </DropdownMenuItem>

            {/* Print View */}
            <DropdownMenuItem onClick={handlePrintView}>
              <Printer className="w-4 h-4 mr-2" />
              Print View
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Drafts */}
            <DropdownMenuItem onClick={() => toast({ title: "Drafts", description: "Accessing saved drafts" })}>
              <FileText className="w-4 h-4 mr-2" />
              Drafts
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Destructive Actions */}
            <DropdownMenuItem 
              onClick={() => onBulkDelete(selectedLeads)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Mass Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onBulkDelete(selectedLeads)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected
        </Button>
      </div>

      {/* Mass Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mass Update Leads</DialogTitle>
            <DialogDescription>
              Update {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Source</Label>
              <Select value={updateData.source} onValueChange={(value) => setUpdateData(prev => ({ ...prev, source: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Industry</Label>
              <Select value={updateData.industry} onValueChange={(value) => setUpdateData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update {selectedLeads.length} Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mass Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Mass Email</DialogTitle>
            <DialogDescription>
              Send email to {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select value={emailData.template} onValueChange={(value) => setEmailData(prev => ({ ...prev, template: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input 
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea 
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Email message"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMassEmail}>
              <Send className="w-4 h-4 mr-2" />
              Send to {selectedLeads.length} Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Tags Dialog */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Add or remove tags for {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tags to Add (comma separated)</Label>
              <Input 
                value={tagsData.tagsToAdd}
                onChange={(e) => setTagsData(prev => ({ ...prev, tagsToAdd: e.target.value }))}
                placeholder="hot, enterprise, follow-up"
              />
            </div>
            <div>
              <Label>Tags to Remove (comma separated)</Label>
              <Input 
                value={tagsData.tagsToRemove}
                onChange={(e) => setTagsData(prev => ({ ...prev, tagsToRemove: e.target.value }))}
                placeholder="cold, inactive"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleManageTags}>
              <Tag className="w-4 h-4 mr-2" />
              Update Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Campaign</DialogTitle>
            <DialogDescription>
              Add {selectedLeads.length} selected leads to a campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign</Label>
              <Select value={campaignData.campaignId} onValueChange={(value) => setCampaignData(prev => ({ ...prev, campaignId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {data.campaigns?.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name} ({campaign.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToCampaign}>
              <Users className="w-4 h-4 mr-2" />
              Add to Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Script Dialog */}
      <Dialog open={showScriptDialog} onOpenChange={setShowScriptDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Client Script Generated</DialogTitle>
            <DialogDescription>
              Script for {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {createClientScript(selectedLeads).script}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScriptDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              navigator.clipboard.writeText(createClientScript(selectedLeads).script);
              toast({ title: "Copied", description: "Script copied to clipboard" });
            }}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Leads Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leads</DialogTitle>
            <DialogDescription>
              Approve {selectedLeads.length} selected leads for processing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to approve these leads? This will mark them as approved and ready for further processing.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveLeads}>
              <Shield className="w-4 h-4 mr-2" />
              Approve Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deduplicate Leads Dialog */}
      <Dialog open={showDeduplicateDialog} onOpenChange={setShowDeduplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deduplicate Leads</DialogTitle>
            <DialogDescription>
              Remove duplicate leads based on selected criteria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Deduplication Criteria</Label>
              <div className="space-y-2 mt-2">
                {['email', 'phone', 'firstName+lastName+company'].map(criteria => (
                  <div key={criteria} className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCriteria(criteria)}
                      className="flex items-center space-x-2"
                    >
                      {deduplicateCriteria.includes(criteria) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                      <span>{criteria}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {deduplicateCriteria.length === 0 && (
              <p className="text-sm text-red-600">Please select at least one criteria</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeduplicateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeduplicateLeads}
              disabled={deduplicateCriteria.length === 0}
            >
              <Filter className="w-4 h-4 mr-2" />
              Deduplicate Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsBulkActions;