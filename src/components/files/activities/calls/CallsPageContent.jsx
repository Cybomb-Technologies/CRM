import React, { useState } from "react";
import { CallsList } from "./CallsList";
import { CreateCallDialog } from "./CreateCallDialog";
import { Button } from "@/components/ui/button";
import { Plus, Phone } from "lucide-react";

export function CallsPageContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCallCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calls</h1>
          <p className="text-gray-600">
            Manage your phone calls and conversations
          </p>
        </div>
        <div className="flex space-x-2">
          {/* <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
            <Phone className="w-4 h-4 mr-2" />
            Log Call
          </Button> */}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Call
          </Button>
        </div>
      </div>

      <CallsList
        onCreateCall={() => setIsCreateDialogOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <CreateCallDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCallCreated={handleCallCreated}
      />
    </div>
  );
}
