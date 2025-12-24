/**
 * ============================================
 * ENHANCED SIDEBAR - HEALTHCARE DESIGN SYSTEM
 * ============================================
 * 
 * Hỗ trợ:
 * - 3 user roles: Patient, Doctor, Admin
 * - Collapsible sidebar
 * - Multi-level navigation
 * - Badge & notification indicators
 * - Dark/Light mode
 * - Responsive
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button-new';
import { Activity, ChevronLeft, ChevronRight, LogOut, Settings } from 'lucide-react';
import { clearSession } from '@/lib/session';
import { useSession } from '@/hooks/useSession';
import { getNavigationForRole } from '@/config/navigation';

export interface SidebarProps {
  /**
   * Initial collapsed state
   */
  defaultCollapsed?: boolean;
  
  /**
   * Callback when collapse state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  
  /**
   * Custom className
   */
  className?: string;
}

export function Sidebar({ defaultCollapsed = false, onCollapsedChange, className }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  // Get navigation items based on user role
  const navSections = React.useMemo(() => {
    return getNavigationForRole(session?.user.role || 'patient');
  }, [session?.user.role]);

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  const handleSignOut = () => {
    clearSession();
    router.push('/auth/login');
  };

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-border bg-gradient-to-b from-sidebar-bg via-sidebar-bg to-sidebar-bg/95 text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-20' : 'w-72',
        className
      )}
    >
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />

      {/* Header / Logo */}
      <div className={cn('flex items-center justify-between border-b border-sidebar-border px-6 py-6', collapsed && 'justify-center px-4')}>
        <div className={cn('flex items-center gap-3', collapsed && 'flex-col gap-2')}>
          <div className="rounded-2xl bg-primary/20 p-3 text-primary shadow-lg">
            <Activity className={cn('h-6 w-6', collapsed && 'h-5 w-5')} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-sidebar-foreground/60">TechXen</p>
              <p className="text-lg font-semibold">Health Monitor</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            {!collapsed && (
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.3em] text-sidebar-foreground/50">
                {section.title}
              </p>
            )}
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/20 text-primary shadow-md'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active Indicator */}
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}

                    {/* Icon */}
                    <span
                      className={cn(
                        'flex items-center justify-center rounded-lg p-1.5 transition-colors',
                        isActive
                          ? 'bg-primary/30 text-primary'
                          : 'bg-sidebar-hover/50 text-sidebar-foreground/70 group-hover:bg-primary/20 group-hover:text-primary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    {/* Label */}
                    {!collapsed && <span className="flex-1">{item.label}</span>}

                    {/* Badge/Notification */}
                    {!collapsed && item.badge && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error px-1.5 text-xs font-semibold text-error-foreground">
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-lg group-hover:block">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-xs font-semibold text-error-foreground">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      <div className={cn('border-t border-sidebar-border p-4', collapsed && 'px-2')}>
        <div
          className={cn(
            'rounded-2xl bg-sidebar-hover/50 p-4 backdrop-blur-sm',
            collapsed && 'p-2'
          )}
        >
          {/* User Info */}
          <div className={cn('mb-3 flex items-center gap-3', collapsed && 'flex-col gap-2 mb-2')}>
            {/* Avatar */}
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold', collapsed && 'h-8 w-8 text-sm')}>
              {session?.user.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {session?.user.fullName ?? 'Đang tải...'}
                </p>
                <p className="text-xs uppercase tracking-wider text-primary">
                  {session?.user.role ?? 'role'}
                </p>
              </div>
            )}

            {!collapsed && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
                onClick={() => router.push('/dashboard/profile')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sign Out Button */}
          <Button
            variant="outline"
            size={collapsed ? 'icon-sm' : 'sm'}
            fullWidth={!collapsed}
            onClick={handleSignOut}
            className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-hover"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={handleToggleCollapse}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md hover:bg-accent hover:text-accent-foreground transition-all"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}
