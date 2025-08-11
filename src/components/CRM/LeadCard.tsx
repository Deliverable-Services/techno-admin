// leadcard.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useDrag } from "react-dnd";
import { Lead } from "./types";
import { MessageCircle, Paperclip, Calendar } from "../../components/ui/icon";
import moment from "moment";
import { Card, CardContent } from "../ui/card";

interface UserAvatarProps {
  profilePic?: string;
  name?: string;
  className?: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  profilePic,
  name,
  className,
  size = 24,
}) => {
  const [showFallback, setShowFallback] = useState<boolean>(!profilePic);

  const handleImageError = () => {
    setShowFallback(true);
  };

  const initials = useMemo(() => {
    if (!name) return "U";

    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }, [name]);

  const backgroundColor = useMemo(() => {
    const colors = [
      "#7e56da",
      "#ffd76a",
      "#7bbfff",
      "#ff6b6b",
      "#51cf66",
      "#ffa726",
      "#42a5f5",
      "#ab47bc",
      "#26c6da",
      "#ffca28",
    ];

    if (!name) return colors[0];

    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }, [name]);

  // Reset fallback state when profilePic changes
  useEffect(() => {
    if (profilePic) {
      setShowFallback(false);
    } else {
      setShowFallback(true);
    }
  }, [profilePic]);

  if (!profilePic || showFallback) {
    return (
      <div
        className={`flex items-center justify-center text-white rounded-full font-bold ${className || ""
          }`}
        style={{
          backgroundColor,
          fontSize: `${size * 0.4}px`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={profilePic}
      alt={name || "User"}
      className={`rounded-full object-cover ${className || ""}`}
      onError={handleImageError}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

interface Props {
  lead: Lead;
}

const LeadCard: React.FC<Props> = ({ lead }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: lead.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const formattedDate = (date: string) => {
    if (!date) return <span>NA</span>;

    return (
      <>
        <span>{moment(date).format("DD MMMM YY")}</span>
        &nbsp;<span>({moment(date).format("hh:mm a")})</span>
      </>
    );
  };

  return (
    <Card
      ref={drag}
      className="card shadow-sm mb-3 cursor-pointer lead-card p-0"
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: "4px solid #eb5757",
      }}
    >
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted small">
            {formattedDate(lead.created_at)}
          </span>

          <span
            className="badge badge-light px-2 py-1 text-dark"
            style={{
              backgroundColor: "#e6f4ea",
              fontSize: "12px",
              borderRadius: "12px",
            }}
          >
            <span
              className="text-green"
              style={{
                fontSize: "10px",
              }}
            >
              Page:{" "}
            </span>
            {lead.page || "N/A"}
          </span>
        </div>

        <h6 className="font-bold mb-1 text-dark">{lead.name}</h6>

        <p
          className="text-muted small mb-2 flex items-center"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            lineHeight: "1.4",
            minHeight: "2.8em",
          }}
        >
          {lead.message}
        </p>
        <div className="inline-flex items-center mb-2">
          <span
            className="small px-2 py-1 flex items-center text-[11px] rounded-xl bg-[#f0f0f0]"

          >
            <Calendar className="mr-1 text-muted" />
            Last Updated At:{" "}
            <strong className="text-dark">
              {formattedDate(lead.updated_at)}
            </strong>
          </span>
        </div>

        {/* Bottom Row: Avatar · Comment Count · Attachment Count */}
        <div className="flex justify-between items-center border-t pt-2 mt-2">
          {/* Assignee Image */}
          <UserAvatar
            profilePic={lead.user?.profile_pic}
            name={lead.user?.name}
            className=""
            size={24}
          />

          {/* Comment & Attachments */}
          <div className="flex items-center text-muted small">
            <div className="flex items-center mr-3">
              <MessageCircle className="mr-1" />
              {lead?.comments?.length || 0}
            </div>
            <div className="flex items-center">
              <Paperclip className="mr-1" />
              {lead?.extra?.attachments || 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
