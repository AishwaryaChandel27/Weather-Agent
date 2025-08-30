import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { useChat } from "@/hooks/useChat";
import { Conversation } from "@/types/chat";
import { 
  Sun, 
  Moon, 
  MapPin, 
  Trash2, 
  MessageSquare,
  Plus
} from "lucide-react";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { conversations, currentConversation, setCurrentConversationId, deleteConversation, clearHistory, newConversation } = useChat();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    onClose(); // Close sidebar on mobile
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    deleteConversation(conversationId);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 glass z-50 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}
      
      <aside className={`
        w-80 bg-card/50 glass border-r border-border flex flex-col
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'flex' : 'hidden lg:flex'}
      `}>
        {/* Header with theme toggle */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-foreground">Weather Agent</h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleTheme}
                size="sm"
                variant="ghost"
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                data-testid="button-toggle-theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4 text-accent" />
                ) : (
                  <Moon className="h-4 w-4 text-accent" />
                )}
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="lg:hidden"
                data-testid="button-close-sidebar"
              >
                ✕
              </Button>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span data-testid="text-current-location">New York, NY</span>
          </div>
        </div>

        {/* Quick Weather Stats */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Current Weather</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-primary/10 border-primary/20">
              <div className="text-2xl font-bold text-primary" data-testid="text-temperature">72°</div>
              <div className="text-xs text-muted-foreground">Temperature</div>
            </Card>
            <Card className="p-3 bg-accent/10 border-accent/20">
              <div className="text-2xl font-bold text-accent" data-testid="text-humidity">65%</div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </Card>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-6 border-b border-border">
          <Button
            onClick={newConversation}
            className="w-full flex items-center justify-center gap-2"
            data-testid="button-new-chat"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent Chats</h3>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors group flex items-center justify-between
                  ${currentConversation?.id === conversation.id 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-secondary/50 hover:bg-secondary'
                  }
                `}
                data-testid={`conversation-item-${conversation.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {conversation.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  data-testid={`button-delete-conversation-${conversation.id}`}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="p-6 border-t border-border">
          <Button
            onClick={clearHistory}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
            data-testid="button-clear-history"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        </div>
      </aside>
    </>
  );
}
