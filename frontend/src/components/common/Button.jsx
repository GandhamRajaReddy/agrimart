import { LoaderCircle } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  icon: Icon,
  loading = false,
  isLoading = false,
  type = "button",
  disabled = false,
  ...props
}) => {
  const isCurrentlyLoading = loading || isLoading;

  const baseStyles =
    "inline-flex items-center justify-center rounded-[var(--radius-control)] font-bold transition duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-55";

  const variants = {
    primary:
      "bg-[#1d4b34] text-white shadow-[0_10px_24px_rgba(29,75,52,0.22)] hover:-translate-y-0.5 hover:bg-[#163c2a] hover:shadow-[0_14px_30px_rgba(29,75,52,0.28)]",
    secondary:
      "border border-[#1d4b34]/15 bg-white text-[#1d4b34] hover:-translate-y-0.5 hover:border-[#1d4b34]/35 hover:bg-[#eaf0e7]",
    outline: "border border-[#1d4b34] bg-transparent text-[#1d4b34] hover:bg-[#eaf0e7]",
    ghost: "bg-transparent text-[#1d4b34] hover:bg-[#eaf0e7]",
    glass: "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20",
    danger: "bg-[#b84736] text-white hover:bg-[#9f392c]",
  };

  const sizes = {
    sm: "min-h-9 gap-1.5 px-3 text-sm",
    md: "min-h-11 gap-2 px-4 text-sm",
    lg: "min-h-13 gap-2.5 px-6 text-base",
  };

  const iconClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isCurrentlyLoading}
      aria-busy={isCurrentlyLoading || undefined}
      {...props}
    >
      {isCurrentlyLoading ? <LoaderCircle className={`${iconClass} animate-spin`} aria-hidden="true" /> : Icon && <Icon className={iconClass} aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
