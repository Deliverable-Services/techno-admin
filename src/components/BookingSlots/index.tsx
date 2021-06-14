import { AxiosError } from "axios";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { MdRemoveShoppingCart } from "react-icons/md";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import Slots from "../../shared-components/Slots";
import { primaryColor } from "../../utils/constants";

const key = "disabled-slots";

const intitialFilter = {
  start: moment().format("YYYY-MM-DD"),
  end: moment().add(10, "days").format("YYYY-MM-DD"),
};

const BookingSlots = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  console.log(selectedRows.map((item) => item.id));
  const [filter, setFilter] = useState(intitialFilter);
  console.log({ filter });
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onCreateClick = () => {
    history.push("/booking-slots/create-edit");
  };

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Reason",
        accessor: "reason",
      },
      {
        Header: "Date",
        accessor: "updated_at",
        Cell: (data: Cell) =>
          moment(data.row.values.updated_at).format("DD-MM-YYYY"),
      },
      {
        Header: "Slot",
        Cell: (data: Cell) =>
          moment(data.row.values.updated_at).format("hh (hh+1) A"),
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.created_at} />;
        },
      },
    ],
    []
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center">
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageHeading
        title="Booking Slots"
        onClick={_onCreateClick}
        totalRecords={data?.total}
      />
      <Container fluid className="p-0 my-2">
        <Row>
          <Col md="auto">
            <div>
              <label className="text-muted">Start Date</label>
              <br />
              <input type="date"
                value={filter.start}
                onChange={e => {
                  const value = moment(e.target.value).format("YYYY-MM-DD")
                  _onFilterChange("start", value)
                }}
                max={moment(filter.end).subtract(1, "day").format("YYYY-MM-DD")}
              />
            </div>
          </Col>
          <Col md="auto">
            <div>
              <label className="text-muted">End Date</label>
              <br />
              <input type="date"
                value={filter.end}
                onChange={e => {
                  const value = moment(e.target.value).format("YYYY-MM-DD")
                  _onFilterChange("end", value)
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <hr />
      <Container fluid className="card component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {
                Object.entries(data) && Object.entries(data).length ?
                  Object.entries(data).map((bookingslot: any, index) => (
                    <Slots
                      key={index}
                      date={bookingslot[0]}
                      slots={bookingslot[1]}
                    />
                  ))
                  :
                  <Container fluid className="d-flex justify-content-center display-3">
                    <div className="d-flex flex-column align-items-center pt-3 pb-3">
                      <MdRemoveShoppingCart color="#000" size={60} />
                      <h4 className="text-black font-weight-bold mt-2">No data found</h4>
                    </div>
                  </Container>
              }
            </>
          )}
        </Container>
      </Container>
    </>
  );
};

export default BookingSlots;
