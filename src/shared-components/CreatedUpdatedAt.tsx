import moment from "moment";
import React from "react";

interface Props {
  date: string;
}

const CreatedUpdatedAt = ({ date }: Props) => {
  return (
    <>
      <span>{date ? moment(date).format("DD MMMM YY") : "NA"}</span>
      <br />
      <span>({date ? moment(date).format("hh:mm a") : "NA"})</span>
    </>
  );
};

export default CreatedUpdatedAt;
