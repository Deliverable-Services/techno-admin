import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { BiArrowFromRight } from 'react-icons/bi'
import { useHistory } from 'react-router-dom'
interface Props {
    title: string
}
const BackButton: React.FC<Props> = ({ title }) => {
    const history = useHistory()
    const _onBackClick = () => history.goBack()
    return (
        <Container fluid className="d-flex justify-content-between py-2">
            <h2 className="font-weight-bold">{title}</h2>
            <Button variant="primary" onClick={_onBackClick}>
                <div className="text-white">
                    <BiArrowFromRight size={25} /> <b>Back</b>
                </div>
            </Button>
        </Container>
    )
}

export default BackButton
