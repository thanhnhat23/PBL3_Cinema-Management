import type { Key, ReactNode } from "react";
import type { Selection, SortDescriptor } from "@heroui/react";

import { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
} from "@heroui/react";
import { Plus, Trash, Search, ChevronLeft, ChevronRight } from "lucide-react";

export type AdminColumn = {
  name: string;
  uid: string;
  sortable?: boolean;
};

type SortValue = string | number | Date | null | undefined;

type AdminDataTableProps<T> = {
  columns: AdminColumn[];
  items: T[];
  isLoading: boolean;
  searchPlaceholder: string;
  addButtonLabel: string;
  totalLabel: (count: number) => string;
  emptyLabel: string;
  loadingLabel: string;
  defaultSort: SortDescriptor;
  rowKey: (item: T) => Key;
  searchBy: (item: T) => string;
  renderCell: (item: T, columnKey: Key) => ReactNode;
  getSortValue?: (item: T, columnKey: string) => SortValue;
};

function normalizeSortValue(value: SortValue): string | number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const asDate = Date.parse(value);
    if (!Number.isNaN(asDate) && /\d{4}|\//.test(value)) return asDate;
    return value.toLowerCase();
  }
  return "";
}

export default function DataTableAdmin<T>({
  columns,
  items,
  isLoading,
  searchPlaceholder,
  addButtonLabel,
  totalLabel,
  emptyLabel,
  loadingLabel,
  defaultSort,
  rowKey,
  searchBy,
  renderCell,
  getSortValue,
}: AdminDataTableProps<T>) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(defaultSort);
  const [page, setPage] = useState(1);
  const rowsPerPage = 9;

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    if (!hasSearchFilter) return items;

    const query = filterValue.toLowerCase();
    return items.filter((item) => searchBy(item).toLowerCase().includes(query));
  }, [items, filterValue, hasSearchFilter, searchBy]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const pagedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, page]);

  const sortedItems = useMemo(() => {
    return [...pagedItems].sort((a, b) => {
      const aRaw = getSortValue
        ? getSortValue(a, String(sortDescriptor.column))
        : ((a as Record<string, unknown>)[String(sortDescriptor.column)] as SortValue);
      const bRaw = getSortValue
        ? getSortValue(b, String(sortDescriptor.column))
        : ((b as Record<string, unknown>)[String(sortDescriptor.column)] as SortValue);

      const first = normalizeSortValue(aRaw);
      const second = normalizeSortValue(bRaw);

      let cmp = 0;
      if (typeof first === "number" && typeof second === "number") {
        cmp = first < second ? -1 : first > second ? 1 : 0;
      } else {
        const firstString = String(first);
        const secondString = String(second);
        cmp = firstString < secondString ? -1 : firstString > secondString ? 1 : 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [pagedItems, sortDescriptor, getSortValue]);

  const onNextPage = useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
      return;
    }

    setFilterValue("");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            classNames={{
              inputWrapper: "rounded-sm",
            }}
            placeholder={searchPlaceholder}
            startContent={<Search size={18} />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />

          <div className="flex gap-4">
            <button className="flex items-center justify-center gap-2 bg-sidebar hover:bg-neutral-300 dark:hover:bg-neutral-800 border-1 border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-sm cursor-pointer font-semibold shadow-sm">
              <Plus size={18} />
              {addButtonLabel}
            </button>

            <button className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 dark:hover:bg-red-600 border-1 border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-sm cursor-pointer font-semibold text-red-100 shadow-sm">
              <Trash size={18} />
              Xóa
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">{totalLabel(items.length)}</span>
        </div>
      </div>
    );
  }, [searchPlaceholder, filterValue, onClear, onSearchChange, addButtonLabel, totalLabel, items.length]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Đã chọn toàn bộ"
            : `${selectedKeys.size} / ${filteredItems.length} mục được chọn`}
        </span>

        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />

        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
            startContent={<ChevronLeft size={18} />}
          >
            Previous
          </Button>

          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
            endContent={<ChevronRight size={18} />}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [filteredItems.length, selectedKeys, page, pages, onPreviousPage, onNextPage]);

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      classNames={{
        wrapper: "bg-sidebar rounded-sm",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody emptyContent={isLoading ? loadingLabel : emptyLabel} items={sortedItems}>
        {(item) => (
          <TableRow key={rowKey(item)}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
