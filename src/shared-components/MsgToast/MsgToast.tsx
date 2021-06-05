import { Alert, Toast } from 'react-bootstrap'
import { useMsgToastStore } from './useMsgToastStore'
import { ImCross } from 'react-icons/im';

interface Props {

}

const MsgToast = (props: Props) => {
    const { toasts, hideToast } = useMsgToastStore()



    return (
        <>
            <div className="position-fixed " style={{ bottom: "2%", right: "2%", zIndex: 1001, minWidth: "200px" }} >
                {
                    toasts.map((t) => {
                        setTimeout(() => hideToast(t.id), 5000)

                        return (
                            <Alert variant="success">{t.message}</Alert>
                        )
                    })
                }
            </div>


        </>
    )

}

export default MsgToast
