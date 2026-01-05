import React from "react";
import { SolutionFilters } from "./SolutionFilters";
import { SolutionCard } from "./SolutionCard";
import { mockSolutions } from "./utils";
import { CreateSolutionDialog } from "./CreateSolutionDialog";
import { ViewSolutionDialog } from "./ViewSolutionDialog";

export function SolutionsList({ status = "all" }) {
  const [selectedSolution, setSelectedSolution] = React.useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [viewSolution, setViewSolution] = React.useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [cloneSolution, setCloneSolution] = React.useState(null);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    search: "",
    status: "all",
    product: "all",
  });

  const filteredSolutions = mockSolutions.filter((solution) => {
    if (status !== "all" && solution.status !== status) return false;
    if (
      filters.search &&
      !solution.solutionTitle
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      !solution.question.toLowerCase().includes(filters.search.toLowerCase()) &&
      !solution.solutionNumber
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status !== "all" && solution.status !== filters.status)
      return false;
    if (filters.product !== "all" && solution.productName !== filters.product)
      return false;
    return true;
  });

  const handleEdit = (solution) => {
    setSelectedSolution(solution);
    setIsEditDialogOpen(true);
  };

  const handleView = (solution) => {
    setViewSolution(solution);
    setIsViewDialogOpen(true);
  };

  const handleClone = (solution) => {
    // Treat as a new solution but pre-fill data
    setCloneSolution(solution);
    setIsCloneDialogOpen(true);
  };

  const handleShare = (solution) => {
    // Mock share - copy to clipboard
    const text = `Check out this solution: ${solution.solutionTitle}\n\nQuestion: ${solution.question}\nAnswer: ${solution.answer}`;
    navigator.clipboard.writeText(text);
    alert("Solution details copied to clipboard!");
  };

  const handlePublish = (solution) => {
    console.log("Publish solution:", solution);
  };

  const handleDelete = (solution) => {
    if (window.confirm("Are you sure you want to delete this solution?")) {
        console.log("Delete solution:", solution);
        // Add delete API logic here
    }
  };

  return (
    <>
      <div className="space-y-6">
        <SolutionFilters
          filters={filters}
          onFiltersChange={setFilters}
          status={status}
        />

        <div className="space-y-4">
          {filteredSolutions.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-500">No solutions found</p>
            </div>
          ) : (
            filteredSolutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                onEdit={handleEdit}
                onPublish={handlePublish}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
      <CreateSolutionDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedSolution(null);
        }}
        solutionToEdit={selectedSolution}
      />
      
      <ViewSolutionDialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        solution={viewSolution} 
      />

      <CreateSolutionDialog
        open={isCloneDialogOpen}
        onOpenChange={(open) => {
            setIsCloneDialogOpen(open);
            if (!open) setCloneSolution(null);
        }}
        solutionToEdit={cloneSolution} // Reuse edit prop to pre-fill
        // We might want to clear the ID or indicate it's a clone in the dialog, 
        // but for now reusing the prop works to fill the form.
        // Ideally CreateSolutionDialog should handle "isClone" to maybe append "(Copy)" to title.
      />
    </>
  );
}
