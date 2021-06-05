import Checkbox from '@material-ui/core/Checkbox';
import React, { ReactElement } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Container, Dropdown, Table } from "react-bootstrap";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AiOutlineSearch } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { GoSettings } from "react-icons/go";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter, useRowSelect, useSortBy,
  useTable
} from "react-table";
import { primaryColor } from "../utils/constants";


interface Props {
  data: any;
  columns: Array<any>;
}
interface ISearchInput {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}
interface dragInter {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}

function SearchInput({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: ISearchInput) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <input
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef<HTMLDivElement>(null)
    const resolvedRef = defaultRef || ref
    //console.log("mm", resolvedRef)
    // React.useEffect(() => {
    //   resolvedRef.current.indeterminate = indeterminate
    // }, [resolvedRef, indeterminate])

    return (
      <>
        <Checkbox
          defaultChecked
          color="primary"
          size="small"
          ref={resolvedRef} {...rest}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />

      </>
    )
  }
)

function ReactTable({ data, columns }: Props): ReactElement {

  const [records, setRecords] = React.useState(data)
  const updateMyData = (rowIndex: any, columnID: any, newValue: any) => {
    setRecords((oldData: any) =>
      oldData.map((row: any, index: any) => {
        if (index === rowIndex) {
          return {
            ...oldData[rowIndex],
            [columnID]: newValue
          };
        }
        return row;
      })
    );
  };

  const reorderData = (startIndex: any, endIndex: any) => {
    const newData = [...records];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setRecords(newData);
  };

  React.useEffect(() => setRecords(data), [data])

  const getRowId = React.useCallback(row => {
    return row.id
  }, [])


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable({ columns, data: records }, useFilters,
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    getRowId,
    hooks => {
      hooks.visibleColumns.push(columns => [

        {
          id: 'selection',
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
      ])
    });



  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    console.log({ result })
    if (!destination) return;
    reorderData(source.index, destination.index);
  };

  return (
    <div>
      <Container
        fluid
        className="card-header pb-3 d-flex align-items-center position-relative"
      >
        <div className="w-100">
          <div className="search-input">
            <AiOutlineSearch size={24} />
            <SearchInput
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        </div>

        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            className="filter-button bg-transparent border-0 text-primary"
          >
            <GoSettings size={24} color={primaryColor} />
          </Dropdown.Toggle>

          <Dropdown.Menu className="p-2">
            {allColumns.map((column) => {
              column.disableGlobalFilter = !column.isVisible;

              return (
                <div key={column.id} className="custom-control custom-checkbox">
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

                    <label className="custom-control-label" htmlFor={column.id}>
                      <p>{column.Header}</p>
                    </label>
                  </div>
                </div>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Container>

      {/*-------------------- table---------------------  */}
      <DndProvider backend={HTML5Backend} >
        <div className="tableFixed">

          <Table
            className="table-fixed"
            {...getTableProps()}
            responsive
            hover
            size="sm"
          >
            <thead className="bg-grey-primary">
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => (
                  // Apply the header row props
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column) => (
                        // Apply the header cell props
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
                      ))
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
                      return (
                        <Draggable
                          draggableId={row.id}
                          key={row.id}
                          index={i}
                        >
                          {(provided, snapshot) => {
                            return (
                              <tr
                                ref={provided.innerRef}
                                {...row.getRowProps()}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging
                                    ? ".5"
                                    : "1",
                                }}
                              >
                                {row.cells.map(cell => (
                                  <td {...cell.getCellProps()}>
                                    {cell.render("Cell", {
                                      dragHandleProps: provided.dragHandleProps,
                                      isSomethingDragging: snapshot.isDragging
                                    })
                                    }
                                  </td>
                                ))}
                              </tr>
                            );
                          }}
                        </Draggable>
                      );
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
          <div className="d-flex flex-column align-items-center">
            <BiSad color={primaryColor} />
            <span className="text-primary display-3">No data found</span>
          </div>
        </Container>
      ) : null}
    </div>
  );
}

export default ReactTable;
