import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { TasksList } from "@/components/files/activities/tasks/TasksList";
import { CreateTaskDialog } from "@/components/files/activities/tasks/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <Helmet>
        <title>Tasks - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-gray-600">Manage your tasks and to-do items</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        <TasksList
          onCreateTask={() => setIsCreateDialogOpen(true)}
          refreshTrigger={refreshTrigger}
        />

        <CreateTaskDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onTaskCreated={handleTaskCreated}
        />
      </div>
    </>
  );
}
