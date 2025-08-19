import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchCompaniesFromDatabase, Company } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BarChart3, Shield, TrendingUp, Eye, Upload, ArrowRight, CheckCircle } from 'lucide-react';
import FeaturedAnalysisCard from "@/components/FeaturedAnalysisCard.tsx";
const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [featuredCompany, setFeaturedCompany] = useState<Company | null>(null);
  useEffect(() => {
    const loadFeaturedCompany = async () => {
      try {
        const companies = await fetchCompaniesFromDatabase();
        if (companies.length > 0) {
          setFeaturedCompany(companies[0]);
        }
      } catch (error) {
        console.error('Error loading featured company:', error);
      }
    };
    if (user) {
      loadFeaturedCompany();
    }
  }, [user]);
  const handleViewData = () => {
    console.log('View Data button clicked, user:', user);
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/analytics');
  };
  const handleUploadData = () => {
    console.log('Upload Data button clicked, user:', user);
    if (!user) {
      navigate('/signup');
      return;
    }
    navigate('/admin');
  };
  const handleGetStarted = () => {
    console.log('Get Started button clicked');
    navigate('/signup');
  };
  const handleScheduleDemo = () => {
    console.log('Schedule Demo button clicked');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
                Greenwashing Detection
                <span className="text-emerald-200 block sm:inline"> Platform</span>
              </h1>
              <p className="text-lg sm:text-xl text-emerald-100 mb-6 lg:mb-8 leading-relaxed px-2 sm:px-0">
                Detect greenwashing, analyze environmental claims, and track sustainability performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={handleViewData} size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 w-full sm:w-auto">
                  <Eye className="h-5 w-5 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Data Analytics Dashboard" className="rounded-2xl shadow-2xl w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized, Improved */}
      <section className="py-14 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight animate-fade-in">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 animate-fade-in delay-100">
              Make smarter ESG decisions with our advanced analytics and actionable insights for environmental accountability.
            </p>
          </div>

          {/* Improved Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Features Array */}
            {[{
            icon: <Shield className="h-9 w-9 text-emerald-700" />,
            bg: "from-emerald-100 to-white",
            glow: "shadow-[0_0_40px_3px_rgba(16,185,129,0.15)]",
            title: "Greenwashing Detection",
            description: "Advanced AI and data science reveal inconsistencies between environmental claims and real-world actions to uncover greenwashing.",
            cta: "Learn more"
          }, {
            icon: <BarChart3 className="h-9 w-9 text-blue-700" />,
            bg: "from-blue-100 to-white",
            glow: "shadow-[0_0_40px_3px_rgba(59,130,246,0.13)]",
            title: "Real-time Analytics",
            description: "Beautiful dashboards and instant visualizations let you track ESG performance metrics and progress at a glance.",
            cta: "Explore dashboards"
          }, {
            icon: <TrendingUp className="h-9 w-9 text-purple-700" />,
            bg: "from-purple-100 to-white",
            glow: "shadow-[0_0_40px_3px_rgba(139,92,246,0.13)]",
            title: "Predictive Insights",
            description: "State-of-the-art ML forecasts future ESG trends—helping you spot opportunities and risks before the market moves.",
            cta: "See predictions"
          }].map((feat, idx) => <div key={idx} className={`
                  group relative rounded-2xl border-0 bg-gradient-to-br ${feat.bg} p-7 shadow-md transition-shadow duration-200 hover:shadow-xl hover:scale-105 animate-fade-in
                `} style={{
            animationDelay: `${0.1 + idx * 0.1}s`
          }}>
                <div className={`
                    absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full w-16 h-16 bg-white ${feat.glow}
                    group-hover:scale-110 transition-all duration-200
                  `} aria-hidden="true">
                  {feat.icon}
                </div>
                <div className="pt-12 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-base text-gray-600 mb-4">{feat.description}</p>
                  
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Company Showcase - Mobile Optimized */}
      {user && featuredCompany && <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Analysis
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 px-4 sm:px-0">
                Explore detailed analysis for companies in our database
              </p>
            </div>
            <div className="flex justify-center">
              <FeaturedAnalysisCard company={featuredCompany} />
            </div>
          </div>
        </section>}

      {/* Stats Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-200 text-sm sm:text-base">Companies Analyzed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">5M+</div>
              <div className="text-emerald-200 text-sm sm:text-base">Data Points Processed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">80%</div>
              <div className="text-emerald-200 text-sm sm:text-base">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-emerald-200 text-sm sm:text-base">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;
