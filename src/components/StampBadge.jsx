import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

export default function StampBadge({ status, delayClass = 'delay-gate-0' }) {
  const configs = {
    ready: {
      label: 'CLEARED',
      icon: Check,
      textClass: 'text-stamp-green',
      borderClass: 'border-stamp-green/80 ring-stamp-green/30',
      bgClass: 'bg-stamp-green-tint',
    },
    borderline: {
      label: 'BORDERLINE',
      icon: AlertTriangle,
      textClass: 'text-stamp-amber',
      borderClass: 'border-stamp-amber/80 ring-stamp-amber/30',
      bgClass: 'bg-stamp-amber-tint',
    },
    not_yet: {
      label: 'NOT YET',
      icon: X,
      textClass: 'text-stamp-red',
      borderClass: 'border-stamp-red/80 ring-stamp-red/30',
      bgClass: 'bg-stamp-red-tint',
    },
  };

  const config = configs[status] || configs.not_yet;
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border-2 border-dashed uppercase tracking-wider font-bold text-xs sm:text-sm shadow-sm select-none animate-stamp ${delayClass} ${config.textClass} ${config.borderClass} ${config.bgClass}`}
      style={{
        letterSpacing: '0.12em',
      }}
      aria-label={`Status: ${config.label}`}
    >
      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
}
