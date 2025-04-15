import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlay, FiPause, FiRefreshCw, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { useTodoContext } from '../context/TodoContext';
import IconWrapper from './IconComponent';

interface FocusModeProps {
  taskId: string;
  onClose: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ taskId, onClose }) => {
  const { categories, toggleTaskCompletion } = useTodoContext();
  
  // Find the task across all categories
  const findTask = () => {
    for (const category of categories) {
      const foundTask = category.tasks.find(t => t.id === taskId);
      if (foundTask) {
        return { task: foundTask, categoryId: category.id };
      }
    }
    return null;
  };
  
  const taskInfo = findTask();
  const task = taskInfo?.task;
  
  const [showCompletionConfetti, setShowCompletionConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Show completion alert or notification
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  
  const handleComplete = () => {
    if (task && taskInfo) {
      toggleTaskCompletion(taskInfo.categoryId, taskId);
      setIsCompleted(true);
      setShowCompletionConfetti(true);
      
      // Hide confetti after 4 seconds
      setTimeout(() => {
        setShowCompletionConfetti(false);
      }, 4000);
    }
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { y: -20, opacity: 0 }
  };
  
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          className="relative glass-panel p-6 rounded-xl max-w-md w-full overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background animations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[100px] opacity-20">
              <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-to-r from-primary to-secondary rounded-full filter blur-3xl animate-blob"></div>
              <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-gradient-to-r from-accent2 to-accent3 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>
          </div>
          
          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            onClick={onClose}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <IconWrapper icon={FiX} size={20} />
          </motion.button>
          
          {/* Content */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-1">Focus Mode</h2>
            <p className="text-gray-300">
              {task?.title || "Focus on your task"}
            </p>
          </motion.div>
          
          {/* Timer display */}
          <motion.div 
            className="relative mb-8 mx-auto"
            variants={itemVariants}
          >
            <div className="w-48 h-48 mx-auto relative">
              {/* Progress circle */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-secondary)" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
                <span className="text-sm text-gray-300">Focus Timer</span>
              </div>
            </div>
          </motion.div>
          
          {/* Timer controls */}
          <motion.div className="flex justify-center space-x-4 mb-8" variants={itemVariants}>
            <motion.button
              className="btn-icon-lg bg-white bg-opacity-10 hover:bg-opacity-20"
              onClick={toggleTimer}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <IconWrapper icon={isActive ? FiPause : FiPlay} size={24} />
            </motion.button>
            
            <motion.button
              className="btn-icon-lg bg-white bg-opacity-10 hover:bg-opacity-20"
              onClick={resetTimer}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <IconWrapper icon={FiRefreshCw} size={24} />
            </motion.button>
          </motion.div>
          
          {/* Complete button */}
          <motion.div variants={itemVariants}>
            <motion.button
              className={`w-full btn-primary flex items-center justify-center gap-2 ${isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={handleComplete}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isCompleted}
            >
              <IconWrapper icon={isCompleted ? FiCheckCircle : FiCheck} size={20} />
              <span>{isCompleted ? "Task Completed!" : "Mark as Complete"}</span>
            </motion.button>
          </motion.div>
          
          {/* Completion confetti */}
          <AnimatePresence>
            {showCompletionConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    initial={{
                      opacity: 1,
                      scale: 0,
                      x: "50%",
                      y: "50%",
                      backgroundColor: i % 5 === 0 ? "var(--color-primary)" :
                                      i % 5 === 1 ? "var(--color-secondary)" :
                                      i % 5 === 2 ? "var(--color-accent1)" :
                                      i % 5 === 3 ? "var(--color-accent2)" : "var(--color-accent3)"
                    }}
                    animate={{
                      opacity: [1, 0.8, 0],
                      scale: [0, 0.6, 1],
                      x: `${50 + (Math.random() * 100 - 50)}%`,
                      y: `${50 + (Math.random() * 100 - 50)}%`,
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FocusMode; 