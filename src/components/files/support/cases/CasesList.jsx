import React from "react";
import { CaseFilters } from "./CaseFilters";
import { CaseCard } from "./CaseCard";
import { mockCases } from "./utils";

export function CasesList({ status = "all" }) {
  const [filters, setFilters] = React.useState({
    search: "",
    status: "all",
    priority: "all",
    type: "all",
    caseOrigin: "all",
  });

  const filteredCases = mockCases.filter((caseItem) => {
    if (status !== "all" && caseItem.status !== status) return false;
    if (
      filters.search &&
      !caseItem.subject.toLowerCase().includes(filters.search.toLowerCase()) &&
      !caseItem.caseNumber.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
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

  const handleEdit = (caseItem) => {
    console.log("Edit case:", caseItem);
  };

  const handleResolve = (caseItem) => {
    console.log("Resolve case:", caseItem);
  };

  const handleDelete = (caseItem) => {
    console.log("Delete case:", caseItem);
  };

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
              key={caseItem.id}
              caseItem={caseItem}
              onEdit={handleEdit}
              onResolve={handleResolve}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
