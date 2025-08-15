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
      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="table-search"
          />
        </div>
        
        {filters.length > 0 && (
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <div className="flex space-x-2">
              {filters.map(filter => (
                <Badge
                  key={filter.id}
                  variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                  className="cursor-pointer"
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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {selectedRows.size} selected
            </span>
            {bulkActions}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected || someSelected}
                    onCheckedChange={handleSelectAll}
                    data-testid="select-all-checkbox"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(
                    column.sortable && "cursor-pointer hover:bg-gray-50",
                    column.width && `w-[${column.width}]`
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                  data-testid={`column-header-${column.id}`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="ml-2">
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
              <TableRow key={row.id} data-testid={`table-row-${row.id}`}>
                {onSelectionChange && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={(checked) => handleRowSelection(row.id, !!checked)}
                      data-testid={`row-checkbox-${row.id}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id} data-testid={`cell-${column.id}-${row.id}`}>
                    {column.cell ? column.cell(row) : 
                     column.accessorKey ? String(row[column.accessorKey]) : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              data-testid="prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              data-testid="next-page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}