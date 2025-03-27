import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";


interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  error,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full pl-11 pr-11 py-3 rounded-xl border ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
        } focus:ring transition-all duration-200 ${className || ""}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
        aria-label="Alternar visibilidad de la contraseña"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 text-gray-400" />
        ) : (
          <Eye className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
