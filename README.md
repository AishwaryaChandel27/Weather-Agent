# Weather Agent Chat Interface

A modern, responsive chat interface that connects users to an AI-powered weather agent through real-time streaming API responses. Built with React, TypeScript, and Express.js.

## Features

### Core Functionality
- **Real-time Chat Interface** - Seamless conversation with weather agent
- **Streaming API Responses** - Live message streaming for natural conversation flow
- **Message History** - Persistent conversation storage and management
- **Voice Input** - Web Speech API integration for hands-free interaction
- **Auto-suggestions** - Smart weather query suggestions as you type

### User Experience
- **Responsive Design** - Mobile-first approach, works on all devices
- **Day/Night Themes** - Automatic theme switching with animated background particles
- **Glass Morphism UI** - Modern glassmorphism design with backdrop blur effects
- **Smooth Animations** - Typewriter effects, slide-in messages, and floating particles
- **Loading States** - Visual feedback during API calls and streaming

### Advanced Features
- **Weather Map Integration** - Interactive weather map overlay (ready for implementation)
- **Location Services** - Get current location weather with geolocation API
- **Chat Export** - Download conversation history as JSON
- **Settings Panel** - Customize theme, language, and notification preferences
- **PWA Support** - Progressive Web App with offline capabilities
- **Push Notifications** - Weather alerts and updates (service worker ready)

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** components built on Radix UI primitives
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for database operations
- **WebSocket** support for real-time features
- **In-memory storage** (easily replaceable with PostgreSQL)

### API Integration
- **Weather Agent API** - Streaming responses from Mastra cloud service
- **Web Speech API** - Voice input and recognition
- **Geolocation API** - Current location weather queries

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-agent-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5000`

### Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets and PWA files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── chat/     # Chat-specific components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   └── weather/  # Weather-related components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility libraries
│   │   ├── pages/        # Route components
│   │   └── types/        # TypeScript type definitions
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/                # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── package.json
```

## API Configuration

### Weather Agent API
The application connects to the Mastra weather agent API:

**Endpoint:** `POST https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream`

**Required Headers:**
```javascript
{
  'Accept': '*/*',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'x-mastra-dev-playground': 'true'
}
```

**Request Body:**
```javascript
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ],
  "runId": "weatherAgent",
  "maxRetries": 2,
  "maxSteps": 5,
  "temperature": 0.5,
  "topP": 1,
  "runtimeContext": {},
  "threadId": "demo-thread",
  "resourceId": "weatherAgent"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally
- `npm run lint` - Run TypeScript type checking

## Usage Examples

### Basic Weather Queries
- "What's the weather in London?"
- "Will it rain tomorrow in Tokyo?"
- "Weather forecast for next week"
- "Temperature in New York"

### Advanced Features
- **Voice Input**: Click the microphone button to speak your weather query
- **Current Location**: Use the location button to get weather for your current position
- **Theme Toggle**: Switch between light/dark modes in the sidebar
- **Export Chat**: Download your conversation history from the header menu
- **Settings**: Customize your experience through the settings modal

## Customization

### Themes
The application supports three theme modes:
- **Light Mode**: Bright theme with sun particles
- **Dark Mode**: Dark theme with star particles  
- **Auto Mode**: Follows system preferences

Themes can be customized by modifying the CSS variables in `client/src/index.css`.

### Styling
Built with Tailwind CSS for easy customization:
- Modify `tailwind.config.ts` for theme configuration
- Add custom animations in `client/src/index.css`
- Glass morphism effects are defined in the `.glass` class

### Components
All UI components are built with Shadcn/ui and can be customized:
- Components are located in `client/src/components/ui/`
- Chat-specific components in `client/src/components/chat/`
- Weather components in `client/src/components/weather/`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by Mastra cloud weather agent
- UI components from Shadcn/ui and Radix UI
- Icons from Lucide React
- Fonts from Google Fonts (Inter)

---

Built with ❤️ using modern web technologies for an exceptional weather chat experience.