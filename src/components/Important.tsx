import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiFilter, FiCalendar, FiList, FiChevronDown, FiAlertTriangle } from 'react-icons/fi';
import { useTodoContext, Task } from '../context/TodoContext';
import IconWrapper from './IconComponent';
import TaskItem from './TaskItem';

const Important: React.FC = () => {
  const { categories } = useTodoContext();
  const [importantTasks, setImportantTasks] = useState<Task[]>([]);
  const [sortType, setSortType] = useState<'priority' | 'dueDate'>('priority');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation variants with improved smoothness
  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 50,
        damping: 15
      }
    }
  };
  
  const item = {
    hidden: { y: 25, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };
  
  const headerItem = {
    hidden: { y: -15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };
  
  // Filter important tasks
  useEffect(() => {
    // Get all tasks from all categories
    const allTasks = categories.flatMap(category => 
      category.tasks.map((task: Task) => ({
        ...task,
        categoryName: category.name,
        categoryColor: category.color,
        categoryIcon: category.icon,
        categoryId: category.id
      }))
    );
    
    const filtered = allTasks.filter(task => task.priority === 'high');
    setImportantTasks(filtered);
    
    // Simulate loading for smoother animations
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [categories]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          className="w-16 h-16 rounded-full"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 0, 360],
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.6, 1],
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="w-full h-full rounded-full border-4 border-t-primary border-r-secondary border-b-accent1 border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }}
          />
        </motion.div>
      </div>
    );
  }
  
  // Get filtered tasks
  const getFilteredTasks = () => {
    switch (filterType) {
      case 'pending':
        return importantTasks.filter(task => !task.completed);
      case 'completed':
        return importantTasks.filter(task => task.completed);
      default:
        return importantTasks;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6 h-full overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <IconWrapper
            icon={FiStar}
            bgColor="bg-yellow-100"
          />
          <h2 className="text-2xl font-bold ml-3">Important Tasks</h2>
        </div>

        <div className="flex space-x-3">
          <motion.div 
            className="relative" 
            variants={headerItem}
            onMouseLeave={() => setShowSortMenu(false)}
          >
            <motion.button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="px-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg flex items-center gap-2"
              whileHover={{ y: -2, backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
              whileTap={{ y: 0 }}
            >
              <IconWrapper icon={sortType === 'priority' ? FiList : FiCalendar} size={16} />
              <span>Sort by: {sortType === 'priority' ? 'Priority' : 'Due Date'}</span>
              <motion.div
                animate={{ rotate: showSortMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <IconWrapper icon={FiChevronDown} size={16} />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  className="absolute z-10 mt-2 right-0 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <motion.button
                    className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                      sortType === 'priority' ? 'text-primary' : 'text-gray-300'
                    } hover:bg-gray-700`}
                    onClick={() => {
                      setSortType('priority');
                      setShowSortMenu(false);
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    <IconWrapper icon={FiList} size={14} />
                    <span>Priority</span>
                  </motion.button>
                  <motion.button
                    className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                      sortType === 'dueDate' ? 'text-primary' : 'text-gray-300'
                    } hover:bg-gray-700`}
                    onClick={() => {
                      setSortType('dueDate');
                      setShowSortMenu(false);
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    <IconWrapper icon={FiCalendar} size={14} />
                    <span>Due Date</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Task list section */}
      <div className="mt-6">
        {getFilteredTasks().length > 0 ? (
          <div className="space-y-4">
            {getFilteredTasks().map((task: Task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                categoryId={task.categoryId || ''} 
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-10"
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
              <IconWrapper icon={FiStar} size={40} className="text-yellow-300" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">No important tasks</h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              You don't have any high priority tasks. Great job keeping on top of things!
            </p>
          </motion.div>
        )}
      </div>
      
      {getFilteredTasks().length > 0 && (
        <motion.div
          className="mt-8 p-4 glass-panel rounded-lg flex items-center gap-4 border-l-4 border-yellow-500"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: 0.3,
            type: "spring",
            stiffness: 80,
            damping: 15
          }}
        >
          <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-full">
            <IconWrapper icon={FiAlertTriangle} size={20} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="font-medium">Important Tasks Alert</h3>
            <p className="text-sm text-gray-400">
              You have {getFilteredTasks().length} high priority {getFilteredTasks().length === 1 ? 'task' : 'tasks'} that need your attention. Focus on these first.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Important; 