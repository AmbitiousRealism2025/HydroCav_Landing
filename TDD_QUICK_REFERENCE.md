# 🧪 TDD Quick Reference - HydroCav Project

## ⚡ **MANDATORY TDD WORKFLOW FOR ALL CLAUDE AGENTS**

### 🔄 **RED-GREEN-REFACTOR Cycle**

```
🔴 RED → 🟢 GREEN → 🔄 REFACTOR → REPEAT
```

#### **1. 🔴 RED Phase: Write Failing Tests**
```bash
# Start tests in watch mode
npm run test:watch

# Write tests in appropriate directory:
tests/unit/         # Individual function tests
tests/integration/  # Workflow tests  
tests/security/     # XSS/CSRF/auth tests
```

#### **2. 🟢 GREEN Phase: Make Tests Pass**
```bash
# Implement minimal code to pass tests
# Run full test suite
npm test

# Check coverage
npm run test:coverage
```

#### **3. 🔄 REFACTOR Phase: Improve Quality**
```bash
# Refactor while keeping tests green
# Continuous test running during refactor
npm run test:watch
```

---

## 🚨 **SECURITY-FIRST PATTERNS**

### **Every Feature MUST Include:**
✅ XSS Protection Test  
✅ CSRF Validation Test  
✅ Input Sanitization Test  
✅ Error Handling Test  
✅ Performance Test  

### **Security Module Integration:**
```javascript
// 1. CSRF Check (always first)
if (!window.CSRFProtection?.validateToken()) {
    window.SecurityManager?.logSecurityEvent('csrf_failed', {...});
    return false;
}

// 2. XSS Sanitization
const clean = window.XSSProtection?.sanitizeInput(input) || input;

// 3. Security Logging  
window.SecurityManager?.logSecurityEvent('action', {...});
```

---

## 🎯 **COVERAGE TARGETS**

| Metric | Target | Status |
|--------|--------|---------|
| Statements | ≥80% | 🎯 |
| Branches | ≥80% | 🎯 |
| Functions | ≥80% | 🎯 |
| Lines | ≥80% | 🎯 |

---

## 🤖 **AGENT TASK INTEGRATION**

### **testbot-beta**: Write ALL Tests First
```
Task: "Write comprehensive test suite for [feature] including:
- Unit tests for core functions
- Integration tests for user workflow
- Security tests (XSS, CSRF, validation)
- Performance tests (<100ms requirements)
- Edge cases and error handling"
```

### **codebot-alpha**: Implement to Pass Tests
```
Task: "Implement [feature] following TDD:
- Make failing tests pass with minimal code
- Use security modules for all user inputs
- Follow liquid glass design patterns
- Maintain accessibility compliance"
```

### **validator**: Verify & Validate
```
Task: "Validate [feature] implementation:
- Run full test suite and verify 100% pass rate
- Check coverage meets ≥80% threshold
- Verify security features work correctly
- Test across mobile/desktop breakpoints"
```

---

## 📋 **QUALITY GATES CHECKLIST**

**🚪 No progression without:**

- [ ] All tests passing (100%)
- [ ] Coverage ≥80% all metrics  
- [ ] Security tests included & passing
- [ ] Performance benchmarks satisfied
- [ ] Accessibility tests validated
- [ ] Liquid glass design maintained
- [ ] Documentation updated

---

## ⚠️ **FAILURE PROTOCOLS**

| Issue | Action |
|-------|--------|
| 🔴 Tests Fail | Continue development until green |
| 🚫 Coverage <80% | Add tests before proceeding |
| ⚠️ Security Fail | **STOP** - fix immediately |
| 🐌 Performance Fail | Optimize before completion |

---

## 🛠️ **TEST COMMANDS**

```bash
# Development
npm run test:watch          # Active development
npm test                    # Full test run
npm run test:coverage      # Coverage report

# Specific test types
npm test tests/unit/        # Unit tests only
npm test tests/security/    # Security tests only
npm test tests/integration/ # Integration tests only

# Single test file
npm test tests/unit/feature.test.js
```

---

## 📁 **TEST FILE STRUCTURE**

```javascript
describe('Feature Name', () => {
  describe('Security', () => {
    test('should validate CSRF token');
    test('should sanitize XSS attempts');
    test('should handle authentication');
  });
  
  describe('Functionality', () => {
    test('should perform core function');
    test('should handle edge cases');
    test('should validate inputs');
  });
  
  describe('Performance', () => {
    test('should complete within 100ms');
    test('should handle large datasets');
  });
  
  describe('Accessibility', () => {
    test('should support screen readers');
    test('should maintain focus management');
  });
});
```

---

## 💡 **QUICK TIPS**

- **Start Small:** Write one failing test, make it pass, refactor
- **Security First:** Always include XSS/CSRF tests for user inputs
- **Performance Matters:** Test timing requirements (<100ms response)
- **Think Edge Cases:** Test empty inputs, max lengths, special characters
- **Mock External:** Use Jest mocks for Supabase, localStorage, etc.
- **Keep Tests Fast:** Unit tests should run in milliseconds

---

**🎯 Remember: No code without tests, no tests without security!**