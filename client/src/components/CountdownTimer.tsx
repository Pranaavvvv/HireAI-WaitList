
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Rocket } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2025-06-21T00:00:00Z');
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsLaunched(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLaunched) {
    return (
      <motion.div
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 md:p-8 text-white text-center shadow-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-4">
          <Rocket className="w-6 h-6 mr-3" />
          <h3 className="text-xl md:text-2xl font-semibold">We're Live!</h3>
        </div>
        <p className="text-green-100">HireAI has officially launched!</p>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <Calendar className="w-5 h-5 text-white mr-2" />
          <h3 className="text-lg md:text-xl font-semibold text-white">
            Launch Countdown
          </h3>
        </div>
        <p className="text-white/80 text-sm">
          Launching June 21st, 2025
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="bg-white/20 backdrop-blur-sm rounded-md p-4 text-center text-white border border-white/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
          >
            <div className="text-2xl md:text-3xl font-bold mb-1 font-mono">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-wide">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center text-white/70">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Coming Soon</span>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
