import React, { useState, useEffect } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import dayjs from "dayjs";
import API from "../../utils/API";
import { CommonModal } from "../CommonPopup/CommonModal";
import "./meeting.css";
import PageHeading from "../../shared-components/PageHeading";
import { handleApiError } from "../../hooks/handleApiErrors";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { BsClock } from "react-icons/bs";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
// import SlotCreateUpdateForm from "./BookingSlotsCreateUpdateForm";
import IsLoading from "../../shared-components/isLoading";
import MeetingDetails from "./MeetingDetails";
import CreateUpdateMeeting from "./CreateUpdateMeeting";
import { primaryColor } from "../../utils/constants";

// dummy event data

const key = "meetings";

const deleteMeeting = (id: any) => {
  return API.delete(`${key}/${id}`);
};

const intitialFilter = {
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().endOf("month").format("YYYY-MM-DD"),
};

const Meetings = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [formattedDataForCalendar, setFormattedDataForCalendar] =
    useState(null);
  const [filter, setFilter] = useState(intitialFilter);
  const [meetings, setMeetings] = useState([]);
  const [prefillData, setPrefillData] = useState(null);

  const [modalShow, setModalShow] = useState(false);

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  useEffect(() => {
    if (data) setMeetings(data?.data?.data);
  }, [data]);

  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation(
    deleteMeeting,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        showMsgToast("Meeting deleted successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const formattedEvents = meetings.map((m) => {
    const date = m.date.split("T")[0]; // strips to "YYYY-MM-DD"
    const start = `${date}T${m.time_from}`;
    const end = `${date}T${m.time_to}`;

    return {
      id: m.id,
      title: m.title || "Meeting",
      start,
      end,
      backgroundColor: m.color || "#007bff",
      extendedProps: {
        ...m,
        date,
        time_from: m.time_from,
        time_to: m.time_to,
      },
    };
  });

  React.useEffect(() => {
    const formataData = () => {
      const events = [];
      if (isLoading) return;
      if (!data) return;
      // formatting data in the calendar accepted form
      Object.values(data).map((items: Array<any>) => {
        items?.map((item) => {
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
    };

    formataData();
  }, [data, isLoading]);

  const _toggleModal = () => {
    setModalShow(!modalShow);
    if (modalShow) setPrefillData(null); // reset on close
  };

  const _onCreateClick = () => {
    // history.push("/booking-slots/create-edit");
    setModalShow(true);
    openFlyout();
  };

  const handleCloseFlyout = () => {
    setSelectedMeeting(null);
    closeFlyout();
  };

  return (
    <>
      <div className="view-padding">
        <PageHeading
          icon={<BsClock size={24} />}
          title="Meetings"
          description="Manage all booked meetings from here"
          onClick={_onCreateClick}
          btnText="Schedule Meeting"
          // totalRecords={data?.total}
          permissionReq="create_bookingslot"
        />
      </div>
      <hr />

      <Container fluid className="card component-wrapper view-padding">
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
                multiMonthPlugin,
              ]}
              initialView="dayGridMonth"
              multiMonthMaxColumns={1}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right:
                  "listWeek,multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={formattedEvents}
              eventContent={renderEventContent}
              eventClick={(info: any) => {
                const m: any = {};
                Object.assign(m, info.event.extendedProps);
                m.time_from = info.event.start;
                m.time_to = info.event.end;
                setSelectedMeeting(m);
                openFlyout();
              }}
              dateClick={(info) => {
                const clickedDate = info.date;
                const formattedDate = dayjs(clickedDate).format("YYYY-MM-DD");
                const formattedTime = dayjs().format("HH:mm");

                setPrefillData({
                  date: formattedDate,
                  time_from: formattedTime,
                  time_to: dayjs(dayjs()).add(1, "hour").format("HH:mm"),
                });

                setModalShow(true);
              }}
              themeSystem="bootstrap"
              height="auto"
            />
          )}
          <CommonModal
            modalShow={modalShow}
            onModalHideClick={_toggleModal}
            title="Schedule A Meeting "
          >
            <CreateUpdateMeeting
              _toggleModal={_toggleModal}
              prefillData={prefillData}
            />
          </CommonModal>

          <Flyout
            isOpen={showFlyout}
            onClose={handleCloseFlyout}
            title={"Meeting Details"}
            cancelText="Cancel"
          >
            <MeetingDetails
              meeting={selectedMeeting}
              onDelete={mutateDelete}
              onEdit={(meeting) => {
                setPrefillData(meeting);
                setModalShow(true);
              }}
              toggleFlyout={closeFlyout}
            />
          </Flyout>
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
              mutateDelete(selectedRowId);
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
      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Meetings"}
        cancelText="Cancel"
        width="800px"
      >
        {/* <SlotCreateUpdateForm /> */}
      </Flyout>
    </>
  );
};
const renderEventContent = (arg) => {
  const color = arg.event.extendedProps.color || "#555";
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: color,
        padding: "2px 6px",
        borderRadius: "4px",
        color: "#fff",
        fontSize: "0.75rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {arg.event.title} {dayjs(arg.event.start).format("HH:mm A")}
    </div>
  );
};
export default Meetings;
