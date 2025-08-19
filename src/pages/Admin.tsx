import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Shield, Users, FileText, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Database as DatabaseType } from '@/integrations/supabase/types';
import { Navigate } from 'react-router-dom';
import AdminStats from '@/components/admin/AdminStats';
import UploadManagement from '@/components/admin/UploadManagement';
import AnalyzedCompanies from '@/components/admin/AnalyzedCompanies';
import Header from '@/components/Header';

type PdfUpload = DatabaseType['public']['Tables']['pdf_uploads']['Row'];

interface UploadWithProfile extends PdfUpload {
  user_email?: string;
  user_full_name?: string;
  upload_status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected' | 'approved';
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [uploads, setUploads] = useState<UploadWithProfile[]>([]);
  const [analyzedCompaniesCount, setAnalyzedCompaniesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    try {
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('pdf_uploads')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (uploadsError) throw uploadsError;

      // Get user profiles for the uploads
      const userIds = [...new Set(uploadsData?.map(upload => upload.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const uploadsWithProfiles = uploadsData?.map(upload => {
        const profile = profiles?.find(p => p.id === upload.user_id);
        return {
          ...upload,
          user_full_name: profile?.full_name,
          upload_status: upload.upload_status as 'pending' | 'processing' | 'completed' | 'failed' | 'rejected' | 'approved'
        };
      }) || [];

      setUploads(uploadsWithProfiles);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({
        title: "Error",
        description: "Failed to load uploads.",
        variant: "destructive"
      });
    }
  };

  const fetchAnalyzedCompaniesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('analyzed_companies')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      setAnalyzedCompaniesCount(count || 0);
    } catch (error) {
      console.error('Error fetching analyzed companies count:', error);
      toast({
        title: "Error",
        description: "Failed to load analyzed companies count.",
        variant: "destructive"
      });
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchUploads(), fetchAnalyzedCompaniesCount()]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const pendingUploads = uploads.filter(upload => upload.upload_status === 'pending');
  const processingUploads = uploads.filter(upload => upload.upload_status === 'processing');
  const completedUploads = uploads.filter(upload => upload.upload_status === 'completed');

  // Calculate unique companies from uploads for upload stats
  const uniqueUploadCompanies = [...new Set(uploads.map(upload => upload.company_name))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />
      
      <div className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg w-fit">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Manage system administration, company data, and analytics</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="flex items-center space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-900 truncate">Upload Companies</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-700">{uniqueUploadCompanies.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-900 truncate">PDF Uploads</p>
                  <p className="text-lg sm:text-xl font-bold text-green-700">{uploads.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 sm:p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-900 truncate">Analyzed Companies</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-700">{analyzedCompaniesCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <AdminStats
            totalUploads={uploads.length}
            totalCompanies={analyzedCompaniesCount}
            pendingUploads={pendingUploads.length}
            processingUploads={processingUploads.length}
            completedUploads={completedUploads.length}
          />

          {/* Analyzed Companies Management */}
          <AnalyzedCompanies />

          {/* PDF Uploads Management */}
          <UploadManagement
            uploads={uploads}
            onRefresh={fetchUploads}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
