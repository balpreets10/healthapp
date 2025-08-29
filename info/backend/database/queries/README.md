# Database Queries Directory

## Purpose
This directory contains SQL queries, stored procedures, and database-related scripts that need to be created, saved, or executed for the health tracking application.

## Organization

### Query Categories
- **`user-management/`** - User-related queries (registration, profiles, authentication)
- **`meal-tracking/`** - Meal and nutrition tracking queries
- **`food-database/`** - Food database queries and data management
- **`analytics/`** - Reporting and analytics queries
- **`maintenance/`** - Database maintenance and optimization queries

### File Naming Convention
- **Query files**: `[category]_[description].sql`
- **Stored procedures**: `sp_[procedure_name].sql`
- **Views**: `view_[view_name].sql`
- **Functions**: `fn_[function_name].sql`

### Examples
- `user-management/get_user_nutrition_goals.sql`
- `meal-tracking/daily_nutrition_summary.sql`
- `food-database/search_foods_by_name.sql`
- `analytics/monthly_calorie_trends.sql`
- `maintenance/cleanup_old_meal_entries.sql`

## Usage Guidelines

### Query Documentation
Each SQL file should include:
```sql
/*
Purpose: Brief description of what this query does
Parameters: List of input parameters (if any)
Returns: Description of return format
Author: Creator name
Date: Creation date
Modified: Last modification date
*/
```

### Best Practices
- Include proper error handling with `IF NOT EXISTS` clauses
- Add Row Level Security (RLS) considerations where appropriate
- Include helpful comments to explain complex logic
- Use consistent formatting and naming conventions
- Test queries thoroughly before saving

### Integration with Application
- Queries in this directory can be referenced in `SupabaseService.ts`
- Complex queries should be documented and version controlled
- Performance considerations should be noted for heavy queries

## Directory Structure
```
queries/
├── user-management/
│   ├── create_user_profile.sql
│   ├── update_nutrition_goals.sql
│   └── get_user_statistics.sql
├── meal-tracking/
│   ├── add_meal_entry.sql
│   ├── daily_nutrition_summary.sql
│   └── meal_history_query.sql
├── food-database/
│   ├── search_foods.sql
│   ├── get_food_nutrition.sql
│   └── popular_foods_query.sql
├── analytics/
│   ├── weekly_progress_report.sql
│   ├── nutrition_trends.sql
│   └── user_engagement_metrics.sql
└── maintenance/
    ├── cleanup_old_data.sql
    ├── optimize_indexes.sql
    └── backup_procedures.sql
```

## Version Control
- All queries should be version controlled
- Include migration scripts for schema changes
- Document breaking changes and upgrade paths
- Tag releases for rollback capability

## Testing and Validation
- Test queries with sample data before deployment
- Validate performance with realistic data volumes
- Include test cases for edge conditions
- Document expected results and performance benchmarks