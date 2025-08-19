
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface AdvancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  onSearch: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  onSearch
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span>Search Companies</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Company Name</label>
            <Input
              type="text"
              placeholder="Enter company name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={onSearch} 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              size="sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="w-full sm:w-auto"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
