import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import moment from "moment";
import React from "react";
import { Container } from "../ui/bootstrap-compat";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { Hammer } from "../ui/icon";

const key = "tickets";

const addMessageToServer = ({ id, message }: any) => {
  return API.post(
    `${key}/${id}/message`,
    { message },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const ChatBox = ({
  initialMessages,
  id,
}: {
  initialMessages: any;
  id: any;
}) => {
  const history = useHistory();
  const loggedInUser = useUserProfileStore((state) => state.user);

  const [messages, setMessages] = React.useState(initialMessages);

  // React.useEffect(() => {
  //   setInterval(() => queryClient.invalidateQueries(`${key}`), 10000);
  // }, []);
  // const getAllMessage = async (id) => {
  //   if (!id) return;
  //   try {
  //     const res = await API.get("/tickets/" + id + "/message");
  //     if (res) console.log({ res });
  //   } catch (error) {
  //     handleApiError(error, history);
  //   }
  // };

  // useEffect(() => {
  //   if (!id) return;
  //   getAllMessage(id);
  // }, [id]);

  const { mutate, isLoading: isSendingMessage } = useMutation(
    addMessageToServer,
    {
      onSuccess: (data) => {
        setTimeout(() => {
          queryClient.invalidateQueries(key);
        }, 500);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const scrollDiv = React.useRef<HTMLDivElement>();

  const addMessageToChat = (messageBody: any) => {
    setMessages((prev) => [...prev, messageBody]);

    scrollDiv.current.scrollIntoView();
  };

  const isMsgFromMe = (user_id: number) => {
    if (loggedInUser.id === user_id) return true;

    return false;
  };

  return (
    <div>
      {/* <!-- DIRECT CHAT PRIMARY --> */}
      <div
        className="card d-flex flex-column justify-content-between "
        style={{
          minHeight: "75vh",
          backgroundColor: "#7598ce2b",
        }}
      >
        <Container
          fluid
          className="messages-container p-0 py-2 hide-scroll"
          style={{
            maxHeight: "70vh",
            overflow: "auto",
          }}
        >
          {messages.length === 0 && (
            <p className="text-center text-muted">
              Send Message to start a conversation
            </p>
          )}
          {messages?.map((msg, i) => (
            <div
              className="message w-100"
              style={{
                position: "relative",
                marginBottom: 6,
              }}
            >
              <div
                className={`d-flex`}
                style={{
                  // marginLeft: msg.from_me ? "auto" : "",
                  display: "flex",
                  minWidth: "50%",

                  flexDirection: !isMsgFromMe(msg.user_id)
                    ? "row"
                    : "row-reverse",
                }}
              >
                <div
                  className="user-image mx-1"
                  style={{
                    flex: 0,
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center text-black "
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: "50%",
                      backgroundColor: isMsgFromMe(msg.user_id)
                        ? "#7bbfff"
                        : "#ffd76a",
                    }}
                  >
                    {msg?.user?.name.slice(0, 1).toUpperCase() || "A"}
                  </div>
                  {/* <Image src={require("../../assets/user.png")} alt="profile" /> */}
                </div>

                <div className="message-details d-flex flex-column">
                  <p
                    style={{
                      backgroundColor: isMsgFromMe(msg.user_id)
                        ? primaryColor
                        : "#fff",
                      color: isMsgFromMe(msg.user_id) ? "white" : "black",
                      boxShadow: isMsgFromMe(msg.user_id)
                        ? ""
                        : "4px 0 20px rgba(0,0,0,.12",
                      maxWidth: "300px",
                      minHeight: 20,
                    }}
                    className="p-1 rounded m-0"
                  >
                    {msg.message}
                  </p>
                  <span
                    className="small text-muted "
                    style={{
                      fontSize: 12,
                      alignSelf: isMsgFromMe(msg.user_id) && "flex-end",
                    }}
                  >
                    {moment(msg.created_at).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollDiv} className="dummy-div "></div>
        </Container>

        <Container fluid className="send-message-form mb-1">
          <div className="bg-light rounded p-1">
            <Formik
              initialValues={{ text: "" }}
              onSubmit={({ text }, { resetForm }) => {
                mutate({ id, message: text });
                // addMessageToChat(body);
                resetForm();
              }}
            >
              {({ handleChange, values }) => (
                <Form>
                  <div className="input-group d-flex align-items-center">
                    <input
                      type="text"
                      name="text"
                      id="text"
                      value={values.text}
                      placeholder="Type Message ..."
                      className="form-control shadow-none"
                      style={{ border: "none", outline: "none" }}
                      required
                      onChange={handleChange}
                    />
                    <button type="submit">
                      <Hammer color={primaryColor} size={24} />
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ChatBox;
