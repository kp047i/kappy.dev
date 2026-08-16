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

# このコンテナには Playwright のブラウザが同梱されているが、ビルド番号が
# プロジェクトの Playwright 版とずれる。ブラウザ配信 CDN はネットワークポリシーで
# 遮断されているため、同梱ビルドを期待されるパスから見えるようにして解決する。
#
# 単純なディレクトリ symlink では足りない。Playwright は配布物の内部構造を
# バージョンによって変えており (chrome-linux から chrome-linux64 や
# chrome-headless-shell-linux64 へ)、実行ファイルの名前も変わるため、
# 新旧どちらのレイアウトからも辿れるようにリンクを張る。
resolve_bundled_browser() {
  local want="$1"
  local root="$2"
  local base prefix have payload entry

  base="$(basename "$want")"
  prefix="${base%-*}"

  have="$(find "$root" -maxdepth 1 -mindepth 1 -type d -name "${prefix}-*" |
    sort -V | tail -n 1)"
  if [ -z "$have" ]; then
    return 1
  fi

  # 以前のフックが張ったディレクトリ symlink が残っていると、mkdir -p が
  # リンク先を書き換えてしまうため先に外す。
  if [ -L "$want" ]; then
    rm -f "$want"
  fi
  mkdir -p "$want"

  # 同梱物をそのまま見せる (旧レイアウト用)。
  for entry in "$have"/*; do
    ln -sfn "$entry" "$want/$(basename "$entry")"
  done

  # 実行ファイルが入っているディレクトリ (chrome-linux) を、新しいレイアウトの
  # 名前でも参照できるようにする。リソースファイルは実行ファイルの隣にある
  # 必要があるので、ファイル単位ではなくディレクトリ単位でリンクする。
  payload="$(find "$have" -maxdepth 1 -mindepth 1 -type d | head -n 1)"
  if [ -z "$payload" ]; then
    return 0
  fi

  case "$prefix" in
    chromium)
      ln -sfn "$payload" "$want/chrome-linux64"
      ;;
    chromium_headless_shell)
      mkdir -p "$want/chrome-headless-shell-linux64"
      for entry in "$payload"/*; do
        ln -sfn "$entry" "$want/chrome-headless-shell-linux64/$(basename "$entry")"
      done
      # 実行ファイル名も headless_shell から chrome-headless-shell に変わった。
      if [ -e "$payload/headless_shell" ]; then
        ln -sfn "$payload/headless_shell" \
          "$want/chrome-headless-shell-linux64/chrome-headless-shell"
      fi
      ;;
  esac
}

echo "==> Playwright ブラウザを解決"
browsers_root="${PLAYWRIGHT_BROWSERS_PATH:-}"
missing=""

if [ -n "$browsers_root" ] && [ -d "$browsers_root" ]; then
  while read -r want; do
    [ -n "$want" ] || continue

    # 実体があるものは触らない。symlink は過去のフックが張ったものなので
    # 張り直す (Playwright の更新でレイアウトが変わっていることがある)。
    if [ -d "$want" ] && [ ! -L "$want" ]; then
      continue
    fi

    if resolve_bundled_browser "$want" "$browsers_root"; then
      echo "  resolved $(basename "$want")"
    else
      missing="$missing $(basename "$want")"
    fi
  done < <(pnpm exec playwright install --dry-run chromium chromium-headless-shell 2>/dev/null |
    awk '/Install location:/ {print $3}' | sort -u)
else
  missing=" (PLAYWRIGHT_BROWSERS_PATH 未設定)"
fi

if [ -n "$missing" ]; then
  # 同梱ブラウザで埋められなかった分だけダウンロードを試す。
  # 失敗してもセッション自体は続行させる (E2E / Storybook テストのみ影響)。
  echo "  同梱ブラウザで解決できず:$missing — ダウンロードを試行"
  pnpm exec playwright install chromium chromium-headless-shell ||
    echo "  [warn] Playwright ブラウザの取得に失敗。E2E / Storybook テストは動きません"
fi

echo "==> セットアップ完了"
