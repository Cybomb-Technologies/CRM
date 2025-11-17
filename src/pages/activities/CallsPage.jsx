import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ActivitiesList, CreateActivityDialog } from "@/components/activities";
import { Button } from "@/components/ui/button";
import { Plus, Phone } from "lucide-react";

export default function CallsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Calls - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Calls</h1>
            <p className="text-gray-600">
              Manage your phone calls and conversations
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Log Call
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
          </div>
        </div>

        <ActivitiesList
          type="calls"
          onCreateActivity={(type) => setIsCreateDialogOpen(true)}
        />

        <CreateActivityDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          defaultType="call"
        />
      </div>
    </>
  );
}
