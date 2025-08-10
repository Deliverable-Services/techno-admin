// Comprehensive react-icons type declarations
declare module 'react-icons/*' {
  import { ComponentType } from 'react';
  
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  // Default export for each icon
  const Icon: ComponentType<IconProps>;
  export default Icon;
  
  // Named exports for all possible icons
  export const [iconName: string]: ComponentType<IconProps>;
}

// Specific module overrides for commonly used icons
declare module 'react-icons/ai' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const AiFillEdit: ComponentType<IconProps>;
  export const AiFillDelete: ComponentType<IconProps>;
  export const AiOutlineLoading: ComponentType<IconProps>;
  export const AiOutlineFileText: ComponentType<IconProps>;
  export const AiOutlineCalendar: ComponentType<IconProps>;
  export const AiFillCheckCircle: ComponentType<IconProps>;
  export const AiFillCloseCircle: ComponentType<IconProps>;
}

declare module 'react-icons/fa' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const FaBuilding: ComponentType<IconProps>;
  export const FaFileInvoiceDollar: ComponentType<IconProps>;
  export const FaCalendarAlt: ComponentType<IconProps>;
  export const FaComments: ComponentType<IconProps>;
  export const FaChevronDown: ComponentType<IconProps>;
  export const FaCheck: ComponentType<IconProps>;
  export const FaEdit: ComponentType<IconProps>;
  export const FaTrash: ComponentType<IconProps>;
  export const FaCalendarCheck: ComponentType<IconProps>;
  export const FaTruckMoving: ComponentType<IconProps>;
  export const FaCheckCircle: ComponentType<IconProps>;
  export const FaCreditCard: ComponentType<IconProps>;
  export const FaUser: ComponentType<IconProps>;
  export const FaUserPlus: ComponentType<IconProps>;
  export const FaComment: ComponentType<IconProps>;
  export const FaPaperclip: ComponentType<IconProps>;
}

declare module 'react-icons/bi' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const BiSad: ComponentType<IconProps>;
}

declare module 'react-icons/bs' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const BsThreeDotsVertical: ComponentType<IconProps>;
  export const BsDiamond: ComponentType<IconProps>;
  export const BsDiamondHalf: ComponentType<IconProps>;
  export const BsFunnel: ComponentType<IconProps>;
}

declare module 'react-icons/ri' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const RiAdvertisementFill: ComponentType<IconProps>;
}

declare module 'react-icons/md' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const MdEmail: ComponentType<IconProps>;
  export const MdPerson: ComponentType<IconProps>;
  export const MdLocationOn: ComponentType<IconProps>;
  export const MdSms: ComponentType<IconProps>;
}

declare module 'react-icons/io' {
  import { ComponentType } from 'react';
  interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  export const IoMdArrowBack: ComponentType<IconProps>;
}
