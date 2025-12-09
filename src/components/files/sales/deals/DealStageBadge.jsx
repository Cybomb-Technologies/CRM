// src/components/deals/DealStageBadge.jsx
import React from "react";
import { Badge } from "@/components/ui/badge";

const DealStageBadge = ({ stage }) => {
  const getStageConfig = (stage) => {
    const stages = {
      qualification: {
        label: "Qualification",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      "needs-analysis": {
        label: "Needs Analysis",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      "value-proposition": {
        label: "Value Proposition",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      "identify-decision-makers": {
        label: "Identify Decision Makers",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      "proposal-price-quote": {
        label: "Proposal/Price Quote",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      },
      "negotiation-review": {
        label: "Negotiation/Review",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      "closed-won": {
        label: "Closed Won",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      "closed-lost": {
        label: "Closed Lost",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      "closed-lost-to-competition": {
        label: "Closed Lost to Competition",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };

    return (
      stages[stage] || {
        label: stage,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  const stageConfig = getStageConfig(stage);

  return (
    <Badge variant="outline" className={stageConfig.color}>
      {stageConfig.label}
    </Badge>
  );
};

export default DealStageBadge;
