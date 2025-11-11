import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ActivitiesList from '@/components/activities/ActivitiesList';
import CreateActivityDialog from '@/components/activities/CreateActivityDialog';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const ActivitiesPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { addDataItem } = useData();
  const { toast } = useToast();

  const onActivityCreated = (activity) => {
    addDataItem('activities', activity);
    setCreateDialogOpen(false);
  };
  
  const handleFilter = () => {
    toast({
      title: "Filter",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Activities - CloudCRM</title>
        <meta name="description" content="Track tasks, calls, and meetings" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activities</h1>
            <p className="text-muted-foreground mt-1">Track tasks, calls, and meetings</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Activity
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search activities..." className="pl-10" />
            </div>
            <Button variant="outline" onClick={handleFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        <ActivitiesList />
        <CreateActivityDialog 
          open={createDialogOpen} 
          onOpenChange={setCreateDialogOpen} 
          onActivityCreated={onActivityCreated} 
        />
      </div>
    </>
  );
};

export default ActivitiesPage;