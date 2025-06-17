
import { Upload, Brain, Users, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HireAIProcess = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Job Requirements",
      description: "Simply upload your job description and requirements. Our AI understands the role and creates a comprehensive candidate profile.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI Screens Candidates",
      description: "Our advanced AI automatically screens all applications, ranking candidates based on skills, experience, and cultural fit.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Review Top Matches",
      description: "Get a curated list of the best candidates with detailed AI insights and matching scores for each applicant.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: CheckCircle,
      title: "Streamlined Hiring",
      description: "Schedule interviews, track progress, and make data-driven hiring decisions with comprehensive analytics.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Enhanced background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            How HireAI Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our streamlined process makes recruitment effortless and efficient.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Enhanced connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <motion.div
              className="h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
            />
            
            {/* Animated dots along the line */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full top-1/2 transform -translate-y-1/2"
                style={{ left: `${25 + i * 25}%` }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
            
            {/* Moving pulse */}
            <motion.div
              className="absolute w-4 h-4 bg-gradient-radial from-blue-400/60 to-transparent rounded-full top-1/2 transform -translate-y-1/2"
              animate={{
                left: ["0%", "100%"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative group"
                variants={stepVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center relative z-10 overflow-hidden"
                  whileHover={{ 
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                    borderColor: "rgba(147, 51, 234, 0.2)"
                  }}
                >
                  {/* Hover gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5`}
                    initial={{ scale: 0, rotate: 45 }}
                    whileHover={{ scale: 1.5, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Animated icon container */}
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        "0 0 0 20px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.4
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    {/* Orbiting sparkles */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles 
                        className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400/60" 
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Enhanced step number */}
                  <motion.div 
                    className={`absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      rotate: {
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2
                      }
                    }}
                  >
                    {index + 1}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 mb-4 relative z-10"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 leading-relaxed relative z-10"
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {step.description}
                  </motion.p>
                  
                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 text-gray-300"
                      animate={{
                        x: [0, 5, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  )}
                  
                  {/* Decorative corner elements */}
                  <motion.div
                    className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1
                    }}
                  />
                  <motion.div
                    className="absolute top-4 left-4 w-1 h-1 bg-purple-400/30 rounded-full"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.15
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HireAIProcess;
