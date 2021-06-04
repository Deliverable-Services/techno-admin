
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import API from "../../utils/API";
import { isActiveArray, userRoles } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import AddressCard from "./AddressCard";

const key = "users";

// const createUpdateUser = ({
//     formdata,
//     id,
// }: {
//     formdata: FormData;
//     id: string;
// }) => {
//     if (!id) {
//         return API.post(`${key}`, formdata, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//     }

//     return API.post(`${key}/${id}`, formdata, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
// };

const UserAddress = () => {
    const { state } = useLocation()
    const id = state ? (state as any).id : null
    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
    // const { mutate, isLoading, error, status } = useMutation(createUpdateUser, {
    //     onSuccess: () => {
    //         setTimeout(() => queryClient.invalidateQueries(key), 500);
    //     },
    // });

    const apiData = data && (data as any);

    if (dataLoading) return null;



    return (
        <Row className="rounded mt-3">
            <PageHeading title="User Addresses" />
            {
                apiData && apiData.addresses && apiData.addresses.length > 0 ?

                    apiData.addresses.map((address: any) => (
                        <>
                            <Col md={6}>
                                <AddressCard address={address} />
                            </Col>
                        </>
                    ))

                    :
                    <h1>No User address found</h1>

            }
        </Row>
    );
};

export default UserAddress;

