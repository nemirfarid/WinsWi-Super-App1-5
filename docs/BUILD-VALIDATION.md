# WinsWi 5.1.1 — Build Validation

Required: Node 22.x and npm 10.x.

Run:
`npm install`
`npm run verify-install`
`npm run verify`
`npm run typecheck`
`npm run lint`
`npm run build`

If a package-lock.json is committed later, use `npm ci` instead of `npm install`.

This release does not fabricate a package-lock.json. Dependency resolution must be performed by a
full npm environment (such as GitHub Actions), where the registry is reachable and the process is
not constrained by this environment's execution timeout.
