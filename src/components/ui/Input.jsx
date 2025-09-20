import { useState, forwardRef } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder = "",
      value,
      onChange,
      onBlur,
      onFocus,
      error,
      success,
      helperText,
      required = false,
      disabled = false,
      className = "",
      icon: Icon,
      iconPosition = "left",
      size = "md",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const baseClasses = "w-full transition-all duration-200 focus:outline-none";

    const variants = {
      default: `
   border border-charcoal-300 dark:border-charcoal-600 rounded-lg
   bg-white dark:bg-charcoal-800
   focus:ring-2 focus:ring-primary-500 focus:border-transparent
   hover:border-charcoal-400 dark:hover:border-charcoal-500
  `,
      filled: `
  border-0 rounded-lg bg-charcoal-100 dark:bg-charcoal-700
  focus:ring-2 focus:ring-primary-500
  hover:bg-charcoal-200 dark:hover:bg-charcoal-600
  `,
      underline: `
  border-0 border-b-2 border-charcoal-300 dark:border-charcoal-600 rounded-none
  bg-transparent focus:border-primary-500
  hover:border-charcoal-400 dark:hover:border-charcoal-500
  `,
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${error ? "border-red-500 focus:ring-red-500" : ""}
    ${success ? "border-green-500 focus:ring-green-500" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${Icon && iconPosition === "left" ? "pl-10" : ""}
    ${Icon && iconPosition === "right" ? "pr-10" : ""}
    ${type === "password" ? "pr-10" : ""}
    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
    ${className}
  `;

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
            block text-sm font-semibold
            ${
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            }
            ${isFocused ? "text-primary-600 dark:text-primary-400" : ""}
          `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {Icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
              <Icon className={`${iconSizes[size]} text-gray-400`} />
            </div>
          )}
          {/* Input */}
          <motion.input
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
          {/* Right side controls (error, success, toggle) */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {success && !error && (
              <CheckCircle className={`${iconSizes[size]} text-green-500`} />
            )}
            {error && (
              <AlertCircle className={`${iconSizes[size]} text-red-500`} />
            )}
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <HiEyeOff className={iconSizes[size]} />
                ) : (
                  <HiEye className={iconSizes[size]} />
                )}
              </button>
            )}
            {Icon && iconPosition === "right" && (
              <Icon className={`${iconSizes[size]} text-gray-400`} />
            )}
          </div>
        </div>

        {/* Helper Text or Error Message */}
        <AnimatePresence>
          {(error || success || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={`text-sm flex items-center space-x-1 ${
                error
                  ? "text-red-600 dark:text-red-400"
                  : success
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {error && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {success && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{error || success || helperText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea Component
export const Textarea = forwardRef(
  (
    {
      label,
      placeholder = "",
      value,
      onChange,
      onBlur,
      onFocus,
      error,
      success,
      helperText,
      required = false,
      disabled = false,
      className = "",
      rows = 4,
      resize = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const textareaClasses = `
    w-full transition-all duration-200 focus:outline-none
    border border-gray-300 dark:border-gray-600 rounded-lg
    bg-white dark:bg-gray-800
    focus:ring-2 focus:ring-primary-500 focus:border-transparent
    hover:border-gray-400 dark:hover:border-gray-500
    px-4 py-3 text-base
    ${error ? "border-red-500 focus:ring-red-500" : ""}
    ${success ? "border-green-500 focus:ring-green-500" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${!resize ? "resize-none" : "resize-y"}
    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
    ${className}
  `;

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
            block text-sm font-semibold
            ${
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            }
            ${isFocused ? "text-primary-600 dark:text-primary-400" : ""}
          `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <motion.textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={textareaClasses}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />

        {/* Helper Text or Error Message */}
        <AnimatePresence>
          {(error || success || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={`text-sm flex items-center space-x-1 ${
                error
                  ? "text-red-600 dark:text-red-400"
                  : success
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {error && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {success && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{error || success || helperText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Input;
