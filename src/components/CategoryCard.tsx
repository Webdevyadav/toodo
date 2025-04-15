import React from 'react';
import { motion } from 'framer-motion';
import { useTodoContext } from '../context/TodoContext';
import { Category } from '../context/TodoContext';
import IconWrapper from './IconComponent';
import { FiArrowRight } from 'react-icons/fi';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { setCurrentCategory } = useTodoContext();
  
  const completedTasks = category.tasks.filter(task => task.completed).length;
  const totalTasks = category.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Calculate progress circle parameters
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPercentage / 100);
  
  return (
    <motion.div 
      className="category-card group"
      onClick={() => setCurrentCategory(category.id)}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between mb-5">
        <motion.div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl overflow-hidden relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-30"
            style={{ backgroundColor: category.color }}
            animate={{ 
              rotate: [0, 45, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Actual background */}
          <div 
            className="absolute inset-0 bg-opacity-90"
            style={{ backgroundColor: category.color }}
          />
          
          {/* Icon */}
          <span role="img" aria-label={category.name} className="relative z-10 text-2xl">
            {category.icon}
          </span>
        </motion.div>
        
        {/* Progress circle */}
        <motion.div 
          className="relative w-16 h-16"
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Background circle */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="8"
            />
          </svg>
          
          {/* Progress arc - only this element should be rotated */}
          <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <motion.circle 
              cx="50" 
              cy="50" 
              r={radius} 
              fill="none" 
              stroke={category.color} 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Percentage text - no rotation here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
              className="text-center font-medium text-sm flex items-center justify-center h-full"
              style={{ transform: 'none' }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: [1, 1.2, 1],
                  color: progressPercentage === 100 ? ["#ffffff", "#10B981", "#ffffff"] : "#ffffff"
                }}
                transition={{ 
                  duration: 2,
                  repeat: progressPercentage === 100 ? Infinity : 0,
                  repeatType: "reverse"
                }}
                className="block text-center"
                style={{ transform: 'none' }}
              >
                {Math.round(progressPercentage)}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <motion.h3 
        className="text-2xl font-display font-bold mb-3 group-hover:text-white transition-colors duration-300"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {category.name}
      </motion.h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <motion.span 
            className="text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {completedTasks}/{totalTasks} tasks
          </motion.span>
        </div>
        <div className="w-full h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: category.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              delay: 0.2
            }}
          >
            {progressPercentage > 0 && (
              <motion.div 
                className="h-full w-full"
                animate={{ 
                  background: progressPercentage === 100 
                    ? ["linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4))", "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))"] 
                    : ["linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2))", "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0))"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Task summary */}
      <div className="mb-6">
        {totalTasks > 0 ? (
          <>
            <motion.div
              className="text-xs text-gray-400 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Recent Tasks:
            </motion.div>
            <motion.div className="space-y-1">
              {category.tasks.slice(0, 2).map((task, index) => (
                <motion.div 
                  key={task.id}
                  className="text-sm truncate"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-300'}>
                    {task.title}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No tasks yet in this category
          </motion.div>
        )}
      </div>
      
      {/* View button - visible on hover */}
      <motion.div
        className="absolute bottom-0 right-0 mb-4 mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ y: 10 }}
        whileHover={{ y: 0 }}
      >
        <motion.button
          className="bg-white bg-opacity-10 p-2 rounded-full flex items-center justify-center"
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: 'rgba(255,255,255,0.2)' 
          }}
          whileTap={{ scale: 0.9 }}
        >
          <IconWrapper icon={FiArrowRight} className="text-white" size={18} />
        </motion.button>
      </motion.div>
      
      {/* Animated floating dots in the background */}
      <div className="absolute -z-10 inset-0 overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity duration-700">
        <motion.div 
          className="absolute top-5 right-5 w-32 h-32 rounded-full" 
          style={{ backgroundColor: category.color }}
          animate={{ 
            filter: ["blur(30px)", "blur(40px)", "blur(30px)"],
            scale: [1, 1.2, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration:
            4, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-5 left-10 w-24 h-24 rounded-full" 
          style={{ backgroundColor: category.color }}
          animate={{ 
            filter: ["blur(20px)", "blur(30px)", "blur(20px)"],
            scale: [1, 1.3, 1],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
      
      {/* Overlay hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-primary to-transparent rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.15 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default CategoryCard; 