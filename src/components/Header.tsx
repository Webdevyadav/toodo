import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiMoon, FiSun, FiPlus, FiSearch, FiBell, FiX } from 'react-icons/fi';
import IconWrapper from './IconComponent';
import AddTask from './AddTask';
import { createPortal } from 'react-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onNavigate }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  const iconVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };
  
  // Modal portal component
  const TaskModal = () => {
    if (!showAddTaskModal) return null;
    
    return createPortal(
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur effect */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddTaskModal(false)}
          />
          
          {/* Modal container */}
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-xl my-8 mx-4 rounded-2xl shadow-2xl border border-gray-700 relative z-10 overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
          >
            {/* Glowing effect in corners */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary opacity-10 filter blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary opacity-10 filter blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <motion.h2 
                className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Create New Task
              </motion.h2>
              <motion.button
                onClick={() => setShowAddTaskModal(false)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconWrapper icon={FiX} size={24} />
              </motion.button>
            </div>
            
            <div className="p-6">
              <AddTask onClose={() => setShowAddTaskModal(false)} />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };
  
  return (
    <header className="glass-panel border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <motion.button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          whileHover="hover"
          whileTap={{ scale: 0.9 }}
          variants={iconVariants}
        >
          <IconWrapper icon={FiMenu} size={20} />
        </motion.button>
        
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.5 
          }}
        >
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent1 bg-clip-text text-transparent animate-gradient-x">
            toodo
          </h1>
        </motion.div>
      </div>

      <motion.div 
        className={`relative max-w-md w-full mx-4 hidden md:block transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -10, opacity: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.2 
        }}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconWrapper icon={FiSearch} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </motion.div>

      <div className="flex items-center gap-3">
        <motion.button 
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.3 
          }}
          onClick={() => setShowAddTaskModal(true)}
        >
          <IconWrapper icon={FiPlus} size={18} />
          <span className="hidden sm:inline">New Task</span>
        </motion.button>
        
        <motion.div className="relative" whileHover="hover">
          <motion.button 
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors relative"
            whileTap={{ scale: 0.9 }}
            variants={iconVariants}
            onClick={() => onNavigate('notifications')}
          >
            <IconWrapper icon={FiBell} size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
          </motion.button>
        </motion.div>
        
        <motion.button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          whileHover="hover"
          whileTap={{ scale: 0.9 }}
          variants={iconVariants}
        >
          {darkMode 
            ? <IconWrapper icon={FiSun} size={20} /> 
            : <IconWrapper icon={FiMoon} size={20} />
          }
        </motion.button>
        
        <motion.div 
          className="w-10 h-10 rounded-full bg-gradient-to-r from-accent3 to-primary flex items-center justify-center text-white cursor-pointer shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.4 
          }}
          onClick={() => onNavigate('profile')}
        >
          <span className="font-medium">US</span>
        </motion.div>
      </div>
      
      {/* Render modal through portal */}
      <TaskModal />
    </header>
  );
};

export default Header; 