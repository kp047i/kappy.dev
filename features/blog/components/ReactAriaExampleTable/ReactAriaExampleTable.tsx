"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  Cell,
  Checkbox,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  type CheckboxProps,
  type Key,
  type Selection,
} from "react-aria-components";

type ExampleRow = {
  id: Key;
  title: string;
  owner: string;
  status: "進行中" | "レビュー待ち" | "完了" | "保留";
  updatedAt: string;
};

const PAGE_SIZE = 5;

const EXAMPLE_ROWS: ExampleRow[] = [
  {
    id: "proj-01",
    title: "オンボーディングの改善",
    owner: "佐藤",
    status: "進行中",
    updatedAt: "2026-01-12",
  },
  {
    id: "proj-02",
    title: "デザインシステム棚卸し",
    owner: "山田",
    status: "レビュー待ち",
    updatedAt: "2026-01-10",
  },
  {
    id: "proj-03",
    title: "検索体験の再設計",
    owner: "高橋",
    status: "完了",
    updatedAt: "2026-01-08",
  },
  {
    id: "proj-04",
    title: "料金ページの整理",
    owner: "伊藤",
    status: "保留",
    updatedAt: "2026-01-05",
  },
  {
    id: "proj-05",
    title: "通知設定の刷新",
    owner: "鈴木",
    status: "進行中",
    updatedAt: "2026-01-04",
  },
  {
    id: "proj-06",
    title: "請求書テンプレート統一",
    owner: "田中",
    status: "レビュー待ち",
    updatedAt: "2026-01-02",
  },
  {
    id: "proj-07",
    title: "管理画面ナビゲーション整理",
    owner: "木村",
    status: "完了",
    updatedAt: "2025-12-28",
  },
  {
    id: "proj-08",
    title: "アクセシビリティ改善",
    owner: "小林",
    status: "進行中",
    updatedAt: "2025-12-26",
  },
  {
    id: "proj-09",
    title: "分析レポートの再構成",
    owner: "橋本",
    status: "保留",
    updatedAt: "2025-12-24",
  },
  {
    id: "proj-10",
    title: "イベントログの整理",
    owner: "斎藤",
    status: "レビュー待ち",
    updatedAt: "2025-12-22",
  },
  {
    id: "proj-11",
    title: "ユーザー権限設定の見直し",
    owner: "吉田",
    status: "進行中",
    updatedAt: "2025-12-20",
  },
  {
    id: "proj-12",
    title: "APIレスポンスの最適化",
    owner: "森",
    status: "完了",
    updatedAt: "2025-12-18",
  },
];

type SelectionCheckboxProps = Omit<CheckboxProps, "children"> & {
  label: string;
};

function SelectionCheckbox({ label, ...props }: SelectionCheckboxProps) {
  return (
    <Checkbox
      aria-label={label}
      {...props}
      className={({ isDisabled }) =>
        clsx("group inline-flex items-center justify-center not-prose", {
          "opacity-40": isDisabled,
        })
      }
    >
      {({ isSelected, isIndeterminate }) => (
        <span
          className={clsx(
            "flex h-4 w-4 items-center justify-center rounded border border-secondary-200 bg-overlay-100 transition-colors",
            "group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-primary-300",
            "dark:border-base-700 dark:bg-base-900",
            (isSelected || isIndeterminate) &&
              "border-primary-500 bg-primary-500"
          )}
        >
          {isIndeterminate ? (
            <span className="h-0.5 w-2 rounded bg-overlay-100" />
          ) : isSelected ? (
            <span className="h-2 w-2 rounded-sm bg-overlay-100" />
          ) : null}
        </span>
      )}
    </Checkbox>
  );
}

export function ReactAriaExampleTable() {
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const totalPages = Math.max(1, Math.ceil(EXAMPLE_ROWS.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;

  const currentItems = useMemo(
    () => EXAMPLE_ROWS.slice(pageStart, pageStart + PAGE_SIZE),
    [pageStart]
  );
  const currentPageIds = useMemo(
    () => currentItems.map((item) => item.id),
    [currentItems]
  );
  const selectedInPageCount =
    selectedKeys === "all"
      ? currentPageIds.length
      : currentPageIds.filter((id) => selectedKeys.has(id)).length;

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const clearSelection = () => {
    setSelectedKeys(new Set());
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 text-sm text-secondary-900 dark:text-base-100">
          <p className="font-semibold not-prose">
            選択中:{" "}
            {selectedKeys === "all" ? EXAMPLE_ROWS.length : selectedKeys.size} / {EXAMPLE_ROWS.length}件
          </p>
          <p className="text-xs text-secondary-700 dark:text-base-300 not-prose">
            このページ: {selectedInPageCount} / {currentPageIds.length}件
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={clsx(
              "rounded-full border border-secondary-200 px-3 py-1 text-secondary-700 transition-colors",
              "hover:border-secondary-300 hover:text-secondary-950",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "dark:border-base-700 dark:text-base-200 dark:hover:text-base-50"
            )}
          >
            前へ
          </button>
          <span className="px-2 text-secondary-700 dark:text-base-200 not-prose">
            {currentPage} / {totalPages} ページ
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={clsx(
              "rounded-full border border-secondary-200 px-3 py-1 text-secondary-700 transition-colors",
              "hover:border-secondary-300 hover:text-secondary-950",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "dark:border-base-700 dark:text-base-200 dark:hover:text-base-50"
            )}
          >
            次へ
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className={clsx(
              "rounded-full border border-primary-200 px-3 py-1 text-primary-700 transition-colors",
              "hover:border-primary-300 hover:text-primary-800",
              "dark:border-primary-800 dark:text-primary-200 dark:hover:text-primary-50"
            )}
          >
            選択をクリア
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-secondary-200 bg-overlay-100 dark:border-base-700 dark:bg-base-900">
        <Table
          aria-label="SelectionとPaginationの挙動を確認するテーブル"
          selectionMode="multiple"
          selectionBehavior="toggle"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          className="w-full min-w-[720px] border-separate border-spacing-0 text-left"
        >
          <TableHeader>
            <Column className="w-12 border-b border-secondary-200 px-3 py-3 text-secondary-700 dark:border-base-700 dark:text-base-300 not-prose">
              <SelectionCheckbox
                slot="selection"
                label="全件を選択"
              />
            </Column>
            <Column
              isRowHeader
              className="border-b border-secondary-200 px-3 py-3 text-xs font-semibold text-secondary-700 dark:border-base-700 dark:text-base-300 not-prose"
            >
              タイトル
            </Column>
            <Column className="border-b border-secondary-200 px-3 py-3 text-xs font-semibold text-secondary-700 dark:border-base-700 dark:text-base-300 not-prose">
              担当
            </Column>
            <Column className="border-b border-secondary-200 px-3 py-3 text-xs font-semibold text-secondary-700 dark:border-base-700 dark:text-base-300 not-prose">
              状態
            </Column>
            <Column className="border-b border-secondary-200 px-3 py-3 text-xs font-semibold text-secondary-700 dark:border-base-700 dark:text-base-300 not-prose">
              更新日
            </Column>
          </TableHeader>
          <TableBody items={currentItems}>
            {(item) => (
              <Row
                id={item.id}
                className={clsx(
                  "transition-colors",
                  "data-[hovered]:bg-secondary-50",
                  "data-[selected]:bg-primary-100/70",
                  "dark:data-[hovered]:bg-base-800/70",
                  "dark:data-[selected]:bg-primary-900/30"
                )}
              >
                <Cell className="w-12 border-t border-secondary-100 px-3 py-2 dark:border-base-700 not-prose">
                  <SelectionCheckbox
                    slot="selection"
                    label={`${item.title} を選択`}
                  />
                </Cell>
                <Cell className="border-t border-secondary-100 px-3 py-2 text-sm font-medium text-secondary-950 dark:border-base-700 dark:text-base-100 not-prose">
                  {item.title}
                </Cell>
                <Cell className="border-t border-secondary-100 px-3 py-2 text-sm text-secondary-800 dark:border-base-700 dark:text-base-200 not-prose">
                  {item.owner}
                </Cell>
                <Cell className="border-t border-secondary-100 px-3 py-2 text-sm text-secondary-800 dark:border-base-700 dark:text-base-200 not-prose">
                  {item.status}
                </Cell>
                <Cell className="border-t border-secondary-100 px-3 py-2 text-sm text-secondary-800 dark:border-base-700 dark:text-base-200 not-prose">
                  {item.updatedAt}
                </Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
