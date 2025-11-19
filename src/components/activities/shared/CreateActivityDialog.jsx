import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskForm } from "../tasks/TaskForm";
import { MeetingForm } from "../meetings/MeetingForm";
import { CallForm } from "../calls/CallForm";

export function CreateActivityDialog({
  open,
  onOpenChange,
  defaultType = "task",
}) {
  const [activeType, setActiveType] = useState(defaultType);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    startTime: "",
    endTime: "",
    scheduledTime: "",
    priority: "medium",
    status: "pending",
    relatedTo: "",
    relatedToType: "deal",
    attendees: "",
    location: "",
    duration: "",
    isOnline: false,
    callType: "outbound",
    phoneNumber: "",
    outcome: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating activity:", { type: activeType, ...formData });
    onOpenChange(false);
    // Reset form
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      startTime: "",
      endTime: "",
      scheduledTime: "",
      priority: "medium",
      status: "pending",
      relatedTo: "",
      relatedToType: "deal",
      attendees: "",
      location: "",
      duration: "",
      isOnline: false,
      callType: "outbound",
      phoneNumber: "",
      outcome: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>
            Add a new task, meeting, or call to track your customer
            interactions.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeType}
          onValueChange={setActiveType}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="task">Task</TabsTrigger>
            <TabsTrigger value="meeting">Meeting</TabsTrigger>
            <TabsTrigger value="call">Call</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="task" className="space-y-4 mt-4">
              <TaskForm formData={formData} onInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="meeting" className="space-y-4 mt-4">
              <MeetingForm
                formData={formData}
                onInputChange={handleInputChange}
              />
            </TabsContent>

            <TabsContent value="call" className="space-y-4 mt-4">
              <CallForm formData={formData} onInputChange={handleInputChange} />
            </TabsContent>

            <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create{" "}
                {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
