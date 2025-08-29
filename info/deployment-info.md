# Deployment Information

## Project Structure
The website is located in the `app` folder. All bash commands and npm commands must be run from within the `app` directory.

## Build Commands

### Development Build
```bash
npm run build:dev
```
- Creates development build with debugging enabled
- Outputs to `builds/dev/`
- Includes source maps and debug information
- Optimized for development workflow

### Production Build
```bash
npm run build:prod
```
- Creates production build with full optimizations
- Outputs to `builds/prod/`
- Minified and compressed assets
- Optimized for deployment

### Deployment Check
```bash
npm run deploy:check
```
- Full deployment validation
- Runs linting, type checking, and builds
- Validates configuration for production

## Environment Configuration

### Environment Files
- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

### Configuration Structure
Environment-specific configuration through `src/config/`:
- `src/config/environments/development.ts`
- `src/config/environments/staging.ts`
- `src/config/environments/production.ts`

### Required Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Application Configuration
VITE_APP_ENV=development|staging|production
VITE_DEBUG_MODE=true|false
```

## Performance Optimization

### Build Optimizations
- Code splitting and lazy loading
- Bundle analysis capabilities
- Tree shaking for unused code elimination
- Asset compression and optimization

### Runtime Optimizations
- Performance monitoring in development
- Lazy loading for components and routes
- Image optimization and lazy loading
- Scroll management for performance

## Deployment Process

### Pre-Deployment Checklist
1. Run `npm run lint` to check code quality
2. Run `npm run typecheck` to validate TypeScript
3. Run `npm run build:prod` to create production build
4. Validate environment variables are set
5. Test build locally before deployment

### Build Outputs
- **Development**: `builds/dev/`
  - Unminified code with source maps
  - Debug information included
  - Development-specific configurations
  
- **Production**: `builds/prod/`
  - Minified and optimized assets
  - Compressed CSS and JavaScript
  - Production-ready configuration

### Static Asset Handling
- Assets placed in `public/` directory
- Build process copies assets to build output
- Optimized asset delivery in production

## Security Considerations

### Environment Variable Security
- Never commit `.env` files to version control
- Use environment-specific configuration
- Validate required variables on startup

### Build Security
- Remove debug code in production builds
- Minify and obfuscate production code
- Remove development-only features

## Hosting Requirements

### Static Hosting
- Support for SPA routing (React Router)
- HTTPS required for OAuth authentication
- Modern browser support (ES2020+)

### Server Configuration
- Proper MIME types for assets
- Gzip compression enabled
- Cache headers for static assets
- Fallback to index.html for SPA routing

## Monitoring and Debugging

### Development Tools
- React Developer Tools support
- Redux DevTools integration (if using Redux)
- Performance monitoring in development mode

### Production Monitoring
- Error logging and reporting
- Performance metrics collection
- User analytics integration points

## Backup and Recovery

### Code Backup
- Git-based version control
- Regular commits and branching
- Tag releases for rollback capability

### Database Backup
- Supabase handles automatic backups
- Manual backup procedures documented
- Data export capabilities available