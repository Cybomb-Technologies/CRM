import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { CasesList } from "@/components/cases/CasesList";
import { CreateCaseDialog } from "@/components/cases/CreateCaseDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download } from "lucide-react";

export default function CasesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Cases - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Cases</h1>
            <p className="text-gray-600">
              Record customer feedback and support issues
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Import Cases
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Case
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Cases</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="waiting">Waiting</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <CasesList status="all" />
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <CasesList status="New" />
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <CasesList status="In Progress" />
          </TabsContent>

          <TabsContent value="waiting" className="space-y-4">
            <CasesList status="Waiting on Customer" />
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <CasesList status="Resolved" />
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <CasesList status="Closed" />
          </TabsContent>
        </Tabs>

        <CreateCaseDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </>
  );
}
