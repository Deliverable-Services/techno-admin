import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useMsgToastStore } from "./useMsgToastStore";

interface Props {}

const MsgToast = (props: Props) => {
  const { toasts, hideToast } = useMsgToastStore();

  return (
    <>
      <div
        className="fixed"
        style={{
          bottom: "2%",
          right: "2%",
          zIndex: 1051,
          minWidth: "200px",
          position: "fixed",
        }}
      >
        {toasts.map((t) => {
          setTimeout(() => hideToast(t.id), 3000);

          return (
            <Alert variant="success" key={t.id}>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{t.message}</AlertDescription>
            </Alert>
          );
        })}
      </div>
    </>
  );
};

export default MsgToast;
