# Health Tracker - Project Information

## High-Level Overview
A modern React-based health and nutrition tracking web application built for gamingdronzz.com. The app provides users with comprehensive tools to track meals, monitor nutrition, and manage their health journey through an intuitive interface.

## Core Features
- **User Authentication**: Google OAuth integration via Supabase
- **Meal Tracking**: Add, edit, and track daily meals with detailed nutritional information
- **Nutrition Analysis**: Comprehensive nutrition calculations and progress tracking
- **User Profiles**: Personalized health profiles and goal management  
- **Journal System**: Health and meal journaling functionality
- **Food Database**: Extensive food database with nutritional information

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: CSS with CSS custom properties (variables)

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with Google OAuth
- **Data Processing**: CSV parsing for food data import

### Development & Build
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript compiler
- **Testing**: Vitest
- **Bundling**: Vite with production optimizations

## Project Structure

### Root Structure
```
gamingdronzz.com-health/
├── app/                    # Main application directory
├── data/                   # External data files
├── info/                   # Project documentation
├── CLAUDE.md              # AI assistant configuration
└── project-info.md       # Legacy project info (now moved to info/)
```

### Application Structure (`app/`)
```
app/
├── src/                   # Source code
│   ├── components/        # Reusable React components
│   ├── pages/            # Main application pages
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Business logic and API services
│   ├── managers/         # Application state managers
│   ├── config/           # Configuration management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and helpers
│   └── styles/           # Global styles and variables
├── public/               # Static assets
├── builds/               # Build outputs (dev/prod)
└── query-optimization/   # Performance tracking
```

## Key Components

### Authentication System
- **Provider**: Supabase Auth with Google OAuth
- **Components**: `ProtectedRoute`, `AuthCallback`
- **Hooks**: `useAuth`
- **Manager**: `AuthManager`

### Navigation System  
- **Component**: `ModernNavigation`
- **Manager**: `NavigationManager`
- **Hook**: `useNavigation`, `useAuthNavigation`
- **Features**: Auth-aware navigation, route protection

### Meal Management
- **Components**: `MealTypeSection`, `CustomMealForm`, `NutritionSummary`
- **Service**: `CalorieCalculatorService`
- **Hook**: `useCalorieTracker`
- **Features**: Food search, custom meals, nutrition calculations

### Data Management
- **Service**: `SupabaseService`
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Food Data**: CSV-based food database with 8000+ items

## Database Schema

### Core Tables
- **users**: User profiles and health information
- **meals**: User meal entries with timestamps
- **foods**: Comprehensive food database with nutritional data
- **custom_meals**: User-created custom meal recipes
- **user_profiles**: Extended user profile information

### Security
- Row Level Security (RLS) enabled on all user data tables
- User isolation through Supabase policies
- Secure API key management through environment variables

## Website Development Best Practices

### Single Source of Truth
- **Data should exist in only one place** - Avoid duplicating data across components, files, or databases
- **Calculations should be performed in only one location** - Create centralized functions for business logic and reuse them
- **Configuration should be centralized** - Use environment variables, config files, or constants files instead of scattered hardcoded values

### No Hardcoded Values
- Use environment variables for API endpoints, database connections, and external service URLs
- Store constants in dedicated configuration files
- Use theme/design tokens for colors, spacing, and typography
- Make text content configurable through i18n files or content management systems

### Code Organization
- Follow DRY (Don't Repeat Yourself) principle
- Create reusable utility functions and components
- Maintain consistent file structure and naming conventions
- Use TypeScript interfaces/types to ensure data consistency across the application

## Development Workflow

### Code Quality
- ESLint configuration for TypeScript/React
- Type checking with TypeScript
- Automated testing with Vitest
- Git-based version control

### Debug Features (Development Only)
- Console logging and performance monitoring
- Debug panel and experimental features
- Query optimization tracking
- Development-specific UI indicators

## Integration Points

### External Services
- **Google OAuth**: User authentication
- **Supabase**: Database, auth, and real-time features
- **CSV Processing**: Food data import and management

### Internal Systems
- **State Management**: Centralized with Zustand
- **Routing**: Client-side routing with React Router
- **Performance**: Scroll management and lazy loading
- **Notifications**: Toast-style user feedback

## Security Features
- Environment variable validation
- Secure API key management
- Row Level Security database policies
- Protected route authentication
- OAuth-based user authentication

## Future Extensibility
- Modular architecture supports easy feature additions
- Environment-based configuration for multiple deployments  
- Extensible food database system
- Plugin-ready navigation and component system

## Maintenance Guidelines

### Project Information Updates
IMPORTANT: Whenever you make structural, system, integration, or behavioral changes to the application, you MUST update this file to reflect these changes.

#### Update Triggers
Update this file when making:

**Structural Changes:**
- Add, remove, or reorganize directories or major files
- Modify the component architecture or page structure
- Change the database schema or add/remove tables
- Update the project's folder organization

**System Changes:**
- Add, remove, or update dependencies in package.json
- Modify build scripts, configuration files, or development tools
- Change environment configuration or deployment processes
- Update TypeScript configuration or linting rules

**Integration Changes:**
- Add or modify external service integrations (APIs, authentication, etc.)
- Change database connections or backend services
- Update routing configuration or navigation structure
- Modify authentication flows or user management

**Behavioral Changes:**
- Add new features or major functionality
- Modify core user flows or application logic
- Change security policies or access controls
- Update performance optimization strategies

#### Sections to Maintain
- **Technology Stack**: Keep dependencies and versions current
- **Project Structure**: Reflect actual directory organization
- **Key Components**: Update component relationships and responsibilities
- **Database Schema**: Keep table structures and relationships accurate
- **Integration Points**: Maintain external service information