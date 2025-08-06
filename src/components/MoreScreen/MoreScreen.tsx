import { BsClock, BsShieldLock } from "react-icons/bs";
import {
  FaAddressCard,
  FaDiceFour,
  FaMoneyCheck,
  FaQuestionCircle,
} from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { MdKeyboardArrowRight } from "react-icons/md";
import "./index.css";
import { useHistory } from "react-router-dom";
import { GoIssueOpened } from "react-icons/go";
import { IoLogoModelS } from "react-icons/io";
import { SiBrandfolder } from "react-icons/si";
import {
  RiAdminFill,
  RiAdvertisementFill,
  RiGlobalLine,
  RiNotification2Line,
  RiServiceFill,
} from "react-icons/ri";
import { AiFillIdcard, AiFillSetting } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { useMutation } from "react-query";
import API from "../../utils/API";
import useTokenStore from "../../hooks/useTokenStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { EditAccountCard } from "./EditAccountCard";

const sections = [
  {
    title: "Leads & Customers",
    items: [
      {
        icon: <BsClock />,
        name: "Bookings",
        linkTo: "/crm-bookings",
      },
      {
        icon: <ImUsers />,
        name: "Customers",
        linkTo: "/users",
      },
      {
        icon: <FaAddressCard />,
        name: "Subscriptions",
        linkTo: "/subscriptions",
      },
      {
        icon: <FaMoneyCheck />,
        name: "Transactions",
        linkTo: "/transactions",
      },
      {
        icon: <GoIssueOpened />,
        name: "Help Center",
        linkTo: "/issues",
      },
    ],
  },
  {
    title: "Products & Services",
    items: [
      {
        icon: <IoLogoModelS />,
        name: "Products",
        linkTo: "/products",
      },
      {
        icon: <SiBrandfolder />,
        name: "Product Brands",
        linkTo: "/product-brands",
      },
      {
        icon: <FaDiceFour />,
        name: "Categories",
        linkTo: "/categories",
      },
    ],
  },
  {
    title: "Products & Services",
    items: [
      {
        icon: <IoLogoModelS />,
        name: "Products",
        linkTo: "/products",
      },
      {
        icon: <SiBrandfolder />,
        name: "Product Brands",
        linkTo: "/product-brands",
      },
      {
        icon: <FaDiceFour />,
        name: "Categories",
        linkTo: "/categories",
      },
    ],
  },
  {
    title: "Websites & Pages",
    items: [
      {
        icon: <FaQuestionCircle />,
        name: "Faqs",
        linkTo: "/faqs",
      },
      {
        icon: <RiAdvertisementFill />,
        name: "Banners",
        linkTo: "/advertisements",
      },
      {
        icon: <AiFillIdcard />,
        name: "Testimonials",
        linkTo: "/testimonials",
      },
      {
        icon: <RiGlobalLine />,
        name: "Website Pages",
        linkTo: "/website-pages",
      },
    ],
  },
  {
    title: "ORGANIZATION & SETTINGS",
    items: [
      {
        icon: <RiAdminFill />,
        name: "Team Members",
        linkTo: "/team-members",
      },
      {
        icon: <BsShieldLock />,
        name: "Roles & Permissions",
        linkTo: "/permissions",
      },
      {
        icon: <AiFillSetting />,
        name: "Configurations",
        linkTo: "/configurations",
      },
      {
        icon: <RiGlobalLine />,
        name: "Organization",
        linkTo: "/organization",
      },
      {
        name: "Notification/Sms",
        linkTo: "/notifications",
        icon: <RiNotification2Line />,
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
    <div className="sections-container">
      <EditAccountCard />
      {sections?.map((item, index) => (
        <div className="section-container" key={index + 1}>
          <p className="section-heading">{item?.title}</p>
          <div className="items-container">
            {item?.items?.map((item, index) => (
              <div
                className="item-container"
                key={index + 1}
                onClick={() => history.push(item?.linkTo)}
              >
                <div className="item-left-container">
                  {item?.icon}
                  <p className="item-title">{item?.name}</p>
                </div>
                <div>
                  <MdKeyboardArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="items-container">
        <div className="item-container" onClick={() => mutate()}>
          <div className="item-left-container">
            <BiLogOut className="mr-2" />
            <p className="item-title">Log Out</p>
          </div>
        </div>
      </div>
    </div>
  );
};
