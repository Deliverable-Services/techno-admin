import React, { ReactElement, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  TableState,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { useContext } from "react";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Select } from "../components/ui/select";
import {
  Search,
  Filter,
  Settings,
  ChevronUp,
  ChevronDown,
  Loader2,
  SearchX,
  Table,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { cn } from "../lib/utils";
interface Props {
  data: any;
  filters?: any;
  tabs?: any;
  columns: Array<any>;
  updateOrder?: any;
  initialState?: Partial<TableState<object>>;
  isDraggable?: boolean;
  setSelectedRows?: React.Dispatch<React.SetStateAction<any[]>>;
  filter?: any;
  onFilterChange?: (idx: string, value: any) => void;
  isDataLoading?: boolean;
  setSelectedRowIds?: any;
  isSelectable?: boolean;
  searchPlaceHolder?: string;
  deletePermissionReq?: string;
  showSearch?: boolean;
  showRecords?: boolean;
}
interface ISearchInput {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
  searchValue: string;
  onSearchChange: any;
  placeholder?: string;
  disabled?: boolean;
}

function SearchInput({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  searchValue,
  onSearchChange,
  placeholder,
  disabled,
}: ISearchInput) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(searchValue);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value || ""}
        onChange={(e) => {
          onSearchChange("q", e.target.value);
          setValue(e.target.value);
        }}
        placeholder={placeholder ? placeholder : `Search ${count} records...`}
        disabled={disabled}
        className="pl-10 pr-4"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => {
            onSearchChange("q", "");
            setValue("");
          }}
        >
          <SearchX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>
>(({ indeterminate, ...rest }, ref) => {
  return <Checkbox ref={ref} indeterminate={indeterminate} {...rest} />;
});

function ReactTable({
  data,
  filters,
  tabs,
  columns,
  updateOrder,
  initialState,
  isDraggable = false,
  setSelectedRows,
  filter,
  onFilterChange,
  isDataLoading,
  // setSelectedRowIds,
  isSelectable = true,
  searchPlaceHolder,
  deletePermissionReq = "",
  showSearch = true,
  showRecords = true,
}: Props): ReactElement {
  const isRestricted = useUserProfileStore((state) => state.isRestricted);
  const [records, setRecords] = React.useState(data);
  const [rowIds, setSelectedRowIds] = React.useState<Record<any, any> | null>(
    null
  );
  const [showSearchField, setShowSearchField] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [pageWiseRows, setPageWiseRows] = React.useState<Record<
    any,
    any
  > | null>(null);

  const formtatedSelectedRows = useMemo(() => {
    const temp = { ...pageWiseRows };
    let data = [];
    Object.values(temp).forEach((d) => {
      data = [...data, ...d];
    });
    return data;
  }, [pageWiseRows]);

  const reorderData = (startIndex: any, endIndex: any) => {
    const newData = [...records];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setRecords(newData);
  };

  const isDesktop = useContext(IsDesktopContext);

  React.useEffect(() => setRecords(data), [data]);

  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    allColumns,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows,
    setPageSize,
    state: { selectedRowIds, pageSize },
  } = useTable(
    {
      columns,
      data: records,
      initialState: {
        ...initialState,
        pageSize: filter.perPage,
        hiddenColumns: ["id"],
        selectedRowIds: rowIds ? rowIds[filter?.page ?? 1] : [],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    getRowId,
    (hooks) => {
      !isRestricted(deletePermissionReq) &&
        isSelectable &&
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",

            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
    }
  );
  React.useEffect(() => {
    function filterRows() {
      let data = [];
      selectedFlatRows.map((d) => {
        data.push(d.original);
      });

      return data;
    }
    // setting row indexes based on current page
    setSelectedRowIds((prev) => ({
      ...prev,
      [filter?.page ?? 1]: selectedRowIds,
    }));

    // setting row list  based on current page
    setPageWiseRows((prev) => ({
      ...prev,
      [filter?.page ?? 1]: filterRows(),
    }));
  }, [selectedRowIds]);

  React.useEffect(() => {
    if (setSelectedRows) setSelectedRows(formtatedSelectedRows);
  }, [formtatedSelectedRows, setSelectedRows]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderData(source.index, destination.index);

    const row = records[result.draggableId];

    if (updateOrder) updateOrder(row.id, destination.index, row);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Header Section */}
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b bg-muted/30",
            isDesktop ? "flex-row" : "flex-col-reverse gap-4"
          )}
        >
          <div className="flex items-center gap-4">
            {tabs && <div className="flex items-center gap-2">{tabs}</div>}

            {/* Selected Rows Indicator */}
            {formtatedSelectedRows.length > 0 && (
              <Badge
                variant="default"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                <span className="font-medium">
                  {formtatedSelectedRows.length} selected
                </span>
              </Badge>
            )}
          </div>

          <div
            className={cn(
              "flex items-center gap-3",
              isDesktop ? "ml-auto" : "w-full"
            )}
          >
            {/* Search Input */}
            {showSearch && (
              <div
                className={cn(
                  "flex-1",
                  isDesktop ? "min-w-[300px] max-w-[400px]" : "w-full"
                )}
              >
                <SearchInput
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  searchValue={filter?.query}
                  onSearchChange={onFilterChange}
                  placeholder={searchPlaceHolder}
                  disabled={formtatedSelectedRows.length > 0}
                />
              </div>
            )}

            {/* External Filters */}
            {filters && (
              <div className="flex items-center gap-2">{filters}</div>
            )}

            {/* Column Visibility Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Settings className="h-4 w-4 mr-2" />
                  View
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <div className="p-2">
                  <h4 className="font-medium text-sm mb-2 px-2">
                    Toggle Columns
                  </h4>
                  {allColumns.map((column) => {
                    column.disableGlobalFilter = !column.isVisible;
                    return (
                      <div
                        key={column.id}
                        className="flex items-center space-x-2 px-2 py-1.5 rounded-sm hover:bg-accent"
                      >
                        <Checkbox
                          {...column.getToggleHiddenProps()}
                          id={`column-${column.id}`}
                        />
                        <label
                          htmlFor={`column-${column.id}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {String(column.Header)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Section */}
        <div className="relative overflow-hidden">
          <DndProvider backend={HTML5Backend}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" {...getTableProps()}>
                <thead className="bg-muted/50 border-b">
                  {/* Loading State */}
                  {isDataLoading ? (
                    <tr>
                      <td
                        colSpan={
                          headerGroups[0]?.headers?.length || columns.length
                        }
                        className="text-center p-8 bg-muted/30 border-0"
                      >
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-medium text-foreground">
                                Loading data...
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Please wait while we fetch the latest
                                information
                              </span>
                            </div>
                          </div>

                          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 animate-pulse" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className={cn(
                            "px-4 py-3 text-left text-sm font-medium text-muted-foreground tracking-wide",
                            "hover:bg-muted/80 transition-colors cursor-pointer select-none",
                            "border-r border-border/50 last:border-r-0"
                          )}
                        >
                          <div className="flex items-center justify-between group">
                            <span className="flex items-center gap-2">
                              {column.render("Header")}
                            </span>
                            <div className="flex items-center">
                              {column.canSort && (
                                <div className="ml-1 flex flex-col">
                                  {column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <ChevronDown className="h-4 w-4 text-primary" />
                                    ) : (
                                      <ChevronUp className="h-4 w-4 text-primary" />
                                    )
                                  ) : (
                                    <div className="flex flex-col opacity-50 group-hover:opacity-100 transition-opacity">
                                      <ChevronUp className="h-3 w-3 -mb-1" />
                                      <ChevronDown className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="table-body">
                    {(provided, snapshot) => (
                      <tbody
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="divide-y divide-border"
                      >
                        {rows.map((row, i) => {
                          prepareRow(row);

                          if (isDraggable)
                            return (
                              <Draggable
                                draggableId={row.id}
                                key={row.id}
                                index={i}
                              >
                                {(provided, snapshot) => (
                                  <DnDRow
                                    provided={provided}
                                    row={row}
                                    snapshot={snapshot}
                                  />
                                )}
                              </Draggable>
                            );
                          else return <Row key={row.id} row={row} />;
                        })}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </DragDropContext>
              </table>
            </div>
          </DndProvider>
          {/* Empty State */}
          {rows.length === 0 && !isDataLoading ? (
            <div className="flex justify-center items-center py-16 px-4">
              <div className="text-center max-w-md">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center border-4 border-muted/30">
                    <Table className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-muted rounded-full flex items-center justify-center border-2 border-background">
                    <SearchX className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No data found
                </h3>

                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {state.globalFilter
                    ? "No results match your current search criteria. Try adjusting your filters or search terms."
                    : "There are no records to display at the moment. Data will appear here once it's added to the system."}
                </p>

                {state.globalFilter && (
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <Search className="h-3 w-3 mr-2" />
                      <span>Clear search and try again</span>
                    </div>
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <Filter className="h-3 w-3 mr-2" />
                      <span>Adjust your filter criteria</span>
                    </div>
                  </div>
                )}

                {state.globalFilter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGlobalFilter("");
                      onFilterChange("q", "");
                    }}
                    className="mx-auto"
                  >
                    <SearchX className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                )}

                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs">
                    {state.globalFilter
                      ? `Searching for "${state.globalFilter}"`
                      : "Ready for data"}
                  </Badge>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer - Row Count */}
          {rows.length > 0 && (
            <div className="flex items-center justify-between p-3 border-t bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {rows.length} {rows.length === 1 ? "row" : "rows"}
                </Badge>
                {formtatedSelectedRows.length > 0 && (
                  <span className="text-xs">
                    · {formtatedSelectedRows.length} selected
                  </span>
                )}
              </div>

              {showRecords && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Rows per page:</span>
                  <select
                    value={pageSize.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPageSize(parseInt(value));
                      onFilterChange("perPage", value);
                    }}
                    className="h-8 w-20 text-xs border border-border rounded-md px-2"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const DnDRow = ({ provided, row, snapshot }: any) => (
  <tr
    ref={provided.innerRef}
    {...row.getRowProps()}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className={cn(
      "hover:bg-muted/50 transition-colors",
      snapshot.isDragging && "opacity-50 bg-muted/80 shadow-lg"
    )}
    style={provided.draggableProps.style}
  >
    {row.cells.map((cell: any) => (
      <td
        key={cell.column.id}
        {...cell.getCellProps()}
        className="px-4 py-3 text-sm text-foreground border-r border-border/50 last:border-r-0"
      >
        {cell.render("Cell", {
          dragHandleProps: provided.dragHandleProps,
          isSomethingDragging: snapshot.isDragging,
        })}
      </td>
    ))}
  </tr>
);

const Row = ({ row }: any) => (
  <tr
    {...row.getRowProps()}
    className="hover:bg-muted/50 transition-colors group"
  >
    {row.cells.map((cell: any) => (
      <td
        key={cell.column.id}
        {...cell.getCellProps()}
        className="px-4 py-3 text-sm text-foreground border-r border-border/50 last:border-r-0"
      >
        {cell.value ||
        cell.column.id === "selection" ||
        cell.column.id === "Actions" ? (
          cell.render("Cell")
        ) : (
          <Badge variant="secondary" className="text-xs">
            N/A
          </Badge>
        )}
      </td>
    ))}
  </tr>
);

export default ReactTable;
