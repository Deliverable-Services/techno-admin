import { IconBaseProps } from "react-icons/lib";
import { TableState } from "react-table";

export interface INavLink {
  title: string;
  path: string;
  onClick?: () => void;
  icon?: IconBaseProps;
  isNavOpen?: boolean;
  permissionReq?: string;
}
export interface INavBar {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ILogo {
  color?: string;
}

export interface ICreateUpdateForm {
  id?: string;
}

export type User = {
  storeType: string;
  created_at: string;
  disabled: number;
  email: string | null;
  email_verified_at: string | null;
  id: number;
  name: string | null;
  otp: string | null;
  otp_generated_at: string | null;
  password: string | null;
  phone: string | null;
  two_factor_recovery_codes: string | null;
  two_factor_secret: string | null;
  updated_at: string | null;
  profile_pic: string;
  stripe_account_id?: string;
  roles: {
    role: string;
    permissions: Array<string>;
  };
  organisations: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    store_type: "crm" | "ecommerce";
    created_at: string;
    updated_at: string;
  };
};

export type IInitialTableState = Partial<TableState<object>>;
