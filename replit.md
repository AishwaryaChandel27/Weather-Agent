# Overview

This is a weather-focused AI chat application built with React and Express. The application provides a conversational interface for users to interact with a weather agent, featuring real-time chat capabilities, conversation management, weather data visualization, and a modern responsive design. The system is designed as a full-stack TypeScript application with a focus on providing an intuitive weather information service through natural language conversations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for fast development and optimized bundling
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting light/dark modes
- **Component Structure**: Modular component architecture with reusable UI components in `/components/ui/` and chat-specific components in `/components/chat/`

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with WebSocket support for real-time features
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage Design
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in shared directory
- **Schema Design**: Normalized database structure with separate tables for users, conversations, messages, and user settings
- **Storage Interface**: Abstract storage interface (`IStorage`) allowing multiple implementations (currently in-memory, designed for future PostgreSQL integration)
- **Data Models**: Strongly typed with Zod schemas for validation and TypeScript interfaces

## Authentication & User Management
- **User System**: Basic user model with username/password authentication structure
- **Session Management**: Designed for session-based authentication (currently using demo user for development)
- **Settings Management**: User preferences including theme, language, weather alerts, and location settings

## Chat System Architecture
- **Real-time Communication**: WebSocket integration for live chat streaming
- **Message Management**: Persistent conversation threads with message history
- **Weather Agent Integration**: Specialized weather agent with streaming response capabilities
- **Voice Input**: Web Speech API integration for voice-to-text input functionality

## Theme & Customization
- **Theme System**: Comprehensive theming with CSS custom properties supporting light, dark, and auto modes
- **Responsive Design**: Mobile-first approach with responsive layouts and touch-friendly interfaces
- **Progressive Web App**: PWA features including service worker, manifest, and offline capabilities

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: TypeScript ORM for database operations
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **express**: Web application framework for Node.js
- **vite**: Build tool and development server

## UI Component Libraries
- **@radix-ui/**: Complete suite of accessible React components for building the UI system
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings conditionally

## Development & Build Tools
- **typescript**: Static type checking
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **wouter**: Minimalist routing library for React

## Planned External Integrations
- **Weather APIs**: Integration with weather data providers (OpenWeatherMap, etc.)
- **Map Services**: Interactive weather maps using Leaflet.js or similar mapping libraries
- **Push Notifications**: Browser push notification support for weather alerts
- **Database**: PostgreSQL database for production data persistence