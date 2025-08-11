import React, { useState, useEffect } from "react";
import { Button, Container, Modal, Spinner } from "../ui/bootstrap-compat";
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
import PageHeading from "../../shared-components/PageHeading";
import { handleApiError } from "../../hooks/handleApiErrors";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
// import SlotCreateUpdateForm from "./BookingSlotsCreateUpdateForm";
import IsLoading from "../../shared-components/isLoading";
import MeetingDetails from "./MeetingDetails";
import CreateUpdateMeeting from "./CreateUpdateMeeting";
import { Hammer } from "../ui/icon";

const key = "meetings";

const deleteMeeting = (id: any) => {
  return API.delete(`${key}/${id}`);
};

const updateMeetingTime = (id: any, data: any) => {
  return API.put(`${key}/${id}`, data);
};

const intitialFilter = {
  start: moment().startOf("month").format("YYYY-MM-DD"),
  end: moment().endOf("month").format("YYYY-MM-DD"),
};

const Meetings = () => {
  const history = useHistory();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [filter] = useState(intitialFilter);
  const [meetings, setMeetings] = useState([]);
  const [prefillData, setPrefillData] = useState(null);

  const [modalShow, setModalShow] = useState(false);

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading } = useQuery<any>([key, filter], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  useEffect(() => {
    if (data) setMeetings(data?.data?.data || data?.data || []);
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

  const { mutate: mutateUpdate } = useMutation(
    ({ id, data }: { id: any; data: any }) => updateMeetingTime(id, data),
    {
      onSuccess: (_response, _variables) => {
        // Remove loading state and add success animation
        document.querySelectorAll(".fc-event-updating").forEach((el) => {
          el.classList.remove("fc-event-updating");
          el.classList.add("fc-event-update-success");
          // Remove success class after animation
          setTimeout(() => {
            el.classList.remove("fc-event-update-success");
          }, 1000);
        });
        queryClient.invalidateQueries(key);
        showMsgToast("Meeting time updated successfully");
      },
      onError: (error: AxiosError) => {
        // Remove loading state from all events
        document.querySelectorAll(".fc-event-updating").forEach((el) => {
          el.classList.remove("fc-event-updating");
        });
        handleApiError(error, history);
        showMsgToast("Failed to update meeting time. Please try again.");
        // Revert the calendar change on error
        queryClient.invalidateQueries(key);
      },
    }
  );

  const formattedEvents = meetings.map((m) => {
    const date = m.date.split("T")[0]; // strips to "YYYY-MM-DD"
    const start = `${date}T${m.time_from}`;
    const end = `${date}T${m.time_to}`;

    // Convert hex to rgba with 0.2 opacity for background
    const color = m.color || "#3b82f6";
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const bgColor = `rgba(${r}, ${g}, ${b}, 0.2)`;

    return {
      id: m.id,
      title: m.title || "Meeting",
      start,
      end,
      backgroundColor: bgColor,
      borderColor: color,
      textColor: color,
      classNames: [`event-${m.id}`],
      extendedProps: {
        ...m,
        date,
        time_from: m.time_from,
        time_to: m.time_to,
        originalColor: color,
        bgColor: bgColor,
      },
    };
  });

  const _toggleModal = () => {
    setModalShow(!modalShow);
    if (modalShow) setPrefillData(null); // reset on close
  };

  const _onCreateClick = () => {
    setPrefillData(null); // Reset prefill data
    setModalShow(true);
  };

  const handleCloseFlyout = () => {
    setSelectedMeeting(null);
    closeFlyout();
  };

  return (
    <>
      <div className="view-padding">
        <PageHeading
          icon={<Hammer size={24} />}
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
              initialView="timeGridWeek"
              multiMonthMaxColumns={1}
              headerToolbar={{
                left: "prev,today,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
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
              // Enable drag selection
              selectable={true}
              selectMirror={true}
              select={(info) => {
                // For drag selection in time grid views
                const start = dayjs(info.start);
                const end = dayjs(info.end);

                setPrefillData({
                  date: start.format("YYYY-MM-DD"),
                  time_from: start.format("HH:mm"),
                  time_to: end.format("HH:mm"),
                });

                setModalShow(true);
              }}
              dateClick={(info) => {
                // Only handle clicks in month view
                if (info.view.type === "dayGridMonth") {
                  const clickedDate = info.date;
                  const formattedDate = dayjs(clickedDate).format("YYYY-MM-DD");
                  const currentTime = dayjs();

                  setPrefillData({
                    date: formattedDate,
                    time_from: currentTime.format("HH:mm"),
                    time_to: currentTime.add(1, "hour").format("HH:mm"),
                  });

                  setModalShow(true);
                }
              }}
              unselectAuto={true}
              selectOverlap={false}
              dayMaxEvents={3}
              dayMaxEventRows={3}
              moreLinkText={(num) => `+${num} more`}
              moreLinkClick="popover"
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              nowIndicator={true}
              allDaySlot={false}
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              slotDuration="00:30:00"
              height="auto"
              expandRows={true}
              eventDidMount={(info) => {
                // Apply CSS variables for colors
                const { originalColor, bgColor } = info.event.extendedProps;
                info.el.style.setProperty(
                  "--fc-event-border-color",
                  originalColor
                );
                info.el.style.setProperty("--fc-event-bg-color", bgColor);
                info.el.style.setProperty(
                  "--fc-event-text-color",
                  originalColor
                );

                // Add animation on mount
                info.el.style.animation = "fadeIn 0.3s ease-in";
              }}
              eventMouseEnter={(info) => {
                // Add hover effect with transition
                info.el.style.transition =
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
                info.el.style.transform = "translateY(-2px) scale(1.02)";
                info.el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                info.el.style.zIndex = "1000";
              }}
              eventMouseLeave={(info) => {
                // Remove hover effect
                info.el.style.transform = "translateY(0) scale(1)";
                info.el.style.boxShadow = "none";
                info.el.style.zIndex = "auto";
              }}
              dayHeaderFormat={{
                weekday: "short",
                month: "numeric",
                day: "numeric",
              }}
              // Enable event resizing
              eventResizableFromStart={true}
              eventDurationEditable={true}
              eventStartEditable={true}
              editable={true}
              // Prevent dragging to invalid times
              eventAllow={(dropInfo, _draggedEvent) => {
                // Prevent events from being dragged to span multiple days
                const start = dayjs(dropInfo.start);
                const end = dayjs(dropInfo.end);
                const sameDay =
                  start.format("YYYY-MM-DD") === end.format("YYYY-MM-DD");

                // Also prevent dragging to past dates
                const notInPast = start.isAfter(dayjs().subtract(1, "day"));

                return sameDay && notInPast;
              }}
              eventDragStart={(info) => {
                // Add visual feedback when dragging starts
                info.el.style.cursor = "grabbing";
              }}
              eventDragStop={(info) => {
                // Reset cursor when dragging stops
                info.el.style.cursor = "pointer";
              }}
              eventResize={(info) => {
                // Handle event resize - directly update without opening modal
                const meetingData = info.event.extendedProps;

                // Process guests to ensure they have the correct format
                const processedGuests = (meetingData.guests || []).map(
                  (guest: any) => ({
                    guest_id: guest.guest_id || null,
                    guest_type: guest.guest_type || null,
                    guest_name: guest.guest_name || null,
                    guest_email: guest.guest_email,
                    guest_phone: guest.guest_phone || null,
                  })
                );

                // Prepare update data - ensure we only send what's needed
                const updateData: any = {
                  // Times and date from the drag/resize action
                  date: dayjs(info.event.start).format("YYYY-MM-DD"),
                  time_from: dayjs(info.event.start).format("HH:mm"),
                  time_to: dayjs(info.event.end).format("HH:mm"),
                };

                // Only include other fields if they exist
                if (meetingData.title) updateData.title = meetingData.title;
                if (meetingData.timezone)
                  updateData.timezone = meetingData.timezone;
                if (meetingData.location !== undefined)
                  updateData.location = meetingData.location;
                if (meetingData.meet_link !== undefined)
                  updateData.meet_link = meetingData.meet_link;
                if (meetingData.description !== undefined)
                  updateData.description = meetingData.description;
                if (meetingData.color || meetingData.originalColor) {
                  updateData.color =
                    meetingData.color || meetingData.originalColor;
                }
                if (meetingData.reminder_before_minutes !== undefined) {
                  updateData.reminder_before_minutes =
                    meetingData.reminder_before_minutes;
                }
                if (processedGuests.length > 0) {
                  updateData.guests = processedGuests;
                }

                // Debug: Log what we're sending
                console.log(
                  "Sending update data:",
                  JSON.stringify(updateData, null, 2)
                );

                // Show loading state on the event
                info.el.classList.add("fc-event-updating");

                // Store original position in case we need to revert
                const revertFunc = info.revert;

                mutateUpdate(
                  {
                    id: info.event.id,
                    data: updateData,
                  },
                  {
                    onError: () => {
                      // Revert the change on error
                      if (revertFunc) revertFunc();
                    },
                  }
                );
              }}
              eventDrop={(info) => {
                // Handle event drag and drop - directly update without opening modal
                const meetingData = info.event.extendedProps;

                // Process guests to ensure they have the correct format
                const processedGuests = (meetingData.guests || []).map(
                  (guest: any) => ({
                    guest_id: guest.guest_id || null,
                    guest_type: guest.guest_type || null,
                    guest_name: guest.guest_name || null,
                    guest_email: guest.guest_email,
                    guest_phone: guest.guest_phone || null,
                  })
                );

                // Prepare update data - ensure we only send what's needed
                const updateData: any = {
                  // Times and date from the drag/resize action
                  date: dayjs(info.event.start).format("YYYY-MM-DD"),
                  time_from: dayjs(info.event.start).format("HH:mm"),
                  time_to: dayjs(info.event.end).format("HH:mm"),
                };

                // Only include other fields if they exist
                if (meetingData.title) updateData.title = meetingData.title;
                if (meetingData.timezone)
                  updateData.timezone = meetingData.timezone;
                if (meetingData.location !== undefined)
                  updateData.location = meetingData.location;
                if (meetingData.meet_link !== undefined)
                  updateData.meet_link = meetingData.meet_link;
                if (meetingData.description !== undefined)
                  updateData.description = meetingData.description;
                if (meetingData.color || meetingData.originalColor) {
                  updateData.color =
                    meetingData.color || meetingData.originalColor;
                }
                if (meetingData.reminder_before_minutes !== undefined) {
                  updateData.reminder_before_minutes =
                    meetingData.reminder_before_minutes;
                }
                if (processedGuests.length > 0) {
                  updateData.guests = processedGuests;
                }

                // Debug: Log what we're sending
                console.log(
                  "Sending update data:",
                  JSON.stringify(updateData, null, 2)
                );

                // Show loading state on the event
                info.el.classList.add("fc-event-updating");

                // Store original position in case we need to revert
                const revertFunc = info.revert;

                mutateUpdate(
                  {
                    id: info.event.id,
                    data: updateData,
                  },
                  {
                    onError: () => {
                      // Revert the change on error
                      if (revertFunc) revertFunc();
                    },
                  }
                );
              }}
              // Google Calendar-like features
              weekNumbers={true}
              weekNumberFormat={{ week: "narrow" }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: "09:00",
                endTime: "18:00",
              }}
              scrollTime={"08:00:00"}
              aspectRatio={1.8}
              handleWindowResize={true}
              windowResizeDelay={100}
              navLinks={true}
              navLinkDayClick="timeGridDay"
              stickyHeaderDates={true}
              eventMaxStack={3}
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
              onDelete={(id) => {
                setSelectedRowId(id);
                setDeletePopup(true);
                closeFlyout();
              }}
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
          <Modal.Title>Delete Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this meeting? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletePopup(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              mutateDelete(selectedRowId);
              setDeletePopup(false);
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
const renderEventContent = (arg) => {
  const { event, view } = arg;
  const isWeekOrDayView =
    view.type === "timeGridWeek" || view.type === "timeGridDay";

  // For week/day view, show time and title
  if (isWeekOrDayView) {
    return (
      <div className="fc-event-content-wrapper" style={{ padding: "2px 4px" }}>
        <div
          className="fc-event-time"
          style={{ fontSize: "0.7rem", fontWeight: "600" }}
        >
          {dayjs(event.start).format("h:mm A")}
        </div>
        <div
          className="fc-event-title"
          style={{ fontSize: "0.75rem", fontWeight: "500" }}
        >
          {event.title}
        </div>
      </div>
    );
  }

  // For month view, show abbreviated format
  return (
    <div
      className="fc-event-content-wrapper"
      style={{
        padding: "2px 6px",
        fontSize: "0.75rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontWeight: "500" }}>
        {dayjs(event.start).format("h:mm A")}
      </span>{" "}
      <span>{event.title}</span>
    </div>
  );
};
export default Meetings;
