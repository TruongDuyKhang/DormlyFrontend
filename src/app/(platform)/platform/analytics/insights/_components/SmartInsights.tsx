// app/(platform)/analytics/insights/_components/SmartInsights.tsx
'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
}

interface SmartInsightsProps {
  insights: Insight[];
  title?: string;
}

const getIcon = (type: string) => {
  switch(type) {
    case 'positive': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />;
    default: return <AlertCircle className="h-4 w-4 text-stone-400" />;
  }
};

const getBgColor = (type: string) => {
  switch(type) {
    case 'positive': return 'bg-emerald-50';
    case 'negative': return 'bg-red-50';
    default: return 'bg-stone-50';
  }
};

export function SmartInsights({ insights, title = "Smart Insights" }: SmartInsightsProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-[#c3a26c]" />
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      </div>
      <div className="space-y-2.5">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn("flex items-start gap-3 rounded-lg p-3", getBgColor(insight.type))}
          >
            {getIcon(insight.type)}
            <p className="text-sm text-stone-700 leading-relaxed">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}