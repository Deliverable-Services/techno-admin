import { AxiosResponse } from "axios";
import React, { ReactElement, useMemo } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Container, Dropdown, Spinner, Table } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AiOutlineSearch } from "react-icons/ai";
import { MdRemoveShoppingCart } from "react-icons/md";
import { GoSettings } from "react-icons/go";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
// import Checkbox from 'react-checkbox-component'
import { UseMutateAsyncFunction } from "react-query";
import {
  TableState,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { filterProps } from "recharts/types/util/types";
import { RowsPerPage } from "../utils/arrays";
import { primaryColor } from "../utils/constants";
import { ImCheckboxUnchecked } from "react-icons/im";
import { useContext } from "react";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useUserProfileStore from "../hooks/useUserProfileStore";

interface Props {
  data: any;
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
}: Props): ReactElement {
  const isRestricted = useUserProfileStore((state) => state.isRestricted);
  const [records, setRecords] = React.useState(data);
  const [rowIds, setSelectedRowIds] = React.useState<Record<any, any> | null>(
    null
  );

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
  console.log("selected flat rows", selectedFlatRows);
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
    <div>
      <Container
        fluid
        className="card-header pb-3 d-flex align-items-end position-relative px-0 align-items-end "
        style={{ flexDirection: isDesktop ? "row" : "column-reverse" }}
      >
        <div className="w-100">
          <div className="search-input">
            <AiOutlineSearch size={18} />
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
        </div>

        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-center">
            <span className="text-muted">Records </span>
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

          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className="filter-button bg-transparent border-0 text-primary"
            >
              <GoSettings size={17} color={primaryColor} />{" "}
              <span className="text-muted my-auto">Filter</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="p-2">
              {allColumns.map((column) => {
                column.disableGlobalFilter = !column.isVisible;
                return (
                  <div
                    key={column.id}
                    className="custom-control custom-checkbox w-100 px-2"
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
                        <p style={{ whiteSpace: "nowrap" }}>{column.Header}</p>
                      </label>
                    </div>
                  </div>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>

      {/*-------------------- table---------------------  */}
      <DndProvider backend={HTML5Backend}>
        <div className="tableFixed">
          <Table
            className="table-fixed"
            {...getTableProps()}
            responsive
            hover
            size="sm"
          >
            <thead className="bg-grey-primary">
              {isDataLoading ? (
                <tr>
                  <td className="text-muted font-weight-bold w-100">
                    Loading <Spinner size="sm" animation="border" />
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
        </div>
      </DndProvider>
      {/* pagination  */}

      {rows.length === 0 ? (
        <Container fluid className="d-flex justify-content-center display-3">
          <div className="d-flex flex-column align-items-center pt-3 pb-3">
            <MdRemoveShoppingCart color="#000" size={60} />
            <h4 className="text-black font-weight-bold mt-2">No data found</h4>
          </div>
        </Container>
      ) : null}
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
