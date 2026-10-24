import { Smartphone, RotateCcw, Home, Volume2, Power } from "lucide-react";
import { Button } from "./ui/button";

interface MobileEmulatorProps {
  isVisible: boolean;
  onClose: () => void;
}

export function MobileEmulator({ isVisible, onClose }: MobileEmulatorProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-surface-1 via-accent-blue/10 to-accent-purple/10 rounded-3xl p-8 w-full max-w-2xl border border-accent-blue/30 shadow-2xl glow-blue">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-gradient text-lg">Universal Platform</h3>
              <p className="text-xs text-secondary">Native mobile apps in your browser</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-accent-red/20 hover:text-accent-red rounded-lg"
          >
            ×
          </Button>
        </div>

        {/* Platform Showcase */}
        <div className="grid grid-cols-2 gap-8">
          {/* Device Frame */}
          <div className="relative">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] p-3 shadow-2xl glow-purple">
              <div className="bg-gradient-to-b from-surface-2 to-accent-blue/10 rounded-[2rem] overflow-hidden border border-accent-blue/20">
                {/* Phone Header */}
                <div className="bg-gradient-to-r from-gray-900 to-black h-8 rounded-t-[2rem] flex items-center justify-center relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-2 w-16 h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
                </div>
                
                {/* Screen Content */}
                <div className="h-80 bg-gradient-to-br from-surface-0 via-accent-blue/5 to-accent-purple/10 p-4 relative overflow-hidden">
                  {/* Mock App Interface */}
                  <div className="bg-white/10 rounded-2xl h-full p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-cyan rounded-lg" />
                      <div className="text-xs text-white">Instagram</div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/20 rounded-lg h-32" />
                      <div className="bg-white/20 rounded-lg h-4 w-3/4" />
                      <div className="bg-white/20 rounded-lg h-4 w-1/2" />
                    </div>
                  </div>
                </div>

                {/* Phone Footer */}
                <div className="bg-gradient-to-r from-gray-900 to-black h-8 rounded-b-[2rem]" />
              </div>
            </div>

            {/* Phone Controls */}
            <div className="absolute -right-1 top-16 space-y-2">
              <div className="w-1 h-12 bg-gradient-to-b from-accent-blue to-accent-purple rounded-l shadow-sm" />
              <div className="w-1 h-8 bg-gradient-to-b from-accent-purple to-accent-cyan rounded-l shadow-sm" />
              <div className="w-1 h-8 bg-gradient-to-b from-accent-cyan to-accent-green rounded-l shadow-sm" />
            </div>
          </div>

          {/* Platform Features */}
          <div className="space-y-6">
            <div>
              <h4 className="text-gradient mb-3">Revolutionary Integration</h4>
              <p className="text-secondary text-sm mb-4">
                Run native Android apps alongside web content. No downloads, no separate windows.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 rounded-xl p-4 border border-accent-blue/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-accent-blue">Instagram</span>
                  <span className="text-xs text-secondary">Running</span>
                </div>
                <div className="text-xs text-secondary">Share directly to web workflow</div>
              </div>

              <div className="bg-gradient-to-r from-accent-purple/10 to-accent-purple/5 rounded-xl p-4 border border-accent-purple/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-accent-purple">VS Code</span>
                  <span className="text-xs text-secondary">Available</span>
                </div>
                <div className="text-xs text-secondary">Code on mobile, deploy from desktop</div>
              </div>

              <div className="bg-gradient-to-r from-accent-cyan/10 to-accent-cyan/5 rounded-xl p-4 border border-accent-cyan/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-accent-cyan">Figma</span>
                  <span className="text-xs text-secondary">Available</span>
                </div>
                <div className="text-xs text-secondary">Design everywhere, sync everything</div>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan text-white shadow-lg transition-all duration-300 hover:scale-105">
                Launch Platform
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}