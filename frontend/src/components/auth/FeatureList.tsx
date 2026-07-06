import React from 'react';
import {
  ShieldCheck,
  CheckSquare,
  Users,
  LayoutDashboard,
  LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  label: string;
}

const features: Feature[] = [
  { icon: ShieldCheck, label: 'Secure Authentication & Access Control' },
  { icon: CheckSquare, label: 'Smart Task Management & Tracking' },
  { icon: Users, label: 'Employee Directory & Profiles' },
  { icon: LayoutDashboard, label: 'Enterprise Analytics Dashboard' },
];

export const FeatureList: React.FC = () => {
  return (
    <ul className="space-y-4 mt-8" role="list" aria-label="Platform features">
      {features.map(({ icon: Icon, label }, i) => (
        <li
          key={i}
          className="auth-feature-item flex items-center gap-3.5"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-400" />
          </span>
          <span className="text-[14px] font-medium text-neutral-300 leading-snug">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
