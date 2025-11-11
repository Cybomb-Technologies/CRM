import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import AccountsList from '@/components/accounts/AccountsList';
import CreateAccountDialog from '@/components/accounts/CreateAccountDialog';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

const AccountsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data, addDataItem } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = () => {
    toast({
      title: "Export",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filter",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  
  const onAccountCreated = (account) => {
    addDataItem('accounts', account);
    setCreateDialogOpen(false);
  };

  const filteredAccounts = useMemo(() => {
    return (data.accounts || []).filter(account =>
      Object.values(account).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data.accounts, searchTerm]);

  return (
    <>
      <Helmet>
        <title>Accounts - CloudCRM</title>
        <meta name="description" content="Manage company accounts" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
            <p className="text-muted-foreground mt-1">Manage your company accounts</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Account
            </Button>
          </div>
        </div>
        
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search accounts by name, website..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        <AccountsList accounts={filteredAccounts} />
        <CreateAccountDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onAccountCreated={onAccountCreated} />
      </div>
    </>
  );
};

export default AccountsPage;