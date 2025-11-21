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
  Users,
  FileText,
  Filter,
  Copy,
  Mail
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const DealsBulkActions = ({ 
  selectedDeals, 
  onBulkDelete, 
  onBulkUpdate,
  onExport
}) => {
  const { 
    bulkUpdateDeals, 
    bulkDeleteDeals, 
    manageDealTags,
    getDealStages,
    data
  } = useData();
  const { toast } = useToast();
  const dealStages = getDealStages();
  
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    stage: '',
    owner: '',
    probability: ''
  });
  const [tagsData, setTagsData] = useState({
    tagsToAdd: '',
    tagsToRemove: ''
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  const handleBulkUpdate = () => {
    const updates = {};
    if (updateData.stage) updates.stage = updateData.stage;
    if (updateData.owner) updates.owner = updateData.owner;
    if (updateData.probability) updates.probability = parseInt(updateData.probability);
    
    onBulkUpdate(selectedDeals, updates);
    setShowUpdateDialog(false);
    setUpdateData({ stage: '', owner: '', probability: '' });
  };

  const handleManageTags = async () => {
    const tagsToAdd = tagsData.tagsToAdd.split(',').map(tag => tag.trim()).filter(tag => tag);
    const tagsToRemove = tagsData.tagsToRemove.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const result = await manageDealTags(selectedDeals, tagsToAdd, tagsToRemove);
    toast({
      title: "Tags Updated",
      description: result.message,
    });
    setShowTagsDialog(false);
    setTagsData({ tagsToAdd: '', tagsToRemove: '' });
  };

  const handleMassEmail = () => {
    // Simulate sending mass email
    console.log('Sending mass email to deals:', selectedDeals, emailData);
    toast({
      title: "Mass Email Sent",
      description: `Email sent for ${selectedDeals.length} deals.`,
    });
    setShowEmailDialog(false);
    setEmailData({ subject: '', message: '' });
  };

  const handleExportSheetView = () => {
    const csvContent = selectedDeals.map(dealId => {
      const deal = data.deals ? Object.values(data.deals).flat().find(d => d.id === dealId) : null;
      return `"${deal?.title || ''}","${deal?.company || ''}","${deal?.contactName || ''}","${deal?.value || ''}","${deal?.probability || ''}","${deal?.stage || ''}","${deal?.owner || ''}","${deal?.closeDate || ''}"`;
    }).join('\n');
    
    const blob = new Blob([`Title,Company,Contact,Value,Probability,Stage,Owner,Close Date\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deals-sheet-view.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sheet View Exported",
      description: `${selectedDeals.length} deals exported as CSV.`,
    });
  };

  const handlePrintView = () => {
    const printWindow = window.open('', '_blank');
    const dealsToPrint = selectedDeals.map(dealId => 
      data.deals ? Object.values(data.deals).flat().find(d => d.id === dealId) : null
    ).filter(Boolean);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Deals Print View</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { text-align: center; margin-bottom: 20px; }
            .stage-badge { padding: 2px 6px; border-radius: 12px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Deals Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Total Deals: ${selectedDeals.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Value</th>
                <th>Probability</th>
                <th>Stage</th>
                <th>Owner</th>
                <th>Close Date</th>
              </tr>
            </thead>
            <tbody>
              ${dealsToPrint.map(deal => `
                <tr>
                  <td>${deal.title}</td>
                  <td>${deal.company}</td>
                  <td>${deal.contactName || 'N/A'}</td>
                  <td>$${deal.value?.toLocaleString() || '0'}</td>
                  <td>${deal.probability}%</td>
                  <td><span class="stage-badge">${dealStages[deal.stage] || deal.stage}</span></td>
                  <td>${deal.owner}</td>
                  <td>${deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : 'N/A'}</td>
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

  if (selectedDeals.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-800">
          {selectedDeals.length} deal(s) selected
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

            <DropdownMenuSeparator />

            {/* Export */}
            <DropdownMenuItem onClick={() => onExport(selectedDeals)}>
              <Download className="w-4 h-4 mr-2" />
              Export Deals
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
              onClick={() => onBulkDelete(selectedDeals)}
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
          onClick={() => onBulkDelete(selectedDeals)}
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
            <DialogTitle>Mass Update Deals</DialogTitle>
            <DialogDescription>
              Update {selectedDeals.length} selected deals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Stage</Label>
              <Select value={updateData.stage} onValueChange={(value) => setUpdateData(prev => ({ ...prev, stage: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dealStages).map(([stageKey, stageLabel]) => (
                    <SelectItem key={stageKey} value={stageKey}>
                      {stageLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Owner</Label>
              <Input
                value={updateData.owner}
                onChange={(e) => setUpdateData(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="New owner name"
              />
            </div>

            <div>
              <Label>Probability</Label>
              <Select value={updateData.probability} onValueChange={(value) => setUpdateData(prev => ({ ...prev, probability: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select probability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10% - Very Low</SelectItem>
                  <SelectItem value="25">25% - Low</SelectItem>
                  <SelectItem value="50">50% - Medium</SelectItem>
                  <SelectItem value="75">75% - High</SelectItem>
                  <SelectItem value="90">90% - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update {selectedDeals.length} Deals
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
            Add or remove tags for {selectedDeals.length} selected deals
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tags to Add (comma separated)</Label>
            <Input 
              value={tagsData.tagsToAdd}
              onChange={(e) => setTagsData(prev => ({ ...prev, tagsToAdd: e.target.value }))}
              placeholder="enterprise, urgent, follow-up"
            />
          </div>
          <div>
            <Label>Tags to Remove (comma separated)</Label>
            <Input 
              value={tagsData.tagsToRemove}
              onChange={(e) => setTagsData(prev => ({ ...prev, tagsToRemove: e.target.value }))}
              placeholder="cold, inactive, old"
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

      {/* Mass Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Mass Email</DialogTitle>
            <DialogDescription>
              Send email for {selectedDeals.length} selected deals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              Send for {selectedDeals.length} Deals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DealsBulkActions;