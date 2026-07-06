import React from 'react';
import { ThemeSelector } from './ThemeSelector';
import { FeatureList } from './FeatureList';
import '@/styles/auth.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-[#0F172A]">

      {/* ── LEFT PANEL (40%) ── branding only, hidden on mobile ── */}
      <aside
        className="auth-panel-bg hidden lg:flex flex-col w-[40%] xl:w-[38%] min-h-screen px-10 py-8 shrink-0"
        aria-hidden="true"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            V
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">
            Employee Task Manager
          </span>
        </div>

        {/* Main copy */}
        <div className="flex-1 flex flex-col justify-center relative z-10 mt-[-48px]">
          <div className="max-w-[360px]">
            <h1 className="text-[36px] font-bold text-white leading-[1.15] tracking-tight">
              Employee Task<br />
              <span className="text-blue-400">Manager</span>
            </h1>
            <p className="mt-4 text-[14px] text-neutral-400 leading-relaxed max-w-[300px]">
              Manage employees, assign tasks, monitor progress, and improve team
              productivity from one unified workspace.
            </p>
            <FeatureList />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-[12px] text-neutral-600 font-medium">
            Built for enterprise productivity
          </p>
        </div>
      </aside>

      {/* ── RIGHT PANEL (60%) ── auth card ── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar — theme switcher */}
        <div className="flex items-center justify-end px-6 py-3">
          <ThemeSelector />
        </div>

        {/* Centered card area */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          {children}
        </div>

        {/* Bottom footnote */}
        <div className="text-center pb-4 px-6">
          <p className="text-[12px] text-neutral-400 dark:text-[#94A3B8]">
            © {new Date().getFullYear()} Vikal Suite · Enterprise Task Management
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
