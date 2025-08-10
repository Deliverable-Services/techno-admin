import dayjs from "dayjs";
import { Col, Row } from "react-bootstrap";
import {
  BiAlarm,
  BiEdit,
  BiGroup,
  BiMapAlt,
  BiText,
  BiTrash,
  BiVideo,
} from "react-icons/bi";

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
                <BiEdit size={18} />
              </button>
              <button
                className="bg-white border p-1 rounded-lg"
                onClick={() => {
                  toggleFlyout();
                  onDelete(id);
                }}
              >
                <BiTrash size={18} />
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
                <BiVideo />
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
                <BiMapAlt />
                {location}
              </div>
            )}

            {/* Guests */}
            <div className="mb-2 d-flex gap-10 align-items-center ">
              <BiGroup />
              {guests.length > 0
                ? `${guests.length} guest${guests.length > 1 ? "s" : ""}`
                : "No guests"}
            </div>

            {/* Reminder */}
            <div className="mb-2 d-flex gap-10 align-items-center ">
              <BiAlarm />
              Reminder {reminder_before_minutes} minutes before
            </div>

            {/* Description */}
            {description && (
              <div className="mb-2">
                <div className="font-medium mb-2 d-flex gap-10 align-items-center ">
                  <BiText />
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
