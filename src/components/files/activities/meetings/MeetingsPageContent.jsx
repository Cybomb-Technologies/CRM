import React, { useState } from "react";
import { MeetingsList } from "./MeetingsList";
import { CreateMeetingDialog } from "./CreateMeetingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function MeetingsPageContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMeetingCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-gray-600">Schedule and manage your meetings</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <MeetingsList
        onCreateMeeting={() => setIsCreateDialogOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <CreateMeetingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}
