# Deploying Codex CLI to npm

This guide explains how to publish your Codex CLI package to npm.

## Prerequisites

1. Create an npm account if you don't have one:
   - Go to [npmjs.com](https://www.npmjs.com/) and sign up
   - Verify your email address

2. Log in to npm from your terminal:
   ```powershell
   npm login
   ```
   - Enter your username, password, and email

## Publishing Steps

1. Make sure your package.json is set up correctly:
   - Check name, version, description, repository URL
   - Verify bin entries are correct
   - Make sure all dependencies are listed

2. Test your package locally:
   ```powershell
   npm link
   ```
   - This creates a symlink to your package
   - Test by running `codex` commands from any directory

3. Publish your package:
   ```powershell
   npm publish
   ```
   - This will run your prepare script which sets permissions
   - Your package will be published to npm registry

4. For subsequent updates:
   - Update version in package.json (follow semver: major.minor.patch)
   - Run `npm publish` again

## Package Maintenance

- **Updating the package**: Increment version number in package.json, then run `npm publish`
- **Checking published package**: `npm view codex-cli`
- **Unpublishing** (only within 72 hours): `npm unpublish codex-cli --force`

## Package Naming Considerations

If `codex-cli` name is already taken, consider these alternatives:
- `@yourusername/codex-cli` (scoped package)
- `codex-terminal`
- `codex-ai-cli`
- `aicoder-cli`
- `devai-cli`

To publish a scoped package, use:
```powershell
npm publish --access public
```

## Final Checks Before Publishing

1. Verify all executable files have correct permissions
2. Ensure config script works properly
3. Update README.md with accurate installation instructions
4. Check all dependencies are correctly specified
5. Make sure postinstall script provides clear guidance
