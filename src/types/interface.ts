import { IconBaseProps } from "react-icons/lib";

export interface INavLink {
    title: string,
    path: string,
    onClick?: () => void,
    icon?: IconBaseProps

}
export interface INavBar {
    isNavOpen: boolean,
    setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export interface ILogo {
    color?: string
}

export interface ICreateUpdateForm {
    id?: string
}