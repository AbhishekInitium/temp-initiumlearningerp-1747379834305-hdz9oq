
import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
}

function DataTable<T>({
  columns,
  data,
  className,
  searchable = false,
  searchKeys = [],
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = searchTerm && searchable
    ? sortedData.filter(item => {
        return searchKeys.some(key => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchTerm);
          }
          return false;
        });
      })
    : sortedData;

  const requestSort = (key: keyof T) => {
    let direction: "asc" | "desc" | null = "asc";
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === "asc") return <ChevronUp size={16} />;
    if (sortConfig.direction === "desc") return <ChevronDown size={16} />;
    return null;
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-white shadow-sm", className)}>
      {searchable && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    typeof column.accessor === "string" && "cursor-pointer select-none",
                    column.className
                  )}
                  onClick={() => {
                    if (typeof column.accessor === "string") {
                      requestSort(column.accessor as keyof T);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {typeof column.accessor === "string" && getSortIcon(column.accessor as keyof T)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="transition-colors hover:bg-muted/30 animate-fade-in"
                  style={{ animationDelay: `${rowIndex * 50}ms` }}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn("px-6 py-4 text-sm", column.className)}
                    >
                      {typeof column.accessor === "function"
                        ? column.accessor(row)
                        : row[column.accessor as keyof T] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
