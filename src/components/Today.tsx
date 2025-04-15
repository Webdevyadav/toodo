import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiClock, FiFilter, FiSun } from 'react-icons/fi';
import { useTodoContext, Task } from '../context/TodoContext';
import IconWrapper from './IconComponent';
import TaskItem from './TaskItem';

const Today: React.FC = () => {
  const { categories } = useTodoContext();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 70
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const headerItem = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  // Get today's date formatted
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  // Filter tasks for today
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all tasks from all categories
    const allTasks = categories.flatMap(category => 
      category.tasks.map((task: Task) => ({
        ...task,
        categoryName: category.name,
        categoryColor: category.color,
        categoryIcon: category.icon
      }))
    );
    
    const filtered = allTasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate.getTime() === today.getTime();
    });
    
    setTodayTasks(filtered);
    
    // Simulate loading for smoother animations
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [categories]);
  
  // Get filtered tasks
  const getFilteredTasks = () => {
    switch (filterType) {
      case 'pending':
        return todayTasks.filter(task => !task.completed);
      case 'completed':
        return todayTasks.filter(task => task.completed);
      default:
        return todayTasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          className="w-16 h-16 rounded-full border-4 border-t-primary border-r-secondary border-b-accent1 border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div 
        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={headerItem}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg">
              <IconWrapper icon={FiSun} size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Today's Tasks</h1>
              <div className="flex items-center gap-2 text-gray-400">
                <IconWrapper icon={FiCalendar} size={14} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="flex flex-wrap gap-2" variants={headerItem}>
          <motion.button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
              filterType === 'all' 
                ? 'bg-primary bg-opacity-20 text-primary' 
                : 'text-gray-400 hover:bg-gray-800 hover:bg-opacity-50'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <IconWrapper icon={FiFilter} size={14} />
            <span>All</span>
          </motion.button>
          
          <motion.button
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
              filterType === 'pending' 
                ? 'bg-orange-500 bg-opacity-20 text-orange-500' 
                : 'text-gray-400 hover:bg-gray-800 hover:bg-opacity-50'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <IconWrapper icon={FiClock} size={14} />
            <span>Pending</span>
          </motion.button>
          
          <motion.button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
              filterType === 'completed' 
                ? 'bg-green-500 bg-opacity-20 text-green-500' 
                : 'text-gray-400 hover:bg-gray-800 hover:bg-opacity-50'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <IconWrapper icon={FiCheckCircle} size={14} />
            <span>Completed</span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              variants={item}
              layoutId={`task-${task.id}`}
              layout
            >
              <TaskItem 
                task={task} 
                categoryId={task.categoryId || ''} 
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="glass-panel rounded-lg p-8 text-center"
            variants={item}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <IconWrapper icon={FiSun} size={40} className="text-orange-300" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">No tasks for today</h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              Enjoy your day or create new tasks to stay productive. Your schedule is clear!
            </p>
          </motion.div>
        )}
      </motion.div>
      
      {filteredTasks.length > 0 && (
        <motion.div
          className="mt-8 flex justify-between items-center p-4 glass-panel rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 100
          }}
        >
          <div>
            <h3 className="font-medium">Daily Progress</h3>
            <p className="text-sm text-gray-400">
              {todayTasks.filter(t => t.completed).length} of {todayTasks.length} tasks completed
            </p>
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent1"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.round((todayTasks.filter(t => t.completed).length / Math.max(todayTasks.length, 1)) * 100)}%` 
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut",
                delay: 0.7
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Today; 