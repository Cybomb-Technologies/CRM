import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, CheckCircle2, Circle, Phone, Briefcase, Calendar } from 'lucide-react';
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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ActivitiesList = () => {
  const { data, updateData } = useData();
  const [activities, setActivities] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setActivities(data.activities);
  }, [data.activities]);

  const handleStatusChange = (activityId) => {
    const updatedActivities = activities.map(act =>
      act.id === activityId ? { ...act, status: act.status === 'Pending' ? 'Completed' : 'Pending' } : act
    );
    updateData('activities', updatedActivities);
    toast({
      title: "Activity Updated",
      description: "Status has been changed successfully.",
    });
  };

  const handleDelete = (activityId) => {
    const updatedActivities = activities.filter(act => act.id !== activityId);
    updateData('activities', updatedActivities);
    toast({
      title: "Activity Deleted",
      description: `Activity has been removed.`,
    });
  };
  
  const typeIcons = {
    Task: Briefcase,
    Call: Phone,
    Meeting: Calendar,
  };

  if (!activities || activities.length === 0) {
    return <p className="text-center text-muted-foreground">No activities found. Create one to get started!</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = typeIcons[activity.type] || Circle;
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                   <Button variant="ghost" size="icon" onClick={() => handleStatusChange(activity.id)} className="flex-shrink-0">
                    {activity.status === 'Completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <h3 className={cn("font-medium text-foreground", activity.status === 'Completed' && 'line-through text-muted-foreground')}>{activity.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-1.5" />
                        {activity.type}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {format(new Date(activity.dueDate), 'MMM dd, yyyy')}
                      </div>
                       <div className="flex items-center">
                        <Badge variant="outline">{activity.relatedTo}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(activity.id)}>Mark as {activity.status === 'Pending' ? 'Completed' : 'Pending'}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({description:"🚧 Not implemented"})}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(activity.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  );
};

export default ActivitiesList;