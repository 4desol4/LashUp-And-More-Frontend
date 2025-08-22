import React, { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Button from "@/components/ui/Button";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);
  const handleSuccess = () => {
    onClose();
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Welcome Back" : "Create Account"}
      size="md"
    >
      <div className="space-y-6">
        {/* Form Content */}
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm onSuccess={handleSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm onSuccess={handleSuccess} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Switch Mode */}
        <div className="text-center pt-4 font-three border-t border-gray-200 dark:border-charcoal-700">
          <p className="text-base  text-gray-600 dark:text-gray-400">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Button
            variant="ghost"
            onClick={switchMode}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            {mode === "login" ? "Create one here" : "Sign in instead"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
