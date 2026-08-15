#  Repository Guidelines

## Language

すべての回答・コミュニケーションは日本語で行ってください。

## Project Overview

Next.js 15 (App Router) + TypeScript + Tailwind CSS で構築された個人ブログ/ポートフォリオサイト。MDX でブログ記事を管理し、Vercel にデプロイしている。

## Commands

```bash
pnpm dev              # 開発サーバー起動 (port 3000)
pnpm build            # 本番ビルド
pnpm lint             # ESLint (TypeScript + Tailwind クラス順序)
pnpm storybook        # Storybook 起動 (port 6006)
pnpm test:storybook   # Storybook の Vitest テスト実行
pnpm test:e2e         # Playwright E2E テスト実行
pnpm exec prettier --write .  # フォーマット
```

## Architecture

- **`app/`** — App Router のルート・レイアウト・メタデータ生成。`blog/[slug]/` で記事ページを SSG
- **`features/blog/`** — ブログ機能の中枢
  - `posts/` — MDX ブログ記事ファイル (frontmatter でメタデータ管理)
  - `components/` — BlogCard, ContentLinkCard, SpeakerDeck など記事用コンポーネント
  - `const/` — カテゴリ (tech/life/other) とタグの定義
  - `utils.ts` — 記事の読み込み・フィルタリングロジック
- **`components/`** — Header, Footer, ThemeToggle などページ共通レイアウト
- **`utils/`** — useViewport など共有フック
- **`e2e/`** — Playwright E2E テスト

## Key Patterns

- Server Components がデフォルト。`"use client"` は必要なコンポーネントにのみ追加
- インポートはルートエイリアス `@/` を使用 (例: `@/features/blog/utils`)
- UI コンポーネントは `features/<domain>/components/<Component>/` に co-locate
- Storybook ストーリーもコンポーネント横に配置 (例: `BlogCard/BlogCard.stories.tsx`)
- クラス結合には `clsx`、アクセシビリティには React Aria を使用
- ダークモードは `next-themes` + class ベース
- MDX は remark-gfm + rehype-pretty-code (GitHub テーマ) で処理

## Coding Style

- TypeScript strict モード
- インデント: スペース 2 個、ダブルクォート、セミコロンあり、trailing comma (ES5)
- コンポーネント/ディレクトリ: PascalCase、ヘルパー関数: camelCase、MDX スラッグ: kebab-case
- Tailwind ユーティリティクラスは Prettier プラグインで自動ソート
- `tailwind.config.js` のカラーパレットトークン (primary/secondary/base/overlay) に従う

## Commit Convention

`type(scope): summary` 形式 (例: `feat(blog): 新しい記事を追加`, `fix(ui): ダークモード修正`)

## Blog Writing Style

- 一人称で丁寧かつ親しみやすい語り口、体験ベースで執筆
- セクション構成: 導入→背景→取り組み→学び→まとめ
- 読者に語りかける文末 (「〜してみました」「〜と思います」)
- 参考リンクは本文中に埋め込み、視覚的な余白を確保

## Environment

- Node 22.13.0 (Volta で固定)、pnpm でパッケージ管理
- 画像は `public/blog-images/` に配置
- 機密情報は `.env.local` に保存 (コミット不可)

## AI エージェント向けセットアップ (`.claude/`)

- `hooks/session-start.sh` — Claude Code on the web のセッション開始時に `pnpm install` と Playwright ブラウザの解決を行う。ローカルの Claude Code では何もしない
- `settings.json` — 上記フックの登録、Write/Edit 後の prettier 自動整形、頻出コマンド (lint / build / test / git) の権限許可

### 既知の制約

- `pnpm test:storybook` は現状失敗する。`@storybook/nextjs-vite` (9.2.0-alpha 系) が Next.js 16 で削除された `next/config` を import しているため。Storybook の更新が必要
- `e2e/theme.spec.ts` の「ブログ記事でコンソールエラーが発生しない」は、外部ホスト (`voicy.jp` など) への通信が遮断された環境では失敗する。記事内の外部リンクカードがリソース取得に失敗するのが原因で、コード側の不具合ではない

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
