import { Alert, Toast } from 'react-bootstrap'
import { useErrorToastStore } from './useErrorToastStore'

interface Props {

}

const ErrorToast = (props: Props) => {
    const { toasts, hideToast } = useErrorToastStore()



    return (
        <>
            <div className="position-fixed" style={{ bottom: "2%", right: "2%", zIndex: 1001, minWidth: "200px" }} >
                {
                    toasts.map((t) => {
                        setTimeout(() => hideToast(t.id), 5000)

                        return (
                            <Alert variant="danger">{t.message}</Alert>
                            // <Toast className=" bg-danger" style={{ bottom: "2%", right: "2%", zIndex: 1001, minWidth: "200px" }} onClose={() => hideToast(t.id)} key={t.id}>
                            //     <Toast.Header className="d-flex justify-content-between" >
                            //         <strong>Error</strong>
                            //         <span></span>
                            //         <span>{" "}</span>
                            //     </Toast.Header>
                            //     <Toast.Body>{t.message}</Toast.Body>
                            // </Toast>
                        )
                    })
                }
            </div>


        </>
    )

}

export default ErrorToast
