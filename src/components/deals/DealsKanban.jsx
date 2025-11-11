import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useData } from '@/contexts/DataContext';

const stages = [
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-500' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-500' }
];

const DealsKanban = () => {
  const { data } = useData();
  const [deals, setDeals] = useState({});

  useEffect(() => {
    setDeals(data.deals);
  }, [data.deals]);

  const getTotalValue = (stageDeals) => {
    return stageDeals?.reduce((sum, deal) => sum + deal.value, 0) || 0;
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
      {stages.map((stage) => (
        <div key={stage.id} className="kanban-column flex-shrink-0">
          <div className="bg-card rounded-lg shadow-sm border">
            <div className={`${stage.color} text-white p-4 rounded-t-lg`}>
              <h3 className="font-semibold text-lg">{stage.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm opacity-90">{deals[stage.id]?.length || 0} deals</span>
                <span className="text-sm font-medium">
                  ${(getTotalValue(deals[stage.id]) / 1000).toFixed(0)}k
                </span>
              </div>
            </div>

            <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {(deals[stage.id] || []).map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-background">
                    <h4 className="font-semibold text-foreground mb-2">{deal.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{deal.company}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="font-medium text-foreground">${(deal.value / 1000).toFixed(0)}k</span>
                        </div>
                        <Badge variant="secondary">{deal.probability}%</Badge>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(deal.closeDate), 'MMM dd, yyyy')}
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-3 h-3 mr-1" />
                        {deal.owner}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DealsKanban;