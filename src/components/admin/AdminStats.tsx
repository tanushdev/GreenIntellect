
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface AdminStatsProps {
  totalUploads: number;
  totalCompanies: number;
  pendingUploads: number;
  processingUploads: number;
  completedUploads: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  totalUploads,
  totalCompanies,
  pendingUploads,
  processingUploads,
  completedUploads,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Uploads</CardTitle>
          <FileText className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{totalUploads}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Companies</CardTitle>
          <BarChart3 className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{totalCompanies}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{pendingUploads}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Processing</CardTitle>
          <AlertTriangle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{processingUploads}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{completedUploads}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
