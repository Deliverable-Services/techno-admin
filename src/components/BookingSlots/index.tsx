import { AxiosError } from "axios";
import moment from "moment";
import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
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
import Calendar from "react-awesome-calendar";
import EventEmitter from "events";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import useUserProfileStore from "../../hooks/useUserProfileStore";
// dummy event data

const key = "disabled-slots";

const deleteSlot = (id: any) => {
  return API.delete(`${key}/${id}`);
};
const intitialFilter = {
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().endOf("month").format("YYYY-MM-DD"),
};

const BookingSlots = () => {
  const isRestricted = useUserProfileStore((state) => state.isRestricted);
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [formattedDataForCalendar, setFormattedDataForCalendar] =
    useState(null);
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
      setDeletePopup(false);
      showMsgToast("Slot deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  React.useEffect(() => {
    const formataData = () => {
      const events = [];
      if (isLoading) return;
      if (!data) return;
      // formatting data in the calendar accepted form
      Object.values(data).map((items: Array<any>) => {
        items.map((item) => {
          console.log({ dataTime: item.datetime });
          const event = {
            id: item.id,
            from: moment.utc(item.datetime).format("YYYY-MM-DD HH:mm:ss"),
            to: moment
              .utc(item.datetime)
              .add(1, "hour")
              .format("YYYY-MM-DD HH:mm:ss"),
            title: `${item.reason} ${moment
              .utc(item.datetime)
              .format("HH")}-${moment
              .utc(item.datetime)
              .add(1, "hour")
              .format("HH")} `,
            color: primaryColor,
          };

          events.push(event);
        });
      });
      setFormattedDataForCalendar(events);
      console.log(events);
    };

    formataData();
  }, [data, isLoading]);

  const _onCreateClick = () => {
    history.push("/booking-slots/create-edit");
  };

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

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
      <Container fluid className="card component-wrapper view-padding">
        <PageHeading
          title="CRM Bookings"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_bookingslot"
        />
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {/* {Object.entries(data) && Object.entries(data).length ? ( */}
              <Calendar
                events={formattedDataForCalendar}
                onClickEvent={(event: any) => {
                  //here event return the id of the slot
                  if (!isRestricted("delete_bookingslot")) {
                    setSelectedRowId(event);
                    setDeletePopup(true);
                  }
                }}
              />
              {/* ) : (
                <Container
                  fluid
                  className="d-flex justify-content-center display-3"
                >
                  <div className="d-flex flex-column align-items-center pt-3 pb-3">
                    <MdRemoveShoppingCart color="#000" size={60} />
                    <h4 className="text-black font-weight-bold mt-2">
                      No disabled slot found
                    </h4>
                  </div>
                </Container>
              )} */}
            </>
          )}
        </Container>
      </Container>
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this disabled slot? This process cannot
          be undone
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
