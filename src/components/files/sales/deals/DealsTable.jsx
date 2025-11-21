// src/components/deals/DealsTable.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Eye, MoreVertical, MoveRight, Building, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import DealStageBadge from './DealStageBadge';

const DealsTable = ({ 
  deals, 
  loading, 
  selectedDeals,
  onDealSelect,
  onDealEdit, 
  onDealDelete, 
  onDealView,
  onDealMove
}) => {
  const { moveDealStage, getDealStages } = useData();
  const { toast } = useToast();
  const dealStages = getDealStages();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading deals...</p>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No deals found. Create your first deal to get started.</p>
      </div>
    );
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      onDealSelect(deals.map(deal => deal.id));
    } else {
      onDealSelect([]);
    }
  };

  const handleSelectDeal = (dealId, checked) => {
    if (checked) {
      onDealSelect([...selectedDeals, dealId]);
    } else {
      onDealSelect(selectedDeals.filter(id => id !== dealId));
    }
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

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return 'bg-green-100 text-green-800';
    if (probability >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
              <Checkbox
                checked={selectedDeals.length === deals.length && deals.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Deal</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Company</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Contact</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Value</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Probability</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Stage</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Owner</th>
            <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Close Date</th>
            <th className="text-right p-4 font-medium text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-4">
                <Checkbox
                  checked={selectedDeals.includes(deal.id)}
                  onCheckedChange={(checked) => handleSelectDeal(deal.id, checked)}
                />
              </td>
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex flex-col">
                  <span className="font-semibold">{deal.title}</span>
                  {deal.tags && deal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {deal.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {deal.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{deal.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {deal.company}
                </div>
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {deal.contactName && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {deal.contactName}
                  </div>
                )}
              </td>
              <td className="p-4 font-semibold text-gray-900 dark:text-white">
                {formatCurrency(deal.value || 0)}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${deal.probability || 0}%` }}
                    ></div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(deal.probability || 0)}`}>
                    {deal.probability || 0}%
                  </span>
                </div>
              </td>
              <td className="p-4">
                <DealStageBadge stage={deal.stage} />
              </td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{deal.owner || 'Unassigned'}</td>
              <td className="p-4 text-gray-600 dark:text-gray-400">
                {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => onDealView && onDealView(deal)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDealEdit && onDealEdit(deal)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Deal
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                      {Object.entries(dealStages).map(([stageKey, stageLabel]) => (
                        stageKey !== deal.stage && (
                          <DropdownMenuItem 
                            key={stageKey}
                            onClick={() => handleMoveStage(deal, stageKey)}
                          >
                            <MoveRight className="w-4 h-4 mr-2" />
                            {stageLabel}
                          </DropdownMenuItem>
                        )
                      ))}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => onDealDelete && onDealDelete(deal)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Deal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DealsTable;