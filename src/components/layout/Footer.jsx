import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPhone, HiMail, HiLocationMarker, HiHeart } from "react-icons/hi";
import { FaInstagram, FaFacebook, FaTwitter, FaTiktok } from "react-icons/fa";
import { CONTACT_INFO } from "@/utils/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Eyelash Extensions", href: "/services#extensions" },
    { name: "Lash Lamination", href: "/services#lamination" },
    { name: "Lash Tinting", href: "/services#tinting" },
    { name: "Lash Removal", href: "/services#removal" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: CONTACT_INFO.social.instagram,
      color: "hover:text-pink-500",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      href: CONTACT_INFO.social.facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      href: CONTACT_INFO.social.twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      href: CONTACT_INFO.social.tiktok,
      color: "hover:text-gray-900 dark:hover:text-white",
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-charcoal-800 border-t border-gray-200 dark:border-charcoal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-3xl font-four font-bold text-gradient">
                LashUpAndMore
              </h3>
            </Link>
            <p className="text-gray-600 font-three dark:text-gray-400 leading-relaxed">
              Professional eyelash services to make you look and feel beautiful.
              Transform your natural beauty with our expert lash artists.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-white dark:bg-charcoal-700 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-200 shadow-sm hover:shadow-md`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg  font-one text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 font-three dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-one text-gray-900 dark:text-white">
              Services
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-gray-600 font-three dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-one text-gray-900 dark:text-white">
              Contact Info
            </h4>
            <div className="space-y-3 font-three font-semibold">
              <div className="flex items-start space-x-3">
                <HiLocationMarker className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {CONTACT_INFO.address}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <HiPhone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <HiMail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="pt-2">
              <h5 className="text-sm  font-one text-gray-900 dark:text-white mb-2">
                Business Hours
              </h5>
              <div className="text-sm font-three text-gray-600 dark:text-gray-400 space-y-1">
                <p>Mon - Thu: {CONTACT_INFO.hours.monday}</p>
                <p>Friday: {CONTACT_INFO.hours.friday}</p>
                <p>Saturday: {CONTACT_INFO.hours.saturday}</p>
                <p>Sunday: {CONTACT_INFO.hours.sunday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-charcoal-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 flex-col sm:flex-row text-base font-three text-gray-600 dark:text-gray-400">
              <span>© {currentYear} LashUpAndMore. Made by</span>
              <span className="text-primary-600 font-bold">
                <a href="https://github.com/4desol4">4desol4</a>
              </span>
              <span>in Lagos, Nigeria</span>
            </div>

            <div className="flex items-center space-x-6 text-base font-three">
              <Link
                to="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
