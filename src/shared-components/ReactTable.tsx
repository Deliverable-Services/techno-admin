import React, { ReactElement, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Container, Dropdown, Table } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AiOutlineSearch } from "react-icons/ai";
import { MdFilterList, MdRefresh } from "react-icons/md";
import { FaDatabase, FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { BsLayoutTextSidebar } from "react-icons/bs";
// import Checkbox from 'react-checkbox-component'
import {
  TableState,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { primaryColor } from "../utils/constants";
import { useContext } from "react";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useUserProfileStore from "../hooks/useUserProfileStore";

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
  // const onChange = useAsyncDebounce((value) => {
  // setGlobalFilter(value || undefined);
  // }, 200);

  return (
    <input
      value={value || ""}
      onChange={(e) => {
        onSearchChange("q", e.target.value);
        setValue(e.target.value);
        // onChange(e.target.value);
      }}
      placeholder={placeholder ? placeholder : `Search ${count} records...`}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    />
  );
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef<HTMLDivElement>(null);
    const resolvedRef = defaultRef || ref;

    // React.useEffect(() => {
    //   resolvedRef.current.indeterminate = indeterminate
    // }, [resolvedRef, indeterminate])

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          name="row-check"
          id="row-check"
        />
      </>
    );
  }
);

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
    <div className="">
      <div
        className="d-flex justify-space-between align-items-center position-relative view-padding view-heading bg-grey-primary"
        style={{
          flexDirection: isDesktop ? "row" : "column-reverse",
          marginBottom: "0 !important",
        }}
      >
        {tabs && tabs}
        <div
          className={`d-flex align-items-center ${
            isDesktop ? "ml-auto" : "ml-unset"
          }`}
        >
          <div
            className="w-100"
            style={{ minWidth: isDesktop ? 300 : "auto", marginRight: 8 }}
          >
            {showSearch && (
              <div
                className="search-input global-card"
                style={{ paddingInline: "10px" }}
              >
                <AiOutlineSearch size={22} />
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
          </div>
          {filters && filters}
          <div className="search-filters-div">
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="filter-button m-0 p-0 manage-column d-flex align-items-center bg-transparent border-0 text-primary"
              >
                <BsLayoutTextSidebar className="mr-2" /> Columns
              </Dropdown.Toggle>

              <Dropdown.Menu className="p-2 menu-dropdown">
                {allColumns.map((column) => {
                  column.disableGlobalFilter = !column.isVisible;
                  return (
                    <div
                      key={column.id}
                      className="custom-control custom-checkbox w-100 px-2 dropdown-item"
                    >
                      <input
                        type="checkbox"
                        {...column.getToggleHiddenProps()}
                        className="d-none"
                        id={column.id}
                      />

                      <div className="custom-control custom-checkbox ">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={column.id}
                          {...column.getToggleHiddenProps()}
                        />

                        <label
                          className="custom-control-label"
                          htmlFor={column.id}
                        >
                          <p style={{ whiteSpace: "nowrap" }}>
                            {column.Header}
                          </p>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/*-------------------- table---------------------  */}
      <div className="">
        <DndProvider backend={HTML5Backend}>
          <div className="tableFixed position-relative">
            <Table
              className="table-fixed mb-0"
              style={{ borderTop: "1px solid var(--border)" }}
              {...getTableProps()}
              responsive
              hover
              size="sm"
            >
              <thead className="bg-grey-primary">
                {isDataLoading ? (
                  <tr>
                    <td
                      colSpan={
                        headerGroups[0]?.headers?.length || columns.length
                      }
                      className="text-center p-4"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        position: "relative",
                      }}
                    >
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <div
                          style={{
                            width: "200px",
                            height: "2px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "1px",
                            overflow: "hidden",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: `linear-gradient(90deg, ${primaryColor}40, ${primaryColor}, ${primaryColor}40)`,
                              animation:
                                "loading-bar 1.5s ease-in-out infinite",
                            }}
                          />
                        </div>

                        <div className="d-flex align-items-center justify-content-center">
                          <div
                            className="d-flex align-items-center justify-content-center mr-2"
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              border: `2px solid ${primaryColor}20`,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            <FaDatabase size={12} color={primaryColor} />
                          </div>

                          <div className="d-flex align-items-center">
                            <span
                              className="text-muted font-weight-500"
                              style={{ fontSize: "15px" }}
                            >
                              Refreshing table data...
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => {
                          // Apply the header cell props
                          return (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {
                                // Render the header
                                column.render("Header")
                              }
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <IoMdArrowDropup />
                                  ) : (
                                    <IoMdArrowDropdown />
                                  )
                                ) : (
                                  ""
                                )}
                              </span>
                            </th>
                          );
                        })
                      }
                    </tr>
                  ))
                }
              </thead>
              {/* Apply the table body props */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="table-body">
                  {(provided, snapshot) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {rows.map((row, i) => {
                        prepareRow(row);

                        if (isDraggable)
                          return (
                            <Draggable
                              draggableId={row.id}
                              key={row.id}
                              index={i}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <DnDRow
                                    provided={provided}
                                    row={row}
                                    snapshot={snapshot}
                                  />
                                );
                              }}
                            </Draggable>
                          );
                        else return <Row row={row} />;
                      })}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
              {/* {rows.length === 0 ?
<Container fluid className="d-flex justify-content-center w-100 align-item-center">
<span className="text-primary display-3">No data found</span>
</Container>
: ""} */}
            </Table>
            {/* {rows.length === 0 ? (
              ""
            ) : showRecords ? (
              <div
                className="d-flex gap-3 align-items-center justify-content-center"
                style={{ position: "absolute", left: 10, bottom: "-40px" }}
              >
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  Records{" "}
                </span>
                <select
                  className="text-primary font-weight-bold"
                  style={{
                    border: "none",
                    marginRight: 5,
                  }}
                  value={pageSize}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPageSize(parseInt(value));
                    onFilterChange("perPage", value);
                  }}
                >
                  {RowsPerPage.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null} */}
          </div>
        </DndProvider>
        {rows.length === 0 ? (
          <Container
            fluid
            className="d-flex justify-content-center"
            style={{ marginTop: "60px", marginBottom: "60px" }}
          >
            <div
              className="d-flex flex-column align-items-center text-center"
              style={{ maxWidth: "450px" }}
            >
              <div className="position-relative mb-4">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "50%",
                    border: `3px solid ${primaryColor}20`,
                  }}
                >
                  <FaDatabase size={40} color={primaryColor} />
                </div>
                <div
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#6c757d",
                    borderRadius: "50%",
                    bottom: "-2px",
                    right: "-2px",
                    border: "2px solid white",
                  }}
                >
                  <FaSearch size={14} color="white" />
                </div>
              </div>

              <h4
                className="mb-3"
                style={{
                  fontWeight: "600",
                  color: "#2c3e50",
                  fontSize: "20px",
                }}
              >
                No data found
              </h4>

              <p
                className="text-muted mb-4"
                style={{
                  fontSize: "15px",
                  lineHeight: "1.5",
                  maxWidth: "380px",
                }}
              >
                {state.globalFilter
                  ? "No results match your current search criteria. Try adjusting your filters or search terms."
                  : "There are no records to display at the moment. Data will appear here once it's added to the system."}
              </p>

              {state.globalFilter ? (
                <div
                  className="d-flex flex-column align-items-center mb-3"
                  style={{ fontSize: "13px" }}
                >
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <MdRefresh
                      size={14}
                      color={primaryColor}
                      className="mr-2"
                    />
                    <span>Clear search and filters</span>
                  </div>
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <FaSearch size={12} color={primaryColor} className="mr-2" />
                    <span>Try different search terms</span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <MdFilterList
                      size={14}
                      color={primaryColor}
                      className="mr-2"
                    />
                    <span>Adjust filter criteria</span>
                  </div>
                </div>
              ) : null}

              <div className="mt-2">
                <small className="text-muted" style={{ opacity: 0.8 }}>
                  {state.globalFilter
                    ? `Searching for "${state.globalFilter}"`
                    : `Need help? Contact support`}
                </small>
              </div>
            </div>
          </Container>
        ) : null}
      </div>
      {/* pagination  */}
    </div>
  );
}

const DnDRow = ({ provided, row, snapshot }: any) => (
  <tr
    ref={provided.innerRef}
    {...row.getRowProps()}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    style={{
      ...provided.draggableProps.style,
      opacity: snapshot.isDragging ? ".5" : "1",
    }}
  >
    {row.cells.map((cell) => (
      <td {...cell.getCellProps()} style={{ verticalAlign: "middle" }}>
        {cell.render("Cell", {
          dragHandleProps: provided.dragHandleProps,
          isSomethingDragging: snapshot.isDragging,
        })}
      </td>
    ))}
  </tr>
);
const Row = ({ row }: any) => (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell) => {
      return (
        <td {...cell.getCellProps()} style={{ verticalAlign: "middle" }}>
          {cell.value ||
          cell.column.id === "selection" ||
          cell.column.id === "Actions" ? (
            cell.render("Cell")
          ) : (
            <span className="text-muted">NA</span>
          )}
        </td>
      );
    })}
  </tr>
);

export default ReactTable;
