import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

interface TrendBadgeProps {
    type: 'rising' | 'high-impact';
    label?: string;
    className?: string;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({ type, label, className = '' }) => {
    if (type === 'rising') {
        return (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-pulse ${className}`}>
                <TrendingUp size={10} />
                {label || 'Rising Trend'}
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider ${className}`}>
            <Zap size={10} />
            {label || 'High Impact'}
        </div>
    );
};

export default TrendBadge;
