import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { SolutionsList } from "@/components/solutions/SolutionsList";
import { CreateSolutionDialog } from "@/components/solutions/CreateSolutionDialog";
import { ImportSolutionsDialog } from "@/components/solutions/ImportSolutionsDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download } from "lucide-react";

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Solutions - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Solutions</h1>
            <p className="text-gray-600">
              Provide solutions to help solve recurrent problems encountered by
              customers
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Import Solutions
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Solution
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Solutions</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="review">Under Review</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <SolutionsList status="all" />
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            <SolutionsList status="Published" />
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <SolutionsList status="Draft" />
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <SolutionsList status="Review" />
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            <SolutionsList status="Archived" />
          </TabsContent>
        </Tabs>

        <CreateSolutionDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        <ImportSolutionsDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
        />
      </div>
    </>
  );
}
