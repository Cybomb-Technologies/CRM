import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DealsKanban from '@/components/deals/DealsKanban';
import CreateDealDialog from '@/components/deals/CreateDealDialog';
import { useData } from '@/contexts/DataContext';

const DealsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { addDataItem } = useData();

  const onDealCreated = (deal) => {
    addDataItem('deals', deal);
    setCreateDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Deals - CloudCRM</title>
        <meta name="description" content="Manage your sales pipeline" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deals Pipeline</h1>
            <p className="text-muted-foreground mt-1">Track and manage your sales opportunities</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>

        <DealsKanban />
        <CreateDealDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onDealCreated={onDealCreated} />
      </div>
    </>
  );
};

export default DealsPage;