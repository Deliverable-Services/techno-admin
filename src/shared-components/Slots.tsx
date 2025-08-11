import { AxiosError } from "axios";
import moment from "moment";
import React from "react";
import {
  Row,
  Col,
  Container,
  Spinner,
} from "../components/ui/bootstrap-compat";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../hooks/handleApiErrors";
import API from "../utils/API";
import { queryClient } from "../utils/queryClient";
import { showMsgToast } from "../utils/showMsgToast";
import { Hammer } from "../components/ui/icon";

const key = "disabled-slots";
interface Props {
  date: string;
  slots: Array<any>;
}

const deleteSlot = (id: Array<string>) => {
  const body = {
    id,
  };
  return API.delete(`${key}/${id}`);
};

const Slots = (props: Props) => {
  const history = useHistory();
  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteSlot, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Slot deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  return (
    <Container fluid className="mt-2">
      {isDeleteLoading && (
        <div>
          {" "}
          Deleting
          <Spinner animation="border" size="sm" />{" "}
        </div>
      )}
      <h2 className="text-muted font-weight-bold">
        {moment(props.date).format("DD-MM-YYYY")}
      </h2>
      <Row
        className="py-2"
        style={{
          borderBottom: "1px solid #1558e718",
        }}
      >
        {props.slots.map((slot) => {
          const initial = moment(slot.datetime).format("HH a");
          const final = moment(slot.datetime).add(1, "hour").format("HH a");
          return (
            <Col
              md="6"
              className="d-flex align-items-center justify-content-between my-1 "
            >
              <div>
                <p className="m-0 font-weight-bold">
                  {initial} - {final}
                </p>
                {slot.reason && (
                  <span className="text-muted text-normal">
                    ({slot.reason})
                  </span>
                )}
              </div>
              <button onClick={() => mutate(slot.id)}>
                {<Hammer size={24} color={"red"} />}
              </button>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Slots;
