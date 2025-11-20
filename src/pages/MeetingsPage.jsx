import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { MeetingsList } from "@/components/meetings/MeetingsList";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MeetingsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Meetings - CloudCRM</title>
      </Helmet>

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

        <MeetingsList onCreateMeeting={() => setIsCreateDialogOpen(true)} />

        <CreateMeetingDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </>
  );
}
