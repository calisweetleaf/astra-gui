import { useState } from "react";

interface WebContentProps {
  url: string;
  isActive: boolean;
}

export function WebContent({ url, isActive }: WebContentProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Mock content based on URL
  const getContent = () => {
    if (url.includes('github.com')) {
      return (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-8 h-8 bg-surface-2 rounded-full" />
              <div>
                <h1 className="text-primary">Somnus Browser</h1>
                <p className="text-secondary text-sm">A modern, beautiful browser experience</p>
              </div>
            </div>
            
            <div className="bg-surface-1 rounded-lg p-6 mb-6">
              <h2 className="text-primary mb-3">README.md</h2>
              <div className="space-y-3 text-secondary text-sm">
                <p># Somnus Browser</p>
                <p>A next-generation browser built with modern web technologies.</p>
                <p>## Features</p>
                <p>- Beautiful, minimalist interface inspired by Arc and Vivaldi</p>
                <p>- Built-in mobile emulator for testing</p>
                <p>- Glass morphism design with dark theme</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (url.includes('example.com') || url === '' || url.includes('somnus://welcome')) {
      return (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-surface-0 via-accent-blue/2 to-accent-purple/2">
          {/* Subtle ambient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/1 via-accent-purple/1 to-accent-cyan/1" />
          
          <div className="relative z-10 w-full max-w-2xl px-8">
            {/* Logo */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-blue via-accent-purple to-accent-cyan rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <div className="w-12 h-12 bg-white/90 rounded-full" />
              </div>
              <h1 className="text-4xl font-light text-gradient mb-2">Somnus</h1>
              <p className="text-secondary">Beautiful browsing with mobile apps built in</p>
            </div>

            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search the web or enter URL..."
                  className="w-full h-14 px-6 text-lg bg-gradient-to-r from-surface-1 to-accent-blue/5 border border-accent-blue/30 rounded-2xl text-primary placeholder:text-secondary focus:outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/20 transition-all duration-300 shadow-lg"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-200">
                  <div className="w-4 h-4 bg-white/90 rounded" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-4 gap-4 mb-12">
              {[
                { name: "Google", color: "from-accent-blue to-accent-cyan" },
                { name: "GitHub", color: "from-accent-purple to-accent-blue" },
                { name: "YouTube", color: "from-accent-red to-accent-yellow" },
                { name: "Twitter", color: "from-accent-cyan to-accent-blue" }
              ].map((site, index) => (
                <div
                  key={site.name}
                  className="group bg-gradient-to-br from-surface-1 to-accent-blue/5 rounded-xl p-4 border border-accent-blue/20 hover:border-accent-blue/40 cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${site.color} rounded-lg mb-3 mx-auto`} />
                  <p className="text-sm text-center text-secondary group-hover:text-primary transition-colors">
                    {site.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile Platform Highlight */}
            <div className="bg-gradient-to-r from-accent-blue/10 via-accent-purple/10 to-accent-cyan/10 rounded-2xl p-6 border border-accent-blue/20 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-white/90 rounded" />
                </div>
                <span className="text-gradient font-medium">Universal Platform Ready</span>
              </div>
              <p className="text-sm text-secondary mb-4">
                Run Android apps directly in your browser alongside web content
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan text-white rounded-lg hover:scale-105 transition-transform duration-200 text-sm shadow-lg">
                Try Mobile Apps
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center relative">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-cyan/20 rounded-xl mx-auto mb-6 flex items-center justify-center border border-accent-blue/30 glow-blue">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg animate-pulse" />
          </div>
          <h3 className="text-gradient mb-4">Loading {url}</h3>
          <div className="w-48 h-2 bg-surface-2 rounded-full overflow-hidden mx-auto border border-accent-blue/20">
            <div className="h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="flex-1 bg-surface-0 overflow-auto">
      {getContent()}
    </div>
  );
}