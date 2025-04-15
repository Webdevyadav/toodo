import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiSun, FiMoon, FiSliders, FiBell, FiGlobe, FiInfo, FiSave, FiX } from 'react-icons/fi';
import IconWrapper from './IconComponent';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'about'>('appearance');
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Appearance section
  const renderAppearanceSettings = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            className={`glass-panel aspect-video rounded-lg flex flex-col items-center justify-center cursor-pointer p-4 ${
              theme === 'dark' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setTheme('dark')}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-2">
              <IconWrapper icon={FiMoon} size={20} className="text-blue-300" />
            </div>
            <span className="text-sm font-medium">Dark</span>
          </motion.div>
          
          <motion.div
            className={`glass-panel aspect-video rounded-lg flex flex-col items-center justify-center cursor-pointer p-4 ${
              theme === 'light' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setTheme('light')}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <IconWrapper icon={FiSun} size={20} className="text-yellow-500" />
            </div>
            <span className="text-sm font-medium">Light</span>
          </motion.div>
          
          <motion.div
            className={`glass-panel aspect-video rounded-lg flex flex-col items-center justify-center cursor-pointer p-4 ${
              theme === 'system' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setTheme('system')}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-800 to-gray-200 flex items-center justify-center mb-2">
              <IconWrapper icon={FiGlobe} size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium">System</span>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Interface</h3>
        
        <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
          <div>
            <h4 className="font-medium">Auto-focus new tasks</h4>
            <p className="text-sm text-gray-400">Automatically enter focus mode when creating new tasks</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={autoFocus}
              onChange={() => setAutoFocus(!autoFocus)}
            />
            <motion.div 
              className={`w-11 h-6 ${
                autoFocus ? 'bg-primary' : 'bg-gray-700'
              } peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
              animate={{ backgroundColor: autoFocus ? 'var(--color-primary)' : 'rgba(55, 65, 81, 1)' }}
            ></motion.div>
          </label>
        </div>
      </motion.div>
    </motion.div>
  );
  
  // Notifications section
  const renderNotificationSettings = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div>
              <h4 className="font-medium">Enable notifications</h4>
              <p className="text-sm text-gray-400">Receive task reminders and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <motion.div 
                className={`w-11 h-6 ${
                  notificationsEnabled ? 'bg-primary' : 'bg-gray-700'
                } peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                animate={{ backgroundColor: notificationsEnabled ? 'var(--color-primary)' : 'rgba(55, 65, 81, 1)' }}
              ></motion.div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div>
              <h4 className="font-medium">Sound effects</h4>
              <p className="text-sm text-gray-400">Play sounds for task completion and alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
              />
              <motion.div 
                className={`w-11 h-6 ${
                  soundEnabled ? 'bg-primary' : 'bg-gray-700'
                } peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                animate={{ backgroundColor: soundEnabled ? 'var(--color-primary)' : 'rgba(55, 65, 81, 1)' }}
              ></motion.div>
            </label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  
  // About section
  const renderAboutSection = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold mb-4">About Toodo</h3>
        
        <div className="glass-panel p-6 rounded-lg text-center">
          <motion.div 
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <span className="text-3xl">✓</span>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Toodo v1.0.0</h2>
          <p className="text-gray-400 mb-4">A beautiful and modern task management application</p>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              className="px-4 py-2 bg-primary bg-opacity-20 text-primary rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Release Notes
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gray-800 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Feedback
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper icon={FiSettings} size={24} className="text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </motion.div>
      
      <div className="flex gap-8 mb-8">
        <div className="w-1/4">
          <motion.div
            className="glass-panel rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ul className="space-y-2">
              <li>
                <motion.button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'appearance' ? 'bg-primary bg-opacity-20 text-primary' : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconWrapper icon={FiSliders} size={18} />
                  <span>Appearance</span>
                </motion.button>
              </li>
              <li>
                <motion.button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'notifications' ? 'bg-primary bg-opacity-20 text-primary' : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconWrapper icon={FiBell} size={18} />
                  <span>Notifications</span>
                </motion.button>
              </li>
              <li>
                <motion.button
                  onClick={() => setActiveTab('about')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'about' ? 'bg-primary bg-opacity-20 text-primary' : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconWrapper icon={FiInfo} size={18} />
                  <span>About</span>
                </motion.button>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <div className="w-3/4">
          <motion.div 
            className="glass-panel rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'about' && renderAboutSection()}
          </motion.div>
          
          <motion.div
            className="mt-4 flex justify-end gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className="px-4 py-2 flex items-center gap-2 rounded-lg bg-transparent hover:bg-white hover:bg-opacity-10"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <IconWrapper icon={FiX} size={16} />
              <span>Cancel</span>
            </motion.button>
            <motion.button
              className="px-4 py-2 flex items-center gap-2 rounded-lg bg-primary text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <IconWrapper icon={FiSave} size={16} />
              <span>Save Changes</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 