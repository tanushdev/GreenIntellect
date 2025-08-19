import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Company } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportCapabilitiesProps {
  selectedCompany?: Company | null;
  companies?: Company[];
}

const ExportCapabilities: React.FC<ExportCapabilitiesProps> = ({ 
  selectedCompany,
  companies = []
}) => {
  const generateChartImage = async (company: Company) => {
    // Create a temporary chart container
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'absolute';
    chartContainer.style.left = '-9999px';
    chartContainer.style.width = '600px';
    chartContainer.style.height = '400px';
    chartContainer.style.backgroundColor = 'white';
    chartContainer.style.padding = '20px';
    chartContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Create score chart
    chartContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin: 0 0 20px 0;">Score Breakdown</h3>
        <div style="display: flex; justify-content: space-around; align-items: end; height: 250px; border-bottom: 2px solid #e5e7eb; padding: 20px 0;">
          <div style="text-align: center;">
            <div style="width: 80px; height: ${company.focusScore * 2}px; background: linear-gradient(to top, #3b82f6, #60a5fa); margin-bottom: 10px; border-radius: 4px 4px 0 0;"></div>
            <div style="font-weight: bold; color: #1f2937;">Focus</div>
            <div style="color: #6b7280; font-size: 14px;">${company.focusScore}/100</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: ${company.environmentScore * 2}px; background: linear-gradient(to top, #10b981, #34d399); margin-bottom: 10px; border-radius: 4px 4px 0 0;"></div>
            <div style="font-weight: bold; color: #1f2937;">Environment</div>
            <div style="color: #6b7280; font-size: 14px;">${company.environmentScore}/100</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: ${company.claimsScore * 2}px; background: linear-gradient(to top, #f59e0b, #fbbf24); margin-bottom: 10px; border-radius: 4px 4px 0 0;"></div>
            <div style="font-weight: bold; color: #1f2937;">Claims</div>
            <div style="color: #6b7280; font-size: 14px;">${company.claimsScore}/100</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 80px; height: ${company.actionsScore * 2}px; background: linear-gradient(to top, #ef4444, #f87171); margin-bottom: 10px; border-radius: 4px 4px 0 0;"></div>
            <div style="font-weight: bold; color: #1f2937;">Actions</div>
            <div style="color: #6b7280; font-size: 14px;">${company.actionsScore}/100</div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(chartContainer);
    
    try {
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: 'white',
        scale: 2
      });
      document.body.removeChild(chartContainer);
      return canvas.toDataURL('image/png');
    } catch (error) {
      document.body.removeChild(chartContainer);
      throw error;
    }
  };

  const generateRadarChart = async (company: Company) => {
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'absolute';
    chartContainer.style.left = '-9999px';
    chartContainer.style.width = '400px';
    chartContainer.style.height = '400px';
    chartContainer.style.backgroundColor = 'white';
    chartContainer.style.padding = '20px';
    
    // Simple radar chart using SVG
    chartContainer.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: #1f2937; margin: 0 0 20px 0;">Performance Radar</h3>
        <svg width="360" height="320" viewBox="0 0 360 320">
          <!-- Grid -->
          <circle cx="180" cy="160" r="120" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          <circle cx="180" cy="160" r="80" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          <circle cx="180" cy="160" r="40" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          
          <!-- Axes -->
          <line x1="180" y1="40" x2="180" y2="280" stroke="#e5e7eb" stroke-width="1"/>
          <line x1="60" y1="160" x2="300" y2="160" stroke="#e5e7eb" stroke-width="1"/>
          <line x1="96" y1="75" x2="264" y2="245" stroke="#e5e7eb" stroke-width="1"/>
          <line x1="264" y1="75" x2="96" y2="245" stroke="#e5e7eb" stroke-width="1"/>
          
          <!-- Data polygon -->
          <polygon points="${180 + Math.cos(-Math.PI/2) * (company.focusScore * 1.2)},${160 + Math.sin(-Math.PI/2) * (company.focusScore * 1.2)} ${180 + Math.cos(0) * (company.environmentScore * 1.2)},${160 + Math.sin(0) * (company.environmentScore * 1.2)} ${180 + Math.cos(Math.PI/2) * (company.claimsScore * 1.2)},${160 + Math.sin(Math.PI/2) * (company.claimsScore * 1.2)} ${180 + Math.cos(Math.PI) * (company.actionsScore * 1.2)},${160 + Math.sin(Math.PI) * (company.actionsScore * 1.2)}" 
                   fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="2"/>
          
          <!-- Labels -->
          <text x="180" y="25" text-anchor="middle" fill="#1f2937" font-size="12" font-weight="bold">Focus (${company.focusScore})</text>
          <text x="315" y="165" text-anchor="middle" fill="#1f2937" font-size="12" font-weight="bold">Environment (${company.environmentScore})</text>
          <text x="180" y="305" text-anchor="middle" fill="#1f2937" font-size="12" font-weight="bold">Claims (${company.claimsScore})</text>
          <text x="45" y="165" text-anchor="middle" fill="#1f2937" font-size="12" font-weight="bold">Actions (${company.actionsScore})</text>
        </svg>
      </div>
    `;
    
    document.body.appendChild(chartContainer);
    
    try {
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: 'white',
        scale: 2
      });
      document.body.removeChild(chartContainer);
      return canvas.toDataURL('image/png');
    } catch (error) {
      document.body.removeChild(chartContainer);
      throw error;
    }
  };

  const generateAIAnalysis = async (company: Company): Promise<string> => {
    try {
      const prompt = `Please provide a comprehensive greenwashing analysis for ${company.name}, a company in the ${company.industry} industry. Here are their sustainability scores:

**Company Details:**
- Company: ${company.name}
- Industry: ${company.industry}
- Report Year: ${company.reportYear}
- Overall Greenwashing Score: ${company.overallScore}/100
- Net Action Direction: ${company.netActionDirection}

**Individual Scores:**
- Focus Score: ${company.focusScore}/100 (measures clarity of environmental focus and commitment)
- Environment Score: ${company.environmentScore}/100 (evaluates actual environmental impact and initiatives)
- Claims Score: ${company.claimsScore}/100 (assesses accuracy and verifiability of environmental claims)
- Actions Score: ${company.actionsScore}/100 (analyzes real actions taken to achieve environmental goals)

Please provide a concise analysis covering:
1. Overall greenwashing risk assessment
2. Key strengths and weaknesses
3. Investment recommendation
4. Areas for improvement

Keep the analysis focused and under 500 words for PDF inclusion.`;

      const { data, error } = await supabase.functions.invoke('generate-ai-analysis', {
        body: { prompt }
      });

      if (error || data.error) {
        console.error('AI analysis error:', error || data.error);
        return `AI Analysis for ${company.name}:

Based on the sustainability scores provided, ${company.name} shows ${company.overallScore >= 70 ? 'strong' : company.overallScore >= 50 ? 'moderate' : 'concerning'} performance with an overall score of ${company.overallScore}/100.

Key Observations:
• Focus Score (${company.focusScore}): ${company.focusScore >= 70 ? 'Strong strategic clarity' : company.focusScore >= 50 ? 'Moderate focus with room for improvement' : 'Lacks clear environmental strategy'}
• Environment Score (${company.environmentScore}): ${company.environmentScore >= 70 ? 'Excellent environmental stewardship' : company.environmentScore >= 50 ? 'Satisfactory environmental practices' : 'Concerning environmental impact'}
• Claims Score (${company.claimsScore}): ${company.claimsScore >= 70 ? 'Highly credible environmental claims' : company.claimsScore >= 50 ? 'Moderately reliable claims' : 'Potentially misleading claims'}
• Actions Score (${company.actionsScore}): ${company.actionsScore >= 70 ? 'Strong implementation alignment' : company.actionsScore >= 50 ? 'Partial implementation' : 'Significant gaps between promises and actions'}

Investment Recommendation: ${company.overallScore >= 70 && company.netActionDirection === 'positive' ? 'Strong Buy - Low greenwashing risk' : company.overallScore >= 50 ? 'Hold - Monitor progress' : 'Caution - High greenwashing risk'}`;
      }

      return data.analysis || 'AI analysis could not be generated at this time.';
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      return `Analysis for ${company.name}: Unable to generate detailed AI analysis. Manual review recommended based on scores: Overall ${company.overallScore}/100, indicating ${company.overallScore >= 70 ? 'low' : company.overallScore >= 50 ? 'moderate' : 'high'} greenwashing risk.`;
    }
  };

  const generateProfessionalPdfReport = async (company: Company) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = 30;

    // Colors - properly typed as tuples
    const primaryColor = '#1f2937';
    const accentColor = '#3b82f6';
    const textColor = '#374151';

    // Helper function to add text with word wrapping
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12, color = textColor) => {
      doc.setTextColor(color);
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Header with company branding
    doc.setFillColor(31, 41, 55); // Dark blue
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('GREENINTELLECT', margin, 25);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Sustainability Analytics Report', margin, 35);
    
    // Company logo placeholder (green circle)
    doc.setFillColor(16, 185, 129);
    doc.circle(pageWidth - 40, 25, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('GI', pageWidth - 45, 29);

    yPosition = 70;

    // Report metadata
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, pageWidth - 80, yPosition);
    yPosition += 20;

    // Company header section
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');
    
    yPosition += 15;
    doc.setTextColor(primaryColor);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    yPosition = addText(company.name, margin + 10, yPosition, pageWidth - 2 * margin - 20, 20, primaryColor);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    yPosition = addText(`${company.industry} • ${company.headquarters} • ${company.reportYear}`, margin + 10, yPosition, pageWidth - 2 * margin - 20, 12, textColor);
    
    yPosition += 25;

    // Overall Score Badge - Fixed color assignment
    const scoreColor: [number, number, number] = company.overallScore >= 80 ? [16, 185, 129] : company.overallScore >= 60 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(margin, yPosition, 80, 25, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${company.overallScore}/100`, margin + 20, yPosition + 17);
    
    doc.setTextColor(textColor);
    doc.setFontSize(12);
    doc.text('Overall Sustainability Score', margin + 90, yPosition + 17);
    
    yPosition += 40;

    // Executive Summary
    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    yPosition = addText('Executive Summary', margin, yPosition, pageWidth - 2 * margin, 16, primaryColor);
    yPosition += 10;

    const summaryText = `${company.name} demonstrates ${company.overallScore >= 70 ? 'strong' : company.overallScore >= 50 ? 'moderate' : 'concerning'} sustainability performance with an overall score of ${company.overallScore}/100. This comprehensive analysis evaluates environmental claims authenticity, implementation effectiveness, and overall commitment to sustainable practices across multiple dimensions including focus, environmental impact, claims verification, and actionable initiatives.`;
    
    doc.setTextColor(textColor);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    yPosition = addText(summaryText, margin, yPosition, pageWidth - 2 * margin, 11, textColor);
    yPosition += 15;

    // Generate and add chart
    try {
      const chartImage = await generateChartImage(company);
      doc.addImage(chartImage, 'PNG', margin, yPosition, pageWidth - 2 * margin, 80);
      yPosition += 90;
    } catch (error) {
      console.log('Chart generation failed, continuing without chart');
      yPosition += 20;
    }

    // Check if we need a new page for AI analysis
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 30;
    }

    // AI-Powered Greenwashing Analysis Section
    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    yPosition = addText('AI-Powered Greenwashing Analysis', margin, yPosition, pageWidth - 2 * margin, 16, primaryColor);
    yPosition += 15;

    // Show loading indicator while generating analysis
    toast({
      title: "Generating AI Analysis",
      description: "Creating detailed AI analysis for the PDF report...",
    });

    // Generate AI analysis
    const aiAnalysis = await generateAIAnalysis(company);
    
    // Clean up the analysis text for PDF
    const cleanAnalysis = aiAnalysis
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\n\n+/g, '\n\n') // Normalize line breaks
      .replace(/^#+\s*/gm, '') // Remove markdown headers
      .trim();

    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    yPosition = addText(cleanAnalysis, margin, yPosition, pageWidth - 2 * margin, 10, textColor);
    yPosition += 20;

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }

    // Detailed Score Analysis
    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    yPosition = addText('Detailed Performance Analysis', margin, yPosition, pageWidth - 2 * margin, 16, primaryColor);
    yPosition += 15;

    const scoreAnalyses = [
      {
        title: 'Focus Score',
        score: company.focusScore,
        analysis: `The focus score of ${company.focusScore}/100 ${company.focusScore >= 70 ? 'demonstrates strong consistency in environmental messaging and strategic alignment' : company.focusScore >= 50 ? 'shows moderate focus with room for improvement in messaging consistency' : 'indicates significant gaps in environmental focus and strategic clarity'}.`
      },
      {
        title: 'Environment Score',
        score: company.environmentScore,
        analysis: `Environmental performance rating of ${company.environmentScore}/100 ${company.environmentScore >= 70 ? 'reflects excellent environmental stewardship and impact management' : company.environmentScore >= 50 ? 'shows satisfactory environmental practices with opportunities for enhancement' : 'reveals concerning environmental impact and insufficient mitigation measures'}.`
      },
      {
        title: 'Claims Score',
        score: company.claimsScore,
        analysis: `Claims verification score of ${company.claimsScore}/100 ${company.claimsScore >= 70 ? 'indicates highly credible environmental statements backed by evidence' : company.claimsScore >= 50 ? 'suggests moderately reliable claims requiring better substantiation' : 'reveals potentially misleading claims lacking adequate verification'}.`
      },
      {
        title: 'Actions Score',
        score: company.actionsScore,
        analysis: `Implementation score of ${company.actionsScore}/100 ${company.actionsScore >= 70 ? 'demonstrates excellent alignment between commitments and concrete actions' : company.actionsScore >= 50 ? 'shows partial implementation of stated environmental commitments' : 'indicates significant gaps between promises and actual environmental initiatives'}.`
      }
    ];

    scoreAnalyses.forEach((item) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 30;
      }

      // Score header with colored indicator - Fixed color assignment
      const itemScoreColor: [number, number, number] = item.score >= 70 ? [16, 185, 129] : item.score >= 50 ? [245, 158, 11] : [239, 68, 68];
      doc.setFillColor(itemScoreColor[0], itemScoreColor[1], itemScoreColor[2]);
      doc.circle(margin + 5, yPosition + 5, 3, 'F');
      
      doc.setTextColor(primaryColor);
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      yPosition = addText(`${item.title}: ${item.score}/100`, margin + 15, yPosition, pageWidth - 2 * margin - 15, 13, primaryColor);
      
      doc.setTextColor(textColor);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      yPosition = addText(item.analysis, margin + 15, yPosition, pageWidth - 2 * margin - 15, 10, textColor);
      yPosition += 15;
    });

    // Add radar chart on new page
    if (yPosition > pageHeight - 150) {
      doc.addPage();
      yPosition = 30;
    }

    try {
      const radarImage = await generateRadarChart(company);
      doc.setTextColor(primaryColor);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      yPosition = addText('Performance Visualization', margin, yPosition, pageWidth - 2 * margin, 16, primaryColor);
      yPosition += 15;
      doc.addImage(radarImage, 'PNG', margin + 20, yPosition, 150, 120);
      yPosition += 130;
    } catch (error) {
      console.log('Radar chart generation failed');
    }

    // Risk Assessment
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    yPosition = addText('Risk Assessment & Investment Outlook', margin, yPosition, pageWidth - 2 * margin, 16, primaryColor);
    yPosition += 15;

    const riskLevel = company.overallScore >= 80 ? 'Low Risk' : company.overallScore >= 60 ? 'Medium Risk' : 'High Risk';
    const riskColor: [number, number, number] = company.overallScore >= 80 ? [16, 185, 129] : company.overallScore >= 60 ? [245, 158, 11] : [239, 68, 68];
    const investmentSignal = company.overallScore >= 70 && company.netActionDirection === 'positive' ? 'Strong Buy' : company.overallScore >= 50 ? 'Hold' : 'Caution';

    // Risk level badge - Fixed color assignment
    doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.roundedRect(margin, yPosition, 60, 15, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(riskLevel, margin + 10, yPosition + 10);

    doc.setTextColor(textColor);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    yPosition = addText(`Investment Signal: ${investmentSignal}`, margin + 70, yPosition + 5, pageWidth - 2 * margin - 70, 11, textColor);
    yPosition = addText(`Net Action Direction: ${company.netActionDirection}`, margin + 70, yPosition, pageWidth - 2 * margin - 70, 11, textColor);
    yPosition += 25;

    const riskAnalysis = `Based on comprehensive analysis, ${company.name} presents ${riskLevel.toLowerCase()} investment risk from a sustainability perspective. The company's ${company.netActionDirection} trajectory in environmental initiatives, combined with an overall score of ${company.overallScore}/100, suggests ${investmentSignal === 'Strong Buy' ? 'excellent' : investmentSignal === 'Hold' ? 'stable' : 'cautious'} prospects for ESG-focused investment strategies.`;
    
    yPosition = addText(riskAnalysis, margin, yPosition, pageWidth - 2 * margin, 11, textColor);

    // Footer on all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(248, 250, 252);
      doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.text('© 2025 GreenIntellect Analytics Platform', margin, pageHeight - 15);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 15);
      doc.text('Greenwashing Report', pageWidth / 2 - 20, pageHeight - 15);
    }

    return doc;
  };

  const downloadPdfReport = async () => {
    if (!selectedCompany) {
      toast({
        title: "No Company Selected",
        description: "Please select a company to download the report.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Generating Report",
        description: "Creating professional PDF with AI analysis, charts and visualizations...",
      });

      const doc = await generateProfessionalPdfReport(selectedCompany);
      const fileName = `${selectedCompany.name.replace(/\s+/g, '_')}_AI_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Download Complete",
        description: `Professional PDF report with AI analysis for ${selectedCompany.name} has been downloaded.`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={downloadPdfReport}
      disabled={!selectedCompany}
    >
      <Download className="w-4 h-4 mr-2" />
      Download AI Analysis Report
    </Button>
  );
};

export default ExportCapabilities;
