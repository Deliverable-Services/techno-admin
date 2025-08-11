import React from "react";
import { Button as ShadcnButton } from "./button";
import { Card as ShadcnCard } from "./card";

// Simple className utility replacement
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

// Bootstrap compatibility components for quick migration
export const Button = ({
  children,
  variant,
  size,
  className,
  disabled,
  onClick,
  type,
  ...props
}: any) => {
  const variantMap = {
    primary: "default",
    secondary: "secondary",
    success: "default",
    danger: "destructive",
    warning: "default",
    info: "default",
    light: "outline",
    dark: "default",
    link: "link",
    "outline-primary": "outline",
    "outline-secondary": "outline",
    "outline-danger": "outline",
  };

  return (
    <ShadcnButton
      variant={variantMap[variant] || "default"}
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      className={cn(className)}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

export const Container = ({ children, fluid, className, ...props }: any) => {
  return (
    <div
      className={cn(
        fluid ? "w-full px-4" : "container mx-auto px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Row = ({ children, className, ...props }: any) => {
  return (
    <div className={cn("flex flex-wrap -mx-2", className)} {...props}>
      {children}
    </div>
  );
};

export const Col = ({ children, md, sm, lg, xs, className, ...props }: any) => {
  const getColClass = () => {
    if (md) return `md:w-${md}/12`;
    if (sm) return `sm:w-${sm}/12`;
    if (lg) return `lg:w-${lg}/12`;
    if (xs) return `w-${xs}/12`;
    return "flex-1";
  };

  return (
    <div className={cn("px-2", getColClass(), className)} {...props}>
      {children}
    </div>
  );
};

export const Card = ({ children, className, ...props }: any) => {
  return (
    <ShadcnCard className={cn("shadow-sm", className)} {...props}>
      {children}
    </ShadcnCard>
  );
};

Card.Body = ({ children, className, ...props }: any) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

Card.Header = ({ children, className, ...props }: any) => (
  <div className={cn("p-6 pb-0", className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className, ...props }: any) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className, ...props }: any) => (
  <h5 className={cn("font-semibold text-lg", className)} {...props}>
    {children}
  </h5>
);

Card.Text = ({ children, className, ...props }: any) => (
  <p className={cn("text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

Card.Img = ({ src, alt, className, variant, ...props }: any) => (
  <img
    src={src}
    alt={alt}
    className={cn(
      "w-full",
      variant === "top" && "rounded-t-lg",
      variant === "bottom" && "rounded-b-lg",
      !variant && "rounded-lg",
      className
    )}
    {...props}
  />
);

export const Modal = ({
  show,
  onHide,
  children,
  size,
  centered,
  ...props
}: any) => {
  if (!show) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "bg-background rounded-lg shadow-lg w-full max-h-[90vh] overflow-auto",
          sizeClasses[size] || "max-w-md"
        )}
      >
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children, className, closeButton, ...props }: any) => (
  <div
    className={cn("flex items-center justify-between p-6 border-b", className)}
    {...props}
  >
    {children}
  </div>
);

Modal.Title = ({ children, className, ...props }: any) => (
  <h4 className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </h4>
);

Modal.Body = ({ children, className, ...props }: any) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

Modal.Footer = ({ children, className, ...props }: any) => (
  <div
    className={cn(
      "flex items-center justify-end gap-2 p-6 border-t",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Spinner = ({ animation, size, className, ...props }: any) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "sm" ? "h-4 w-4" : "h-6 w-6",
        className
      )}
      {...props}
    />
  );
};

export const Dropdown = ({ children, ...props }: any) => {
  return (
    <div className="relative inline-block" {...props}>
      {children}
    </div>
  );
};

Dropdown.Toggle = ({ children, className, ...props }: any) => (
  <button
    className={cn(
      "inline-flex items-center px-4 py-2 border border-border rounded-md bg-background hover:bg-accent",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

Dropdown.Menu = ({ children, className, ...props }: any) => (
  <div
    className={cn(
      "absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

Dropdown.Item = ({ children, className, onClick, ...props }: any) => (
  <button
    className={cn(
      "block w-full text-left px-4 py-2 hover:bg-accent",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const Nav = ({ children, className, ...props }: any) => {
  return (
    <nav className={cn("flex space-x-4", className)} {...props}>
      {children}
    </nav>
  );
};

Nav.Item = ({ children, className, ...props }: any) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

Nav.Link = ({ children, className, active, href, onClick, ...props }: any) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-accent",
      className
    )}
    {...props}
  >
    {children}
  </a>
);

export const Badge = ({ children, variant, className, ...props }: any) => {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-green-500 text-white",
    danger: "bg-destructive text-destructive-foreground",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
    light: "bg-gray-200 text-gray-800",
    dark: "bg-gray-800 text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant] || variantClasses.primary,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const Alert = ({ children, variant, className, ...props }: any) => {
  const variantClasses = {
    success: "bg-green-50 text-green-800 border-green-200",
    danger: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        variantClasses[variant] || variantClasses.info,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex", className)} {...props}>
    {children}
  </div>
);

InputGroup.Text = ({ children, className, ...props }: any) => (
  <span
    className={cn(
      "inline-flex items-center px-3 border border-r-0 border-border bg-muted text-sm rounded-l-md",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

InputGroup.Prepend = ({ children, className, ...props }: any) => (
  <div className={cn("flex", className)} {...props}>
    {children}
  </div>
);

export const ListGroup = ({ children, className, ...props }: any) => (
  <div
    className={cn("border border-border rounded-lg overflow-hidden", className)}
    {...props}
  >
    {children}
  </div>
);

ListGroup.Item = ({ children, className, active, ...props }: any) => (
  <div
    className={cn(
      "block w-full px-4 py-2 border-b border-border last:border-b-0",
      active && "bg-primary text-primary-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Image = ({
  src,
  alt,
  className,
  fluid,
  rounded,
  ...props
}: any) => (
  <img
    src={src}
    alt={alt}
    className={cn(fluid && "w-full", rounded && "rounded", className)}
    {...props}
  />
);

export const Table = ({
  children,
  striped,
  bordered,
  hover,
  className,
  ...props
}: any) => (
  <table
    className={cn("w-full border-collapse", bordered && "border", className)}
    {...props}
  >
    {children}
  </table>
);

export const Pagination = ({ children, className, ...props }: any) => (
  <nav className={cn("flex items-center space-x-1", className)} {...props}>
    {children}
  </nav>
);

Pagination.First = ({ children, onClick, className, ...props }: any) => (
  <button
    className={cn("px-3 py-2 border border-border rounded-l-md", className)}
    onClick={onClick}
    {...props}
  >
    {children || "«"}
  </button>
);

Pagination.Prev = ({ children, onClick, className, ...props }: any) => (
  <button
    className={cn("px-3 py-2 border border-border", className)}
    onClick={onClick}
    {...props}
  >
    {children || "‹"}
  </button>
);

Pagination.Item = ({ children, active, onClick, className, ...props }: any) => (
  <button
    className={cn(
      "px-3 py-2 border border-border",
      active && "bg-primary text-primary-foreground",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

Pagination.Next = ({ children, onClick, className, ...props }: any) => (
  <button
    className={cn("px-3 py-2 border border-border", className)}
    onClick={onClick}
    {...props}
  >
    {children || "›"}
  </button>
);

Pagination.Last = ({ children, onClick, className, ...props }: any) => (
  <button
    className={cn("px-3 py-2 border border-border rounded-r-md", className)}
    onClick={onClick}
    {...props}
  >
    {children || "»"}
  </button>
);

// Legacy Pagination object for backwards compatibility
export const PaginationOld = {
  First: ({ children, onClick, className, ...props }: any) => (
    <button
      className={cn("px-3 py-2 border border-border rounded-l-md", className)}
      onClick={onClick}
      {...props}
    >
      {children || "«"}
    </button>
  ),
  Prev: ({ children, onClick, className, ...props }: any) => (
    <button
      className={cn("px-3 py-2 border border-border", className)}
      onClick={onClick}
      {...props}
    >
      {children || "‹"}
    </button>
  ),
  Item: ({ children, active, onClick, className, ...props }: any) => (
    <button
      className={cn(
        "px-3 py-2 border border-border",
        active && "bg-primary text-primary-foreground",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  Next: ({ children, onClick, className, ...props }: any) => (
    <button
      className={cn("px-3 py-2 border border-border", className)}
      onClick={onClick}
      {...props}
    >
      {children || "›"}
    </button>
  ),
  Last: ({ children, onClick, className, ...props }: any) => (
    <button
      className={cn("px-3 py-2 border border-border rounded-r-md", className)}
      onClick={onClick}
      {...props}
    >
      {children || "»"}
    </button>
  ),
};

export const Toast = ({
  children,
  show,
  onClose,
  className,
  ...props
}: any) => {
  if (!show) return null;
  return (
    <div
      className={cn(
        "fixed top-4 right-4 bg-background border border-border rounded-lg shadow-lg p-4 z-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Tabs = ({ children, className, ...props }: any) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

export const Tab = ({
  children,
  className,
  eventKey,
  title,
  ...props
}: any) => (
  <div className={cn("w-full", className)} {...props}>
    {children}
  </div>
);

export const Form = {
  Group: ({ children, className, ...props }: any) => (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  ),
  Label: ({ children, className, ...props }: any) => (
    <label
      className={cn("block text-sm font-medium mb-1", className)}
      {...props}
    >
      {children}
    </label>
  ),
  Control: ({ as, className, ...props }: any) => {
    const Component = as || "input";
    return (
      <Component
        className={cn(
          "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
          className
        )}
        {...props}
      />
    );
  },
  Text: ({ children, className, ...props }: any) => (
    <div
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    >
      {children}
    </div>
  ),
};
