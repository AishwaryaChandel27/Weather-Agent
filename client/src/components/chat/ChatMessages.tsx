import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherCard } from "./WeatherCard";
import { useChat } from "@/hooks/useChat";
import { Message } from "@/types/chat";
import { 
  Bot, 
  CloudSun, 
  User,
  Search
} from "lucide-react";

interface ChatMessagesProps {
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Weather in Tokyo",
  "Rain forecast",
  "Weekly outlook",
  "Weather in Paris",
  "Temperature in London"
];

const TypingIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="typing-indicator bg-muted-foreground"></div>
    <div className="typing-indicator bg-muted-foreground"></div>
    <div className="typing-indicator bg-muted-foreground"></div>
  </div>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-bubble`}>
      <div className={`max-w-md lg:max-w-2xl ${isUser ? 'max-w-md lg:max-w-lg' : ''}`}>
        <div className={`
          rounded-2xl px-4 py-3
          ${isUser 
            ? 'bg-primary text-primary-foreground rounded-br-sm' 
            : 'bg-card glass border border-border rounded-bl-sm'
          }
        `}>
          {!isUser && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Render weather card if metadata contains weather data */}
                {message.metadata?.weatherData && (
                  <div className="mt-3">
                    <WeatherCard weather={message.metadata.weatherData} />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isUser && (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
        
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : ''}`}>
          <span data-testid={`message-timestamp-${message.id}`}>
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export function ChatMessages({ showSuggestions, onSuggestionClick }: ChatMessagesProps) {
  const { messages, isStreaming, streamingMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" data-testid="messages-container">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex justify-center">
            <Card className="bg-secondary/50 glass rounded-lg p-4 max-w-md text-center">
              <CloudSun className="h-8 w-8 text-primary mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Welcome to Weather Agent
              </h2>
              <p className="text-sm text-muted-foreground">
                Ask me about weather conditions anywhere in the world!
              </p>
            </Card>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Streaming Response */}
        {isStreaming && (
          <div className="flex justify-start message-bubble">
            <div className="max-w-md lg:max-w-2xl">
              <div className="bg-card glass border border-border rounded-2xl rounded-bl-sm p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    {streamingMessage ? (
                      <div className="text-sm text-foreground whitespace-pre-wrap typewriter">
                        {streamingMessage}
                      </div>
                    ) : (
                      <TypingIndicator />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                size="sm"
                variant="outline"
                className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
                data-testid={`suggestion-button-${index}`}
              >
                <Search className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
