import { ArrowLeft, ArrowRight, RotateCcw, Lock, Star, MoreHorizontal, Minimize2, Maximize2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface BrowserTopBarProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  onNavigate: (direction: 'back' | 'forward' | 'refresh') => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function BrowserTopBar({ 
  currentUrl, 
  onUrlChange, 
  onNavigate, 
  onMinimize, 
  onMaximize, 
  onClose 
}: BrowserTopBarProps) {
  return (
    <div className="h-12 bg-gradient-to-r from-surface-1 via-accent-blue/5 to-accent-purple/5 border-b border-subtle flex items-center px-4 space-x-3 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/3 via-transparent to-accent-cyan/3" />
      
      {/* Window Controls */}
      <div className="flex items-center space-x-2 relative">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gradient-to-br from-accent-red to-accent-red/80 rounded-full cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-accent-red/50 transition-all duration-200" onClick={onClose} />
          <div className="w-3 h-3 bg-gradient-to-br from-accent-yellow to-accent-yellow/80 rounded-full cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-accent-yellow/50 transition-all duration-200" onClick={onMinimize} />
          <div className="w-3 h-3 bg-gradient-to-br from-accent-green to-accent-green/80 rounded-full cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-accent-green/50 transition-all duration-200" onClick={onMaximize} />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-1 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('back')}
          className="h-8 w-8 p-0 hover:bg-accent-blue/20 hover:text-accent-blue transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('forward')}
          className="h-8 w-8 p-0 hover:bg-accent-purple/20 hover:text-accent-purple transition-all duration-300"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('refresh')}
          className="h-8 w-8 p-0 hover:bg-accent-cyan/20 hover:text-accent-cyan transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Address Bar */}
      <div className="flex-1 max-w-2xl relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Lock className="h-3 w-3 text-accent-green drop-shadow-sm" />
          </div>
          <Input
            value={currentUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Search or enter web address..."
            className="pl-10 pr-10 h-8 bg-gradient-to-r from-surface-2 to-accent-blue/5 border border-accent-blue/30 text-sm focus:bg-gradient-to-r focus:from-surface-0 focus:to-accent-blue/10 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-300 text-primary placeholder:text-secondary"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Star className="h-3 w-3 text-muted hover:text-accent-yellow hover:scale-110 cursor-pointer transition-all duration-200" />
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1 relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-accent-purple/20 hover:text-accent-purple transition-all duration-300"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}