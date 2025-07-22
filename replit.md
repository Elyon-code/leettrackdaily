# LeetTrackDaily - Personal LeetCode Progress Tracker

## Overview

LeetTrackDaily is a modern, full-stack web application designed to help aspiring software engineers track, visualize, and stay motivated with their LeetCode problem-solving progress. The application provides comprehensive tracking capabilities including daily goals, problem logging, pattern mastery analysis, and progress visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between frontend and backend concerns:

### Frontend Architecture
- **React + TypeScript**: Component-based UI library with type safety
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality, accessible component library built on Radix UI
- **TanStack Query**: Server state management and caching
- **React Hook Form + Zod**: Form handling with validation
- **Wouter**: Lightweight client-side routing

### Backend Architecture
- **Express.js**: Node.js web framework for API endpoints
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Primary database (configured but database can be added later)
- **Multer**: File upload handling for screenshots

## Key Components

### Frontend Structure
- **Layout System**: Consistent page layout with sidebar navigation and top bar
- **Page Components**: Dashboard, Problem Log, Goals, Patterns, Settings
- **Form Components**: Reusable forms for problems and goals with validation
- **Theme System**: Dark/light mode support with context-based state management
- **UI Components**: Comprehensive component library (cards, buttons, forms, tables, etc.)

### Backend Structure
- **Route Handlers**: RESTful API endpoints for CRUD operations
- **Storage Interface**: Abstracted data layer for future database implementation
- **File Upload**: Image handling for problem screenshots
- **Error Handling**: Centralized error management with proper HTTP status codes

### Database Schema
- **Users**: Profile information, daily goals, preferences
- **Problems**: Comprehensive problem tracking with difficulty, patterns, solutions
- **Goals**: Custom goal setting with progress tracking
- **User Settings**: Theme preferences and configuration

## Data Flow

1. **Client Requests**: Frontend makes HTTP requests to Express API endpoints
2. **Server Processing**: Express routes handle business logic and data validation
3. **Data Layer**: Storage interface abstracts database operations (ready for Drizzle + PostgreSQL)
4. **Response**: JSON responses with proper error handling
5. **Client Updates**: TanStack Query manages caching and UI updates

### Key Data Patterns
- **Problem Tracking**: Comprehensive metadata including complexity analysis, patterns, and thought processes
- **Progress Analytics**: Streak tracking, difficulty distribution, pattern mastery
- **Goal Management**: Custom targets with deadline tracking and progress calculation

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React ecosystem (React, React DOM)
- **Styling**: Tailwind CSS with PostCSS
- **Components**: Radix UI primitives for accessibility
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **File Handling**: Multer for multipart form data
- **Validation**: Zod schemas shared between client and server

### Development Tools
- **Build Tools**: Vite with React plugin
- **Type Checking**: TypeScript compiler
- **Database Tools**: Drizzle Kit for migrations
- **Development**: Hot reload and error overlay support

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets
2. **Backend Build**: esbuild bundles Express server with dependencies
3. **Output Structure**: Compiled client assets and server bundle

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Node.js server serving both API and static files
- **Database**: PostgreSQL connection via environment variables

### File Upload Handling
- **Local Storage**: Multer configured for local file system
- **Image Processing**: Basic file validation and size limits
- **Future Enhancement**: Ready for cloud storage integration

The architecture is designed to be scalable and maintainable, with clear separation of concerns and modern development practices. The shared schema approach ensures type safety across the full stack, while the component-based frontend provides a responsive and interactive user experience.