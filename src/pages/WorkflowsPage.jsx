
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Zap, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const WorkflowsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([
    { id: '1', name: 'Lead Auto-Assignment', description: 'Automatically assign new leads based on territory', active: true, triggers: 3, actions: 5 },
    { id: '2', name: 'Deal Stage Notifications', description: 'Notify team when deals move stages', active: true, triggers: 1, actions: 2 },
    { id: '3', name: 'Follow-up Reminders', description: 'Create tasks for inactive leads', active: false, triggers: 2, actions: 3 }
  ]);
  
  const toggleWorkflow = (id) => {
    setWorkflows(workflows.map(wf => wf.id === id ? { ...wf, active: !wf.active } : wf));
  };
  
  const handleDelete = (id) => {
    setWorkflows(workflows.filter(wf => wf.id !== id));
    toast({ title: 'Workflow Deleted', description: 'The workflow has been removed.' });
  };

  const handleDuplicate = (id) => {
      const original = workflows.find(wf => wf.id === id);
      const newWorkflow = { ...original, id: Date.now().toString(), name: `${original.name} (Copy)`, active: false };
      setWorkflows([newWorkflow, ...workflows]);
      toast({ title: 'Workflow Duplicated', description: `A copy of "${original.name}" has been created.` });
  };

  return (
    <>
      <Helmet>
        <title>Workflows - CloudCRM</title>
        <meta name="description" content="Automate your processes" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflow Automation</h1>
            <p className="text-muted-foreground mt-1">Automate repetitive tasks and processes</p>
          </div>
          <Button onClick={() => navigate('/workflows/builder')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        <div className="grid gap-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription className="mt-1">{workflow.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Switch checked={workflow.active} onCheckedChange={() => toggleWorkflow(workflow.id)} />
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/workflows/builder/${workflow.id}`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(workflow.id)}>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(workflow.id)} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/40">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                   </DropdownMenu>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>{workflow.triggers} Triggers</span>
                  <span>{workflow.actions} Actions</span>
                   <Badge className={workflow.active ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}>
                    {workflow.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkflowsPage;
