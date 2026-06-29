# dev-init

CLI tool to scaffold new projects with language, AI, and feature composition.

## Install

```bash
npm install -g dev-init
```

## Usage

```bash
# Interactive mode (creates ./project-name/ directory)
dev-init

# Generate in current directory
dev-init --here

# Specify output directory
dev-init --output ~/projects

# Update cached templates
dev-init update-templates
```

## What it generates

```
my-project/
├── README.md
├── .gitignore
├── .env.example
├── package.json          # merged from language + feature patches
├── tsconfig.json         # (TypeScript only)
├── CLAUDE.md             # symlink → .ai/claude/CLAUDE.md
├── CODEX.md              # symlink → .ai/codex/CODEX.md
├── src/
│   └── index.ts
├── tests/                # (if Vitest selected)
├── .github/workflows/    # (if GitHub Actions selected)
├── docker-compose.yml    # (if Docker selected)
├── eslint.config.js      # (if ESLint selected)
├── .prettierrc           # (if Prettier selected)
└── .ai/
    ├── company/
    │   ├── coding-standard.md
    │   ├── git-workflow.md
    │   ├── review-policy.md
    │   └── security.md
    ├── project/
    │   ├── overview.md
    │   ├── architecture.md
    │   ├── conventions.md
    │   └── testing.md
    ├── claude/
    │   └── CLAUDE.md
    └── codex/
        └── CODEX.md
```

## Supported Combinations

### Languages
| ID | Label |
|---|---|
| `typescript` | TypeScript (Node.js ESM) |
| `laravel` | Laravel (PHP) |
| `python` | Python 3.x |

### AI Providers
| ID | Config file |
|---|---|
| `claude` | `CLAUDE.md` |
| `codex` | `CODEX.md` |

### Features
| ID | Compatible Languages |
|---|---|
| `github-actions` | All |
| `docker` | All |
| `discord` | All |
| `line-bot` | TypeScript, Python |
| `lark` | All |
| `eslint` | TypeScript |
| `prettier` | TypeScript |
| `vitest` | TypeScript |

## Templates

Templates are fetched from [dev-init-templates](https://github.com/Ruu5LP/dev-init-templates) and cached in `~/.dev-init/templates/`.

## License

MIT
