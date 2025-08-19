
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Upload, BarChart3, Lock } from 'lucide-react';

interface AnalyticsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  user: any;
  comparisonCount: number;
  children: React.ReactNode;
}

const AnalyticsNavigation: React.FC<AnalyticsNavigationProps> = ({
  activeTab,
  onTabChange,
  user,
  comparisonCount,
  children
}) => (
  <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6 sm:mb-8">
    <TabsList className="grid w-full grid-cols-3 bg-white h-auto p-1">
      <TabsTrigger value="search" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm">
        <Search className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Search & Analyze</span>
        <span className="sm:hidden">Search</span>
      </TabsTrigger>
      <TabsTrigger value="upload" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm" disabled={!user}>
        <div className="flex items-center space-x-1">
          <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
          {!user && <Lock className="w-2 h-2 sm:w-3 sm:h-3" />}
        </div>
        <span className="hidden sm:inline">Upload Report</span>
        <span className="sm:hidden">Upload</span>
      </TabsTrigger>
      <TabsTrigger value="compare" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm" disabled={!user}>
        <div className="flex items-center space-x-1">
          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
          {!user && <Lock className="w-2 h-2 sm:w-3 sm:h-3" />}
        </div>
        <span className="hidden sm:inline">Compare ({user ? comparisonCount : 0})</span>
        <span className="sm:hidden">Compare</span>
      </TabsTrigger>
    </TabsList>
    {children}
  </Tabs>
);

export default AnalyticsNavigation;
