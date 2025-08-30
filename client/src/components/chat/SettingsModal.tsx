import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/hooks/useTheme";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UserSettings } from "@/types/chat";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  
  const [localSettings, setLocalSettings] = useState<Partial<UserSettings>>({
    theme: theme,
    language: "en",
    weatherAlerts: true,
    soundEnabled: false,
  });

  // Fetch user settings
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
    enabled: isOpen,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      const response = await apiRequest('PATCH', '/api/settings', updates);
      return response.json();
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['/api/settings'], updatedSettings);
      if (updatedSettings.theme) {
        setTheme(updatedSettings.theme);
      }
    },
  });

  // Update local settings when server settings load
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        theme: settings.theme,
        language: settings.language,
        weatherAlerts: settings.weatherAlerts,
        soundEnabled: settings.soundEnabled,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettingsMutation.mutateAsync(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 glass z-50 flex items-center justify-center"
      onClick={onClose}
      data-testid="settings-modal-overlay"
    >
      <Card 
        className="bg-card glass border border-border rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            data-testid="button-close-settings"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Appearance</h3>
            <RadioGroup
              value={localSettings.theme || "auto"}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, theme: value as any }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="text-sm text-foreground">Light mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="text-sm text-foreground">Dark mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto" className="text-sm text-foreground">Auto (system)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Language Settings */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Language</h3>
            <Select
              value={localSettings.language || "en"}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="weather-alerts" className="text-sm text-foreground">
                  Weather alerts
                </Label>
                <Switch
                  id="weather-alerts"
                  checked={localSettings.weatherAlerts || false}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, weatherAlerts: checked }))
                  }
                  data-testid="switch-weather-alerts"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled" className="text-sm text-foreground">
                  Sound notifications
                </Label>
                <Switch
                  id="sound-enabled"
                  checked={localSettings.soundEnabled || false}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, soundEnabled: checked }))
                  }
                  data-testid="switch-sound-notifications"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={updateSettingsMutation.isPending}
            data-testid="button-save-settings"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
