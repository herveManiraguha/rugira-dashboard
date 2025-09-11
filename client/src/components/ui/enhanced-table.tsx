import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  hideOnMobile?: boolean;
  priority?: 'high' | 'medium' | 'low'; // For responsive hiding
}

export interface Filter {
  id: string;
  label: string;
  value: string;
}

interface EnhancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  filters?: Filter[];
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  bulkActions?: React.ReactNode;
  pageSize?: number;
  className?: string;
}

export function EnhancedTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  filters = [],
  selectedFilters = [],
  onFilterChange,
  onSelectionChange,
  bulkActions,
  pageSize = 10,
  className
}: EnhancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm) {
      result = result.filter(item => {
        return columns.some(column => {
          if (column.accessorKey) {
            const value = item[column.accessorKey];
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
    }

    // Apply filters
    if (selectedFilters.length > 0) {
      result = result.filter(item => {
        return selectedFilters.some(filterId => {
          const filter = filters.find(f => f.id === filterId);
          if (!filter) return false;
          
          // Basic filter logic - can be extended based on needs
          return columns.some(column => {
            if (column.accessorKey) {
              const value = item[column.accessorKey];
              return String(value).toLowerCase().includes(filter.value.toLowerCase());
            }
            return false;
          });
        });
      });
    }

    return result;
  }, [data, searchTerm, selectedFilters, columns, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    const column = columns.find(col => col.id === sortColumn);
    if (!column?.accessorKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[column.accessorKey!];
      const bValue = b[column.accessorKey!];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleRowSelection = (rowId: string | number, isSelected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (isSelected) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    
    if (onSelectionChange) {
      const selectedItems = data.filter(item => newSelected.has(item.id));
      onSelectionChange(selectedItems);
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(paginatedData.map(item => item.id));
      setSelectedRows(allIds);
      if (onSelectionChange) {
        onSelectionChange(paginatedData);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  const getSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const allSelected = selectedRows.size === paginatedData.length && paginatedData.length > 0;
  const someSelected = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
            data-testid="table-search"
          />
        </div>
        
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          {filters.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {filters.map(filter => (
                  <Badge
                    key={filter.id}
                    variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                    className="cursor-pointer touch-friendly min-h-[32px] px-3"
                    onClick={() => {
                      if (onFilterChange) {
                        const newFilters = selectedFilters.includes(filter.id)
                          ? selectedFilters.filter(id => id !== filter.id)
                          : [...selectedFilters, filter.id];
                        onFilterChange(newFilters);
                      }
                    }}
                    data-testid={`filter-${filter.id}`}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {selectedRows.size > 0 && bulkActions && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span className="text-sm text-gray-500">
                {selectedRows.size} selected
              </span>
              <div className="flex space-x-2 w-full sm:w-auto">
                {bulkActions}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {onSelectionChange && (
                  <TableHead className="w-12 sticky left-0 bg-background z-10 !p-0">
                    <div className="h-12 flex items-center justify-center">
                      <Checkbox
                        checked={allSelected || someSelected}
                        onCheckedChange={handleSelectAll}
                        data-testid="select-all-checkbox"
                      />
                    </div>
                  </TableHead>
                )}
                {columns.map((column, index) => (
                  <TableHead 
                    key={column.id}
                    className={cn(
                      column.sortable && "cursor-pointer hover:bg-gray-50",
                      column.hideOnMobile && "hidden sm:table-cell",
                      column.priority === 'low' && "hidden lg:table-cell",
                      column.priority === 'medium' && "hidden md:table-cell",
                      // Make first column sticky on mobile
                      index === 0 && onSelectionChange && "sticky left-12 bg-background z-10",
                      index === 0 && !onSelectionChange && "sticky left-0 bg-background z-10",
                      "px-3 py-3 sm:px-6 sm:py-4"
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                    data-testid={`column-header-${column.id}`}
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="text-xs sm:text-sm font-medium">{column.header}</span>
                      {column.sortable && (
                        <span className="ml-1">
                          {getSortIcon(column.id)}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} data-testid={`table-row-${row.id}`} className="hover:bg-gray-50">
                  {onSelectionChange && (
                    <TableCell className="w-12 sticky left-0 bg-background z-10 !p-0">
                      <div className="h-full min-h-[3rem] flex items-center justify-center">
                        <Checkbox
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={(checked) => handleRowSelection(row.id, !!checked)}
                          data-testid={`row-checkbox-${row.id}`}
                        />
                      </div>
                    </TableCell>
                  )}
                  {columns.map((column, index) => (
                    <TableCell 
                      key={column.id} 
                      data-testid={`cell-${column.id}-${row.id}`}
                      className={cn(
                        column.hideOnMobile && "hidden sm:table-cell",
                        column.priority === 'low' && "hidden lg:table-cell",
                        column.priority === 'medium' && "hidden md:table-cell",
                        // Make first column sticky on mobile
                        index === 0 && onSelectionChange && "sticky left-12 bg-background z-10",
                        index === 0 && !onSelectionChange && "sticky left-0 bg-background z-10",
                        "whitespace-nowrap px-3 py-3 sm:px-6 sm:py-4 text-sm"
                      )}
                    >
                      {column.cell ? column.cell(row) : 
                       column.accessorKey ? String(row[column.accessorKey]) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center justify-center space-x-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              data-testid="prev-page"
              className="h-9 sm:h-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="text-xs sm:text-sm font-medium bg-gray-100 px-3 py-2 rounded">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              data-testid="next-page"
              className="h-9 sm:h-8"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}