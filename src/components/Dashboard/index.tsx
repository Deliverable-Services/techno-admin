
import { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { AiFillCar } from 'react-icons/ai'

interface Props {

}


const Dashboard = (props: Props) => {
    const [chartOneSelect, setChartOneSelect] = useState<string>("1")
    const [chartTwoSelect, setChartTwoSelect] = useState<string>("")

    console.log(chartOneSelect)

    const handleChartOneChange = (e: any) => setChartOneSelect(e.target.value)
    const handleChartTwoChange = (e: any) => setChartTwoSelect(e.target.value)
    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">
                <Container className="d-flex justify-content-between py-2">
                    <h2 className="text-primary font-weight-bold">Dashboard</h2>

                </Container>


                <Container fluid className="d-flex">
                    <div className="head-row">

                        {
                            Array.from({ length: 4 }).map(id => (
                                <div className="card p-2 bg-secondary panel panel-red text-light">
                                    <div className="d-flex display-4 justify-content-between align-items-ceter">
                                        <AiFillCar />
                                        <p className="lead display-4">12</p>
                                    </div>
                                    <h4 className="ml-auto">
                                        Card Title
                                        </h4>


                                </div>
                            ))
                        }
                    </div>
                </Container>
                <Container className="d-flex justify-content-between py-2 my-1">
                    <h2 className="text-primary font-weight-bold">Analytics</h2>

                </Container>
                <Container fluid>
                    <div className="charts-row">

                        <div className="card bg-light-secondary">
                            <div className="chart-setting p-1 d-flex justify-content-between">
                                <strong >
                                    Chart Title
                                </strong>
                                <div>
                                    <Form.Control as="select" custom onChange={handleChartOneChange} className="bg-transparent">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>

                                    </Form.Control>
                                </div>

                            </div>
                            <div className=" chart-container">
                                Chart goes here
                            </div>
                        </div>
                        <div className="card bg-light-secondary">
                            <div className="chart-setting p-1 d-flex justify-content-between">
                                <strong>
                                    Chart Title
                                </strong>
                                <div>
                                    <Form.Control as="select" custom onChange={handleChartTwoChange} className="bg-transparent">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>

                                    </Form.Control>
                                </div>
                            </div>
                            <div className=" chart-container">
                                Chart goes here
                            </div>
                        </div>
                        <div className="card bg-light-secondary">
                            <div className="chart-setting p-1 d-flex justify-content-between">
                                <strong>
                                    Chart Title
                                </strong>
                                <div>
                                    <Form.Control as="select" custom onChange={handleChartTwoChange} className="bg-transparent">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>

                                    </Form.Control>
                                </div>
                            </div>
                            <div className=" chart-container">
                                Chart goes here
                            </div>
                        </div>
                        <div className="card bg-light-secondary">
                            <div className="chart-setting p-1 d-flex justify-content-between">
                                <strong>
                                    Chart Title
                                </strong>
                                <div>
                                    <Form.Control as="select" custom onChange={handleChartTwoChange} className="bg-transparent">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                        <option value="3">Option 3</option>

                                    </Form.Control>
                                </div>
                            </div>
                            <div className=" chart-container">
                                Chart goes here
                            </div>
                        </div>

                    </div>
                </Container>
            </Container>
        </>

    )
}

export default Dashboard
