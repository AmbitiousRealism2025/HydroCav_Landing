# HydroCav Code Quality Guidelines

## Overview

This guide outlines the code quality standards and automated tooling for the HydroCav website project. Following these guidelines ensures consistent, secure, and maintainable code across the team.

## Automated Quality Pipeline

### Pre-commit Hooks (Automatic)

Every commit automatically runs:
- **ESLint**: Security-focused linting with custom rules
- **Prettier**: Code formatting for consistency  
- **Security Tests**: Fast validation of security modules
- **Commit Message Validation**: Conventional commit format enforcement

**Performance**: Complete pipeline runs in <1 second

### Quality Scripts

```bash
# Quick quality check
npm run quality:check

# Fix formatting issues
npm run quality:fix

# Run security tests
npm run test:security

# Full validation
npm run validate
```

## Code Style Standards

### JavaScript (ES Modules)
- **Indentation**: 2 spaces
- **Line Length**: 100 characters
- **Semicolons**: Required
- **Quotes**: Single quotes preferred
- **Trailing Commas**: ES5 style

### Security Modules
Stricter rules apply to security-related files:
- **Max Function Length**: 30 lines
- **Complexity**: Max 8
- **Console Statements**: Forbidden (use SecurityManager logging)
- **Parameters**: Max 3 per function
- **Nesting Depth**: Max 3 levels

### UI/Animation Modules
Relaxed rules for `main.js` and `ui-feedback.js`:
- **Max Function Length**: 100 lines
- **Console Statements**: Warnings only
- **Complexity**: Max 15

## Commit Message Format

Use conventional commits:

```
type(scope): description

feat: add new security validation
fix: resolve animation performance issue
docs: update API documentation
style: format code with prettier
refactor: simplify authentication logic
test: add unit tests for XSS protection
security: enhance CSRF token validation
perf: optimize bubble animations
```

**Valid Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `security`, `perf`

## VSCode Setup

### Required Extensions
The project includes `.vscode/extensions.json` with recommended extensions:
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Tailwind CSS** - Utility-first CSS
- **Live Server** - Development server
- **GitLens** - Git supercharged

### Configuration
- **Format on Save**: Enabled
- **ESLint Auto-fix**: Enabled on save
- **Tab Size**: 2 spaces
- **Prettier**: Default formatter

## Security Guidelines

### Security Module Patterns
```javascript
// ✅ Good: Simple, focused security function
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }
  return input.length <= MAX_LENGTH;
}

// ❌ Bad: Complex, nested security logic
function processUserData(data) {
  if (data) {
    if (data.user) {
      if (data.user.input) {
        // Too many nested conditions
      }
    }
  }
}
```

### Required Security Practices
1. **Input Sanitization**: All user inputs via XSSProtection module
2. **CSRF Protection**: All form submissions require token validation
3. **Error Logging**: Use SecurityManager for all security events
4. **No Console Logs**: Security modules must not use console.log

## Testing Requirements

### Test Coverage
- **Minimum**: 80% coverage for statements, branches, functions, lines
- **Security Modules**: 100% coverage required
- **TDD Approach**: Write tests before implementation

### Performance Standards
- **ESLint Execution**: <3 seconds
- **Test Suite**: <5 seconds for fast tests
- **Pre-commit Pipeline**: <10 seconds total

## Common Issues & Solutions

### ESLint Errors

**Generic Object Injection Sink**
```javascript
// ❌ Problematic
obj[userInput] = value;

// ✅ Solution
if (ALLOWED_KEYS.includes(userInput)) {
  obj[userInput] = value;
}
```

**Console Statement in Security Module**
```javascript
// ❌ Forbidden in security modules
console.log('Debug info');

// ✅ Use SecurityManager
SecurityManager.logSecurityEvent('debug', { info: data });
```

**Function Too Complex**
```javascript
// ❌ Complexity > 8
function complexFunction(a, b, c, d, e) {
  if (a) {
    if (b) {
      if (c) {
        // Too nested, too many parameters
      }
    }
  }
}

// ✅ Simplified
function simpleFunction(input) {
  const validated = validateInput(input);
  return validated ? processInput(input) : null;
}
```

### Prettier Formatting

Most formatting issues are auto-fixed on save. Manual fix:
```bash
npm run format
```

### Commit Message Rejected

Ensure conventional commit format:
```bash
# ❌ Rejected
git commit -m "fixed bug"

# ✅ Accepted  
git commit -m "fix: resolve authentication timeout issue"
```

## Performance Optimization

### ESLint Performance
- Files excluded: HTML, coverage, node_modules
- Cache enabled: `.eslintcache` (gitignored)
- Parallel processing for large codebases

### Pre-commit Optimization
- **lint-staged**: Only checks changed files
- **maxWorkers=1**: Reduces resource usage
- **Fast security tests**: Skip integration tests in hooks

## Team Workflows

### Daily Development
1. **Pull latest changes**: `git pull`
2. **Create feature branch**: `git checkout -b feature/description`
3. **Write tests first** (TDD approach)
4. **Implement feature**
5. **Commit changes** (automatic quality checks)
6. **Push and create PR**

### Code Review Checklist
- [ ] All automated checks passing
- [ ] Security patterns followed
- [ ] Test coverage maintained
- [ ] Performance requirements met
- [ ] Documentation updated

### Troubleshooting

**Pre-commit hooks not running**
```bash
npm run prepare
```

**ESLint cache issues**
```bash
rm -rf node_modules/.cache/eslint/
```

**Permission errors**
```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

## Architecture Compliance

### SOLID Principles Enforcement
- **Single Responsibility**: Max 30 lines per function
- **Open/Closed**: Prefer composition over modification
- **Interface Segregation**: Max 3 parameters per function
- **Dependency Inversion**: Use SecurityManager for logging

### Security-First Architecture
- Security modules have stricter rules
- All user inputs must be validated
- Separation of concerns enforced
- Performance monitoring included

---

For questions or issues with the quality pipeline, refer to the project's ESLint and Prettier configurations or contact the development team.