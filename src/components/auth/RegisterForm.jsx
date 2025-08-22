import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";


const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

const RegisterForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password");

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
  };

const onSubmit = async (data) => {
  try {
    const { confirmPassword, terms, ...registrationData } = data;
    const result = await registerUser(registrationData);
    if (result.success) {
      const loginResult = await login({
        email: registrationData.email,
        password: registrationData.password,
      });

      if (loginResult.success && onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
  }
};
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 font-three text-lg dark:text-gray-400">
          Create your account to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-base font-three text-gray-900 dark:text-white mb-2">
            Full Name
          </label>
          <div className="relative">
            <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Your full name"
              className="pl-10"
              {...register("name")}
              error={errors.name?.message}
              autoComplete="name"
              icon={HiUser}
              iconPosition="left"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-base font-three text-gray-900 dark:text-white mb-2">
            Email Address
          </label>
          <div className="relative">
            <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="your@email.com"
              className="pl-10"
              {...register("email")}
              error={errors.email?.message}
              autoComplete="email"
              icon={HiMail}
              iconPosition="left"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-base font-three text-gray-900 dark:text-white mb-2">
            Password
          </label>
          <div className="relative">
            
            <Input
              type="password"
              placeholder="Create a strong password"
              className="pl-10 pr-10"
              {...register("password")}
              error={errors.password?.message}
              autoComplete="new-password"
              icon={HiLockClosed}
              iconPosition="left"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-charcoal-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                      passwordStrength
                    )}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength <= 1
                      ? "text-red-600"
                      : passwordStrength <= 2
                      ? "text-yellow-600"
                      : passwordStrength <= 3
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-base font-three text-gray-900 dark:text-white mb-2">
            Confirm Password
          </label>
          <div className="relative">
            
            <Input
              type="password"
              placeholder="Confirm your password"
              className="pl-10 pr-10"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              icon={HiLockClosed}
              iconPosition="left"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="flex items-start space-x-3 font-three">
            <input
              type="checkbox"
              {...register("terms")}
              className="w-4 h-4 text-primary-600 border-gray-300 dark:border-charcoal-600 rounded focus:ring-primary-500 mt-1"
            />
            <span className="text-base text-gray-600 dark:text-gray-400">
              I agree to the{" "}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
              >
                Privacy Policy
              </button>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-base font-three text-red-600">{errors.terms.message}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-base font-three text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full font-three"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Privacy Notice */}
      <div className="text-center">
        <p className="text-sm font-three text-gray-500 dark:text-gray-400">
          By creating an account, you agree to receive marketing communications
          from LashUp And More. You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
