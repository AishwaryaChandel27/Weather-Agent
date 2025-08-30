import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { 
  Menu, 
  Map, 
  Download, 
  Settings,
  Cloud,
  Moon,
  Sun
} from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onToggleMap: () => void;
  onExportChat: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({ 
  onToggleSidebar, 
  onToggleMap, 
  onExportChat, 
  onOpenSettings 
}: ChatHeaderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <header className="bg-card/50 glass border-b border-border p-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onToggleSidebar}
          size="sm"
          variant="ghost"
          className="lg:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          data-testid="button-toggle-sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-4">
          {/* Current Weather Display */}
          <div className="flex items-center space-x-3">
            {/* Weather icon based on theme */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              {resolvedTheme === "dark" ? (
                <Moon className="h-5 w-5 text-accent" />
              ) : (
                <Sun className="h-5 w-5 text-accent" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-foreground" data-testid="text-weather-description">
                Partly Cloudy
              </div>
              <div className="text-xs text-muted-foreground" data-testid="text-weather-location">
                New York, NY
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Weather Map Toggle */}
          <Button
            onClick={onToggleMap}
            size="sm"
            variant="ghost"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            title="Toggle Weather Map"
            data-testid="button-toggle-map"
          >
            <Map className="h-4 w-4" />
          </Button>
          
          {/* Export Chat */}
          <Button
            onClick={onExportChat}
            size="sm"
            variant="ghost"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            title="Export Chat"
            data-testid="button-export-chat"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {/* Settings */}
          <Button
            onClick={onOpenSettings}
            size="sm"
            variant="ghost"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            title="Settings"
            data-testid="button-open-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
