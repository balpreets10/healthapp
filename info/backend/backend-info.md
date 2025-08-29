# Backend Information

## Overview
The application uses Supabase as a Backend-as-a-Service (BaaS) solution, providing database, authentication, and real-time features through a managed PostgreSQL database.

## Database System

### Provider
- **Service**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL
- **Access**: REST API and real-time subscriptions
- **Authentication**: Supabase Auth with Google OAuth integration

### Database Schema Location
- **Schema Definitions**: `info/database/sql-schema.json`
- **Security Policies**: `info/database/database-policies.json`
- **SQL Scripts**: `info/sql-files/` (executed scripts) and `info/sql-files-executed/` (archived)

## Core Tables

### Users and Authentication
- **users**: Core user profiles and authentication data (managed by Supabase Auth)
- **user_profiles**: Extended user profile information and health data

### Meal Tracking System
- **meals**: User meal entries with timestamps and nutritional data
- **custom_meals**: User-created custom meal recipes and combinations
- **foods**: Comprehensive food database with nutritional information (8000+ items)

### System Tables
- **orientation**: System orientation and onboarding data

## Data Services

### SupabaseService (`src/services/SupabaseService.ts`)
Primary service for database operations:
- Database connection management
- CRUD operations for all entities
- Real-time subscriptions
- File storage operations
- Authentication state management

### CalorieCalculatorService (`src/services/CalorieCalculatorService.ts`)
Nutrition and meal calculation service:
- Nutritional calculations and aggregations
- Calorie tracking and goal management
- Meal composition analysis
- Progress tracking utilities

## Authentication System

### Provider Integration
- **Google OAuth**: Primary authentication method
- **Supabase Auth**: Authentication provider and user management
- **Session Management**: Automatic token refresh and session persistence

### Security Implementation
- **Row Level Security (RLS)**: Enabled on all user data tables
- **User Isolation**: Database policies ensure users only access their own data
- **API Security**: Secure API key management through environment variables
- **Token Validation**: Automatic JWT token validation for all requests

### Authentication Flow
1. User initiates Google OAuth login
2. Google provides OAuth token
3. Supabase validates and creates/updates user record
4. Application receives Supabase session token
5. All API calls use validated session token

## Data Management Patterns

### CRUD Operations
- **Create**: New meal entries, custom meals, user profiles
- **Read**: Food database queries, user meal history, nutritional summaries
- **Update**: Meal modifications, profile updates, goal adjustments
- **Delete**: Meal removal, custom meal deletion (with proper cascading)

### Data Validation
- **Client-side**: TypeScript interfaces and validation
- **Server-side**: Database constraints and RLS policies
- **Sanitization**: Input sanitization for security

## Real-time Features

### Live Updates
- **Meal Tracking**: Real-time updates when meals are added/modified
- **Progress Tracking**: Live nutritional goal progress
- **User Profiles**: Real-time profile synchronization

### Subscription Management
- Automatic subscription cleanup on component unmount
- Connection state management
- Error handling for connection issues

## Data Import and Processing

### Food Database Import
- **Source**: CSV files with nutritional data
- **Processing**: Node.js scripts for data transformation
- **Import**: Batch insertion with proper validation
- **Location**: `info/food_data.csv` and related import scripts

### Custom Data Processing
- **User Data Export**: JSON/CSV export capabilities
- **Bulk Operations**: Batch meal import/export
- **Data Migration**: Version-aware data migration scripts

## Performance Optimization

### Database Optimization
- **Indexing**: Optimized indexes for common queries
- **Query Optimization**: Efficient query patterns and joins
- **Connection Pooling**: Managed by Supabase infrastructure

### Caching Strategy
- **Client-side Caching**: React Query or similar for API response caching
- **Local Storage**: Temporary data persistence for offline functionality
- **CDN**: Static asset caching through Supabase CDN

## Error Handling and Monitoring

### Error Management
- **Database Errors**: Proper error handling for constraint violations
- **Network Errors**: Retry logic for failed requests
- **Authentication Errors**: Automatic re-authentication flows
- **Validation Errors**: User-friendly error messaging

### Logging and Monitoring
- **Error Logging**: Client-side error capture and reporting
- **Performance Monitoring**: Query performance tracking
- **Usage Analytics**: Optional user behavior tracking

## API Endpoints and Operations

### Common Operations
```typescript
// User Management
await supabase.auth.signInWithOAuth({ provider: 'google' })
await supabase.auth.signOut()

// Meal Operations
await supabase.from('meals').insert(mealData)
await supabase.from('meals').select().eq('user_id', userId)

// Food Database Queries
await supabase.from('foods').select().textSearch('name', query)
await supabase.from('foods').select().eq('id', foodId)

// Real-time Subscriptions
supabase.channel('meals').on('postgres_changes', callback)
```

### Data Relationships
- **Users ↔ Meals**: One-to-many relationship
- **Users ↔ Custom Meals**: One-to-many relationship
- **Meals ↔ Foods**: Many-to-one relationship
- **Custom Meals ↔ Foods**: Many-to-many relationship

## Environment Configuration

### Database Connection
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Service Configuration
- **Connection Timeout**: Configurable request timeouts
- **Retry Logic**: Automatic retry for failed requests
- **Rate Limiting**: Respect Supabase rate limits

## Backup and Data Management

### Automated Backups
- **Supabase Backups**: Automatic daily backups by Supabase
- **Point-in-time Recovery**: Available through Supabase dashboard
- **Export Capabilities**: Full data export for migration purposes

### Data Migrations
- **Version Control**: All schema changes version controlled
- **Migration Scripts**: Located in `info/sql-files/`
- **Rollback Procedures**: Documented rollback processes for schema changes