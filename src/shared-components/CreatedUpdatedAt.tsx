import moment from "moment";
import React from "react";

interface Props {
  date: string;
}

const CreatedUpdatedAt = ({ date }: Props) => {
  return (
    <div style={{ whiteSpace: "nowrap" }}>
      <span>{date ? moment(date).format("DD MMMM YY") : "NA"}</span>
      <br />
      <span>({date ? moment(date).format("hh:mm a") : "NA"})</span>
    </div>
  );
};

export default CreatedUpdatedAt;
