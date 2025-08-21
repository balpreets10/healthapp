# Claude Assistant Configuration

## Database Documentation

Database schema and policies are available in the `info/` folder:
- `info/sql-schema.json` - Database schema definitions
- `info/database-policies.json` - Database security policies

## Token Usage Optimization

After completing tasks, Claude should give the user a choice to run `/clear` to optimize token usage, with clearing as the default option.

Example prompt: "Task completed. Would you like to clear the conversation context to optimize token usage? [Y/n]"