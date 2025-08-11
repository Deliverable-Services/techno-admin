import { Alert } from 'react-bootstrap'
import { useMsgToastStore } from './useMsgToastStore'

interface Props {

}

const MsgToast = (props: Props) => {
    const { toasts, hideToast } = useMsgToastStore()



    return (
        <>
            <div className="position-fixed " style={{ bottom: "2%", right: "2%", zIndex: 1051, minWidth: "200px" }} >
                {
                    toasts.map((t) => {
                        setTimeout(() => hideToast(t.id), 3000)

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
