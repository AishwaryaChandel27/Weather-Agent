import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useChat } from "@/hooks/useChat";
import { 
  Mic,
  MicOff,
  Send,
  StopCircle
} from "lucide-react";

interface MessageInputProps {
  onMessageSent?: () => void;
}

export function MessageInput({ onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming } = useChat();

  const { isListening, isSupported, toggleListening } = useVoiceInput({
    onResult: (transcript) => {
      setMessage(transcript);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    },
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  // Simple autocomplete suggestions
  useEffect(() => {
    if (message.trim().length > 2) {
      const weatherSuggestions = [
        "Weather in San Francisco",
        "Weather in London",
        "Weather in Tokyo",
        "What's the temperature in",
        "Will it rain tomorrow in",
        "Weather forecast for next week",
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(message.toLowerCase())
      );
      setSuggestions(weatherSuggestions.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [message]);

  const handleSubmit = async () => {
    if (!message.trim() || isStreaming) return;

    const messageToSend = message.trim();
    setMessage("");
    setSuggestions([]);
    
    await sendMessage(messageToSend);
    onMessageSent?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setSuggestions([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card/30 glass">
      <div className="flex items-end space-x-3">
        {/* Voice Input Button */}
        {isSupported && (
          <Button
            onClick={toggleListening}
            size="sm"
            className={`
              p-3 rounded-full transition-colors self-end
              ${isListening 
                ? 'bg-destructive hover:bg-destructive/80 text-destructive-foreground' 
                : 'bg-accent hover:bg-accent/80 text-accent-foreground'
              }
            `}
            title={isListening ? "Stop recording" : "Start voice input"}
            data-testid="button-voice-input"
          >
            {isListening ? (
              <StopCircle className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Text Input with Autocomplete */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about weather anywhere..."
            rows={1}
            className="w-full px-4 py-3 bg-input border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground transition-all"
            disabled={isStreaming}
            data-testid="input-message"
          />
          
          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover glass border border-border rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-secondary cursor-pointer text-sm text-popover-foreground first:rounded-t-lg last:rounded-b-lg"
                  data-testid={`suggestion-${index}`}
                >
                  <span className="text-muted-foreground mr-2">🔍</span>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isStreaming}
          className="p-3 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
          data-testid="button-send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Voice Recording Indicator */}
      {isListening && (
        <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
          <div className="w-2 h-2 bg-destructive rounded-full mr-2 animate-pulse"></div>
          Recording... Tap to stop
        </div>
      )}
    </div>
  );
}
