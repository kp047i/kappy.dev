#!/usr/bin/env bash
#
# Claude Code on the web 用の SessionStart フック。
# セッション開始時に依存関係を揃え、lint / build / テストがすぐ動く状態にする。
#
# ローカルの Claude Code では何もしない (手元の環境を勝手に触らないため)。
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

echo "==> pnpm install"
# --frozen-lockfile ではなく通常の install。コンテナのキャッシュが効きやすく、
# セッション中に依存を追加したケースでも失敗しない。
pnpm install

echo "==> Playwright ブラウザを解決"
# このコンテナには Playwright のブラウザが同梱されているが、ビルド番号が
# プロジェクトの Playwright 版とずれることがある。ブラウザ配信 CDN は
# ネットワークポリシーで遮断されているため、同梱ビルドへ symlink して解決する。
browsers_root="${PLAYWRIGHT_BROWSERS_PATH:-}"
missing=""

if [ -n "$browsers_root" ] && [ -d "$browsers_root" ]; then
  while read -r want; do
    [ -n "$want" ] || continue
    [ -e "$want" ] && continue

    base="$(basename "$want")"
    prefix="${base%-*}"
    # 例: chromium-1193 が無ければ chromium-1194 を、
    #     chromium_headless_shell-1193 が無ければ同名 prefix の最新を使う。
    have="$(find "$browsers_root" -maxdepth 1 -mindepth 1 -type d -name "${prefix}-*" |
      sort -V | tail -n 1)"

    if [ -n "$have" ]; then
      ln -sfn "$(basename "$have")" "$want"
      echo "  linked $base -> $(basename "$have")"
    else
      missing="$missing $base"
    fi
  done < <(pnpm exec playwright install --dry-run chromium chromium-headless-shell 2>/dev/null |
    awk '/Install location:/ {print $3}' | sort -u)
else
  missing=" (PLAYWRIGHT_BROWSERS_PATH 未設定)"
fi

if [ -n "$missing" ]; then
  # symlink で埋められなかった分だけダウンロードを試す。
  # 失敗してもセッション自体は続行させる (E2E / Storybook テストのみ影響)。
  echo "  同梱ブラウザで解決できず:$missing — ダウンロードを試行"
  pnpm exec playwright install chromium chromium-headless-shell ||
    echo "  [warn] Playwright ブラウザの取得に失敗。E2E / Storybook テストは動きません"
fi

echo "==> セットアップ完了"
