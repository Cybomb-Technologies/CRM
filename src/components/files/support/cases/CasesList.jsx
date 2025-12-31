import React from "react";
import { casesService } from "./casesService";
import { CaseFilters } from "./CaseFilters"; // Keep this if used, or remove if not needed/mock
import { CaseCard } from "./CaseCard";
import { Button } from "@/components/ui/button"; // For refresh or error retry
import { CreateCaseDialog } from "./CreateCaseDialog";

export function CasesList({ status = "all" }) {
  const [cases, setCases] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    search: "",
    status: "all",
    priority: "all",
    type: "all",
    caseOrigin: "all",
  });

  const fetchCases = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await casesService.fetchCases();
      if (response.success) {
        setCases(response.data);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch cases");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Client-side filtering logic (can be moved to server-side later if needed)
  const filteredCases = cases.filter((caseItem) => {
    // Tab status filter
    if (status !== "all" && caseItem.status !== status) return false;

    // Search filter
    if (
      filters.search &&
      !caseItem.subject.toLowerCase().includes(filters.search.toLowerCase()) &&
      (!caseItem.caseNumber || !caseItem.caseNumber.toLowerCase().includes(filters.search.toLowerCase()))
    ) {
      return false;
    }

    // Dropdown filters
    if (filters.status !== "all" && caseItem.status !== filters.status)
      return false;
    if (filters.priority !== "all" && caseItem.priority !== filters.priority)
      return false;
    if (filters.type !== "all" && caseItem.type !== filters.type) return false;
    if (
      filters.caseOrigin !== "all" &&
      caseItem.caseOrigin !== filters.caseOrigin
    )
      return false;

    return true;
  });

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedCase, setSelectedCase] = React.useState(null);

  const handleEdit = (caseItem) => {
    setSelectedCase(caseItem);
    setIsEditOpen(true);
  };

  const handleError = (msg) => {
    // Small helper if we want to show non-blocking errors, 
    // but for now we just use console or alert if needed.
    console.error(msg);
  }

  const handleResolve = async (caseItem) => {
    if (window.confirm("Are you sure you want to resolve this case?")) {
      const response = await casesService.updateCase(caseItem._id, { status: "Resolved" });
      if (response.success) {
        fetchCases();
      } else {
        alert("Failed to resolve case: " + response.message);
      }
    }
  };

  const handleDelete = async (caseItem) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      const response = await casesService.deleteCase(caseItem._id);
      if (response.success) {
        fetchCases();
      } else {
        alert("Failed to delete case: " + response.message);
      }
    }
  };

  const handleEditSuccess = () => {
    fetchCases();
    setIsEditOpen(false);
    setSelectedCase(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading cases...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
        <Button onClick={fetchCases} variant="link" className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CaseFilters
        filters={filters}
        onFiltersChange={setFilters}
        status={status}
      />

      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No cases found</p>
          </div>
        ) : (
          filteredCases.map((caseItem) => (
            <CaseCard
              key={caseItem._id}
              caseItem={caseItem}
              onEdit={handleEdit}
              onResolve={handleResolve}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {selectedCase && (
        <CreateCaseDialog
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setSelectedCase(null);
          }}
          onSuccess={handleEditSuccess}
          caseToEdit={selectedCase}
        />
      )}
    </div>
  );
}
