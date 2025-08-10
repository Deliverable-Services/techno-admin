import { useHistory } from "react-router-dom";

import { useMutation } from "react-query";
import API from "../../utils/API";
import useTokenStore from "../../hooks/useTokenStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { EditAccountCard } from "./EditAccountCard";
import { Hammer } from "../ui/icon";

const sections = [
  {
    title: "Leads & Customers",
    items: [
      {
        icon: <Hammer />,
        name: "Bookings",
        linkTo: "/crm-bookings",
      },
      {
        icon: <Hammer />,
        name: "Customers",
        linkTo: "/users",
      },
      {
        icon: <Hammer />,
        name: "Subscriptions",
        linkTo: "/subscriptions",
      },
      {
        icon: <Hammer />,
        name: "Transactions",
        linkTo: "/transactions",
      },
      {
        icon: <Hammer />,
        name: "Help Center",
        linkTo: "/issues",
      },
    ],
  },
  {
    title: "Products & Services",
    items: [
      {
        icon: <Hammer />,
        name: "Products",
        linkTo: "/products",
      },
      {
        icon: <Hammer />,
        name: "Product Brands",
        linkTo: "/product-brands",
      },
      {
        icon: <Hammer />,
        name: "Categories",
        linkTo: "/categories",
      },
    ],
  },
  {
    title: "Products & Services",
    items: [
      {
        icon: <Hammer />,
        name: "Products",
        linkTo: "/products",
      },
      {
        icon: <Hammer />,
        name: "Product Brands",
        linkTo: "/product-brands",
      },
      {
        icon: <Hammer />,
        name: "Categories",
        linkTo: "/categories",
      },
    ],
  },
  {
    title: "Websites & Pages",
    items: [
      {
        icon: <Hammer />,
        name: "Faqs",
        linkTo: "/faqs",
      },
      {
        icon: <Hammer />,
        name: "Banners",
        linkTo: "/advertisements",
      },
      {
        icon: <Hammer />,
        name: "Testimonials",
        linkTo: "/testimonials",
      },
      {
        icon: <Hammer />,
        name: "Website Pages",
        linkTo: "/website-pages",
      },
    ],
  },
  {
    title: "ORGANIZATION & SETTINGS",
    items: [
      {
        icon: <Hammer />,
        name: "Team Members",
        linkTo: "/team-members",
      },
      {
        icon: <Hammer />,
        name: "Roles & Permissions",
        linkTo: "/permissions",
      },
      {
        icon: <Hammer />,
        name: "Configurations",
        linkTo: "/configurations",
      },
      {
        icon: <Hammer />,
        name: "Organization",
        linkTo: "/organization",
      },
      {
        name: "Notification/Sms",
        linkTo: "/notifications",
        icon: <Hammer />,
      },
    ],
  },
];

export const MoreScreen = () => {
  const history = useHistory();
  const removeToken = useTokenStore((state) => state.removeToken);
  const removeUser = useUserProfileStore((state) => state.removeUser);

  const logout = () => {
    return API.post("/auth/logout");
  };

  const { mutate } = useMutation(logout, {
    onSuccess: () => {
      removeUser();
      removeToken();
      window.location.href = "/login";
    },
    onError: () => {
      removeUser();
      removeToken();
      window.location.href = "/login";
    },
  });

  return (
    <div className="flex flex-col gap-3 pb-10 m-3">
      <EditAccountCard />
      {sections?.map((item, index) => (
        <div className="flex flex-col gap-2" key={index + 1}>
          <p className="text-lg font-semibold pl-1">{item?.title}</p>
          <div className="flex flex-col gap-7 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            {item?.items?.map((item, index) => (
              <div
                className="flex flex-row justify-between cursor-pointer"
                key={index + 1}
                onClick={() => history.push(item?.linkTo)}
              >
                <div className="flex flex-row gap-3 items-center">
                  {item?.icon}
                  <p className="text-base font-medium">{item?.name}</p>
                </div>
                <div>
                  <Hammer />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-7 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div
          className="flex flex-row justify-between cursor-pointer"
          onClick={() => mutate()}
        >
          <div className="flex flex-row gap-3 items-center">
            <Hammer className="mr-2" />
            <p className="text-base font-medium">Log Out</p>
          </div>
        </div>
      </div>
    </div>
  );
};
