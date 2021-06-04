import React, { ReactElement } from "react";
import { Container, Dropdown, Table } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { GoSettings } from "react-icons/go";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import Checkbox from '@material-ui/core/Checkbox';

import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useTable,
  useRowSelect,
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
  } = useTable({ columns, data }, useFilters, useGlobalFilter, useSortBy, useRowSelect, getRowId,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
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


  const moveRow = (dragIndex: any, hoverIndex: any) => {
    const dragRecord = records[dragIndex]
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    )
  }

  { console.log("flatRow", selectedFlatRows) }
  const DND_ITEM_TYPE: any = 'row'
  const Row = ({ row, index, moveRow }: any) => {
    const dropRef = React.useRef<HTMLDivElement>(null)
    const dragRef = React.useRef<HTMLDivElement>(null)

    const [, drop] = useDrop({
      accept: DND_ITEM_TYPE,
      hover(item: any, monitor: any) {
        if (!dropRef.current) {
          return
        }
        const dragIndex = item.index
        const hoverIndex = index
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }
        // Determine rectangle on screen
        const hoverBoundingRect = dropRef.current.getBoundingClientRect()
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }
        // Time to actually perform the action
        moveRow(dragIndex, hoverIndex)
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
      },
    })

    // const [{ isDragging }, drag, preview] = useDrag({
    //   item: { type: DND_ITEM_TYPE, index },
    //   // collect: (monitor: any) => ({
    //   //   isDragging: monitor.isDragging(),
    //   // }),
    // })

    // const opacity = isDragging ? 0 : 1

    // preview(drop(dropRef))
    // drag(dragRef)

    return (
      <tr ref={"dropRef"} style={{}}>
        <td ref={"dragRef"}>move</td>
        {row.cells.map((cell: any) => {
          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
        })}
      </tr>
    )
  }


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
            <tbody {...getTableBodyProps()}>
              {
                // Loop over the table rows
                rows.map((row, index) => {
                  // Prepare the row for display
                  prepareRow(row);
                  // console.log("row", rows.length)
                  // if (!rows.length) return <h1>No data</h1>
                  <Row
                    index={index}
                    row={row}
                    moveRow={moveRow}
                    {...row.getRowProps()}
                  />
                  return (
                    // Apply the row props
                    <tr {...row.getRowProps()}>
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          // Apply the cell props
                          return (
                            <td {...cell.getCellProps()}>
                              {
                                // Render the cell contents
                                cell.render("Cell")
                              }
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
              {/* {rows.length === 0 ?
                                <Container fluid className="d-flex justify-content-center w-100 align-item-center">
                                    <span className="text-primary display-3">No data found</span>
                                </Container>
                                : ""} */}
            </tbody>
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
