import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiPlus, FiSettings, FiCalendar, FiStar, FiFilter, FiBell, FiUser, FiTrendingUp } from 'react-icons/fi';
import { useTodoContext } from '../context/TodoContext';
import IconWrapper from './IconComponent';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (page: string) => void;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate, activePage }) => {
  const { categories, setCurrentCategory, currentCategory } = useTodoContext();
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const iconVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    }
  };

  return (
    <motion.aside 
      className={`glass-panel w-64 border-r border-gray-800 p-4 fixed top-[64px] left-0 h-[calc(100vh-64px)] overflow-y-auto shadow-xl transition-all duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-40`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h3 className="font-semibold text-gray-400 mb-3 uppercase text-xs tracking-wider">
          Dashboard
        </h3>
        <ul className="space-y-2">
          <motion.li variants={itemVariants}>
            <motion.button
              onClick={() => {
                setCurrentCategory(null);
                onNavigate('dashboard');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 ${
                currentCategory === null && activePage === 'dashboard' ? 'bg-primary bg-opacity-20 shadow-md border-l-4 border-primary' : ''
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiHome} size={18} className="text-primary" />
              </motion.span>
              <span>All Tasks</span>
            </motion.button>
          </motion.li>
          <motion.li variants={itemVariants}>
            <motion.button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('today')}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiCalendar} size={18} className="text-accent1" />
              </motion.span>
              <span>Today</span>
            </motion.button>
          </motion.li>
          <motion.li variants={itemVariants}>
            <motion.button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('important')}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiStar} size={18} className="text-accent2" />
              </motion.span>
              <span>Important</span>
            </motion.button>
          </motion.li>
          <motion.li variants={itemVariants}>
            <motion.button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('stats')}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiTrendingUp} size={18} className="text-green-500" />
              </motion.span>
              <span>Statistics</span>
            </motion.button>
          </motion.li>
        </ul>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider">
            Categories
          </h3>
          <motion.button 
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddCategory(true)}
          >
            <IconWrapper icon={FiPlus} size={16} />
          </motion.button>
        </div>
        
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <motion.li 
              key={category.id}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => {
                  setCurrentCategory(category.id);
                  onNavigate('dashboard');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 ${
                  currentCategory === category.id ? 'bg-white bg-opacity-10 shadow-md border-l-4 border-l-[color:var(--category-color)]' : ''
                }`}
                style={{ 
                  '--category-color': category.color 
                } as React.CSSProperties}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: category.color }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <span role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                </motion.div>
                <span>{category.name}</span>
                <motion.span 
                  className="ml-auto text-sm text-gray-400 bg-gray-800 bg-opacity-50 rounded-full h-5 min-w-5 px-1 flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  {category.tasks.length}
                </motion.span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div 
        className="mt-8 pt-8 border-t border-gray-800"
        variants={itemVariants}
      >
        <h3 className="font-semibold text-gray-400 mb-3 uppercase text-xs tracking-wider">
          System
        </h3>
        <ul className="space-y-2">
          <motion.li variants={itemVariants}>
            <motion.button 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 ${
                activePage === 'notifications' ? 'bg-primary bg-opacity-20 text-primary' : ''
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('notifications')}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiBell} size={18} className="text-yellow-500" />
              </motion.span>
              <span>Notifications</span>
              <motion.span 
                className="ml-auto text-xs text-white bg-primary rounded-full h-5 min-w-5 px-1 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              >
                2
              </motion.span>
            </motion.button>
          </motion.li>
          <motion.li variants={itemVariants}>
            <motion.button 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 ${
                activePage === 'settings' ? 'bg-primary bg-opacity-20 text-primary' : ''
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('settings')}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiSettings} size={18} className="text-gray-400" />
              </motion.span>
              <span>Settings</span>
            </motion.button>
          </motion.li>
          <motion.li variants={itemVariants}>
            <motion.button 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 ${
                activePage === 'profile' ? 'bg-primary bg-opacity-20 text-primary' : ''
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('profile')}
            >
              <motion.span whileHover="hover" variants={iconVariants}>
                <IconWrapper icon={FiUser} size={18} className="text-accent3" />
              </motion.span>
              <span>Profile</span>
            </motion.button>
          </motion.li>
        </ul>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar; 