import React from "react";
import useUserProfileStore from "../hooks/useUserProfileStore";

type Props = React.PropsWithChildren<{
  to: string;
  fallBackUI?: React.ComponentType | null;
}>;

const Restricted: React.FC<Props> = (props) => {
  const loggedInUserPermissoins = useUserProfileStore(
    (state) => state?.permissions
  );

  const isAllowed = (to: string) => loggedInUserPermissoins?.includes(to);
  if (!isAllowed(props.to)) {
    if (props.fallBackUI) {
      const Fallback = props.fallBackUI;
      return <Fallback />;
    }

    return null;
  }
  return <>{props.children}</>;
};

export default Restricted;
