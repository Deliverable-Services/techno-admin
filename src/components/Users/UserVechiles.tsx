
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import PageHeading from "../../shared-components/PageHeading";
import VehicleCard from "./VehicleCard";

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

const UserVehicles = () => {
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
        <Row className="rounded mt-3"
        // style={{ borderTop: "1px solid rgba(0,0,0,.25" }}
        >
            <PageHeading title="User Vehicles" />

            {
                apiData && apiData.vehicles && apiData.vehicles.length > 0 ?

                    apiData.vehicles.map((vehicle: any) => (
                        <>
                            <Col md={6}>
                                <VehicleCard vehicle={vehicle} />
                            </Col>
                        </>
                    ))

                    :
                    <h1>No User address found</h1>

            }

        </Row>
    );
};

export default UserVehicles;

