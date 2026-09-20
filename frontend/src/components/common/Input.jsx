import React, { forwardRef, useId } from "react";

const Input = forwardRef(({ 
  label,
  error,
  icon,
  leftIcon,
  rightIcon,
  className = "",
  wrapperClassName = "",
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;

  const renderIcon = (iconProp) => {
    if (!iconProp) return null;
    if (React.isValidElement(iconProp)) {
      return iconProp;
    }
    const IconComponent = iconProp;
    return <IconComponent className="h-5 w-5" />;
  };

  const activeLeftIcon = leftIcon || icon;

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs sm:text-sm font-bold text-emerald-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {activeLeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-400">
            {renderIcon(activeLeftIcon)}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            min-h-11 w-full rounded-xl border border-emerald-800/60 bg-emerald-950/60 px-4 py-2.5
            text-white placeholder:text-emerald-400/60 shadow-sm transition-all duration-200
            focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30
            ${activeLeftIcon ? "pl-10" : "pl-4"}
            ${rightIcon ? "pr-10" : "pr-4"}
            ${error ? "border-red-500 focus:border-red-400 focus:ring-red-400/30" : ""}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-400">
            {renderIcon(rightIcon)}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
