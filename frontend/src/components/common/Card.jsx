const Card = ({
  children,
  className = "",
  variant = "default",
  hover = false,
  as: Component = "div",
  ...props
}) => {
  const baseStyles = "relative overflow-hidden rounded-[var(--radius-card)]";

  const variants = {
    default: "border border-[#1d4b34]/10 bg-white shadow-[var(--shadow-soft)]",
    glass: "border border-white/60 bg-white/72 shadow-[var(--shadow-soft)] backdrop-blur",
    glassEmerald: "border border-[#5d8f3d]/30 bg-[#eaf0e7]/90 shadow-[var(--shadow-soft)]",
    dark: "border border-white/12 bg-[#163124] text-white shadow-[var(--shadow-soft)]",
  };

  const hoverStyles = hover
    ? "transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]"
    : "";

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
