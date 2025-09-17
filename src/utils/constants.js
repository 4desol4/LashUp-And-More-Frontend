export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// App Constants
export const APP_NAME = "LashUpAndMore";
export const APP_TAGLINE = "Perfect Eyelashes";

// Services
export const SERVICES = [
  {
    id: "extensions",
    name: "Eyelash Extension",
    description:
      "Create natural extensions to achieve beauty that makes every woman uniquely beautiful.",
    image: "/images/4.jpg",
    price: "From ₦80000",
    duration: "2-3 hours",
    features: [
      "Volume lashes",
      "Classic lashes",
      "Hybrid technique",
      "Long-lasting",
    ],
  },
  {
    id: "lamination",
    name: "Eyelash Lamination",
    description:
      "With selected eyelashes you can have perfect look for everyday.",
    image: "/images/5.jpg",
    price: "From ₦55000",
    duration: "1-1.5 hours",
    features: [
      "Lash lift",
      "Tinting included",
      "Natural curl",
      "6-8 weeks lasting",
    ],
  },
  {
    id: "microblading",
    name: "EyeBrow Microblading",
    description:
      "Microblading is a tattooing technique which uses a small handheld tool made of several tiny needles to add semi-permanent pigment to the skin.",
    image: "/images/brow2.jpg",
    price: "From ₦75000",
    duration: "45-60 minutes",
    features: [
      "Safe dyes",
      "Gentle process",
      "Brows conditioning",
      "Professional care",
    ],
  },

  {
    id: "brow",
    name: "EyeBrow Tinting",
    description: "We are more about enhancing your natural brows.",
    image: "/images/brow1.jpg",
    price: "From ₦60000",
    duration: "45-60 minutes",
    features: [
      "Safe dyes",
      "Gentle process",
      "Brows conditioning",
      "Professional care",
    ],
  },
  {
    id: "removal",
    name: "Eyelash Removal",
    description:
      "We are distinguished by our individual approach to each client.",
    image: "/images/9.jpg",
    price: "From ₦40000",
    duration: "45-60 minutes",
    features: [
      "Safe removal",
      "Gentle process",
      "Lash conditioning",
      "Professional care",
    ],
  },
  {
    id: "tinting",
    name: "Eyelash Tinting",
    description:
      "We are without any risk wondering, and you feel more aesthetically beautiful.",
    image: "/images/3.jpg",
    price: "From ₦30000",
    duration: "30-45 minutes",
    features: [
      "Natural colors",
      "Safe dyes",
      "Immediate results",
      "4-6 weeks lasting",
    ],
  },
];

// Status Constants
export const BOOKING_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
};

export const ORDER_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
};

// Status Colors
export const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

// Time Slots (for booking)
export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Contact Information
export const CONTACT_INFO = {
  phone: "+1 (555) 123-4567",
  email: "hello@LashUpAndMore.com",
  address: "123 Beauty Street, Lagos, Nigeria",
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 5:00 PM",
    sunday: "Closed",
  },
  social: {
    instagram: "https://www.instagram.com/lashupandmore/",
    facebook: "https://facebook.com/sewalashes",
    twitter: "https://twitter.com/sewalashes",
    tiktok: "https://vm.tiktok.com/ZMALoGXU8/",
  },
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Transition Settings
export const TRANSITIONS = {
  default: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.6, ease: "easeOut" },
  fast: { duration: 0.15, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Form Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid phone number",
  invalidName: "Name should only contain letters and spaces",
  weakPassword:
    "Password must be at least 8 characters with uppercase, lowercase, and number",
  passwordMismatch: "Passwords do not match",
  networkError: "Network error. Please check your connection.",
  serverError: "Server error. Please try again later.",
  unauthorized: "You are not authorized to perform this action",
  notFound: "Resource not found",
  timeout: "Request timeout. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  bookingCreated: "Booking created successfully!",
  orderPlaced: "Order placed successfully!",
  profileUpdated: "Profile updated successfully!",
  passwordChanged: "Password changed successfully!",
  emailSent: "Email sent successfully!",
  loginSuccess: "Welcome back!",
  registerSuccess: "Account created successfully!",
  logoutSuccess: "Logged out successfully",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  token: "token",
  user: "user",
  theme: "theme",
  cart: "cart",
  preferences: "preferences",
};

// Image Placeholder URLs (for development)
export const PLACEHOLDER_IMAGES = {
  hero: "./images/1.jpg",
  service: "./images/2.jpg",
  product: "./images/3.jpg",
  gallery: "./images/8.jpg",
  avatar: "./images/ceo.jpeg",
};

// Feature Flags
export const FEATURES = {
  darkMode: true,
  animations: true,
  notifications: true,
  cart: true,
  booking: true,
  gallery: true,
  reviews: true,
  newsletter: true,
};
