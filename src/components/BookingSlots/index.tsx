import { AxiosError } from "axios";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { MdRemoveShoppingCart } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import Slots from "../../shared-components/Slots";
import { primaryColor } from "../../utils/constants";
import Calendar from 'react-awesome-calendar';
import EventEmitter from "events";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
// dummy event data

const key = "disabled-slots";

const deleteSlot = (id: any) => {
  return API.delete(`${key}/${id}`);

};
const intitialFilter = {
  start: moment().format("YYYY-MM-DD"),
  end: moment().add(10, "days").format("YYYY-MM-DD"),
};



const BookingSlots = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [formattedDataForCalendar, setFormattedDataForCalendar] = useState(null)
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteSlot, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setDeletePopup(false)
      showMsgToast("Slot deleted successfully")
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history)
    },
  });

  React.useEffect(() => {
    const formataData = () => {
      const events = []
      if (isLoading) return;
      if (!data) return
      // formatting data in the calendar accepted form
      Object.values(data).map((items: Array<any>) => {
        items.map(item => {

          const event = {
            id: item.id,
            from: (moment(item.datetime).format("YYYY-MM-DDThh:mm:ss")),
            to: (moment(item.datetime).add(1, "hour").format("YYYY-MM-DDThh:mm:ss")),
            title: `${item.reason} ${(moment(item.datetime).format("HH a"))}-${(moment(item.datetime).add(1, "hour").format("HH a"))} `,
            color: primaryColor
          };
          events.push(event)
        })
      })
      setFormattedDataForCalendar(events)

    }

    formataData()
  }, [data, isLoading])

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
            <Form>
              <Form.Label className="text-muted">Start Date</Form.Label>
              <Form.Control type="date"
                value={filter.start}
                onChange={e => {
                  const value = moment(e.target.value).format("YYYY-MM-DD")
                  _onFilterChange("start", value)
                }}
                max={moment(filter.end).subtract(1, "day").format("YYYY-MM-DD")}
              />
            </Form>
          </Col>
          <Col md="auto">
            <Form>
              <Form.Label className="text-muted">End Date</Form.Label>
              <Form.Control type="date"
                value={filter.end}
                onChange={e => {
                  const value = moment(e.target.value).format("YYYY-MM-DD")
                  _onFilterChange("end", value)
                }}
              />
            </Form>
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
                  <Calendar
                    events={formattedDataForCalendar}
                    onClickEvent={(event: any) => {
                      //here event return the id of the slot
                      setSelectedRowId(event)
                      setDeletePopup(true)
                    }}
                  />
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
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this disabled slot? This process cannot be
          undone
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              mutate(selectedRowId);
            }}
          >
            {isDeleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookingSlots;
