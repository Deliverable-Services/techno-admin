import React from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { primaryColor } from '../../utils/constants'
import { RiSendPlane2Fill } from 'react-icons/ri'
import { BsChat } from 'react-icons/bs'
import moment from 'moment'
import { Container } from 'react-bootstrap';
import image from "../../assets/user.png"


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

    return (
        <div
        >
            {/* <!-- DIRECT CHAT PRIMARY --> */}
            <div className="card d-flex flex-column justify-content-between "
                style={{
                    minHeight: "80vh",
                    backgroundColor: "#3873cc2b"
                }}
            >
                <Container fluid className="messages-container p-0 py-2">


                    {
                        messages.map(msg => (

                            <div className="message w-100"
                                style={{
                                    position: "relative"
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
                                    <div className="user-image"
                                        style={{
                                            flex: 0
                                        }}
                                    >
                                        <img src={require("../../assets/user.png")} alt="profile" height="30" />
                                    </div>

                                    <div className="message-details">
                                        <p
                                            style={{
                                                backgroundColor: msg.from_me ? primaryColor : "#fff",
                                                boxShadow: msg.from_me ? "" : "4px 0 20px rgba(0,0,0,.12",
                                                maxWidth: "300px",
                                            }}
                                            className="p-1 rounded m-0"
                                        >
                                            {msg.text}
                                        </p>
                                        <span className="small text-muted">{msg.send_at}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </Container>

                <Container fluid className="send-message-form mb-1">
                    <div className="bg-light rounded p-1">

                        <form>
                            <div className="input-group d-flex align-items-center">
                                <input type="text" name="message" placeholder="Type Message ..." className="form-control" style={{ border: "none", outline: "none" }} />
                                <RiSendPlane2Fill color={primaryColor} size={24} />
                            </div>
                        </form>
                    </div>
                </Container>
            </div>
        </div >
    )
}

export default ChatBox
