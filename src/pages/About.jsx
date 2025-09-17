import { motion } from 'framer-motion';
import { HiStar, HiHeart, HiUserGroup } from 'react-icons/hi';
import { FaAward } from 'react-icons/fa';
import { ANIMATION_VARIANTS } from '@/utils/constants';
import Card from '@/components/ui/Card';
import BackToTop from "@/components/ui/BackToTop"; 
const About = () => {
  const stats = [
    { icon: HiUserGroup, label: 'Happy Clients', value: '2,500+' },
    { icon: FaAward, label: 'Years Experience', value: '8+' },
    { icon: HiStar, label: 'Five Star Reviews', value: '98%' },
    { icon: HiHeart, label: 'Treatments Done', value: '10,000+' },
  ];

  const team = [
    {
      name: 'Adeleye Abisade',
      role: 'Founder & Lead Lash Artist',
      image: './images/ceo.jpeg',
      bio: 'With over 8 years of experience, Sewa is passionate about creating beautiful, natural-looking lashes that enhance each client\'s unique features.'
    },
    {
      name: 'Maria Santos',
      role: 'Senior Lash Technician',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      bio: 'Maria specializes in volume lashing and has trained hundreds of lash artists. She brings precision and artistry to every treatment.'
    },
    {
      name: 'Jennifer Lee',
      role: 'Lash Artist & Trainer',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
      bio: 'Jennifer is known for her gentle touch and ability to create the perfect lash look for any occasion, from natural to dramatic.'
    }
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
              About <span className="text-gradient">LashUpAndMore</span>
            </h1>
            <p className="text-xl text-gray-600 font-three dark:text-gray-400 leading-relaxed">
              Where artistry meets beauty, and every client leaves feeling confident and beautiful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={ANIMATION_VARIANTS.fadeInLeft}
            >
              <h2 className="text-3xl md:text-4xl font-one text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 font-three text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Founded in 2016 by Adeleye Abisade, LashUpAndMore began as a passion project in Lagos, Nigeria. 
                  What started as a small home-based business has grown into one of the most trusted lash studios in the city.
                </p>
                <p>
                  Our mission is simple: to enhance your natural beauty and boost your confidence through 
                  expert lash artistry. We believe that beautiful lashes are not just about appearance – 
                  they're about how they make you feel.
                </p>
                <p>
                  Every treatment is personalized to your unique eye shape, lifestyle, and preferences. 
                  We use only the highest quality materials and the latest techniques to ensure your lashes 
                  look stunning and last longer.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={ANIMATION_VARIANTS.fadeInRight}
              className="relative"
            >
              <img
                src="/images/ceo.jpeg"
                alt="LashUpAndMore Studio"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={ANIMATION_VARIANTS.fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <Icon className="w-8 h-8 mx-auto mb-4" />
                  <div className="text-3xl font-one mb-2">{stat.value}</div>
                  <div className="text-primary-100 font-three">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-one text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl font-three text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our talented team of certified lash artists is dedicated to creating beautiful, 
              customized looks for every client.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={ANIMATION_VARIANTS.fadeInUp}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-one text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-three mb-4 font-medium">
                    {member.role}
                  </p>
                  <p className="text-gray-600 font-three dark:text-gray-400 text-base leading-relaxed">
                    {member.bio}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <BackToTop />
    </div>
  );
};

export default About;