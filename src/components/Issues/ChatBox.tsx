import { Form, Formik } from 'formik'
import moment from 'moment'
import React from 'react'
import { Container } from 'react-bootstrap'
import { RiSendPlane2Fill } from 'react-icons/ri'
import { primaryColor } from '../../utils/constants'


const initialMessage = [
    {
        text: "Hi! Please fix this issue. Some important stuff is missing from the car",
        user: {
            id: 1,
            name: "Hitesh Kumar"
        },
        send_at: moment().subtract(1, "hour").fromNow(),
        from_me: false
    },
    {
        text: "I'm working on it ",
        user: {
            id: 2,
            name: "Dishant"
        },
        send_at: moment().fromNow(),
        from_me: true
    },
    {
        text: "Ok Thanks",
        user: {
            id: 1,
            name: "Hitesh Kumar"
        },
        send_at: moment().fromNow(),
        from_me: false
    },
]

const ChatBox = () => {

    const [messages, setMessages] = React.useState(initialMessage)

    const scrollDiv = React.useRef<HTMLDivElement>()

    const addMessageToChat = (messageBody: any) => {
        setMessages(prev => ([
            ...prev,
            messageBody
        ])
        )

        scrollDiv.current.scrollIntoView()
    }

    return (
        <div
        >
            {/* <!-- DIRECT CHAT PRIMARY --> */}
            <div className="card d-flex flex-column justify-content-between "
                style={{
                    minHeight: "75vh",
                    backgroundColor: "#7598ce2b"
                }}
            >
                <Container fluid className="messages-container p-0 py-2 hide-scroll"
                    style={{
                        maxHeight: "70vh",
                        overflow: "auto"
                    }}
                >


                    {
                        messages.map(msg => (

                            <div className="message w-100"
                                style={{
                                    position: "relative",
                                    marginBottom: 6
                                }}
                            >
                                <div
                                    className={`d-flex`}
                                    style={{
                                        // marginLeft: msg.from_me ? "auto" : "",
                                        display: "flex",
                                        minWidth: "50%",

                                        flexDirection: !msg.from_me ? "row" : "row-reverse"


                                    }}
                                >
                                    <div className="user-image mx-1"
                                        style={{
                                            flex: 0
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-center text-black "
                                            style={{
                                                height: 30,
                                                width: 30,
                                                borderRadius: "50%",
                                                backgroundColor: msg.from_me ? "#7bbfff" : "#ffd76a"
                                            }}
                                        >{msg.user.name.slice(0, 1).toUpperCase()}</div>
                                        {/* <Image src={require("../../assets/user.png")} alt="profile" /> */}
                                    </div>

                                    <div className="message-details d-flex flex-column">
                                        <p
                                            style={{
                                                backgroundColor: msg.from_me ? primaryColor : "#fff",
                                                color: msg.from_me ? "white" : "black",
                                                boxShadow: msg.from_me ? "" : "4px 0 20px rgba(0,0,0,.12",
                                                maxWidth: "300px",
                                            }}
                                            className="p-1 rounded m-0"
                                        >
                                            {msg.text}
                                        </p>
                                        <span
                                            className="small text-muted "
                                            style={{
                                                fontSize: 12,
                                                alignSelf: msg.from_me && "flex-end"
                                            }}
                                        >{msg.send_at}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <div ref={scrollDiv} className="dummy-div"></div>
                </Container>

                <Container fluid className="send-message-form mb-1">
                    <div className="bg-light rounded p-1">

                        <Formik
                            initialValues={{ text: "" }}
                            onSubmit={({ text }, { resetForm }) => {
                                const body = {
                                    text,
                                    user: {
                                        id: 2,
                                        name: "Dishant"
                                    },
                                    send_at: moment().fromNow(),
                                    from_me: true
                                }
                                addMessageToChat(body)
                                resetForm()
                            }}
                        >
                            {
                                ({ handleChange, values }) => (
                                    <Form>
                                        <div className="input-group d-flex align-items-center">
                                            <input type="text" name="text" id="text" value={values.text} placeholder="Type Message ..." className="form-control shadow-none" style={{ border: "none", outline: "none" }}
                                                required
                                                onChange={handleChange}
                                            />
                                            <button type="submit">

                                                <RiSendPlane2Fill color={primaryColor} size={24} />
                                            </button>
                                        </div>

                                    </Form>
                                )
                            }

                        </Formik>
                    </div>
                </Container>
            </div>
        </div >
    )
}

export default ChatBox
