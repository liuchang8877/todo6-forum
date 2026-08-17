# Implementation Notes

## 2026-08-17

- The repository root already contains an unrelated, uncommitted CodeCharta dashboard. The forum is isolated under `forum/`, and the Pages workflow publishes only that directory so the existing work is not overwritten.
- At implementation time the local Git repository had no remote. The confirmed publication target is the public `liuchang8877/todo6-forum` repository; the giscus node IDs, Discussions category ID, and real custom domain remain explicit values in `forum/config.js` and `forum/CNAME` until configured.
- GitHub Pages is static hosting. The implementation uses GitHub Discussions as the system of record and giscus only for the fixed homepage discussion. No access token, database, API proxy, or custom authentication layer was added.
- The topic list is deliberately linked to native GitHub Discussions categories instead of being rebuilt through the GitHub API. A custom live listing would introduce rate limits, client-side API failure states, and duplicated navigation while still requiring GitHub for authoring.
- giscus uses `mapping="specific"` with the stable term `community-home`. This prevents a domain or pathname change from silently creating a second homepage thread.
- The site shows a configuration state until a syntactically valid `OWNER/REPOSITORY` and all required giscus IDs are present. This keeps an incomplete deployment understandable without pretending the discussion backend is connected.
- A subdomain such as `forum.example.com` is the recommended DNS shape. DNS cannot map a custom domain directly to the path `github.com/OWNER/REPOSITORY/discussions`; the custom domain serves the Pages frontend, while native discussion links still open GitHub.
- Visual scope is intentionally utilitarian: a compact community index, four category entry points, one embedded station thread, and community rules. No speculative feed implementation or decorative marketing sections were added.
- Verification: `node --check` passed for `app.js` and `config.js`; the Pages workflow parsed as valid YAML; the local server returned HTTP 200 for the page, CSS, and both scripts. Browser checks found no console or page errors, no horizontal overflow at a 390 x 844 viewport, and correct desktop, mobile, light, and dark rendering. The GitHub icon asset returned HTTP 200.
- The Pages workflow pins the current official action majors verified on 2026-08-17: `actions/checkout@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`.
- `actions/upload-pages-artifact@v5` excludes dotfiles by default, so the workflow explicitly sets `include-hidden-files: true` to preserve `forum/.nojekyll` in the deployed artifact.
- The public repository was created and GitHub Discussions was enabled before the first push. The initial publish intentionally targets `main` because an empty repository has no base branch for a feature PR; the Pages workflow is scoped to the forum artifact.
- After the repository was created, its public node ID and the default `General` category ID were read from GitHub GraphQL and filled into `forum/config.js`. No token is stored; the remaining deployment choice is only the optional custom domain.
