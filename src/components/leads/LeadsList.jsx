import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Mail, Phone, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import LeadDetailSheet from './LeadDetailSheet';
import ConvertLeadDialog from './ConvertLeadDialog';

const LeadsList = ({ leads }) => {
  const { data, updateData, addDataItem } = useData();
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      'Contacted': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
      'Qualified': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      'Lost': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setDetailSheetOpen(true);
  };

  const handleConvert = (lead) => {
    setSelectedLead(lead);
    setConvertDialogOpen(true);
  };

  const handleDelete = (leadId) => {
    const updatedLeads = data.leads.filter(l => l.id !== leadId);
    updateData('leads', updatedLeads);
    toast({
      title: "Lead Deleted",
      description: `Lead has been removed.`,
    });
  };

  const handleSaveLead = (updatedLead) => {
    const updatedLeads = data.leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    updateData('leads', updatedLeads);
    setDetailSheetOpen(false);
  };

  const processConversion = ({ leadId, accountName, contact, createDeal, deal }) => {
    // 1. Create Account (if it doesn't exist)
    let account = data.accounts.find(acc => acc.name.toLowerCase() === accountName.toLowerCase());
    if (!account) {
      account = { id: Date.now().toString(), name: accountName, website: '', phone: '', industry: '', contacts: 1 };
      addDataItem('accounts', account);
    } else {
      const updatedAccounts = data.accounts.map(acc => acc.id === account.id ? {...acc, contacts: acc.contacts + 1} : acc);
      updateData('accounts', updatedAccounts);
    }

    // 2. Create Contact
    const newContact = { id: Date.now().toString(), ...contact, company: account.name };
    addDataItem('contacts', newContact);

    // 3. Create Deal if requested
    if (createDeal && deal) {
      const newDeal = { id: Date.now().toString(), ...deal, owner: 'John Doe' };
      addDataItem('deals', newDeal);
    }

    // 4. Delete the lead
    handleDelete(leadId);
  };

  if (!leads || leads.length === 0) {
    return <p className="text-center text-muted-foreground py-10">No leads match your criteria. Try adjusting your search or filters.</p>
  }

  return (
    <>
      <div className="space-y-4">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleViewDetails(lead)}>
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    <Badge variant="outline">Score: {lead.score}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="w-4 h-4 mr-2" />
                      {lead.company}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Source:</span>
                    <Badge variant="secondary" className="text-xs">{lead.source}</Badge>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(lead)}>View / Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleConvert(lead)}>Convert to Deal</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <LeadDetailSheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen} lead={selectedLead} onSave={handleSaveLead} />
      <ConvertLeadDialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen} lead={selectedLead} onConvert={processConversion} />
    </>
  );
};

export default LeadsList;