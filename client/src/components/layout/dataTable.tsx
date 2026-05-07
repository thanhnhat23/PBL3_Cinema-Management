import type { Key, ReactNode } from "react";
import type { Selection as TableSelection, SortDescriptor } from "@heroui/react";

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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@heroui/react";
import { Plus, Trash, Search, ChevronLeft, ChevronRight, Filter, ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  addButtonLabel?: string;
  totalLabel: (count: number) => string;
  emptyLabel: string;
  loadingLabel: string;
  defaultSort: SortDescriptor;
  rowKey: (item: T) => Key;
  searchBy: (item: T) => string;
  renderCell: (item: T, columnKey: Key) => ReactNode;
  getSortValue?: (item: T, columnKey: string) => SortValue;
  onAdd?: () => void;
  onDeleteSelected?: (selectedKeys: TableSelection) => void;
  selectionMode?: "multiple" | "single" | "none";
  hideDeleteSelected?: boolean;
  filters?: {
    uid: string;
    name: string;
    options: { name: string; uid: string }[];
  }[];
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
  onAdd,
  onDeleteSelected,
  selectionMode = "multiple",
  hideDeleteSelected = false,
  filters,
}: AdminDataTableProps<T>) {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<TableSelection>(new Set([]) as TableSelection);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, TableSelection>>({});
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(defaultSort);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    if (hasSearchFilter) {
      const query = filterValue.toLowerCase();
      filtered = filtered.filter((item) => searchBy(item).toLowerCase().includes(query));
    }

    // Apply active filters
    Object.entries(selectedFilters).forEach(([uid, selection]) => {
      if (selection !== "all" && selection.size > 0) {
        filtered = filtered.filter((item) => {
          const val = String((item as Record<string, unknown>)[uid] as unknown);
          return selection.has(val);
        });
      }
    });

    return filtered;
  }, [items, filterValue, hasSearchFilter, searchBy, selectedFilters]);

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
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onClearFilters = useCallback(() => {
    setSelectedFilters({});
    setPage(1);
  }, []);

  const removeFilter = useCallback((uid: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[uid];
      if (current instanceof Set || (typeof current === "object" && current !== null && "delete" in current)) {
        const next = new Set(current as Set<Key>);
        next.delete(value);
        return { ...prev, [uid]: next as TableSelection };
      }
      return prev;
    });
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    const hasActiveFilters = Object.values(selectedFilters).some(s => s !== "all" && s.size > 0);

    return (
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="w-full sm:flex-1 sm:max-w-100">
            <Input
              isClearable
              classNames={{
                base: "w-full",
                inputWrapper: "h-11 bg-white dark:bg-zinc-900 border-1 border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm",
                input: "text-sm",
              }}
              placeholder={searchPlaceholder}
              startContent={<Search size={18} className="text-zinc-400" />}
              value={filterValue}
              onClear={onClear}
              onValueChange={onSearchChange}
            />
          </div>

          <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
            {onAdd && (
              <button 
                onClick={() => onAdd?.()}
                className="flex-1 sm:flex-none group flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3 sm:px-5 py-2.5 rounded-sm cursor-pointer font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="truncate">{addButtonLabel || t('dashboard.data_table.add_new')}</span>
              </button>
            )}

            {!hideDeleteSelected && (
              <button 
                onClick={() => onDeleteSelected?.(selectedKeys)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-1 border-rose-100 dark:border-rose-900/50 px-3 sm:px-5 py-2.5 rounded-sm cursor-pointer font-bold text-xs sm:text-sm hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors active:scale-95"
              >
                <Trash size={16} />
                <span className="truncate">{t('dashboard.data_table.delete_selected')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 px-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-1">{t('dashboard.data_table.filtering')}</span>
                {filters?.map(f => {
                    const selection = selectedFilters[f.uid];
                    if (!selection || selection === "all" || selection.size === 0) return null;
                    
                    return Array.from(selection).map(val => {
                        const option = f.options.find(opt => String(opt.uid) === String(val));
                        return (
                            <Chip
                                key={`${f.uid}-${val}`}
                                size="sm"
                                variant="flat"
                                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none h-6 px-2 text-[11px] font-bold"
                                endContent={<X size={12} className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => removeFilter(f.uid, String(val))} />}
                            >
                                <span className="opacity-50 font-medium mr-1">{f.name}:</span>
                                {option?.name || val}
                            </Chip>
                        );
                    });
                })}
                <button 
                    onClick={onClearFilters}
                    className="text-[10px] font-black text-rose-500 uppercase tracking-tighter hover:underline cursor-pointer ml-1"
                >
                    {t('dashboard.data_table.clear_all_filters')}
                </button>
            </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{totalLabel(filteredItems.length)}</span>
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{t('dashboard.data_table.page_info', { page, pages })}</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
             {filters && filters.map((f) => (
                <Dropdown key={f.uid} classNames={{
                    content: "bg-sidebar border-1 border-zinc-200 dark:border-zinc-800 shadow-xl",
                }}>
                    <DropdownTrigger>
                        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[11px] font-bold uppercase tracking-wider">
                            <Filter size={14} />
                            {f.name}
                            <ChevronDown size={14} className="opacity-50" />
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label={`Filter ${f.name}`}
                        closeOnSelect={false}
                        selectedKeys={selectedFilters[f.uid] || new Set([])}
                        selectionMode="multiple"
                        onSelectionChange={(keys) => {
                            setSelectedFilters(prev => ({ ...prev, [f.uid]: keys as TableSelection }));
                            setPage(1);
                        }}
                    >
                        {f.options.map((opt) => (
                            <DropdownItem key={opt.uid} className="capitalize">
                                {opt.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
             ))}
          </div>
        </div>
      </div>
    );
  }, [searchPlaceholder, filterValue, onClear, onSearchChange, addButtonLabel, totalLabel, filteredItems.length, onAdd, page, pages, filters, selectedFilters, onClearFilters, removeFilter, hideDeleteSelected, selectedKeys, onDeleteSelected]);

  const bottomContent = useMemo(() => {
    const hasSelection = (selectedKeys === "all" || selectedKeys.size > 0);

    return (
      <div className="py-4 px-4 flex justify-between items-center bg-white dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 rounded-b-sm shadow-sm mt-4">
        <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
                {selectedKeys === "all"
                    ? t('dashboard.data_table.all_selected')
                    : t('dashboard.data_table.selected_count', { count: selectedKeys.size })}
             </div>
             {hasSelection && (
                <button 
                    onClick={() => setSelectedKeys(new Set([]) as TableSelection)}
                    className="text-[10px] font-black text-rose-500 uppercase tracking-tighter hover:underline cursor-pointer"
                >
                    {t('dashboard.data_table.deselect_all')}
                </button>
             )}
        </div>

        <Pagination
          isCompact
          showControls
          showShadow
          classNames={{
            cursor: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg",
            item: "rounded-lg font-medium",
            next: "rounded-lg",
            prev: "rounded-lg",
          }}
          page={page}
          total={pages}
          onChange={setPage}
        />

        <div className="hidden sm:flex items-center gap-2">
          <Button
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
            className="bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-bold"
          >
            <ChevronLeft size={18} />
          </Button>

          <Button
            isDisabled={page === pages}
            size="sm"
            variant="flat"
            onPress={onNextPage}
            className="bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-bold"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, page, pages, onPreviousPage, onNextPage]);

  return (
    <div className="w-full">
      <Table
        aria-label={addButtonLabel || "Data Table"}
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        classNames={{
          wrapper: "bg-white dark:bg-zinc-900/40 p-0 rounded-sm border-1 border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none",
          th: "bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-black text-[10px] uppercase tracking-[0.15em] h-14 border-b border-zinc-100 dark:border-zinc-800 first:rounded-tl-2xl last:rounded-tr-2xl",
          td: "h-15 px-6 border-b border-zinc-50 dark:border-zinc-800/50 group-hover:bg-zinc-50/50 dark:group-hover:bg-zinc-800/20 transition-colors",
          tr: "group",
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

        <TableBody 
            emptyContent={isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{loadingLabel}</span>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-20 opacity-30">
                    <Search size={48} />
                    <span className="text-sm font-medium">{emptyLabel}</span>
                </div>
            )} 
            items={sortedItems}
        >
          {(item) => (
            <TableRow key={rowKey(item)} className="cursor-default">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
