# Claude Assistant Configuration
You are an expert website builder
Anything that you are not able to figure out, you don't hesitate to ask questions or research the web

## Database Documentation

Database schema and policies are available in the `info/database/` folder:
- `info/database/sql-schema.json` - Database schema definitions
- `info/database/database-policies.json` - Database security policies

## SQL Files Management

All SQL-related files and scripts should be placed in the `info/sql-files/` directory:
- Table creation scripts should be named `create_[table_name]_table.sql`
- Data insertion scripts should be named `insert_[table_name]_data.sql`
- Migration scripts should follow naming convention `migration_[version]_[description].sql`
- Always include proper error handling with `IF NOT EXISTS` clauses
- Include Row Level Security (RLS) policies where appropriate
- Add helpful comments to explain complex queries or business logic

## Token Usage Optimization - MANDATORY FOR ALL RESPONSES

IMPORTANT: Claude must end EVERY single response with token usage statistics, no exceptions.

Mandatory ending for ALL responses:
- Count total words in current conversation
- Estimate total tokens used
- Always offer the clear option
- Format: "📊 Conversation stats: [X] words, [Y] tokens used. Run `/clear` to optimize? [Y/n]"

### Query Optimization Tracking
- When conversations exceed 3000 tokens, automatically log to `query-optimization/query-journal.md`
- Follow rules defined in `query-optimization/query-optimizations.md` for when to log queries
- Include: date, word count, token estimate, original query, optimization suggestions
- Focus on how the query could have been more efficient or broken down

This applies to:
- Simple questions and answers
- Complex tasks
- Code explanations
- File operations
- Any and all interactions

## Website Development Best Practices

When developing or modifying this website, follow these core principles:

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

### Build Commands
- npm run build:dev
- npm run build:prod