import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ContactsList from '@/components/contacts/ContactsList';
import CreateContactDialog from '@/components/contacts/CreateContactDialog';
import { useToast } from '@/components/ui/use-toast';

const ContactsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

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

  const onContactCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Helmet>
        <title>Contacts - CloudCRM</title>
        <meta name="description" content="Manage your contacts" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground mt-1">Manage your contact relationships</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Contact
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-10" />
            </div>
            <Button variant="outline" onClick={handleFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        <ContactsList key={refreshKey} onAction={() => setRefreshKey(prev => prev + 1)} />
        <CreateContactDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onContactCreated={onContactCreated} />
      </div>
    </>
  );
};

export default ContactsPage;