import moment from "moment";

interface Props {
  date: string;
}

const CreatedUpdatedAt = ({ date }: Props) => {
  return (
    <div style={{ whiteSpace: "nowrap" }}>
      <span>{date ? moment(date).format("DD MMMM YY") : "NA"}</span>
      <span>({date ? moment(date).format("hh:mm a") : "NA"})</span>
    </div>
  );
};

export default CreatedUpdatedAt;
