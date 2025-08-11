import React from "react";
import useUserProfileStore from "../hooks/useUserProfileStore";

interface Props {
  to: string;
  fallBackUI?: any;
}

const Restricted: React.FC<Props> = (props) => {
  const loggedInUserPermissoins = useUserProfileStore(
    (state) => state?.permissions
  );

  const isAllowed = (to: string) => loggedInUserPermissoins?.includes(to);
  if (!isAllowed(props.to)) {
    if (props.fallBackUI) return <props.fallBackUI />;

    return null;
  }
  return <>{props.children}</>;
};

export default Restricted;
