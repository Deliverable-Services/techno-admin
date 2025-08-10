import React from "react";
import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "../../lib/utils";

// Import all the icons we're going to re-export
import {
  // Navigation & UI
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  Plus,
  Minus,
  MoreVertical,
  MoreHorizontal,

  // Actions
  Edit,
  Trash2,
  Save,
  Copy,
  Share,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Settings,

  // User & People
  User,
  Users,
  UserPlus,
  Eye,
  EyeOff,

  // Communication
  Mail,
  Phone,
  MessageCircle,
  MessageSquare,
  Bell,

  // Status & Feedback
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Circle,
  CircleDot,

  // Files & Folders
  File,
  FileText,
  Folder,
  FolderOpen,
  Paperclip,

  // Social
  Heart,
  Star,
  ThumbsUp,
  ThumbsDown,
  Frown,

  // Business & Finance
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,

  // Calendar & Time
  Calendar,
  Clock,

  // Location
  MapPin,
  Globe,

  // Media Controls
  Play,
  Pause,
  StopCircle,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,

  // General
  Home,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Bookmark,
  Tag,
  Lock,
  Unlock,
  Key,
  Shield,
  Zap,
  Lightbulb,
  Database,
  Server,
  Wifi,
  Bluetooth,
  Battery,
  Power,

  // Tools
  Wrench,
  Hammer,
  Scissors,
  Ruler,
  Palette,
  Brush,
  Pen,
  PenTool,

  // Transportation
  Car,
  Truck,
  Plane,
  Train,
  Bike,

  // Weather
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,

  // CRM Specific
  Target,
  Building,
  Users2,
} from "lucide-react";

export interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  className,
  size = 16,
  ...props
}) => {
  return (
    <IconComponent
      size={size}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
};

// Re-export common icons for easy access
export {
  // Navigation & UI
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  Plus,
  Minus,
  MoreVertical,
  MoreHorizontal,

  // Actions
  Edit,
  Trash2 as Trash,
  Save,
  Copy,
  Share,
  Download,
  Upload,
  RefreshCw as Refresh,
  Search,
  Filter,
  Settings,

  // User & People
  User,
  Users,
  UserPlus,
  Eye,
  EyeOff,
  Lock,
  Unlock,

  // Communication
  Mail,
  Phone,
  MessageCircle,
  MessageSquare,
  Bell,

  // Files & Folders
  File,
  FileText,
  Folder,
  FolderOpen,
  Paperclip,
  FileText as FileInvoice,

  // Media
  Image,
  Video,
  Camera,
  Mic,
  Music,

  // Status & Feedback
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Circle,
  CircleDot,

  // Business & Finance
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,

  // Date & Time
  Calendar,
  Clock,

  // Location
  MapPin,
  Globe,

  // Tech & Connectivity
  Wifi,
  Link,

  // CRM Specific
  Target,
  Building,
  Users2,
  Truck,

  // Social
  Heart,
  Star,
  ThumbsUp,
  ThumbsDown,
  Frown,

  // General
  Home,
  LayoutDashboard as Dashboard,
  ShoppingCart,
  Package,
  Zap,
  Award,
  Flag,
  Tag,

  // Media Controls
  Play,
  Pause,
  StopCircle as Stop,
  SkipForward,
  SkipBack,

  // Arrows & Movement
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,

  // Layout
  Sidebar,
  Columns,
  Grid,
  List,

  // Development
  Code,
  Terminal,
  Github,

  // Communication & Social
  AtSign,
  Hash,

  // Weather & Nature
  Sun,
  Moon,
  Cloud,

  // Transportation
  Car,
  Plane,

  // Tools
  Wrench,
  Hammer,
} from "lucide-react";

export default Icon;
