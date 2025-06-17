
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Award } from 'lucide-react';
import SEO from '@/components/SEO';
import PageLayout from '@/components/PageLayout';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We're constantly pushing the boundaries of what's possible with AI in recruitment, always staying ahead of the curve."
    },
    {
      icon: Users,
      title: "Human-Centered",
      description: "While we leverage AI, we never forget that hiring is ultimately about connecting people with opportunities."
    },
    {
      icon: Lightbulb,
      title: "Transparency",
      description: "We believe in clear, explainable AI that helps recruiters understand and trust our recommendations."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We're committed to delivering the highest quality solutions that drive real results for our customers."
    }
  ];

  const team = [
    {
      name: "Hitanshu Gala",
      bio: "Passionate about revolutionizing recruitment through artificial intelligence and creating meaningful connections between talent and opportunities.",
      initials: "HG"
    },
    {
      name: "Pranav Dharwadkar",
      bio: "Dedicated to building scalable AI systems that transform how companies discover and engage with top talent.",
      initials: "PD"
    },
    {
      name: "Omkar Dalvi",
      bio: "Focused on creating intuitive user experiences that make AI-powered recruitment accessible and effective for everyone.",
      initials: "OD"
    },
    {
      name: "Mihir Patil",
      bio: "Committed to developing robust technical solutions that streamline hiring processes and improve recruitment outcomes.",
      initials: "MP"
    }
  ];

  return (
    <PageLayout>
      <SEO 
        title="About HireAI - Revolutionizing Recruitment with AI"
        description="Learn about HireAI's mission to transform recruitment through artificial intelligence. Meet our team and discover our story."
      />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforming Recruitment with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of hiring by combining cutting-edge artificial intelligence 
              with deep understanding of human potential and organizational needs.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    HireAI began as a conversation among friends who saw firsthand how slow and inefficient traditional recruitment could be—both for companies and for jobseekers.
                  </p>
                  <p>
                    Driven by a shared passion for technology and people, we set out in <strong>2025</strong> to build a next-generation platform that leverages AI to simplify, speed up, and improve the hiring process from day one. We believe fresh ideas—powered by ethical AI—can help organizations everywhere discover true talent more fairly and efficiently.
                  </p>
                  <p>
                    As we launch HireAI for the first time, our mission is clear: enable every business to find great people and every candidate to unlock new opportunities, without unnecessary bias or friction. We're excited to start this journey and invite you to join us as we redefine how hiring works.
                  </p>
                </div>
              </div>
              
              {/* Launch/Fundation highlight instead of stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 flex items-center justify-center min-h-[180px]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">2025</div>
                  <div className="text-lg text-gray-700 font-medium">Product Launch</div>
                  <div className="mt-4 text-gray-500 text-base max-w-xs mx-auto">
                    We're excited to launch HireAI and begin our journey to make hiring smarter, fairer, and more human—right from day one.
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            className="mb-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                "To democratize access to opportunity by making recruitment 
                more intelligent, fair, and human-centered through the power of AI."
              </p>
            </div>
          </motion.section>

          {/* Values Section */}
          <section className="mb-20">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Core Values
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-white text-2xl font-bold">
                        {member.initials}
                      </span>
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <motion.section
            className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Future of Recruitment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We envision a world where every person has equal access to opportunities, 
              where companies can find the perfect candidates efficiently, and where bias 
              is eliminated from the hiring process through intelligent AI systems.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Fair Hiring', 'Global Talent Access', 'Reduced Bias', 'Faster Matching'].map((item, index) => (
                <motion.span 
                  key={index}
                  className="px-4 py-2 bg-white rounded-full text-gray-700 font-medium shadow-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;

