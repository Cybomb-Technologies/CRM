import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import LeadsList from '@/components/leads/LeadsList';
import CreateLeadDialog from '@/components/leads/CreateLeadDialog';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LeadsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data, addDataItem, updateData } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: { New: true, Contacted: true, Qualified: true, Lost: true },
    source: { Website: true, Referral: true, LinkedIn: true, 'Cold Call': true, Event: true },
  });

  const handleExport = () => {
    toast({
      title: "Exporting Leads...",
      description: "This feature is not fully implemented in the demo.",
    });
    // Basic CSV export logic
    const headers = ['id', 'name', 'company', 'email', 'phone', 'status', 'source', 'score'];
    const csvContent = [
      headers.join(','),
      ...data.leads.map(lead => headers.map(header => `"${lead[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'leads.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onLeadCreated = (lead) => {
    addDataItem('leads', lead);
    setCreateDialogOpen(false);
  };

  const filteredLeads = useMemo(() => {
    return (data.leads || []).filter(lead => {
      const searchMatch = Object.values(lead).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const statusMatch = filters.status[lead.status];
      const sourceMatch = filters.source[lead.source];
      return searchMatch && statusMatch && sourceMatch;
    });
  }, [data.leads, searchTerm, filters]);

  const handleFilterChange = (type, key) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key]
      }
    }));
  };

  return (
    <>
      <Helmet>
        <title>Leads - CloudCRM</title>
        <meta name="description" content="Manage your sales leads" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-1">Manage and convert your sales leads</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search leads by name, company, email..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(filters.status).map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.status[status]}
                    onCheckedChange={() => handleFilterChange('status', status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuLabel className="mt-2">Source</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(filters.source).map(source => (
                  <DropdownMenuCheckboxItem
                    key={source}
                    checked={filters.source[source]}
                    onCheckedChange={() => handleFilterChange('source', source)}
                  >
                    {source}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        <LeadsList leads={filteredLeads} />
        <CreateLeadDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onLeadCreated={onLeadCreated} />
      </div>
    </>
  );
};

export default LeadsPage;