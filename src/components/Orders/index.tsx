import { useMemo, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Cell } from 'react-table';
import ReactTable from '../../shared-components/ReactTable';
import { mockData } from '../../utils/mockData';

interface Props {

}

// const isActiveTab = (id: string, key: string): { variant: string, color: string } => {
//     if (id === key)
//         return {
//             variant: "primary",
//             color: "text-secondary"
//         }
//     else
//         return {
//             variant: "light",
//             color: "text-primary"
//         }
// }
const isActiveTab = (id: string, key: string): string => {
    const classname = "tab-link"
    if (id === key)
        return `${classname} isActive`
    else
        return classname
}

const Orders = (props: Props) => {
    const columns = useMemo(
        () => [
            {
                Header: '#Id',
                accessor: 'id',  //accessor is the "key" in the data
            },
            {
                Header: 'Image',
                accessor: 'imageScr',
                Cell: (data: Cell) =>
                    <div className="table-image">
                        <img src={data.row.values.imageScr} alt="name" />
                    </div>


            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'User',
                accessor: 'created_by',
            },
            {
                Header: 'Actions',
                Cell: () => (
                    <Button>Action</Button>
                )
            }
        ],
        []
    )

    const [key, setKey] = useState<string>("1")

    const displayTab = (key: string) => {
        switch (key) {
            case "1":
                return <ReactTable data={mockData} columns={columns} />
            case "2":
                return <ReactTable data={mockData} columns={columns} />
            case "3":
                return <ReactTable data={mockData} columns={columns} />
            case "4":
                return <ReactTable data={mockData} columns={columns} />

            default:
                return <ReactTable data={mockData} columns={columns} />
        }
    }
    return (
        <Container fluid className="px-0 py-2">
            <Container className="d-flex justify-content-between py-2">
                <h2 className="text-primary font-weight-bold">Orders</h2>

            </Container>
            <Container fluid>
                <div className="tab-btn-row">
                    {/* <Button variant={isActiveTab("1", key).variant} className={`${isActiveTab("1", key).color}`}
                        onClick={() => setKey("1")}
                    >All</Button>
                    <Button variant={isActiveTab("2", key).variant} className={`${isActiveTab("2", key).color} `}
                        onClick={() => setKey("2")}
                    >Ongoing</Button>
                    <Button variant={isActiveTab("3", key).variant} className={`${isActiveTab("3", key).color} `}
                        onClick={() => setKey("3")}
                    >Cancelled</Button>
                    <Button variant={isActiveTab("4", key).variant} className={`${isActiveTab("4", key).color} `}
                        onClick={() => setKey("4")}
                    >Completed</Button> */}

                    <Button variant="light" className={`${isActiveTab("1", key)}`}
                        onClick={() => setKey("1")}
                    >All</Button>

                    <Button variant="light" className={`${isActiveTab("2", key)} `}
                        onClick={() => setKey("2")}
                    >Ongoing</Button>
                    <Button variant="light" className={`${isActiveTab("3", key)} `}
                        onClick={() => setKey("3")}
                    >Cancelled</Button>
                    <Button variant="light" className={`${isActiveTab("4", key)} `}
                        onClick={() => setKey("4")}
                    >Completed</Button>

                </div>
            </Container>
            <div className="mt-3 p-0">
                {
                    // displaying the tabs here
                    displayTab(key)
                }

            </div>




        </Container>
    )
}

export default Orders
