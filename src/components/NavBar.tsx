import { INavBar, INavLink } from "../types/interface"
import Logo from "../shared-components/Logo"
import Navlink from "../shared-components/Navlink"
import Overlay from "../shared-components/Overlay"
import { ImCross } from "react-icons/im"
import { SiBrandfolder } from "react-icons/si"
import { IoLogoModelS } from "react-icons/io"
import { FaAddressCard, FaBoxes, FaDiceFour, FaQuestionCircle, FaRegLightbulb, FaUsers } from "react-icons/fa"
import { RiCoupon3Line, RiDashboardFill, RiServiceFill } from "react-icons/ri"
import { useContext } from "react"
import { IsDesktopContext } from "../context/IsDesktopContext"


const manageLinks: Array<INavLink> = [
    {
        title: "Brands",
        path: "/brands",
        icon: <SiBrandfolder />
    },
    {
        title: "Brand Models",
        path: "/brand-models",
        icon: <IoLogoModelS />

    },
    {
        title: "Categories",
        path: "/categories",
        icon: <FaDiceFour />
    },
    {
        title: "Users",
        path: "/users",
        icon: <FaUsers />
    },
    {
        title: "Services",
        path: "/servicies",
        icon: <RiServiceFill />
    },
    {
        title: "Faqs",
        path: "/faqs",
        icon: <FaQuestionCircle />
    },
    {
        title: "Plans",
        path: "/plans",
        icon: <FaRegLightbulb />
    },
    {
        title: "Coupons",
        path: "/coupons",
        icon: <RiCoupon3Line />
    },
]
const mainLinks: Array<INavLink> = [
    {
        title: "Orders",
        path: "/orders",
        icon: <FaBoxes />
    },
    {
        title: "Subscriptions",
        path: "/subscriptions",
        icon: <FaAddressCard />
    },
    {
        title: "Advertisements",
        path: "/advertisements",
        icon: <FaAddressCard />
    },

]




const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
    const isDesktop = useContext(IsDesktopContext)

    const closeNavBar = () => {
        if (setIsNavOpen) {
            setIsNavOpen(false)
        }
    }

    return (
        <>
            <nav className={isNavOpen ? "active" : ""}>
                {
                    isDesktop ?
                        <Logo /> : null
                }
                {
                    !isDesktop ?
                        <div className="menu-hamburger">
                            <ImCross size={20} onClick={closeNavBar} color="white" />
                        </div>
                        : null
                }
                <div className="all-links mt-5">

                    <ul>
                        <Navlink title="Dashboard" path="/" onClick={closeNavBar} icon={<RiDashboardFill />} />
                    </ul>

                    <p className=" mb-2">Manage</p>
                    <ul>
                        {
                            manageLinks.map(({ title, path, icon }) => (
                                <Navlink path={path} title={title} key={title} onClick={closeNavBar} icon={icon} />
                            ))
                        }
                    </ul>
                    <p className="mb-2">Main</p>
                    <ul>
                        {
                            mainLinks.map(({ title, path, icon }) => (
                                <Navlink path={path} title={title} key={title} onClick={closeNavBar} icon={icon} />
                            ))
                        }
                    </ul>
                </div>
            </nav>
            {isNavOpen && <Overlay onClick={closeNavBar} />}
        </>
    )
}

export default NavBar
