
import React from 'react';
import { Rocket, Target, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactInfo = () => {
  const features = [
    {
      icon: Rocket,
      title: "Launch Ready",
      description: "HireAI is preparing for launch on June 21st, 2025. Join our waitlist to be the first to experience the future of recruitment."
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Our AI algorithms ensure perfect candidate-job matching, reducing hiring time and improving quality of hires."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built by a team of four passionate co-founders dedicated to revolutionizing the recruitment industry."
    },
    {
      icon: Zap,
      title: "Automated Efficiency",
      description: "Streamline your entire hiring process with intelligent automation that handles screening, scheduling, and more."
    }
  ];

  return (
    <section id="about-hireai" className="bg-gradient-to-b from-white to-gray-50 py-[50px] md:py-[80px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            About HireAI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            The Future of Recruitment
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            HireAI is revolutionizing the recruitment industry with cutting-edge AI technology. 
            Our platform helps recruiters find the perfect candidates faster and more efficiently than ever before.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Hiring Process?
          </h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of recruiters who are waiting for HireAI to launch. 
            Be among the first to experience the future of recruitment.
          </p>
          <motion.a
            href="/waitlist"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Waitlist
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
