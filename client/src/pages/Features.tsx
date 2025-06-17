
import { motion } from 'framer-motion';
import { Bot, Search, Clock, BarChart3, Shield, Zap, Brain, Target, Workflow, MessageSquare } from 'lucide-react';
import SEO from '@/components/SEO';
import PageLayout from '@/components/PageLayout';

const Features = () => {
  const coreFeatures = [
    {
      icon: Bot,
      title: "AI-Powered Resume Screening",
      description: "Advanced machine learning algorithms automatically analyze and rank resumes based on job requirements, skills, and experience relevance.",
      benefits: ["95% faster screening", "Consistent evaluation", "Bias reduction"]
    },
    {
      icon: Search,
      title: "Intelligent Candidate Matching",
      description: "Go beyond keyword matching with semantic understanding that identifies candidates with the right skills and potential.",
      benefits: ["Context-aware matching", "Hidden talent discovery", "Skill gap analysis"]
    },
    {
      icon: Clock,
      title: "Automated Scheduling",
      description: "Streamline interview coordination with intelligent calendar integration and automated candidate communication.",
      benefits: ["Zero scheduling conflicts", "Automated reminders", "Multi-timezone support"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive insights into your recruitment pipeline, candidate quality, and hiring performance metrics.",
      benefits: ["Real-time dashboards", "Predictive analytics", "ROI tracking"]
    }
  ];

  const advancedFeatures = [
    {
      icon: Brain,
      title: "Predictive Hiring Success",
      description: "Machine learning models predict candidate success probability based on historical hiring data."
    },
    {
      icon: Target,
      title: "Bias Detection & Mitigation",
      description: "AI algorithms identify and reduce unconscious bias in job descriptions and evaluation processes."
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Automate repetitive tasks like sending follow-up emails, updating candidate status, and generating reports."
    },
    {
      icon: MessageSquare,
      title: "AI Interview Assistant",
      description: "Real-time interview support with suggested questions and candidate evaluation frameworks."
    }
  ];

  return (
    <PageLayout>
      <SEO 
        title="HireAI Features - AI-Powered Recruitment Tools"
        description="Discover how HireAI's advanced features transform recruitment with AI-powered screening, intelligent matching, and automated workflows."
      />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern Recruitment
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your hiring process with cutting-edge AI technology designed specifically for recruiters and HR professionals.
            </p>
          </motion.div>

          {/* Core Features */}
          <section className="mb-20">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Core Features
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Advanced Features */}
          <section className="mb-20">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Advanced Capabilities
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <motion.section 
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose HireAI?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of recruiters who have transformed their hiring process with our AI-powered platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { stat: "75%", label: "Faster Time-to-Hire", desc: "Reduce screening time from hours to minutes" },
                { stat: "90%", label: "Better Match Quality", desc: "AI finds candidates you might miss" },
                { stat: "60%", label: "Cost Reduction", desc: "Lower recruitment costs per hire" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {item.stat}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {item.label}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {item.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Features;
