import * as React from "react";
import { cn } from "../utils";

// Simple dropdown implementation without Radix dependency
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within DropdownMenu");
  }
  return context;
};

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}> = ({ children, className, asChild }) => {
  const { isOpen, setIsOpen } = useDropdown();

  return (
    <div 
      className={cn("cursor-pointer", className)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { isOpen, setIsOpen } = useDropdown();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        className
      )}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenuItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}> = ({ children, onClick, className, asChild }) => {
  const { setIsOpen } = useDropdown();

  const handleClick = () => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("border-t border-gray-100 my-1", className)} />;
};

// Additional exports to match shadcn API
export const DropdownMenuGroup = DropdownMenuContent;
export const DropdownMenuPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const DropdownMenuSub = DropdownMenu;
export const DropdownMenuRadioGroup = DropdownMenuContent;
