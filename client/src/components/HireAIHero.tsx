import { ArrowRight, Users, Clock, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";

const HireAIHero = () => {
  const scrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/waitlist';
  };

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="relative w-full" // removed mt-16/md:mt-0; handle spacing via section-container outside for consistency
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <section className="w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden min-h-[80vh] md:min-h-[850px] flex-col flex items-center justify-center px-2 sm:px-0">
        {/* backdrop overlay */}
        <div className="absolute inset-0 bg-black/20 z-1"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full"
            variants={pulseVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-48 h-48 bg-purple-400/10 rounded-full"
            variants={pulseVariants}
            animate="animate"
            transition={{ delay: 1 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-400/10 rounded-full"
            variants={pulseVariants}
            animate="animate"
            transition={{ delay: 2 }}
          />
          
          {/* New floating elements */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-16 h-16 bg-cyan-400/10 rounded-full"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-pink-400/10 rounded-full"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1.5 }}
          />
          
          {/* Animated sparkles */}
          <motion.div
            className="absolute top-1/4 left-1/2 text-yellow-400/30"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles size={32} />
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 right-1/3 text-blue-400/30"
            animate={{
              rotate: -360,
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          >
            <Sparkles size={24} />
          </motion.div>
        </div>
        
        {/* Hero section content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <motion.div
            className="w-full max-w-2xl mx-auto text-center mb-4 md:mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="inline-block mb-5 px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm sm:text-base font-medium border border-white/20"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 HireAI Launches June 21, 2025
            </motion.div>
            <motion.h1
              className="banner-title text-white mb-3 md:mb-6"
              variants={itemVariants}
            >
              Elevate your recruitment pipeline with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hireai-primary to-hireai-secondary font-bold">HireAI</span>
            </motion.h1>
            <motion.p
              className="banner-subtitle text-gray-200 mb-5 md:mb-8 mx-auto max-w-2xl"
              variants={itemVariants}
            >
              AI-powered automation for screening, shortlisting, and interviewing: trusted by hundreds of modern teams worldwide.
            </motion.p>
          </motion.div>
          {/* Cleaner countdown spacing */}
          <motion.div 
            className="mb-9 w-full max-w-lg mx-auto px-1"
            variants={itemVariants}
          >
            <CountdownTimer />
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 md:mb-16"
            variants={itemVariants}
          >
            <motion.button
              onClick={scrollToWaitlist}
              className="w-full sm:w-auto min-h-[56px] px-8 py-3 bg-gradient-to-r from-hireai-primary to-hireai-secondary text-white rounded-xl shadow-xl flex items-center justify-center group text-base sm:text-lg font-semibold transition-transform hover:scale-[1.04]"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
              }}
              whileTap={{ scale: 0.96 }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Join the Waitlist
              <ArrowRight className="ml-3 w-5 h-5" />
            </motion.button>
            <motion.div className="flex items-center text-white/80 text-base">
              <Users className="w-5 h-5 mr-2" />
              <span>2,500+ recruiters already waiting</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* === Modern, professional stats grid === */}
      <div className="w-full bg-gray-50 py-12 px-2 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-blue-100 w-20 h-20">
              <svg aria-hidden="true">
                {/* Use Lucide "clock" icon for best display */}
                <g>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#3B82F6" strokeWidth="2" />
                  <path d="M24 13v11l7 4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <h4 className="text-3xl font-semibold text-gray-900 mb-1">75%</h4>
            <p className="text-base font-medium text-gray-600">Faster Hiring Process</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-purple-100 w-20 h-20">
              <svg aria-hidden="true">
                {/* Use Lucide "target" icon */}
                <g>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                  <circle cx="24" cy="24" r="9" fill="none" stroke="#8B5CF6" strokeWidth="2"/>
                  <circle cx="24" cy="24" r="3" fill="#8B5CF6" />
                </g>
              </svg>
            </div>
            <h4 className="text-3xl font-semibold text-gray-900 mb-1">90%</h4>
            <p className="text-base font-medium text-gray-600">Better Candidate Matching</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-indigo-100 w-20 h-20">
              <svg aria-hidden="true">
                {/* Use Lucide "users" icon */}
                <g>
                  <circle cx="16" cy="19" r="5" fill="none" stroke="#6366F1" strokeWidth="2"/>
                  <circle cx="32" cy="19" r="5" fill="none" stroke="#6366F1" strokeWidth="2"/>
                  <rect x="10" y="30" width="28" height="7" rx="3.5" fill="none" stroke="#6366F1" strokeWidth="2"/>
                </g>
              </svg>
            </div>
            <h4 className="text-3xl font-semibold text-gray-900 mb-1">50%</h4>
            <p className="text-base font-medium text-gray-600">Reduced Manual Work</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HireAIHero;
