import React, { useState } from 'react'
import { Container, Row, Col, Card, Dropdown } from 'react-bootstrap'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { QueryFunction, useQuery } from 'react-query';
import IsLoading from '../../shared-components/isLoading';
import API from '../../utils/API';
import { baseUploadUrl, secondaryColor } from '../../utils/constants'
import { types } from './AdvertisementTypes';

interface Props {
    setSelectedRowId: React.Dispatch<React.SetStateAction<string>>;
    setDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
    setStatusEdit: () => void;
}
const key = "banners/list"


const getBanners: QueryFunction = async ({ queryKey }) => {
    const r = await API.get(`${queryKey[0]}/${(queryKey[1] as string).toLowerCase()}`);

    return await r.data;
}

const LatestAd: React.FC<Props> = ({ setDeletePopup, setStatusEdit, setSelectedRowId }) => {

    const [selectedType, setSelectedType] = useState(types[0])

    const { data, isLoading, isFetching } = useQuery<any>([key, selectedType.id], getBanners)

    console.log(data)

    if (isLoading || isFetching)
        return <IsLoading />



    return (
        <>
            <Container fluid className=" bg-light-secondary d-flex align-items-center  py-2 position-relative">


                <Dropdown className="ml-auto">
                    <Dropdown.Toggle id="dropdown-basic" className="filter-button bg-transparent border-0 text-primary">
                        {
                            selectedType.name
                        }


                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-2">
                        {
                            types.map(type => (
                                <Dropdown.Item active={selectedType.id === type.id}
                                    onClick={() => setSelectedType(type)}
                                >{type.name}</Dropdown.Item>
                            ))
                        }
                    </Dropdown.Menu>
                </Dropdown>

            </Container>
            <Container fluid className="mt-3">

                <Row >
                    {
                        data.data.map((ad: any) => (

                            <Col md={6} className="mb-3">
                                <Card >
                                    <Card.Img variant="top" src={`${baseUploadUrl}banners/${ad.image}`} style={{ height: "12rem", objectFit: "cover" }} className="advertisement-image" />
                                    <Card.Body className="d-flex align-items-center justify-content-between">
                                        <Card.Title className="m-0">{ad.name}</Card.Title>
                                        <div className="advertisements-actions ">

                                            <button onClick={() => {
                                                setSelectedRowId(ad.id)
                                                setStatusEdit()
                                            }}>
                                                <AiFillEdit color={secondaryColor} size={24} />
                                            </button>
                                            <button className="ml-2" onClick={() => {
                                                setSelectedRowId(ad.id)
                                                setDeletePopup(true)
                                            }}>
                                                <AiFillDelete color="red" size={24} />
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </Container>
        </>
    )
}

export default LatestAd
