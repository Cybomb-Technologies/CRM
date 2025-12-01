import React from "react";
import { Helmet } from "react-helmet";
import { TasksPageContent } from "@/components/files/activities/tasks/TasksPageContent";

export default function TasksPage() {
  return (
    <>
      <Helmet>
        <title>Tasks - CloudCRM</title>
      </Helmet>
      <TasksPageContent />
    </>
  );
}
