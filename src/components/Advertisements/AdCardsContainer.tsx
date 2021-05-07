import React, { useState } from 'react'
import { Container, Row, Col, Card, Dropdown } from 'react-bootstrap'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { BiSad } from 'react-icons/bi';
import { QueryFunction, useQuery } from 'react-query';
import IsLoading from '../../shared-components/isLoading';
import API from '../../utils/API';
import { baseUploadUrl, primaryColor, secondaryColor } from '../../utils/constants'
import { types } from './AdvertisementTypes';
import moment from 'moment';
import useCurrentAdTypeSelectedStore from './useCurrentAdTypeSelectedStore';

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
    const selectedType = useCurrentAdTypeSelectedStore(state => state.type)
    const setSelectedType = useCurrentAdTypeSelectedStore(state => state.setCurrentType)
    // const [selectedType, setSelectedType] = useState(types[0])

    const { data, isLoading, isFetching } = useQuery<any>([key, selectedType.id], getBanners)


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
                        data.data.length > 0 ?
                            data.data.map((ad: any) => (

                                <Col md={6} className="mb-3">
                                    <Card >
                                        <Card.Img variant="top" src={`${baseUploadUrl}banners/${ad.image}`} style={{ height: "12rem", }} className="advertisement-image" />
                                        <Card.Body className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <Card.Title className="m-0 text-primary">{ad.name}</Card.Title>
                                                <span className="text-muted">({moment(ad.valid_from).format("DD/MM/YY")}-{moment(ad.valid_to).format("DD/MM/YY")})</span>
                                            </div>
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
                            )) :
                            <Container fluid className="d-flex justify-content-center display-3">
                                <div className="d-flex flex-column align-items-center">

                                    <BiSad color={primaryColor} />
                                    <span className="text-primary display-3">No data found</span>
                                </div>
                            </Container>
                    }
                </Row>
            </Container>
        </>
    )
}

export default LatestAd
