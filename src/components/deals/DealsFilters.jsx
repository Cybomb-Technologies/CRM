// src/components/deals/DealsFilters.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';

const DealsFilters = ({ filters, onFiltersChange }) => {
  const { getDealStages } = useData();
  const dealStages = getDealStages();

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      stage: '',
      owner: '',
      company: '',
      probability: '',
      valueRange: ''
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Stage</label>
        <Select value={filters.stage} onValueChange={(value) => handleFilterChange('stage', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-stages">All Stages</SelectItem>
            {Object.entries(dealStages).map(([stageKey, stageLabel]) => (
              <SelectItem key={stageKey} value={stageKey}>
                {stageLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Owner</label>
        <Select value={filters.owner} onValueChange={(value) => handleFilterChange('owner', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Owners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-owners">All Owners</SelectItem>
            <SelectItem value="John Doe">John Doe</SelectItem>
            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            <SelectItem value="Current User">Current User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Company</label>
        <Input
          value={filters.company}
          onChange={(e) => handleFilterChange('company', e.target.value)}
          placeholder="Filter by company..."
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Probability</label>
        <Select value={filters.probability} onValueChange={(value) => handleFilterChange('probability', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Probabilities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-probabilities">All Probabilities</SelectItem>
            <SelectItem value="high">High (70%+)</SelectItem>
            <SelectItem value="medium">Medium (30-69%)</SelectItem>
            <SelectItem value="low">Low (0-29%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Value Range</label>
        <Select value={filters.valueRange} onValueChange={(value) => handleFilterChange('valueRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Values" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-values">All Values</SelectItem>
            <SelectItem value="0-10000">$0 - $10K</SelectItem>
            <SelectItem value="10000-50000">$10K - $50K</SelectItem>
            <SelectItem value="50000-100000">$50K - $100K</SelectItem>
            <SelectItem value="100000+">$100K+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-span-5 flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default DealsFilters;