import React, { useState } from "react";
import ActivitiesList from "@/components/activities/ActivitiesList"; // ← Default import
import { CreateActivityDialog } from "@/components/activities/CreateActivityDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-gray-600">
            Manage your tasks, meetings, and calls
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          + New Activity
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
          <ActivitiesList type="all" />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <ActivitiesList type="tasks" />
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <ActivitiesList type="meetings" />
        </TabsContent>

        <TabsContent value="calls" className="space-y-4">
          <ActivitiesList type="calls" />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <ActivitiesList type="completed" />
        </TabsContent>
      </Tabs>

      <CreateActivityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
