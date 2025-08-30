import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface WeatherMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeatherMap({ isOpen, onClose }: WeatherMapProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-background/95 glass z-10" data-testid="weather-map-overlay">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Weather Map</h2>
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            data-testid="button-close-map"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          {/* Interactive weather map placeholder */}
          <div className="w-full h-full weather-map rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Card className="bg-card/80 glass rounded-lg p-6 text-center">
              <div className="text-lg font-medium text-foreground mb-2">Interactive Weather Map</div>
              <div className="text-sm text-muted-foreground mb-4">
                Weather map integration with real-time data would be implemented here using services like:
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• OpenWeatherMap API</div>
                <div>• Leaflet.js for interactive maps</div>
                <div>• Weather overlays (precipitation, temperature, etc.)</div>
                <div>• Real-time weather tracking</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
