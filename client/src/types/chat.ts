export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    timestamp?: string;
    weatherData?: WeatherData;
    location?: {
      lat: number;
      lng: number;
      city: string;
    };
  };
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  visibility: number;
  location: string;
  forecast?: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  icon: string;
  temperature: number;
}

export interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  weatherAlerts: boolean;
  soundEnabled: boolean;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
}
