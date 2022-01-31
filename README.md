# Alerts Dashboard

### Getting Started

-   `npm install` from the root of the repository will install the needed dependencies
-   In the extensions pane, search for `@recommended`, and install the recommended extensions
    -   All team code linting / formatting will happen upon saving
-   `npm run watch` will spin up the alerting-dashboard in watch mode (code changes will refresh)

### Testing
Jest is the testing library for unit tests.

- `npm run test:watch` will run all `*.test.ts` files in watch mode
- `npm run view:coverage` will startup a server to serve the coverage report
    for you to view in your browser
- `npm run detect` will check for open handles in the tests

### Deployment

Github Actions is used for our internal deployment, steps are documented in the
`.github/workflows` directory.

### API Dependencies Note

-   Anything needed by typescript to build (including `@types` packages) need to
    be included in the `dependencies`, not the `devDependencies`. This could be
    changed to be more conventional, but the dockerfile steps would also need
    to be updated.

### Connecting manually
For staging:
1. Connect to the VPN
2. `websocat ws://alerts-api.staging.internal.smartcolumbusos.com:8080`

For local:
1. Connect to the VPN
2. `docker build -t alerts-dashboard .`
3. `docker run --name alerts-dashboard -d -p 3000:3000 -p 8080:8080 alerts-dashboard`
4. `websocat ws://localhost:8080`
