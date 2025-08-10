import dayjs from "dayjs";
import { Col, Row, Badge } from "react-bootstrap";
import { Hammer } from "../ui/icon";

const MeetingDetails = ({ meeting, onDelete, onEdit, toggleFlyout }) => {
  const {
    id,
    title,
    timezone,
    date,
    time_from,
    time_to,
    meet_link,
    location,
    description,
    color,
    reminder_before_minutes,
    guests = [],
    created_by_type,
    is_approved_by_admin,
  } = meeting;

  return (
    <>
      <Row className="rounded">
        <Col className="mx-auto">
          <div className="w-full p-3 max-w-md p-6 rounded-lg shadow-md border bg-white">
            <div className="d-flex justify-content-end gap-4">
              <button
                className="bg-white border p-1 rounded-lg"
                onClick={() => {
                  toggleFlyout();
                  onEdit(meeting);
                }}
              >
                <Hammer size={18} />
              </button>
              <button
                className="bg-white border p-1 rounded-lg"
                onClick={() => {
                  toggleFlyout();
                  onDelete(id);
                }}
              >
                <Hammer size={18} />
              </button>
            </div>

            <div className="mb-2">
              <div className="d-flex align-items-center gap-10 mb-4">
                <span
                  className="rounded"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: `${color}`,
                  }}
                ></span>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              </div>
              <p className="text-sm text-gray-500">
                {dayjs(date).format("dddd, D MMMM")} &middot;{"     "}
              </p>
              <p className="text-sm text-gray-500 my-2">
                {dayjs(time_from, "HH:mm:ss").format("hh:mm A")} –{" "}
                {dayjs(time_to, "HH:mm:ss").format("hh:mm A")} ({timezone})
              </p>
              <p className="text-sm text-gray-500 my-2">
                {is_approved_by_admin ? "Approved" : "Pending approval"}
              </p>
            </div>

            {/* Join links */}
            {meet_link && (
              <div className="mb-2 d-flex gap-10 align-items-center ">
                <Hammer />
                <a
                  href={meet_link}
                  className="text-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </a>
              </div>
            )}

            {/* Location */}
            {location && (
              <div className="mb-2 d-flex gap-10 align-items-center ">
                <Hammer />
                {location}
              </div>
            )}

            {/* Guests */}
            <div className="mb-3">
              <div className="d-flex gap-10 align-items-center mb-2">
                <Hammer />
                <span className="fw-medium">Guests ({guests.length})</span>
              </div>
              {guests.length > 0 ? (
                <div className="ms-4">
                  {guests.map((guest, index) => (
                    <div key={index} className="mb-1">
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-2">•</small>
                        <div>
                          <div className="fw-medium">
                            {guest.guest_name || guest.guest_email}
                          </div>
                          {guest.guest_name && (
                            <small className="text-muted">
                              {guest.guest_email}
                            </small>
                          )}
                          {guest.guest_type && (
                            <Badge
                              bg={
                                guest.guest_type === "lead"
                                  ? "warning"
                                  : guest.guest_type === "customer"
                                  ? "success"
                                  : "primary"
                              }
                              className="ms-2"
                            >
                              {guest.guest_type}
                            </Badge>
                          )}
                          {!guest.guest_id && (
                            <Badge bg="secondary" className="ms-2">
                              External
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ms-4 text-muted">
                  <small>No guests added</small>
                </div>
              )}
            </div>

            {/* Reminder */}
            <div className="mb-2 d-flex gap-10 align-items-center ">
              <Hammer />
              Reminder {reminder_before_minutes} minutes before
            </div>

            {/* Description */}
            {description && (
              <div className="mb-2">
                <div className="font-medium mb-2 d-flex gap-10 align-items-center ">
                  <Hammer />
                  <section>Description</section>
                </div>
                <p className="bg-light rounded p-2">{description}</p>
              </div>
            )}

            {/* Created By */}
            <div className="text-sm text-gray-500">
              Created by: {created_by_type}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MeetingDetails;
