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


// export interface IRequestResponse{
//       "current_page ": 1,
//     "data": [],
//     "first_page_url": "http://carsafai.deliverable.services/admin/v1/brand-models?page=1",
//     "from": null,
//     "last_page": 1,
//     "last_page_url": "http://carsafai.deliverable.services/admin/v1/brand-models?page=1",
//     "links": [
//         {
//             "url": null,
//             "label": "&laquo; Previous",
//             "active": false
//         },
//         {
//             "url": "http://carsafai.deliverable.services/admin/v1/brand-models?page=1",
//             "label": "1",
//             "active": true
//         },
//         {
//             "url": null,
//             "label": "Next &raquo;",
//             "active": false
//         }
//     ],
//     "next_page_url": null,
//     "path": "http://carsafai.deliverable.services/admin/v1/brand-models",
//     "per_page": 30,
//     "prev_page_url": null,
//     "to": null,
//     "total": 0
// }