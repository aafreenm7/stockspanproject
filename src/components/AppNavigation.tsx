import React from 'react';
import {
  Compass,
  Layers,
  TableProperties,
  BarChart3,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'visualizer'
  | 'history'
  | 'analytics'
  | 'guide'
  | 'about';

interface AppNavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  recordCount: number;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  activeTab,
  onSelectTab,
  recordCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'visualizer', label: 'Stack Visualizer', icon: Layers },
    { id: 'history', label: 'Price History', icon: TableProperties, badge: recordCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'guide', label: 'Algorithm Guide', icon: BookOpen },
    { id: 'about', label: 'About Project', icon: GraduationCap },
  ];

  return (
    <nav className="border-b border-line bg-bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-brand-mint text-brand border border-brand-sage font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-[#F7F7F2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-ink-secondary'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-brand text-white'
                        : 'bg-line text-ink-secondary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
