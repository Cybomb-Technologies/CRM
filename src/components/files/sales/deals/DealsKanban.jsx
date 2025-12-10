// src/components/deals/DealsKanban.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreVertical,
  MoveRight,
  IndianRupee,
  Target,
  Calendar,
  User,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import DealStageBadge from "./DealStageBadge";
import dealsAPI from "./dealsAPI";

const DealsKanban = ({
  deals,
  loading,
  selectedDeals,
  onDealSelect,
  onDealView,
  onDealEdit,
  onDealDelete,
  refreshDeals,
}) => {
  const { toast } = useToast();

  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dealStages, setDealStages] = useState({});

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const stages = await dealsAPI.getDealStages();
        setDealStages(stages);
      } catch (error) {
        console.error("Error fetching deal stages:", error);
      }
    };

    fetchStages();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading deals...</p>
      </div>
    );
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.setData("text/plain", deal._id || deal.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedDeal) return;

    if (draggedDeal.stage !== targetStage) {
      try {
        const response = await dealsAPI.moveDealStage(
          draggedDeal._id || draggedDeal.id,
          targetStage
        );

        if (response.success) {
          toast({
            title: "Stage Updated",
            description: `Deal moved to ${dealStages[targetStage]}`,
          });

          // Refresh the deals list using the passed refresh function
          if (refreshDeals) {
            refreshDeals();
          }
        } else {
          toast({
            title: "Move Failed",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error moving deal stage:", error);
        toast({
          title: "Move Failed",
          description: error.message || "Failed to move deal stage",
          variant: "destructive",
        });
      }
    }

    setDraggedDeal(null);
  };

  const handleMoveStage = async (deal, newStage) => {
    try {
      const response = await dealsAPI.moveDealStage(
        deal._id || deal.id,
        newStage
      );

      if (response.success) {
        toast({
          title: "Stage Updated",
          description: response.message,
        });

        // Refresh the deals list using the passed refresh function
        if (refreshDeals) {
          refreshDeals();
        }
      } else {
        toast({
          title: "Move Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error moving deal stage:", error);
      toast({
        title: "Move Failed",
        description: error.message || "Failed to move deal stage",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStageDeals = (stage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getTotalValue = (stageDeals) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const getWeightedValue = (stageDeals) => {
    return stageDeals.reduce(
      (sum, deal) => sum + ((deal.value || 0) * (deal.probability || 0)) / 100,
      0
    );
  };

  const handleSelectDeal = (dealId, checked) => {
    if (checked) {
      onDealSelect([...selectedDeals, dealId]);
    } else {
      onDealSelect(selectedDeals.filter((id) => id !== dealId));
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[700px]">
        {Object.entries(dealStages).map(([stageKey, stageLabel]) => {
          const stageDeals = getStageDeals(stageKey);
          const totalValue = getTotalValue(stageDeals);
          const weightedValue = getWeightedValue(stageDeals);

          return (
            <div
              key={stageKey}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageKey)}
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                  <CardTitle className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <DealStageBadge stage={stageKey} />
                      <Badge variant="secondary" className="text-xs">
                        {stageDeals.length}
                      </Badge>
                    </div>
                  </CardTitle>
                  <div className="text-xs text-gray-500 space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">
                        {formatCurrency(totalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weighted:</span>
                      <span className="font-medium">
                        {formatCurrency(weightedValue)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal._id || deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="border rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-move group"
                    >
                      {/* Header with Checkbox and Menu */}
                      <div className="flex items-start justify-between mb-2">
                        <Checkbox
                          checked={selectedDeals.includes(deal._id || deal.id)}
                          onCheckedChange={(checked) =>
                            handleSelectDeal(deal._id || deal.id, checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 max-h-60 overflow-y-auto"
                          >
                            <DropdownMenuItem
                              onClick={() => onDealView && onDealView(deal)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDealEdit && onDealEdit(deal)}
                            >
                              Edit Deal
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                            {Object.entries(dealStages).map(
                              ([targetStageKey, targetStageLabel]) =>
                                targetStageKey !== deal.stage && (
                                  <DropdownMenuItem
                                    key={targetStageKey}
                                    onClick={() =>
                                      handleMoveStage(deal, targetStageKey)
                                    }
                                  >
                                    <MoveRight className="w-4 h-4 mr-2" />
                                    {targetStageLabel}
                                  </DropdownMenuItem>
                                )
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => onDealDelete && onDealDelete(deal)}
                              className="text-red-600"
                            >
                              Delete Deal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Deal Title */}
                      <h4 className="font-semibold text-sm mb-3 line-clamp-2 leading-tight">
                        {deal.title}
                      </h4>

                      {/* Deal Details */}
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{deal.company}</span>
                        </div>

                        {deal.contactName && (
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{deal.contactName}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-3 h-3 flex-shrink-0" />
                          <span className="font-semibold truncate">
                            {formatCurrency(deal.value)}
                          </span>
                        </div>

                        {/* Probability Bar */}
                        <div className="flex items-center gap-2 pt-1">
                          <Target className="w-3 h-3 flex-shrink-0" />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 min-w-[40px]">
                              <div
                                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${deal.probability || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">
                              {deal.probability || 0}%
                            </span>
                          </div>
                        </div>

                        {deal.closeDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {new Date(deal.closeDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {deal.owner && (
                          <div className="text-xs text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700">
                            Owner:{" "}
                            <span className="font-medium">{deal.owner}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {deal.tags && deal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                          {deal.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs px-2 py-0 h-5"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {deal.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0 h-5"
                            >
                              +{deal.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <div>No deals in this stage</div>
                      <div className="text-xs mt-1">
                        Drag deals here or create new ones
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DealsKanban;
