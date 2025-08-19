
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, TrendingUp, Eye, Share2, Filter } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: "Q4 2024 ESG Performance Report",
      description: "Comprehensive analysis of ESG metrics and performance indicators for the fourth quarter",
      type: "Quarterly",
      date: "2024-12-15",
      status: "Published",
      downloads: 1247,
      pages: 45
    },
    {
      id: 2,
      title: "Annual Sustainability Report 2024",
      description: "Complete overview of sustainability initiatives, achievements, and future goals",
      type: "Annual",
      date: "2024-12-01",
      status: "Published", 
      downloads: 3421,
      pages: 128
    },
    {
      id: 3,
      title: "Carbon Footprint Analysis Report",
      description: "Detailed analysis of carbon emissions and reduction strategies implementation",
      type: "Special",
      date: "2024-11-20",
      status: "Published",
      downloads: 892,
      pages: 32
    },
    {
      id: 4,
      title: "Greenwashing Detection Analysis",
      description: "AI-powered analysis identifying potential greenwashing patterns in corporate communications",
      type: "Monthly",
      date: "2024-12-10",
      status: "Published",
      downloads: 567,
      pages: 28
    },
    {
      id: 5,
      title: "Social Impact Assessment 2024",
      description: "Evaluation of social programs effectiveness and community engagement metrics",
      type: "Annual",
      date: "2024-11-30",
      status: "Draft",
      downloads: 0,
      pages: 67
    },
    {
      id: 6,
      title: "Governance Compliance Report",
      description: "Assessment of corporate governance practices and regulatory compliance status",
      type: "Quarterly",
      date: "2024-12-05",
      status: "Under Review",
      downloads: 234,
      pages: 41
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Annual': return 'bg-purple-100 text-purple-800';
      case 'Quarterly': return 'bg-blue-100 text-blue-800';
      case 'Monthly': return 'bg-emerald-100 text-emerald-800';
      case 'Special': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ESG Reports Center</h1>
          <p className="text-xl text-gray-600">Access comprehensive ESG reports, sustainability assessments, and compliance documentation</p>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-emerald-600">24</p>
                </div>
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-blue-600">18</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-3xl font-bold text-purple-600">12.4K</p>
                </div>
                <Download className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-orange-600">4.8</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter Reports</span>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate New Report
            </Button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-3">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {report.pages} pages
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {report.downloads.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled={report.status !== 'Published'}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" disabled={report.status !== 'Published'}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sustainability Reports</h3>
              <p className="text-gray-600 text-sm">Comprehensive environmental impact and sustainability performance analysis</p>
            </Card>

            <Card className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600 text-sm">Data-driven insights and performance metrics across all ESG dimensions</p>
            </Card>

            <Card className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compliance Audits</h3>
              <p className="text-gray-600 text-sm">Regulatory compliance assessments and governance evaluations</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
