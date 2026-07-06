import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Menu, Sun, Moon, Laptop, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemePreference, useTheme } from '@/hooks/useTheme';
import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar/Avatar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
    setThemeDropdownOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Employees', path: '/employees', icon: Users },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'Auto', icon: Laptop },
  ];

  const CurrentThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-[#0F172A] text-neutral-900 dark:text-[#F8FAFC]">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col shrink-0 bg-white dark:bg-[#111827] border-r border-neutral-200 dark:border-[#334155] h-full overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-neutral-200 dark:border-[#334155] shrink-0">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm">
            V
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="ml-3 font-semibold text-[15px] text-neutral-900 dark:text-[#F8FAFC] whitespace-nowrap overflow-hidden tracking-tight"
            >
              Employee Task Manager
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-hidden">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-50 dark:bg-[#1E293B] text-blue-700 dark:text-[#93C5FD]'
                    : 'text-neutral-500 dark:text-[#94A3B8] hover:bg-neutral-100 dark:hover:bg-[#1E293B] hover:text-neutral-800 dark:hover:text-[#F8FAFC]'
                ].join(' ')}
              >
                <Icon className={['w-[18px] h-[18px] shrink-0 transition-colors', isActive ? 'text-blue-600 dark:text-[#93C5FD]' : 'text-neutral-400 dark:text-[#94A3B8]'].join(' ')} />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="truncate whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-2 pb-4 border-t border-neutral-200 dark:border-[#334155] pt-4 shrink-0">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-50 dark:bg-[#111827] transition-colors">
            <Avatar
              src={user?.avatarUrl}
              name={user?.name ?? 'User'}
              size="sm"
              className="bg-blue-600 text-white"
            />
            {sidebarOpen && (
              <div className="overflow-hidden text-left">
                <p className="text-[12px] font-semibold text-neutral-900 dark:text-[#F8FAFC] truncate">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-[#94A3B8] truncate">
                  {user?.email || user?.role || 'Member'}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-[#111827] border-b border-neutral-200 dark:border-[#334155] shrink-0">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer text-neutral-600 dark:text-[#CBD5E1]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation Links beside Hamburger */}
            <nav className="hidden md:flex items-center gap-6 ml-6 border-l border-neutral-200 dark:border-[#334155] pl-6">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-[#93C5FD] font-semibold'
                        : 'text-neutral-550 dark:text-[#94A3B8] hover:text-neutral-900 dark:hover:text-[#F8FAFC]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Professional Theme Switcher Dropdown */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#111827] hover:bg-neutral-50 dark:hover:bg-[#1E293B] transition-all cursor-pointer text-xs font-semibold text-neutral-700 dark:text-[#CBD5E1]"
              >
                <CurrentThemeIcon className="w-4 h-4 text-neutral-500 dark:text-[#94A3B8]" />
                <span className="capitalize">{theme === 'system' ? 'Auto' : theme}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-md shadow-lg dark:shadow-[0_16px_48px_rgba(0,0,0,0.35)] z-30 py-1"
                  >
                    {themeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = theme === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleThemeChange(opt.value as ThemePreference)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-[#1E293B] text-blue-600 dark:text-[#93C5FD] font-semibold'
                              : 'text-neutral-700 dark:text-[#CBD5E1] hover:bg-neutral-50 dark:hover:bg-[#1E293B]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={async () => {
                await logout();
                navigate('/login', { replace: true });
              }}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#1E293B] transition-colors text-neutral-600 dark:text-[#CBD5E1]"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* User profile and dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-neutral-200 dark:border-[#334155] rounded-full hover:bg-neutral-100 dark:hover:bg-[#1E293B] transition-colors px-3 py-2"
              >
                <Avatar
                  src={user?.avatarUrl}
                  name={user?.name ?? 'User'}
                  size="sm"
                  className="bg-blue-600 text-white"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-[#F8FAFC] truncate">
                    {user?.name ?? 'User'}
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-[#94A3B8] font-medium truncate">
                    {user?.email || user?.role || 'Member'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400 dark:text-[#94A3B8]" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 origin-top-right bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-xl shadow-lg dark:shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-40 py-2"
                  >
                    <button
                      onClick={async () => {
                        await logout();
                        navigate('/login', { replace: true });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-[#CBD5E1] hover:bg-neutral-50 dark:hover:bg-[#1E293B] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-neutral-50 dark:bg-[#0F172A]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
