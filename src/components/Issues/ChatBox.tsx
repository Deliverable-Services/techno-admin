import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { BiMinus, BiPlus } from 'react-icons/bi'
import { primaryColor } from '../../utils/constants'
import { RiSendPlane2Fill } from 'react-icons/ri'
import { BsChat } from 'react-icons/bs'
interface Props {
    isChatBoxOpen: boolean,
    setIsChatBoxOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatBox = ({ isChatBoxOpen = false, setIsChatBoxOpen }: Props) => {

    console.log({ isChatBoxOpen })

    const _closeChatbox = () => {
        setIsChatBoxOpen(false)
    }

    const _openChatbox = () => {
        setIsChatBoxOpen(true)
    }
    return (
        <div
            style={{
                position: "fixed",
                width: "400px",
                right: "2%",
                bottom: 0,


            }}
        >
            {/* <!-- DIRECT CHAT PRIMARY --> */}
            <div className="box box-primary direct-chat direct-chat-primary"
            >
                <div className="box-header with-border">
                    <h3 className="box-title">Direct Chat</h3>

                    <div className="box-tools pull-right d-flex">
                        <div className="position-relative mr-3">
                            <BsChat />
                            <span className="position-absolute text-light  font-weight-bold bg-primary d-flex align-items-center justify-content-center"
                                style={{
                                    height: 18,
                                    width: 18,
                                    top: -2,
                                    right: "-40%",
                                    borderRadius: "50%"
                                }}
                            >

                                3
                            </span></div>
                        <button className="btn btn-box-tool" data-widget="collapse">
                            {
                                !isChatBoxOpen
                                    ?
                                    <BiPlus onClick={_openChatbox} className="font-weight-bold" size={20}
                                    />
                                    :
                                    <BiMinus color={primaryColor} onClick={_closeChatbox} />
                            }
                        </button>
                    </div>
                </div>
                {
                    isChatBoxOpen &&
                    <>
                        {/* <!-- /.box-header --> */}
                        <div className="box-body">
                            {/* <!-- Conversations are loaded here --> */}
                            <div className="direct-chat-messages">
                                {/* <!-- Message. Default to the left --> */}
                                <div className="direct-chat-msg">
                                    <div className="direct-chat-info clearfix">
                                        <span className="direct-chat-name pull-left">Alexander Pierce</span>
                                        <span className="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span>
                                    </div>
                                    {/* <!-- /.direct-chat-info --> */}
                                    <img className="direct-chat-img" src="https://bootdey.com/img/Content/user_1.jpg" alt="Message User Image" />
                                    {/* <!-- /.direct-chat-img --> */}
                                    <div className="direct-chat-text">
                                        Is this template really for free? That's unbelievable!
                                    </div>
                                    {/* <!-- /.direct-chat-text --> */}
                                </div>
                                {/* <!-- /.direct-chat-msg --> */}

                                {/* <!-- Message to the right --> */}
                                <div className="direct-chat-msg right">
                                    <div className="direct-chat-info clearfix">
                                        <span className="direct-chat-name pull-right">Sarah Bullock</span>
                                        <span className="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>
                                    </div>
                                    {/* <!-- /.direct-chat-info --> */}
                                    <img className="direct-chat-img" src="https://bootdey.com/img/Content/user_2.jpg" alt="Message User Image" />
                                    {/* <!-- /.direct-chat-img --> */}
                                    <div className="direct-chat-text">
                                        You better believe it!
                                    </div>
                                    {/* <!-- /.direct-chat-text --> */}
                                </div>
                                {/* <!-- /.direct-chat-msg --> */}
                            </div>

                        </div>
                        {/* <!-- /.box-body --> */}
                        <div className="box-footer">
                            <form>
                                <div className="input-group d-flex align-items-center">
                                    <input type="text" name="message" placeholder="Type Message ..." className="form-control" />
                                    <RiSendPlane2Fill color={primaryColor} size={24} />
                                </div>
                            </form>
                        </div>
                        {/* <!-- /.box-footer--> */}
                    </>
                }
            </div>
            {/* <!--/.direct-chat --> */}
        </div >
    )
}

export default ChatBox
