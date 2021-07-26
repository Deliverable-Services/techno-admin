import { Col, Container, Row } from "react-bootstrap";
import { MdRemoveShoppingCart } from "react-icons/md";
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
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  // const { mutate, isLoading, error, status } = useMutation(createUpdateUser, {
  //     onSuccess: () => {
  //         setTimeout(() => queryClient.invalidateQueries(key), 500);
  //     },
  // });

  const apiData = data && (data as any);

  if (dataLoading) return null;

  return (
    <>
      <PageHeading title="User Vehicles" />
      <Row
        className="rounded mt-3"
        // style={{ borderTop: "1px solid rgba(0,0,0,.25" }}
      >
        {apiData && apiData.vehicles && apiData.vehicles.length > 0 ? (
          apiData.vehicles.map((vehicle: any) => (
            <>
              <Col md={6} className="mt-2">
                <VehicleCard vehicle={vehicle} />
              </Col>
            </>
          ))
        ) : (
          <Container fluid className="d-flex justify-content-center display-3">
            <div className="d-flex flex-column align-items-center pt-3 pb-3">
              <MdRemoveShoppingCart color="#000" size={60} />
              <h4 className="text-black font-weight-bold mt-2">
                No vehicle found
              </h4>
            </div>
          </Container>
        )}
      </Row>
    </>
  );
};

export default UserVehicles;
