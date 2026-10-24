import { useState } from "react";
import { BrowserSidebar } from "./components/BrowserSidebar";
import { BrowserTopBar } from "./components/BrowserTopBar";
import { WebContent } from "./components/WebContent";
import { MobileEmulator } from "./components/MobileEmulator";

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive?: boolean;
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Welcome to Somnus",
      url: "somnus://welcome",
      isActive: true,
    },
    {
      id: "2", 
      title: "Somnus Browser · GitHub",
      url: "https://github.com/somnus/browser",
      favicon: "https://github.com/favicon.ico",
    },
    {
      id: "3",
      title: "Example Domain",
      url: "https://example.com",
    },
  ]);

  const [currentUrl, setCurrentUrl] = useState("somnus://welcome");
  const [showMobileEmulator, setShowMobileEmulator] = useState(false);

  const activeTab = tabs.find(tab => tab.isActive);

  const handleTabSelect = (tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
    
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      setCurrentUrl(selectedTab.url);
    }
  };

  const handleNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "New Tab",
      url: "",
      isActive: true,
    };

    setTabs([
      ...tabs.map(tab => ({ ...tab, isActive: false })),
      newTab
    ]);
    setCurrentUrl("");
  };

  const handleUrlChange = (url: string) => {
    setCurrentUrl(url);
    
    // Update the active tab
    setTabs(tabs.map(tab => 
      tab.isActive 
        ? { 
            ...tab, 
            url, 
            title: url || "New Tab" 
          }
        : tab
    ));
  };

  const handleNavigate = (direction: 'back' | 'forward' | 'refresh') => {
    // Mock navigation - in real browser this would handle history
    console.log(`Navigate ${direction}`);
  };

  const handleWindowControl = (action: string) => {
    console.log(`Window ${action}`);
  };

  return (
    <div className="h-screen w-screen bg-surface-0 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <BrowserTopBar
        currentUrl={currentUrl}
        onUrlChange={handleUrlChange}
        onNavigate={handleNavigate}
        onMinimize={() => handleWindowControl('minimize')}
        onMaximize={() => handleWindowControl('maximize')}
        onClose={() => handleWindowControl('close')}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <BrowserSidebar
          tabs={tabs}
          onTabSelect={handleTabSelect}
          onNewTab={handleNewTab}
          onMobileView={() => setShowMobileEmulator(true)}
        />

        {/* Web Content */}
        <div className="flex-1 flex flex-col">
          {tabs.map(tab => (
            <WebContent
              key={tab.id}
              url={tab.url}
              isActive={tab.isActive}
            />
          ))}
        </div>
      </div>

      {/* Mobile Emulator Modal */}
      <MobileEmulator
        isVisible={showMobileEmulator}
        onClose={() => setShowMobileEmulator(false)}
      />
    </div>
  );
}