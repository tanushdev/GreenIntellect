import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Users, Target, Award, Brain, Shield, Globe, Zap, CheckCircle, ArrowRight } from 'lucide-react';
const About = () => {
  const founders = [{
    name: "Tanush Shyam",
    role: "Co-Founder",
    image: "/placeholder.svg",
    description: "Visionary leader driving innovation in ESG technology and sustainable business practices"
  }, {
    name: "Manasi Kale",
    role: "Co-Founder",
    image: "/placeholder.svg",
    description: "Expert in environmental analysis and corporate sustainability assessment"
  }, {
    name: "Mannat Nayyar",
    role: "Co-Founder",
    image: "/placeholder.svg",
    description: "Specialist in data science and AI-powered greenwashing detection algorithms"
  }, {
    name: "Shabarinath R",
    role: "Co-Founder",
    image: "/placeholder.svg",
    description: "Technology innovator focused on transparent ESG reporting and corporate accountability"
  }];
  const milestones = [{
    year: "2021",
    event: "GreenIntellect founded with mission to democratize ESG intelligence",
    icon: Leaf
  }, {
    year: "2022",
    event: "Launched AI-powered greenwashing detection with 94% accuracy rate",
    icon: Brain
  }, {
    year: "2023",
    event: "Partnered with 100+ organizations across 25 countries",
    icon: Globe
  }, {
    year: "2024",
    event: "Recognized as ESG Technology Leader by Sustainability Awards",
    icon: Award
  }];
  const values = [{
    icon: Shield,
    title: "Transparency",
    description: "We believe in complete transparency in ESG reporting and corporate accountability"
  }, {
    icon: Target,
    title: "Accuracy",
    description: "Our AI-driven insights provide precise, data-backed ESG assessments you can trust"
  }, {
    icon: Users,
    title: "Impact",
    description: "Empowering organizations to make meaningful environmental and social change"
  }, {
    icon: Zap,
    title: "Innovation",
    description: "Continuously advancing ESG technology to meet evolving sustainability challenges"
  }];
  return <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">About GreenIntellect</h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">GreenIntellect is a platform designed to bring transparency, data, and insight into companies greenwashing practices.
Using a combination of data analysis, financial expertise, and advanced natural language processing .</p>
            <div className="flex justify-center space-x-4">
              
              
              
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <Target className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">At GreenIntellect, our mission is to bring greater transparency, authenticity, and accountability to corporate sustainability practices.</p>
              </Card>

              <Card className="p-8 rounded-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">We aim to become the leading platform for evaluating and verifying greenwashing, turning data into a powerful tool for transformation fostering a future where sustainable business is the norm, not the exception.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Founders Team */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Founders</h2>
              <p className="text-xl text-gray-600">Meet the visionaries behind GreenIntellect</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {founders.map((founder, index) => <Card key={index} className="p-6 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{founder.name}</h3>
                  <p className="text-emerald-600 font-medium mb-2">{founder.role}</p>
                  
                </Card>)}
            </div>
          </div>
        </section>

        {/* Technology & Innovation */}
        

        {/* Call to Action */}
        
      </main>

      <Footer />
    </div>;
};
export default About;