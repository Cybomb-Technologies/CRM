import React from "react";
import { ActivityFilters } from "./ActivityFilters";
import { TasksView } from "./TasksView";
import { MeetingsView } from "./MeetingsView";
import { CallsView } from "./CallsView";

export function ActivitiesList({ type = "all" }) {
  const [filters, setFilters] = React.useState({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    callType: "all",
  });

  const renderView = () => {
    switch (type) {
      case "tasks":
        return <TasksView filters={filters} />;
      case "meetings":
        return <MeetingsView filters={filters} />;
      case "calls":
        return <CallsView filters={filters} />;
      case "completed":
        return (
          <div className="space-y-6">
            <TasksView filters={{ ...filters, status: "completed" }} />
            <MeetingsView filters={{ ...filters, status: "completed" }} />
            <CallsView filters={{ ...filters, status: "completed" }} />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <TasksView filters={filters} />
            <MeetingsView filters={filters} />
            <CallsView filters={filters} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        type={type}
      />
      {renderView()}
    </div>
  );
}
