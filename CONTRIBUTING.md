# Contributing to QuickBite API

Thank you for contributing to the QuickBite API project! Please follow these guidelines.

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards:
   - Write tests for new functionality
   - Follow existing code patterns
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   npm test
   npm run dev  # Verify app starts correctly
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: descriptive commit message"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Code Standards

- **TDD Approach**: Write tests first
- **Sequelize ORM**: Use parameterized queries (no raw SQL)
- **Input Validation**: Validate all user inputs
- **Error Handling**: Proper error responses with meaningful messages
- **Documentation**: Update Swagger docs for API changes

## Commit Message Format

```
type(scope): description

- feat: new feature
- fix: bug fix
- docs: documentation changes
- test: test-related changes
- refactor: code refactoring
```

## Review Process

All PRs require:
- [ ] All tests passing
- [ ] Code review approval
- [ ] Documentation updated
- [ ] No merge conflicts