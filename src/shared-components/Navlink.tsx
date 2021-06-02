import { Link, useLocation } from "react-router-dom"
import { INavLink } from "../types/interface"

const Navlink = ({ title, path, onClick, icon }: INavLink) => {
    const { pathname } = useLocation()
    return (
        <Link to={path} >
            <li className={pathname.includes(path) ? "navLink active" : "navLink my-1"}
                onClick={onClick}
            >{icon && icon} {title}</li>
        </Link>
    )
}

export default Navlink
