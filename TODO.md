# TODO

Optional work that was deliberately left out of the November 2026 cleanup. None of it blocks anything.

## Dependency upgrades

Each of these is a major version with breaking changes and little visible payoff for this app, so do them one at a time, when there is a reason to.

- [ ] **Vite 8** together with `@vitejs/plugin-react` 6. Vite 8 moves to the Rolldown bundler. The plugin was held at 5.x because 6.x requires Vite 8.
- [ ] **React 19** and matching `@types/react` / `@types/react-dom`. Mostly type changes and a few removed APIs. Lowest risk of the four.
- [ ] **Tailwind CSS 4** and `prettier-plugin-tailwindcss`. Configuration moves from `tailwind.config.cjs` into CSS, several utilities were renamed, and the custom colour tokens have to be re-declared.
- [ ] **framer-motion 14**, now published as `motion`. Import paths changed and there are breaking changes across four major versions. The header hover and page transition animations need retesting afterwards.
