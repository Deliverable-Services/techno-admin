import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { AiFillPlusSquare } from 'react-icons/ai'
interface Props {
    title: string,
    onClick?: () => void
}
const PageHeading: React.FC<Props> = ({ title, onClick }) => {
    return (
        <Container fluid className="d-flex justify-content-between py-2">
            <h2 className="font-weight-bold">{title}</h2>
            {
                onClick &&
                <Button variant="primary" onClick={onClick}>
                    <div className="text-white">
                        <AiFillPlusSquare size={25} /> <b>Create</b>
                    </div>
                </Button>
            }
        </Container>
    )
}

export default PageHeading


