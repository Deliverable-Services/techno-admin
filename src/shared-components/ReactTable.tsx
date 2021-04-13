import React, { ReactElement } from 'react'
import { Container, Dropdown, Pagination, Table } from 'react-bootstrap'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiSad } from 'react-icons/bi'
import { GoSettings } from 'react-icons/go'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { useAsyncDebounce, useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table'
import { primaryColor } from '../utils/constants'

interface Props {
    data: any,
    columns: Array<any>,


}
interface ISearchInput {
    preGlobalFilteredRows: any;
    globalFilter: any;
    setGlobalFilter: any;
}

function SearchInput({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}: ISearchInput) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (

        <input
            value={value || ""}
            onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
            placeholder={`Search ${count} records...`}
        />

    )
}

function ReactTable({ data, columns }: Props): ReactElement {



    const {

        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        state,
        preGlobalFilteredRows,
        setGlobalFilter

    } = useTable({ columns, data }, useFilters, useGlobalFilter, useSortBy,)




    return (

        <Container fluid className="px-0">

            {/* search and column hiding */}

            <Container fluid className=" bg-light-secondary d-flex align-items-center py-2 position-relative">
                <div className="w-100">
                    <div className="search-input">
                        <AiOutlineSearch size={24} />
                        <SearchInput
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </div></div>

                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="filter-button bg-transparent border-0 text-primary">


                        <GoSettings size={24} color={primaryColor} />

                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-2">
                        {
                            allColumns.map((column) => {

                                column.disableGlobalFilter = !column.isVisible

                                return (
                                    <div key={column.id} className="custom-control custom-checkbox">

                                        <input type="checkbox" {...column.getToggleHiddenProps()} className="d-none" id={column.id}
                                        />

                                        <div className="custom-control custom-checkbox ">
                                            <input type="checkbox" className="custom-control-input" id={column.id} {...column.getToggleHiddenProps()}
                                            />

                                            <label className="custom-control-label" htmlFor={column.id}><p>{column.Header}</p></label>
                                        </div>


                                    </div>
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>

            </Container>
            <Container fluid className="mt-4    ">
                {/*-------------------- table---------------------  */}
                <div className="tableFixed">

                    <Table className="table-fixed" {...getTableProps()} responsive striped bordered hover size="sm">
                        <thead className="bg-light-primary">
                            {// Loop over the header rows
                                headerGroups.map(headerGroup => (
                                    // Apply the header row props
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {// Loop over the headers in each row
                                            headerGroup.headers.map((column) => (
                                                // Apply the header cell props
                                                <th {...column.getHeaderProps((column).getSortByToggleProps())}>
                                                    {// Render the header
                                                        column.render('Header')}
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? <IoMdArrowDropup />
                                                                : <IoMdArrowDropdown />
                                                            : ''}
                                                    </span>

                                                </th>
                                            ))}
                                    </tr>
                                ))}
                        </thead>
                        {/* Apply the table body props */}
                        <tbody {...getTableBodyProps()}>
                            {// Loop over the table rows
                                rows.map(row => {
                                    // Prepare the row for display
                                    prepareRow(row)
                                    // console.log("row", rows.length)
                                    // if (!rows.length) return <h1>No data</h1>
                                    return (
                                        // Apply the row props
                                        <tr {...row.getRowProps()}>
                                            {// Loop over the rows cells
                                                row.cells.map(cell => {
                                                    // Apply the cell props
                                                    return (
                                                        <td {...cell.getCellProps()}>
                                                            {// Render the cell contents
                                                                cell.render('Cell')}
                                                        </td>
                                                    )
                                                })}
                                        </tr>
                                    )
                                })}
                            {/* {rows.length === 0 ?
                                <Container fluid className="d-flex justify-content-center w-100 align-item-center">
                                    <span className="text-primary display-3">No data found</span>
                                </Container>
                                : ""} */}
                        </tbody>

                    </Table>

                </div>

                {/* pagination  */}

                {
                    rows.length === 0 ?
                        <Container fluid className="d-flex justify-content-center display-3">
                            <div className="d-flex flex-column align-items-center">

                                <BiSad color={primaryColor} />
                                <span className="text-primary display-3">No data found</span>
                            </div>
                        </Container>
                        :
                        <Container fluid className="d-flex justify-content-end">
                            <Pagination>
                                <Pagination.First />
                                <Pagination.Prev />
                                <Pagination.Item active ><span className="text-secondary">1</span></Pagination.Item>
                                <Pagination.Next />
                                <Pagination.Last />
                            </Pagination>
                        </Container>
                }

            </Container>
        </Container>
    )
}

export default ReactTable
