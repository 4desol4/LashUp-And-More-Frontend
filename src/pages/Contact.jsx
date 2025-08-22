import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  HiPhone, 
  HiMail, 
  HiLocationMarker, 
  HiClock,
  HiChat
} from 'react-icons/hi';
import { CONTACT_INFO, ANIMATION_VARIANTS } from '@/utils/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com'; 

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
});

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          phone: data.phone, 
          subject: data.subject,
          message: data.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      console.log("Form data:", data);
      if (result.text === 'OK') {
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset();
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const contactMethods = [
    {
      icon: HiPhone,
      title: 'Phone',
      content: CONTACT_INFO.phone,
      link: `tel:${CONTACT_INFO.phone}`,
    },
    {
      icon: HiMail,
      title: 'Email',
      content: CONTACT_INFO.email,
      link: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: HiLocationMarker,
      title: 'Address',
      content: CONTACT_INFO.address,
      link: `https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white dark:from-charcoal-900 dark:to-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-one text-gray-900 dark:text-white mb-6">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-xl font-three text-gray-600 dark:text-gray-400 leading-relaxed">
              Get in touch with us for appointments, questions, or just to say hello. 
              We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={ANIMATION_VARIANTS.fadeInLeft}
            >
              <Card className="p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <HiChat className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-one text-gray-900 dark:text-white">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-three font-medium text-gray-900 dark:text-white mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        {...register('name')}
                        error={errors.name?.message}
                      />
                    </div>

                    <div>
                      <label className="block text-base font-three font-medium text-gray-900 dark:text-white mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-three font-medium text-gray-900 dark:text-white mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="Your phone number"
                        {...register('phone')}
                        error={errors.phone?.message}
                      />
                    </div>

                    <div>
                      <label className="block text-base font-three font-medium text-gray-900 dark:text-white mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        placeholder="What's this about?"
                        {...register('subject')}
                        error={errors.subject?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-three font-medium text-gray-900 dark:text-white mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-charcoal-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full font-three" size="lg">
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={ANIMATION_VARIANTS.fadeInRight}
              className="space-y-8"
            >
              {/* Contact Methods */}
              <div className="space-y-6">
                <h2 className="text-2xl font-one text-gray-900 dark:text-white">
                  Get in Touch
                </h2>
                
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.title}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      variants={ANIMATION_VARIANTS.fadeInUp}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-primary-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold font-three text-gray-900 dark:text-white mb-1">
                              {method.title}
                            </h3>
                            <a
                              href={method.link}
                              className="text-gray-600 dark:text-gray-400 font-three hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              target={method.title === 'Address' ? '_blank' : undefined}
                              rel={method.title === 'Address' ? 'noopener noreferrer' : undefined}
                            >
                              {method.content}
                            </a>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Business Hours */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <HiClock className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-semibold font-three text-gray-900 dark:text-white">
                    Business Hours
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm font-three">
                  {Object.entries(CONTACT_INFO.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between ">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {day}:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
