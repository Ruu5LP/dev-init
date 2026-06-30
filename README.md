# @ruu5lp/dev-init

プロジェクトを対話形式で高速に立ち上げるCLIツールです。
言語・AI・機能を選ぶだけで、必要なファイルを自動生成します。

## インストール

```bash
npm install -g @ruu5lp/dev-init
```

## 使い方

```bash
# 対話形式でプロジェクトを生成（./プロジェクト名/ に出力）
dev-init

# 現在のディレクトリに生成
dev-init --here

# 出力先を指定
dev-init --output ~/projects

# テンプレートを最新版に更新
dev-init update-templates
```

## 生成されるファイル構成

```
my-project/
├── README.md
├── .gitignore
├── .env.example
├── package.json          # 選択した機能に応じて自動生成
├── tsconfig.json         # TypeScript選択時
├── CLAUDE.md             # .ai/claude/CLAUDE.md へのシンボリックリンク
├── CODEX.md              # .ai/codex/CODEX.md へのシンボリックリンク
├── src/
│   └── index.ts
├── tests/                # Vitest選択時
├── .github/workflows/    # GitHub Actions選択時
├── docker-compose.yml    # Docker選択時
├── eslint.config.js      # ESLint選択時
├── .prettierrc           # Prettier選択時
└── .ai/
    ├── company/          # 社内共通ルール
    │   ├── coding-standard.md
    │   ├── git-workflow.md
    │   ├── review-policy.md
    │   └── security.md
    ├── project/          # プロジェクト固有ルール
    │   ├── overview.md
    │   ├── architecture.md
    │   ├── conventions.md
    │   └── testing.md
    ├── claude/
    │   └── CLAUDE.md
    └── codex/
        └── CODEX.md
```

## 対応言語

| ID | 言語 |
|---|---|
| `typescript` | TypeScript（Node.js ESM） |
| `laravel` | Laravel（PHP） |
| `python` | Python 3.x |

## 対応AI

| ID | 設定ファイル |
|---|---|
| `claude` | `CLAUDE.md` |
| `codex` | `CODEX.md` |

## 対応機能（Feature）

| ID | 対応言語 |
|---|---|
| `github-actions` | すべて |
| `docker` | すべて |
| `discord` | すべて |
| `line-bot` | TypeScript・Python |
| `lark` | すべて |
| `eslint` | TypeScript |
| `prettier` | TypeScript |
| `vitest` | TypeScript |

## テンプレートについて

テンプレートは [dev-init-templates](https://github.com/Ruu5LP/dev-init-templates) から取得し、`~/.dev-init/templates/` にキャッシュされます。

## ライセンス

MIT
