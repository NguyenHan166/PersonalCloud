import React, { useState, createContext, useContext } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/classNames';
import { Avatar, IconButton, Input, Tooltip } from '@/components/common';
import {
  Library,
  FolderOpen,
  FileText,
  Link,
  StickyNote,
  Share2,
  Trash2,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Globe,
} from 'lucide-react';
import type { Tag } from '@/types/domain';

// Context for sidebar state
interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within AppShell');
  return context;
};

// Navigation items
const navItems = [
  { path: '/library', label: 'Library', icon: Library },
  { path: '/collections', label: 'Collections', icon: FolderOpen },
  { path: '/files', label: 'Files', icon: FileText },
  { path: '/links', label: 'Links', icon: Link },
  { path: '/notes', label: 'Notes', icon: StickyNote },
  { path: '/shared-links', label: 'Shared Links', icon: Share2 },
  { path: '/trash', label: 'Trash', icon: Trash2 },
  { divider: true },
  { path: '/public', label: 'Public Library', icon: Globe, external: true },
];

// Dummy tags for now
const dummyTags: Tag[] = [
  { id: '1', name: 'Frontend', color: '#6366F1', usageCount: 15 },
  { id: '2', name: 'Backend', color: '#22C55E', usageCount: 12 },
  { id: '3', name: 'Design', color: '#F59E0B', usageCount: 8 },
  { id: '4', name: 'DevOps', color: '#EF4444', usageCount: 5 },
  { id: '5', name: 'AI/ML', color: '#8B5CF6', usageCount: 3 },
];

interface AppShellProps {
  tags?: Tag[];
  onTagSelect?: (tagId: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  tags = dummyTags,
  onTagSelect,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div className="relative h-screen bg-background overflow-hidden">
        {/* Backdrop when sidebar is expanded */}
        {!isCollapsed && (
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={toggleCollapse}
          />
        )}

        {/* Sidebar - overlay mode */}
        <aside
          className={classNames(
            'fixed inset-y-0 left-0 z-50',
            'flex flex-col bg-surface border-r border-border shadow-lg',
            'transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between h-16 px-3 border-b border-border">
            {!isCollapsed && (
              <h1 className="text-lg font-bold text-primary truncate">
                CloudLib
              </h1>
            )}
            <Tooltip content={isCollapsed ? 'Expand' : 'Collapse'} position="right">
              <IconButton
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                icon={isCollapsed ? <PanelLeft className="w-full h-full" /> : <PanelLeftClose className="w-full h-full" />}
                onClick={toggleCollapse}
              />
            </Tooltip>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item, index) => {
                // Handle divider
                if ('divider' in item && item.divider) {
                  return (
                    <li key={`divider-${index}`} className="my-2">
                      <hr className="border-border" />
                    </li>
                  );
                }

                // Type guard for nav items
                if (!item.path || !item.icon) return null;

                const NavIcon = item.icon;

                return (
                  <li key={item.path}>
                    <Tooltip 
                      content={item.label} 
                      position="right"
                      delay={isCollapsed ? 100 : 1000}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          classNames(
                            'flex items-center gap-3 px-3 py-2 rounded-lg',
                            'transition-colors duration-200',
                            isCollapsed && 'justify-center',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-text-secondary hover:bg-gray-100 hover:text-text'
                          )
                        }
                      >
                        <NavIcon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </NavLink>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>

            {/* Tags section */}
            {!isCollapsed && (
              <div className="mt-6 px-2">
                <button
                  onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted hover:text-text"
                >
                  <span>Popular Tags</span>
                  {isTagsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isTagsExpanded && (
                  <ul className="mt-1 space-y-1">
                    {tags.map((tag) => (
                      <li key={tag.id}>
                        <button
                          onClick={() => onTagSelect?.(tag.id)}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-secondary hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tag.color || '#94A3B8' }}
                          />
                          <span className="truncate">{tag.name}</span>
                          {tag.usageCount !== undefined && (
                            <span className="ml-auto text-xs text-muted">
                              {tag.usageCount}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </nav>

          {/* User section at bottom */}
          <div className="p-3 border-t border-border">
            <div className={classNames(
              'flex items-center gap-3',
              isCollapsed && 'justify-center'
            )}>
              <Avatar name="John Doe" size="sm" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">John Doe</p>
                  <p className="text-xs text-muted truncate">john@example.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content area - offset by collapsed sidebar width */}
        <div className="flex flex-col h-screen ml-16">
          {/* Header */}
          <Header />

          {/* Page content - scrollable */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

// Header component
const Header: React.FC = () => {
  const location = useLocation();

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    const item = navItems.find((nav) => 'path' in nav && nav.path && path.startsWith(nav.path));
    return (item && 'label' in item) ? item.label : 'Dashboard';
  };

  return (
    <header className="h-16 bg-surface border-b border-border px-4 md:px-6 flex items-center gap-4">
      {/* Page title */}
      <h2 className="text-lg font-semibold text-text md:hidden">
        {getPageTitle()}
      </h2>

      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <Input
          placeholder="Search by title, tags, content..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Tooltip content="Settings" position="bottom">
          <IconButton
            aria-label="Settings"
            icon={<Settings className="w-full h-full" />}
          />
        </Tooltip>
        <div className="hidden md:block">
          <Avatar name="John Doe" size="sm" />
        </div>
      </div>
    </header>
  );
};
