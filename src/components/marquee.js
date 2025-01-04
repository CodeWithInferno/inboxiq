import React from 'react';
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { Building2, Star } from 'lucide-react';

const companies = [
  {
    name: "Netflix",
    type: "Entertainment",
    color: "from-red-500/20 to-red-500/5"
  },
  {
    name: "Notion",
    type: "Productivity",
    color: "from-gray-500/20 to-gray-500/5"
  },
  {
    name: "Brex",
    type: "Fintech",
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    name: "Deel",
    type: "HR Tech",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    name: "Compass",
    type: "Real Estate",
    color: "from-orange-500/20 to-orange-500/5"
  },
  {
    name: "Amazon",
    type: "E-commerce",
    color: "from-yellow-500/20 to-yellow-500/5"
  },
  {
    name: "Google",
    type: "Technology",
    color: "from-green-500/20 to-green-500/5"
  },
  {
    name: "Microsoft",
    type: "Software",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    name: "Apple",
    type: "Consumer Tech",
    color: "from-gray-500/20 to-gray-500/5"
  },
  {
    name: "Meta",
    type: "Social Media",
    color: "from-indigo-500/20 to-indigo-500/5"
  }
];

const CompanyCard = ({ company }) => {
  return (
    <div className="relative group">
      <div className={cn(
        "flex flex-col items-center justify-center p-6 rounded-xl",
        "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900",
        "border border-gray-200 dark:border-gray-700",
        "transform transition-all duration-300 hover:scale-105",
        "shadow-sm hover:shadow-xl dark:shadow-gray-900/30",
      )}>
        <div className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100",
          `bg-gradient-to-br ${company.color}`,
          "transition-opacity duration-300",
          "-z-10 blur-xl"
        )} />
        
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {company.name}
          </span>
        </div>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {company.type}
        </span>
      </div>
    </div>
  );
};

export function MarqueeDemoHorizontal() {
  const fullCompaniesList = [...companies, ...companies];

  return (
    <div className="relative py-12 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-grid-gray-300/20 dark:bg-grid-gray-700/20 bg-opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-40" />
      </div>

      {/* Title Section */}
      <div className="text-center mb-12 relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-purple-500 uppercase tracking-wider">
            Trusted by Industry Leaders
          </span>
          <Star className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Powering the World&apos;s Best Teams
        </h2>
      </div>


      {/* Marquee Content */}
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:30s] py-4">
          <div className="flex gap-8">
            {fullCompaniesList.map((company, index) => (
              <CompanyCard 
                key={`${company.name}-${index}`} 
                company={company} 
              />
            ))}
          </div>
        </Marquee>

        {/* Gradient Edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
      </div>
    </div>
  );
}

export default MarqueeDemoHorizontal;