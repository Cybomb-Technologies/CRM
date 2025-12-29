// src/components/forecasts/ForecastFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';

const ForecastFilters = ({ filters, onFiltersChange, disabled, filterOptions }) => {
  const { getDealStages } = useData();
  const dealStages = getDealStages();

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      owner: 'all',
      team: 'all',
      stage: 'all',
      probability: 'all'
    });
  };

  // Use filterOptions from API if available, otherwise empty array
  const owners = filterOptions?.owners || [];
  const stages = filterOptions?.stages || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Owner</label>
        <Select value={filters.owner} onValueChange={(value) => handleFilterChange('owner', value)} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="All Owners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            {owners.map(owner => (
              <SelectItem key={owner} value={owner}>
                {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Stage</label>
        <Select value={filters.stage} onValueChange={(value) => handleFilterChange('stage', value)} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.entries(dealStages).map(([stageKey, stageLabel]) => (
              <SelectItem key={stageKey} value={stageKey}>
                {stageLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Probability</label>
        <Select value={filters.probability} onValueChange={(value) => handleFilterChange('probability', value)} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="All Probabilities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Probabilities</SelectItem>
            <SelectItem value="high">High (70%+)</SelectItem>
            <SelectItem value="medium">Medium (30-69%)</SelectItem>
            <SelectItem value="low">Low (0-29%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        <Button variant="outline" onClick={clearFilters} className="w-full" disabled={disabled}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ForecastFilters;