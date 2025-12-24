/**
 * ============================================
 * ENHANCED TOPNAV/HEADER - HEALTHCARE DESIGN SYSTEM
 * ============================================
 * 
 * Features:
 * - Search bar
 * - Notifications dropdown
 * - Language switcher (EN/VI)
 * - Theme toggle (Dark/Light)
 * - User profile dropdown
 * - Breadcrumb navigation
 */

'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, IconButton } from '@/components/ui/button-new';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession } from '@/hooks/useSession';
import { clearSession } from '@/lib/session';

export interface TopNavProps {
  /**
   * Show/hide search bar
   */
  showSearch?: boolean;
  
  /**
   * Callback for mobile menu toggle
   */
  onMenuClick?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
}

export function TopNav({ showSearch = true, onMenuClick, className }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const session = useSession();
  const [language, setLanguage] = React.useState<'en' | 'vi'>('en');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // TODO: Fetch notifications from API - GET /api/notifications/:userId
  // See BACKEND_API_PLAN.md for API specifications
  const notifications: Array<any> = [];
  const unreadCount = 0;

  const handleSignOut = () => {
    clearSession();
    router.push('/auth/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  // Generate breadcrumbs from pathname
  const breadcrumbs = React.useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      href: '/' + paths.slice(0, index + 1).join('/'),
    }));
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-header-border bg-header-bg/95 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          {/* Mobile Menu Button */}
          <IconButton
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </IconButton>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <span className="text-muted-foreground">/</span>
                )}
                <button
                  onClick={() => router.push(crumb.href)}
                  className={cn(
                    'hover:text-primary transition-colors',
                    index === breadcrumbs.length - 1
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Search Bar */}
          {showSearch && (
            <div className="hidden lg:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search patients, records, reports..."
                  className="h-9 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          {showSearch && (
            <IconButton
              variant="ghost"
              size="icon"
              className="lg:hidden"
            >
              <Search className="h-5 w-5" />
            </IconButton>
          )}

          {/* Theme Toggle */}
          <IconButton
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </IconButton>

          {/* Language Switcher */}
          <IconButton
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title="Change language"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">{language === 'en' ? 'EN' : 'VI'}</span>
          </IconButton>

          {/* Notifications */}
          <div className="relative">
            <IconButton
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-error-foreground">
                  {unreadCount}
                </span>
              )}
            </IconButton>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-popover-border bg-popover shadow-xl">
                <div className="border-b border-popover-border px-4 py-3">
                  <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className={cn(
                        'flex w-full flex-col gap-1 border-b border-popover-border px-4 py-3 text-left transition-colors hover:bg-dropdown-hover',
                        notif.unread && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-popover-foreground">
                          {notif.title}
                        </p>
                        {notif.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">{notif.time}</p>
                    </button>
                  ))}
                </div>
                <div className="border-t border-popover-border px-4 py-2">
                  <Button variant="link" size="sm" fullWidth>
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-accent/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {session?.user.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {session?.user.fullName ?? 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user.role ?? 'role'}
                </p>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-muted-foreground" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-popover-border bg-popover shadow-xl">
                <div className="border-b border-popover-border px-4 py-3">
                  <p className="font-semibold text-popover-foreground">
                    {session?.user.fullName ?? 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user.email ?? 'email'}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-dropdown-hover"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-dropdown-hover"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-popover-border p-2">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
