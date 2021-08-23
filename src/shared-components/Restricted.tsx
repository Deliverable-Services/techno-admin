import React from "react";
import useUserProfileStore from "../hooks/useUserProfileStore";

interface Props {
  to: string;
}

const Restricted: React.FC<Props> = (props) => {
  const loggedInUserPermissoins = useUserProfileStore(
    (state) => state?.user?.roles?.permissions
  );

  const isAllowed = (to: string) => loggedInUserPermissoins.includes(to);
  if (!isAllowed(props.to)) return null;
  return <>{props.children}</>;
};

export default Restricted;
