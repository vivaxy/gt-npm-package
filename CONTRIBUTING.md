# Steps to make contributions:

- Update codes.
- Supply test cases covering your codes.
- Check code styles with `npm run lint`.
- Commit with [Conventional Commits](https://conventionalcommits.org). Maybe use [gacp](https://github.com/vivaxy/gacp) as a tool.

# Steps to publish:

- Check test cases.
- Check code styles.
- Check codes that are already updated with origin master.
- Run `npm run release`. This will automatically update `CHANGELOG.md`, bump version, push changes to git remote, and publish to npm.
