
import React from "react";
import { Company } from "@/data/mockData";
import { Check, AlertCircle, Info } from "lucide-react";

interface FeaturedAnalysisCardProps {
  company: Company;
}

const getDirectionColor = (direction: Company["netActionDirection"]) => {
  switch (direction) {
    case "negative":
      return "bg-red-500 text-white";
    case "positive":
      return "bg-green-500 text-white";
    case "neutral":
    default:
      return "bg-gray-400 text-white";
  }
};

const getFindingIcon = (type: "positive" | "negative" | "neutral") => {
  if (type === "positive")
    return <Check className="text-green-500 h-5 w-5 mt-0.5" />;
  if (type === "negative")
    return <AlertCircle className="text-red-500 h-5 w-5 mt-0.5" />;
  return <Info className="text-yellow-500 h-5 w-5 mt-0.5" />;
};

const FeaturedAnalysisCard: React.FC<FeaturedAnalysisCardProps> = ({ company }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto animate-fade-in">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <div>
        <h3 className="text-2xl font-semibold mb-1">{company.name}</h3>
        <div className="text-gray-500 text-sm">{company.industry} • {company.headquarters}</div>
      </div>
      <span className={`px-4 py-1 rounded-full text-xs font-semibold capitalize ${getDirectionColor(company.netActionDirection)}`}>
        {company.netActionDirection}
      </span>
    </div>
    <div className="flex gap-4 mb-7 flex-col xs:flex-row sm:flex-row">
      <div className="flex-1 bg-emerald-50 rounded-lg flex flex-col justify-center items-center py-5">
        <span className="text-3xl font-bold text-emerald-600">{company.overallScore}</span>
        <span className="text-gray-700 text-sm mt-2">Overall Score</span>
      </div>
      <div className="flex-1 bg-blue-50 rounded-lg flex flex-col justify-center items-center py-5">
        <span className="text-3xl font-bold text-blue-600">{company.focusScore}</span>
        <span className="text-gray-700 text-sm mt-2">Focus Score</span>
      </div>
    </div>
    <div className="space-y-4">
      {/* Only show first 2 findings for clean look */}
      {company.keyFindings.slice(0,2).map((finding, idx) => (
        <div className="flex items-start gap-3" key={idx}>
          {getFindingIcon(finding.type)}
          <div>
            <span className="font-semibold text-black block">
              {finding.title}
            </span>
            <span className="text-gray-600 text-sm block">
              {finding.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FeaturedAnalysisCard;
