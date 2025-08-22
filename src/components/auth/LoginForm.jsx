import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      if (result.success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 text-lg font-three dark:text-gray-400">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="Enter your password"
              className="pr-10"
              {...register("password")}
              error={errors.password?.message}
              autoComplete="current-password"
              icon={HiLockClosed}
              iconPosition="left"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            ></button>
          </div>
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
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      
    </div>
  );
};

export default LoginForm;
