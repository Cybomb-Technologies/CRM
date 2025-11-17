import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ActivitiesList } from "@/components/activities/ActivitiesList"; // ← Default import
import { CreateActivityDialog } from "@/components/activities/CreateActivityDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Activities - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Activities</h1>
            <p className="text-gray-600">
              Manage your tasks, meetings, and calls
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Activity
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ActivitiesList
              type="all"
              onCreateActivity={(type) => setIsCreateDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <ActivitiesList
              type="tasks"
              onCreateActivity={(type) => setIsCreateDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <ActivitiesList
              type="meetings"
              onCreateActivity={(type) => setIsCreateDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <ActivitiesList
              type="calls"
              onCreateActivity={(type) => setIsCreateDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <ActivitiesList
              type="completed"
              onCreateActivity={(type) => setIsCreateDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>

        <CreateActivityDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </>
  );
}
