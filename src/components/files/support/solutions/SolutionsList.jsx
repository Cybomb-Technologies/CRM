import React from "react";
import { SolutionFilters } from "./SolutionFilters";
import { SolutionCard } from "./SolutionCard";
import { mockSolutions } from "./utils";

export function SolutionsList({ status = "all" }) {
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
    console.log("Edit solution:", solution);
  };

  const handlePublish = (solution) => {
    console.log("Publish solution:", solution);
  };

  const handleDelete = (solution) => {
    console.log("Delete solution:", solution);
  };

  return (
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
  );
}
