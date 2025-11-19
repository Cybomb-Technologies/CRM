// src/components/deals/DealsKanban.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreVertical, 
  MoveRight, 
  DollarSign, 
  Target, 
  Calendar, 
  User, 
  Building 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import DealStageBadge from './DealStageBadge';

const DealsKanban = ({ deals, loading, selectedDeals, onDealSelect }) => {
  const { moveDealStage, getDealStages, getDealsByStage } = useData();
  const { toast } = useToast();
  const dealStages = getDealStages();

  const [draggedDeal, setDraggedDeal] = useState(null);

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
    e.dataTransfer.setData('text/plain', deal.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedDeal) return;

    if (draggedDeal.stage !== targetStage) {
      const result = await moveDealStage(draggedDeal.id, draggedDeal.stage, targetStage);
      
      if (result.success) {
        toast({
          title: "Stage Updated",
          description: `Deal moved to ${dealStages[targetStage]}`,
        });
      } else {
        toast({
          title: "Move Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    }
    
    setDraggedDeal(null);
  };

  const handleMoveStage = async (deal, newStage) => {
    const result = await moveDealStage(deal.id, deal.stage, newStage);
    
    if (result.success) {
      toast({
        title: "Stage Updated",
        description: result.message,
      });
    } else {
      toast({
        title: "Move Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStageDeals = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getTotalValue = (stageDeals) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const getWeightedValue = (stageDeals) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0) * (deal.probability || 0) / 100, 0);
  };

  const handleSelectDeal = (dealId, checked) => {
    if (checked) {
      onDealSelect([...selectedDeals, dealId]);
    } else {
      onDealSelect(selectedDeals.filter(id => id !== dealId));
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {Object.entries(dealStages).map(([stageKey, stageLabel]) => {
          const stageDeals = getStageDeals(stageKey);
          const totalValue = getTotalValue(stageDeals);
          const weightedValue = getWeightedValue(stageDeals);

          return (
            <div 
              key={stageKey}
              className="min-w-[300px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageKey)}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <DealStageBadge stage={stageKey} />
                      <Badge variant="secondary" className="text-xs">
                        {stageDeals.length}
                      </Badge>
                    </div>
                  </CardTitle>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Total: {formatCurrency(totalValue)}</div>
                    <div>Weighted: {formatCurrency(weightedValue)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="border rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-move"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Checkbox
                          checked={selectedDeals.includes(deal.id)}
                          onCheckedChange={(checked) => handleSelectDeal(deal.id, checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                            {Object.entries(dealStages).map(([targetStageKey, targetStageLabel]) => (
                              targetStageKey !== deal.stage && (
                                <DropdownMenuItem 
                                  key={targetStageKey}
                                  onClick={() => handleMoveStage(deal, targetStageKey)}
                                >
                                  <MoveRight className="w-4 h-4 mr-2" />
                                  {targetStageLabel}
                                </DropdownMenuItem>
                              )
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                        {deal.title}
                      </h4>

                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{deal.company}</span>
                        </div>
                        
                        {deal.contactName && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{deal.contactName}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-semibold">{formatCurrency(deal.value)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-blue-600"
                                style={{ width: `${deal.probability || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{deal.probability || 0}%</span>
                          </div>
                        </div>

                        {deal.closeDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {deal.owner && (
                          <div className="text-xs text-gray-500">
                            Owner: {deal.owner}
                          </div>
                        )}
                      </div>

                      {deal.tags && deal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {deal.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {deal.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{deal.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      No deals in this stage
                      <div className="text-xs mt-1">Drag deals here or create new ones</div>
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