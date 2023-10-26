---
title: Style Guidelines
description: Code syntax, and general project format and structure

---

## Tools

This repository makes use of EditorConfig, ESLint, and Prettier to enforce a consistent coding style. These tools are configured under `.editorconfig`, `packages/config/eslintrc.base.cjs`, and `packages/config/prettierrc.base.cjs` respectively. Linting can be done locally by running `pnpm lint:fix` and formatting by running `pnpm format` from the root of the monorepo.

## Suggested editor extensions

To avoid CI failing due to linting and formatting issues, it is recommended to install the following extensions for your editor and enable format/lint on save.

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## General guidelines

- Code indentation of 2 spaces.
- Maximum line length of 100 characters.
- Use single quotes for strings.
- Functional programming first - avoid side effects and mutations.
- Clarity and readability in mind, descriptive names and comments.

## TypeScript & JavaScript

- Use TypeScript over JavaScript.
- TypeScript interfaces, enums, and types should live in a types.ts, enums.ts, or interfaces.ts file respectively (src level or co-located to usage).
- Use modern ES6+ syntax.
- Use inline named exports over default exports i.e `export const isExported = true;`.
- Use `const` over `let` where possible.
- Use arrow functions over function expressions.
- Avoid over 2 levels of nesting, utilize early returns.
- Avoid `for` loops, use `Array.prototype.forEach` or `Array.prototype.map` instead.

## Naming conventions

- kebab-case for file and directory names.
- PascalCase for class names, TypeScript enums, interfaces, types, and UI components (Svelte, JSX, etc.) file and directory names.
- camelCase for variables, functions, and methods.
- Prefix interfaces with `I`, enums with `E`, and types with `T`. i.e `interface IMyInterface`, `enum EMyEnum`, `type TMyType`.
- Prefix private variables, properties, and methods with `__`.
- Prefix unused variables and parameters with `_`.
- A function that returns a value should be prefixed with `get` i.e `getUser`.
- A function that sets a value should be prefixed with `set` i.e `setUser`.
- A function that makes an HTTP request should be prefixed with `fetch` i.e `fetchUser`.
- A function that preforms a mutation should be prefixed with `create`, `update`, or `delete` i.e `createUser`, `updateUser`, `deleteUser`.
- A function that returns a boolean should be prefixed with `checkIs` i.e `checkIsMobile`.
- A variable that holds a boolean should be prefixed with `is` i.e `isMobile`.

## Project structure

### UI components (Svelte, JSX, etc.)

This repository uses the [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) methodology to organize UI components and strives for co-location of files a component owns such as its styling and tests.

```
├── atoms/
└───── Button/
        ├── Button.svelte
        ├── Button.test.svelte (an implementation Button.svelte to be imported
         by Button.test.ts)
        ├── Button.test.ts
        └── types.ts
```

### Non-UI

```
├── utils/
└───── get-user/
        ├── get-user.ts
        ├── get-user.test.ts
        └── types.ts
```
