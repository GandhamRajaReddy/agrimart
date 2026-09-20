const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = ""
}) => {
  const variants = {
    primary: "border-[#5d8f3d]/25 bg-[#eaf0e7] text-[#1d4b34]",
    warning: "border-[#d68b35]/25 bg-[#f8e7c6] text-[#8b5319]",
    danger: "border-[#b84736]/20 bg-[#fff0ed] text-[#9f392c]",
    info: "border-sky-700/15 bg-sky-50 text-sky-800",
    neutral: "border-[#1d4b34]/10 bg-[#f6f5ef] text-[#587062]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[0.6875rem]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-extrabold ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
