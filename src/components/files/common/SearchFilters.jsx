import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks';

const SearchFilters = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
  const { toast } = useToast();

  const handleFilter = (filterType) => {
    toast({
      title: "Filter Applied",
      description: `${filterType} filter has been applied.`
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilter("Status")}>
                  By Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilter("Date Range")}>
                  By Date Range
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilter("Amount")}>
                  By Amount
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilter("Company")}>
                  By Company
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;