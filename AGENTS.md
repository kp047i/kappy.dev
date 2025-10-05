# Repository Guidelines

## エージェントへの追加指示
- すべての回答・コミュニケーションは日本語で行ってください。

## プロジェクト構成とモジュール整理
- `app/` には App Router のルート、レイアウト、メタデータ生成関数、共有 CSS を配置します。
- `features/blog/` はブログ機能の中枢で、MDX 記事は `features/blog/posts/`、関連アセットは `public/` に置きます。
- `components/` はページ共通のレイアウト用コンポーネント、`utils/` は `useViewport` などの共有フックを格納します。
- UI は可能な限り `features/<domain>/components/<Component>/` に共存させ、インポートはルート起点のエイリアス `@/` を利用してください。

## ビルド・テスト・開発コマンド
- `pnpm dev` で Next.js のローカル開発サーバーを起動します。
- `pnpm build` と `pnpm start` で本番ビルドの生成と検証を行います。
- `pnpm lint` は TypeScript + Tailwind クラス順序を含む ESLint を実行します。
- `pnpm storybook` で Storybook を起動し、`pnpm build-storybook` で静的ビルドを出力します。
- `pnpm test-storybook` は Storybook ビルドに対して Playwright ベースのテストを流します。

## コーディングスタイルと命名規則
- TypeScript の strict モードを前提とし、Server/Client コンポーネントの意図を明確にして `"use client"` を必要なコンポーネントに追加します。
- `pnpm exec prettier --write .` でフォーマットし、コミット前に lint を解消してください。インデントはスペース 2 個、Tailwind ユーティリティは規定順序を維持します。
- React コンポーネントとディレクトリは PascalCase、ヘルパー関数は camelCase、MDX のスラッグは kebab-case を採用します。
- クラス結合には `clsx` を使い、`tailwind.config.js` のトークンに従ってカラーパレットを統一します。

## テスト指針
- Storybook のストーリーはコンポーネント横に配置し（例: `BlogCard/BlogCard.stories.tsx`）、主要な状態を網羅します。
- `pnpm build-storybook && pnpm test-storybook` を PR 前に実行し、挙動変更時は `__snapshots__/` を更新します。
- 大きな UI フローを追加する場合は Storybook に Playwright の相互作用テストを足し、オートメーションが難しい場合は PR に手動 QA の手順を記載してください。

## コミットと PR ガイドライン
- コミットメッセージは `type(scope): summary` 形式（例: `feat(blog): …`, `chore(vscode): …`）に揃えます。
- 細かな WIP コミットはスカッシュし、意味のある単位で履歴を残します。
- PR では関連 issue、機能変更の概要、実行した主要コマンド、UI 変更時のスクリーンショットや Storybook URL を共有してください。
- ブログ記事を更新する際は公開予定のスラッグと `public/` 配下のアセット確認を明記するとレビューが円滑です。

## コンテンツと設定に関する注意
- Volta で固定された Node `22.13.0` と pnpm 8 を使用します。ローカル環境もこのバージョンに合わせてください。
- 機密情報はコミットしないでください。実行時の設定は `.env.local` に保存し、リポジトリへは追加しません。
