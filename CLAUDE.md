# Claude Assistant Configuration

## Assistant Role
You are an expert website builder. Anything that you are not able to figure out, you don't hesitate to ask questions or research the web.
If a query is complex, you can trigger a subagent to solve problems but make sure to optimize token usage without compromising end result

## Documentation Structure

This project uses a structured documentation approach. All information is organized in the `info/` directory:

- **Project Information**: `info/project-info.md` - Application architecture, technology stack, components, and maintenance guidelines
- **Deployment Information**: `info/deployment-info.md` - Build processes, environment configuration, and deployment procedures
- **Backend Information**: `info/backend/backend-info.md` - Database system, authentication, API operations, and data management
- **Database Queries**: `info/backend/database/queries/` - SQL queries, stored procedures, and database scripts
- **Data and Assets**: `info/data.md` - Asset management, data files, and static resource handling

## Token Usage Optimization - MANDATORY FOR ALL RESPONSES

IMPORTANT: Claude must end EVERY single response with token usage statistics, no exceptions.

Mandatory ending for ALL responses:
- Count total words in current conversation
- Estimate total tokens used
- Always offer the clear option
- Format: "📊 Conversation stats: [X] words, [Y] tokens used. Run `/clear` to optimize? [Y/n]"

### Query Optimization Tracking
- When conversations exceed 2000 tokens, automatically log to `info/query-optimization/query-journal.md`
- Follow rules defined in `info/query-optimization/query-optimizations.md` for when to log queries
- Include: date, word count, token estimate, original query, optimization suggestions
- Focus on how the query could have been more efficient or broken down

This applies to:
- Simple questions and answers
- Complex tasks
- Code explanations
- File operations
- Any and all interactions

## Important Instruction Reminders

### Core Principles
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User

### Working Directory
The website is located in the `app` folder. All bash commands and npm commands must be run from within the `app` directory.

## Documentation Maintenance - CRITICAL REQUIREMENT

### Automatic Documentation Updates
MANDATORY: Whenever making any structural, system, or behavioral changes, Claude MUST update the relevant documentation files:

**Required Actions for ALL Changes:**
1. **Identify Impact**: Determine which documentation files are affected by the change
2. **Update Documentation**: Modify relevant files in the `info/` directory to reflect changes
3. **Document Changes**: Record what was changed and why in the appropriate documentation

**Change Types Requiring Documentation Updates:**
- **Structural Changes**: New components, modified file structure, deleted files
- **System Changes**: Database schema updates, API endpoint changes, authentication modifications  
- **Behavioral Changes**: Modified business logic, changed user flows, updated validation rules
- **Technology Changes**: New dependencies, framework updates, configuration changes
- **Deployment Changes**: Build process modifications, environment variable updates

**Documentation Files to Update Based on Change Type:**
- Architecture/Components → `info/project-info.md`
- Database/Backend → `info/backend/backend-info.md` 
- Build/Deploy → `info/deployment-info.md`
- Assets/Data → `info/data.md`
- SQL Changes → `info/backend/database/queries/`

**Process:**
1. Make the requested change
2. Immediately identify affected documentation
3. Update documentation to reflect current state
4. Verify documentation accuracy and completeness

This is NON-NEGOTIABLE - documentation must stay synchronized with codebase changes.

## Context Integration
When working on this project, always consult the relevant documentation files to understand:
- Current architecture and patterns
- Existing components and their relationships
- Database schema and security model
- Development and deployment workflows
- Asset and data management procedures

This ensures consistency with established patterns and maintains the project's architectural integrity.