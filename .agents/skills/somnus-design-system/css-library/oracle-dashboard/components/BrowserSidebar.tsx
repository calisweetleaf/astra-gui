import { Plus, Home, Search, Settings, Smartphone, Bookmark, History, Download } from "lucide-react";
import { Button } from "./ui/button";

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive?: boolean;
}

interface BrowserSidebarProps {
  tabs: Tab[];
  onTabSelect: (tabId: string) => void;
  onNewTab: () => void;
  onMobileView: () => void;
}

export function BrowserSidebar({ tabs, onTabSelect, onNewTab, onMobileView }: BrowserSidebarProps) {
  const navigationItems = [
    { icon: Home, label: "Home", action: () => {} },
    { icon: Search, label: "Search", action: () => {} },
    { icon: Bookmark, label: "Bookmarks", action: () => {} },
    { icon: History, label: "History", action: () => {} },
    { icon: Download, label: "Downloads", action: () => {} },
  ];

  return (
    <div className="w-64 h-full bg-surface-1 border-r border-subtle flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 via-accent-purple/5 to-accent-cyan/5" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-subtle bg-gradient-to-r from-accent-blue/10 to-accent-purple/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gradient font-medium">Somnus Browser</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewTab}
            className="h-8 w-8 p-0 hover:bg-accent-blue/20 hover:glow-blue transition-all duration-300"
          >
            <Plus className="h-4 w-4 text-accent-blue" />
          </Button>
        </div>
        
        {/* Universal Platform Access */}
        <Button
          onClick={onMobileView}
          className="w-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan hover:from-accent-blue/90 hover:via-accent-purple/90 hover:to-accent-cyan/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue relative overflow-hidden"
          size="sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 transform -skew-x-12 animate-pulse" />
          <Smartphone className="h-4 w-4 mr-2 relative" />
          <span className="relative">Universal Platform</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="relative px-3 py-2 border-b border-subtle">
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            const colors = [
              'hover:bg-accent-blue/20 hover:text-accent-blue',
              'hover:bg-accent-purple/20 hover:text-accent-purple',
              'hover:bg-accent-cyan/20 hover:text-accent-cyan',
              'hover:bg-accent-green/20 hover:text-accent-green',
              'hover:bg-accent-yellow/20 hover:text-accent-yellow'
            ];
            return (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={item.action}
                className={`w-full justify-start text-secondary transition-all duration-300 ${colors[index]}`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="p-3">
          <div className="text-xs text-gradient-alt font-medium mb-3 px-2">OPEN TABS</div>
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                onClick={() => onTabSelect(tab.id)}
                className={`
                  group cursor-pointer rounded-lg p-3 transition-all duration-300 relative overflow-hidden
                  ${tab.isActive 
                    ? 'bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-cyan/20 border border-accent-blue/30 shadow-lg glow-blue' 
                    : 'hover:bg-gradient-to-r hover:from-accent-blue/10 hover:to-accent-purple/10 hover:border-accent-blue/20 border border-transparent'
                  }
                `}
              >
                {tab.isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-accent-purple/5 to-accent-cyan/5 animate-pulse" />
                )}
                <div className="flex items-start space-x-3 relative">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                    {tab.favicon ? (
                      <img src={tab.favicon} alt="" className="w-full h-full rounded-sm" />
                    ) : (
                      <div className={`w-full h-full rounded-sm ${
                        tab.isActive 
                          ? 'bg-gradient-to-br from-accent-blue to-accent-purple' 
                          : 'bg-surface-3'
                      }`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm truncate ${
                      tab.isActive ? 'text-white font-medium' : 'text-primary'
                    }`}>
                      {tab.title}
                    </div>
                    <div className={`text-xs truncate mt-0.5 ${
                      tab.isActive ? 'text-accent-cyan' : 'text-muted'
                    }`}>
                      {tab.url}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="relative p-3 border-t border-subtle bg-gradient-to-r from-accent-purple/5 to-accent-cyan/5">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-secondary hover:text-accent-purple hover:bg-accent-purple/20 transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
}