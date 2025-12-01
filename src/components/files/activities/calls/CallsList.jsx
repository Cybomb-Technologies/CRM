import React, { useState, useEffect } from "react";
import { CallCard } from "./CallCard";
import { CallFilters } from "./CallFilters";
import { EditCallDialog } from "./EditCallDialog";
import { callAPI } from "./utils";

export function CallsList({ onCreateCall, refreshTrigger }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    callType: "all",
  });
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCall, setEditingCall] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const callsData = await callAPI.getCalls(filters);
      setCalls(callsData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching calls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [filters, refreshTrigger]);

  const handleEdit = (call) => {
    setEditingCall(call);
    setIsEditDialogOpen(true);
  };

  const handleComplete = async (call) => {
    try {
      await callAPI.completeCall(call._id);
      fetchCalls(); // Refresh the list
    } catch (error) {
      console.error("Error completing call:", error);
    }
  };

  const handleDelete = async (call) => {
    try {
      if (window.confirm("Are you sure you want to delete this call?")) {
        await callAPI.deleteCall(call._id);
        fetchCalls(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting call:", error);
    }
  };

  const handleStatusChange = async (call, newStatus) => {
    try {
      await callAPI.updateCall(call._id, { status: newStatus });
      fetchCalls(); // Refresh the list
    } catch (error) {
      console.error("Error updating call status:", error);
    }
  };

  const handleCallUpdated = () => {
    fetchCalls(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading calls: {error}</p>
        <button
          onClick={fetchCalls}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CallFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2">📞</span>
            Calls ({calls.length})
          </h3>
        </div>

        {calls.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No calls found</p>
            {filters.search ||
            filters.status !== "all" ||
            filters.priority !== "all" ||
            filters.callType !== "all" ? (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            ) : (
              <button
                onClick={onCreateCall}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Schedule Your First Call
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {calls.map((call) => (
              <CallCard
                key={call._id}
                call={call}
                onEdit={handleEdit}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <EditCallDialog
        call={editingCall}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onCallUpdated={handleCallUpdated}
      />
    </div>
  );
}
