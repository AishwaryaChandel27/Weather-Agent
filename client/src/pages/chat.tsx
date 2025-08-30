import { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { MessageInput } from "@/components/chat/MessageInput";
import { WeatherMap } from "@/components/chat/WeatherMap";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { WeatherParticles } from "@/components/weather/WeatherParticles";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Radar,
  AlertTriangle,
  X
} from "lucide-react";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState<{
    message: string;
    severity: 'info' | 'warning' | 'error';
  } | null>(null);

  const { sendMessage, messages, error } = useChat();
  const { toast } = useToast();

  // Handle suggestion clicks
  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  // Export chat functionality
  const handleExportChat = () => {
    if (messages.length === 0) {
      toast({
        title: "No messages to export",
        description: "Start a conversation first to export your chat history.",
        variant: "destructive",
      });
      return;
    }

    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat exported",
      description: "Your chat history has been downloaded as a JSON file.",
    });
  };

  // Get current location weather
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await sendMessage(`What's the weather at coordinates ${latitude}, ${longitude}?`);
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enable location access to get current weather.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
    }
  };

  // Show weather radar (placeholder)
  const handleShowRadar = () => {
    toast({
      title: "Weather Radar",
      description: "Weather radar integration would be implemented here.",
    });
  };

  const handleMessageSent = () => {
    // Auto-scroll or other actions after message is sent
  };

  // Dismiss weather alert
  const dismissAlert = () => {
    setWeatherAlert(null);
  };

  // Show error toast
  if (error) {
    toast({
      title: "Connection Error",
      description: error,
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* Weather Particles Background */}
      <WeatherParticles />

      <div className="flex h-screen relative">
        {/* Sidebar */}
        <ChatSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <ChatHeader
            onToggleSidebar={() => setSidebarOpen(true)}
            onToggleMap={() => setMapOpen(true)}
            onExportChat={handleExportChat}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          {/* Chat Messages and Input */}
          <div className="flex-1 flex relative">
            <div className="flex-1 flex flex-col">
              <ChatMessages
                showSuggestions={messages.length === 0}
                onSuggestionClick={handleSuggestionClick}
              />
              
              <MessageInput onMessageSent={handleMessageSent} />
            </div>

            {/* Weather Map Overlay */}
            <WeatherMap 
              isOpen={mapOpen} 
              onClose={() => setMapOpen(false)} 
            />
          </div>

          {/* Weather Alert Banner */}
          {weatherAlert && (
            <div className="absolute top-20 left-4 right-4 z-30">
              <Card className={`
                p-3 border backdrop-blur-sm
                ${weatherAlert.severity === 'error' 
                  ? 'bg-destructive/90 text-destructive-foreground border-destructive' 
                  : weatherAlert.severity === 'warning'
                  ? 'bg-amber-500/90 text-white border-amber-500'
                  : 'bg-primary/90 text-primary-foreground border-primary'
                }
              `}>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Weather Alert</div>
                    <div className="text-xs">{weatherAlert.message}</div>
                  </div>
                  <Button
                    onClick={dismissAlert}
                    size="sm"
                    variant="ghost"
                    className="p-1 hover:bg-white/10"
                    data-testid="button-dismiss-alert"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
        <Button
          onClick={handleGetCurrentLocation}
          size="sm"
          className="w-12 h-12 bg-accent hover:bg-accent/80 text-accent-foreground rounded-full shadow-lg transition-all hover:scale-110"
          title="Get current location weather"
          data-testid="button-current-location"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleShowRadar}
          size="sm"
          className="w-12 h-12 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full shadow-lg transition-all hover:scale-110"
          title="Weather radar"
          data-testid="button-weather-radar"
        >
          <Radar className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}
