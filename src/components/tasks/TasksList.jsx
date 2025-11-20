import React, { useState, useEffect } from "react";
import { TaskCard } from "./TaskCard";
import { TaskFilters } from "./TaskFilters";
import { EditTaskDialog } from "./EditTaskDialog";
import { taskAPI } from "./utils";

export function TasksList({ onCreateTask, refreshTrigger }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskAPI.getTasks(filters);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters, refreshTrigger]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleComplete = async (task) => {
    try {
      await taskAPI.completeTask(task._id);
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDelete = async (task) => {
    try {
      if (window.confirm("Are you sure you want to delete this task?")) {
        await taskAPI.deleteTask(task._id);
        fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskUpdated = () => {
    fetchTasks(); // Refresh the list
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
        <p>Error loading tasks: {error}</p>
        <button
          onClick={fetchTasks}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2">✅</span>
            Tasks ({tasks.length})
          </h3>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No tasks found</p>
            {filters.search ||
            filters.status !== "all" ||
            filters.priority !== "all" ? (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            ) : (
              <button
                onClick={onCreateTask}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <EditTaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  );
}
