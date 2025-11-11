import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const CreateActivityDialog = ({ open, onOpenChange, onActivityCreated, initialDate }) => {
  const { data } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Task',
    dueDate: '',
    relatedTo: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialDate) {
        setFormData(prev => ({...prev, dueDate: initialDate.split('T')[0]}));
    }
  }, [initialDate, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newActivity = {
      id: Date.now().toString(),
      ...formData,
      status: 'Pending',
      assignedTo: user.name,
      dueDate: new Date(formData.dueDate).toISOString()
    };
    
    if (onActivityCreated) onActivityCreated(newActivity);
    
    toast({
      title: "Activity Created",
      description: `${formData.title} has been added successfully.`
    });
    
    setFormData({ title: '', type: 'Task', dueDate: '', relatedTo: '' });
    onOpenChange(false);
  };
  
  const relatedOptions = [
    ...data.leads.map(l => ({ value: `Lead: ${l.id}`, label: `Lead: ${l.name}`})),
    ...Object.values(data.deals).flat().map(d => ({ value: `Deal: ${d.id}`, label: `Deal: ${d.title}`}))
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="activity-title">Title *</Label>
            <Input
              id="activity-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Task">Task</SelectItem>
                  <SelectItem value="Call">Call</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="related-to">Related To</Label>
             <Select onValueChange={(value) => setFormData({ ...formData, relatedTo: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Lead or Deal" />
              </SelectTrigger>
              <SelectContent>
                {relatedOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityDialog;